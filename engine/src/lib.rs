//! The compute behind the ADS dashboard example.
//!
//! The point of this crate is that the dashboard on the page is not a set of
//! hard-coded numbers in a Vue component. A dataset is generated here, and
//! every figure on screen — the aggregates, the latency percentiles, the
//! health score, the ranked plan, and the result of every filter change — is
//! computed in Rust and read back across the WebAssembly boundary.
//!
//! ## The interface is numeric on purpose
//!
//! There is no `wasm-bindgen` here. Every exported function takes and returns
//! plain integers and floats, and anything larger is written into a buffer
//! that JavaScript reads directly out of linear memory as a `Float64Array`.
//! That costs a little marshalling discipline and saves a build dependency,
//! a code generator and about 200 KB of glue — and it means the whole thing
//! builds with nothing but `cargo build --target wasm32-unknown-unknown`.
//!
//! ## Row layout
//!
//! Rows are a flat `f64` array, [`STRIDE`] values per row, in the order given
//! by the `F_*` constants. Flat because a struct-of-arrays crossing the
//! boundary would need either a serialiser or one call per field, and this
//! needs neither: JavaScript takes one view over the memory and strides it.

#![no_std]

extern crate alloc;

use alloc::vec::Vec;
use core::cmp::Ordering;


/// `no_std` has no `f64::floor`, `round` or `max` — those come from libm via
/// std. Every value here is finite and non-negative, so three lines cover it
/// rather than taking on a maths dependency for a demo dataset.
#[inline]
fn floor(x: f64) -> f64 {
    let t = x as i64 as f64;
    if t > x { t - 1.0 } else { t }
}

#[inline]
fn round(x: f64) -> f64 {
    floor(x + 0.5)
}

#[inline]
fn fmax(a: f64, b: f64) -> f64 {
    if a > b { a } else { b }
}

/// Values per row.
pub const STRIDE: usize = 7;

pub const F_CODE: usize = 0; // HTTP status
pub const F_DEPTH: usize = 1; // clicks from the start URL
pub const F_WORDS: usize = 2;
pub const F_INLINKS: usize = 3;
pub const F_LATENCY: usize = 4; // ms
pub const F_BYTES: usize = 5;
pub const F_SEVERITY: usize = 6; // 1 low .. 4 critical

/// Everything the module owns, so the exported functions stay thin.
struct Engine {
    rows: Vec<f64>,
    view: Vec<f64>,    // the current filter's result
    metrics: [f64; 16],
    plan: Vec<f64>,    // 4 values per job: severity, reach, effort, score
    rng: u64,
}

static mut ENGINE: Option<Engine> = None;

/// # Safety
/// Single-threaded by construction: WebAssembly here has one thread, and
/// every export runs to completion before JavaScript regains control.
#[allow(static_mut_refs)]
fn engine() -> &'static mut Engine {
    unsafe {
        if ENGINE.is_none() {
            ENGINE = Some(Engine {
                rows: Vec::new(),
                view: Vec::new(),
                metrics: [0.0; 16],
                plan: Vec::new(),
                rng: 0x2545_F491_4F6C_DD1D,
            });
        }
        ENGINE.as_mut().unwrap()
    }
}

impl Engine {
    /// xorshift64*. Deterministic, so the same seed gives the same dashboard
    /// on every reload and on the server — a demo whose numbers change under
    /// the reader is a demo nobody can point at.
    fn next_u64(&mut self) -> u64 {
        let mut x = self.rng;
        x ^= x >> 12;
        x ^= x << 25;
        x ^= x >> 27;
        self.rng = x;
        x.wrapping_mul(0x2545_F491_4F6C_DD1D)
    }

    fn next_f64(&mut self) -> f64 {
        // 53 significant bits, mapped to [0, 1).
        (self.next_u64() >> 11) as f64 / (1u64 << 53) as f64
    }

    fn pick(&mut self, weights: &[(f64, f64)]) -> f64 {
        let total: f64 = weights.iter().map(|w| w.1).sum();
        let mut r = self.next_f64() * total;
        for (value, weight) in weights {
            r -= weight;
            if r <= 0.0 {
                return *value;
            }
        }
        weights[weights.len() - 1].0
    }
}

