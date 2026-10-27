//! Gauge — a dial for a changing rate.

use dioxus::prelude::*;

const CX: f32 = 64.0;
const CY: f32 = 64.0;
const R: f32 = 54.0;

fn polar(angle_deg: f32, radius: f32) -> (f32, f32) {
    let rad = angle_deg.to_radians();
    (CX + radius * rad.cos(), CY + radius * rad.sin())
}

fn arc(start: f32, sweep: f32) -> String {
    let (x1, y1) = polar(start, R);
    let (x2, y2) = polar(start + sweep, R);
    let large = if sweep > 180.0 { 1 } else { 0 };
    format!("M{x1:.2} {y1:.2} A{R} {R} 0 {large} 1 {x2:.2} {y2:.2}")
}

/// A dial for a changing rate — the eye reads the needle before the digits.
#[component]
pub fn AdsGauge(
    #[props(default = 0u32)] value: u32,
    #[props(default = 100u32)] max: u32,
    #[props(into)] label: String,
    #[props(into, optional)] unit: Option<String>,
) -> Element {
    const START: f32 = 140.0;
    const SWEEP: f32 = 260.0;
    let fraction = (value as f32 / max as f32).clamp(0.0, 1.0);
    let track = arc(START, SWEEP);
    let progress = arc(START, SWEEP * fraction.max(0.001));

    rsx! {
        div { class: "gauge",
            svg { view_box: "0 0 128 128", role: "img",
                path { d: track, class: "track", fill: "none", stroke: "var(--canvas)", stroke_width: 7, stroke_linecap: "round", opacity: 0.85 }
                path { d: progress, class: "progress", fill: "none", stroke: "var(--accent)", stroke_width: 7, stroke_linecap: "round" }
                circle { cx: CX, cy: CY, r: 31, class: "cap", fill: "var(--raised)" }
            }
            div { class: "read",
                span { class: "num value",
                    "{value}"
                    if let Some(u) = &unit { span { class: "unit", "{u}" } }
                }
                span { class: "eyebrow", "{label}" }
            }
        }
    }
}