/// Builds a dataset shaped like a real crawl: mostly 200s, a tail of
/// redirects, a few 404s, latency that climbs with depth, and inlinks that
/// fall away from the root.
#[no_mangle]
pub extern "C" fn generate(count: u32, seed: u32) -> u32 {
    let e = engine();
    e.rng = (seed as u64).wrapping_mul(0x9E37_79B9_7F4A_7C15) | 1;
    e.rows.clear();
    e.rows.reserve(count as usize * STRIDE);

    for i in 0..count {
        let depth = if i == 0 {
            0.0
        } else {
            e.pick(&[(1.0, 22.0), (2.0, 34.0), (3.0, 26.0), (4.0, 12.0), (5.0, 6.0)])
        };

        let code = if i == 0 {
            200.0
        } else {
            e.pick(&[(200.0, 86.0), (301.0, 7.0), (302.0, 2.0), (404.0, 4.0), (500.0, 1.0)])
        };

        // Deeper pages are thinner, slower and less linked to. None of this
        // is noise for its own sake — the correlations are what make the
        // charts on the page say something when you filter.
        let depth_factor = 1.0 + depth * 0.45;
        let words = if code >= 300.0 {
            e.next_f64() * 120.0
        } else {
            (1400.0 / depth_factor) * (0.45 + e.next_f64() * 1.1)
        };
        let inlinks = (3800.0 / (depth_factor * depth_factor)) * (0.1 + e.next_f64() * 1.3);
        let latency = 48.0 * depth_factor * (0.7 + e.next_f64() * 1.5)
            + if code >= 500.0 { 900.0 } else { 0.0 };
        let bytes = 18_000.0 + words * 42.0 + e.next_f64() * 30_000.0;

        let severity = match code as i32 {
            500..=599 => 4.0,
            404 => 4.0,
            301 | 302 => 2.0,
            _ => {
                if words < 220.0 {
                    3.0
                } else if latency > 320.0 {
                    2.0
                } else {
                    1.0
                }
            }
        };

        e.rows.extend_from_slice(&[
            code,
            depth,
            round(words),
            round(inlinks),
            round(latency),
            round(bytes),
            severity,
        ]);
    }

    recompute(0b1111, 9);
    (e.rows.len() / STRIDE) as u32
}

/// Applies a filter and recomputes every derived figure.
///
/// `class_mask` is a bitmask over status classes — 1 = 2xx, 2 = 3xx, 4 = 4xx,
/// 8 = 5xx — so the dashboard's segmented control maps onto one integer.
#[no_mangle]
pub extern "C" fn recompute(class_mask: u32, max_depth: u32) -> u32 {
    let e = engine();
    e.view.clear();

    let total_rows = e.rows.len() / STRIDE;
    for i in 0..total_rows {
        let base = i * STRIDE;
        let code = e.rows[base + F_CODE] as u32;
        let depth = e.rows[base + F_DEPTH] as u32;

        let bit = match code / 100 {
            2 => 1,
            3 => 2,
            4 => 4,
            _ => 8,
        };
        if class_mask & bit == 0 || depth > max_depth {
            continue;
        }
        e.view.extend_from_slice(&e.rows[base..base + STRIDE]);
    }

    let n = e.view.len() / STRIDE;
    let mut latencies = Vec::with_capacity(n);
    let mut words_total = 0.0;
    let mut bytes_total = 0.0;
    let mut counts = [0.0f64; 4]; // 2xx 3xx 4xx 5xx
    let mut severity_sum = 0.0;
    let mut issues = 0.0;

    for i in 0..n {
        let base = i * STRIDE;
        latencies.push(e.view[base + F_LATENCY]);
        words_total += e.view[base + F_WORDS];
        bytes_total += e.view[base + F_BYTES];
        let sev = e.view[base + F_SEVERITY];
        severity_sum += sev;
        if sev >= 3.0 {
            issues += 1.0;
        }
        let idx = match e.view[base + F_CODE] as u32 / 100 {
            2 => 0,
            3 => 1,
            4 => 2,
            _ => 3,
        };
        counts[idx] += 1.0;
    }

    latencies.sort_by(|a, b| a.partial_cmp(b).unwrap_or(Ordering::Equal));
    let pct = |p: f64| -> f64 {
        if latencies.is_empty() {
            return 0.0;
        }
        let idx = round((latencies.len() - 1) as f64 * p) as usize;
        latencies[idx]
    };

    let nf = n as f64;
    e.metrics[0] = nf;
    e.metrics[1] = pct(0.5);
    e.metrics[2] = pct(0.95);
    e.metrics[3] = if n == 0 { 0.0 } else { words_total / nf };
    e.metrics[4] = counts[0];
    e.metrics[5] = counts[1];
    e.metrics[6] = counts[2];
    e.metrics[7] = counts[3];
    e.metrics[8] = issues;
    // Health: 100 minus the average severity above "low", scaled. A single
    // number only earns its place next to a threshold, which the page draws.
    e.metrics[9] = if n == 0 {
        0.0
    } else {
        round(fmax(100.0 - ((severity_sum / nf) - 1.0) * 33.0, 0.0))
    };
    e.metrics[10] = bytes_total / 1_048_576.0; // MiB
    e.metrics[11] = (e.rows.len() / STRIDE) as f64;

    build_plan(issues);
    n as u32
}

/// Ranks the work.
///
/// Severity alone is not a to-do list: a critical finding on two pages is
/// less valuable than a medium one on four hundred that a single template
/// change fixes. Score is severity x reach / effort, where effort is the
/// number of distinct changes the fix actually takes.
fn build_plan(_issues: f64) {
    let e = engine();
    let n = e.view.len() / STRIDE;

    // Group the view into jobs by the kind of problem it represents.
    // (severity, reach, effort) accumulated per job.
    let mut jobs = [
        (4.0f64, 0.0f64, 2.0f64),  // 0 server errors — one fix, usually
        (4.0, 0.0, 1.0),           // 1 broken links  — one template
        (3.0, 0.0, 1.0),           // 2 thin content  — one template
        (2.0, 0.0, 14.0),          // 3 redirect chains — many separate edits
        (2.0, 0.0, 3.0),           // 4 slow pages
    ];

    for i in 0..n {
        let base = i * STRIDE;
        let code = e.view[base + F_CODE] as u32;
        let words = e.view[base + F_WORDS];
        let latency = e.view[base + F_LATENCY];

        if code >= 500 {
            jobs[0].1 += 1.0;
        } else if code == 404 {
            jobs[1].1 += 1.0;
        } else if code < 300 && words < 220.0 {
            jobs[2].1 += 1.0;
        } else if (300..400).contains(&code) {
            jobs[3].1 += 1.0;
        }
        if latency > 320.0 {
            jobs[4].1 += 1.0;
        }
    }

    e.plan.clear();
    for (severity, reach, effort) in jobs.iter() {
        let score = if *reach == 0.0 {
            0.0
        } else {
            severity * reach / effort
        };
        e.plan.extend_from_slice(&[*severity, *reach, *effort, score]);
    }
}

/// A histogram of latency, so the page can draw a distribution rather than
/// an average — an average hides the shape, and the shape is the point.
#[no_mangle]
pub extern "C" fn histogram(buckets: u32) -> u32 {
    let e = engine();
    let n = e.view.len() / STRIDE;
    let b = buckets.max(1) as usize;

    let mut hi = 0.0f64;
    for i in 0..n {
        hi = fmax(hi, e.view[i * STRIDE + F_LATENCY]);
    }
    if hi <= 0.0 {
        hi = 1.0;
    }

    // Reuse the tail of the metrics buffer's own storage? No — histograms
    // get their own, appended after the plan so one pointer serves both.
    e.plan.truncate(20);
    for _ in 0..b {
        e.plan.push(0.0);
    }
    for i in 0..n {
        let v = e.view[i * STRIDE + F_LATENCY];
        let mut idx = floor((v / hi) * (b as f64 - 1.0)) as usize;
        if idx >= b {
            idx = b - 1;
        }
        e.plan[20 + idx] += 1.0;
    }
    hi as u32
}

#[no_mangle]
pub extern "C" fn rows_ptr() -> *const f64 {
    engine().view.as_ptr()
}

#[no_mangle]
pub extern "C" fn rows_len() -> u32 {
    (engine().view.len() / STRIDE) as u32
}

#[no_mangle]
pub extern "C" fn metrics_ptr() -> *const f64 {
    engine().metrics.as_ptr()
}

#[no_mangle]
pub extern "C" fn plan_ptr() -> *const f64 {
    engine().plan.as_ptr()
}

#[no_mangle]
pub extern "C" fn stride() -> u32 {
    STRIDE as u32
}

/// `no_std` needs these: there is no runtime to unwind into, and the host
/// never calls a panicking path in normal operation.
#[cfg(target_arch = "wasm32")]
#[panic_handler]
fn panic(_: &core::panic::PanicInfo) -> ! {
    core::arch::wasm32::unreachable()
}

/// A bump allocator. The engine allocates a handful of vectors once and
/// grows them; it never frees, so reclaiming memory would be dead code.
#[cfg(target_arch = "wasm32")]
mod alloc_impl {
    use core::alloc::{GlobalAlloc, Layout};

    pub struct Bump;

    static mut OFFSET: usize = 0;

    unsafe impl GlobalAlloc for Bump {
        unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
            let align = layout.align();
            let size = layout.size();

            if OFFSET == 0 {
                // Start just past whatever the linker placed in low memory.
                OFFSET = (core::arch::wasm32::memory_size(0) * 65_536) / 2;
            }

            let start = (OFFSET + align - 1) & !(align - 1);
            let end = start + size;

            let have = core::arch::wasm32::memory_size(0) * 65_536;
            if end > have {
                let need_pages = (end - have + 65_535) / 65_536;
                if core::arch::wasm32::memory_grow(0, need_pages) == usize::MAX {
                    return core::ptr::null_mut();
                }
            }

            OFFSET = end;
            start as *mut u8
        }

        unsafe fn dealloc(&self, _ptr: *mut u8, _layout: Layout) {}
    }
}

#[cfg(target_arch = "wasm32")]
#[global_allocator]
static ALLOC: alloc_impl::Bump = alloc_impl::Bump;
