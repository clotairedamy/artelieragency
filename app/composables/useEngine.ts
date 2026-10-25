/**
 * Loads the Rust engine and hands back typed views over its memory.
 *
 * There is no generated glue here because the module has no `wasm-bindgen`:
 * every export is numeric, and anything bigger than a number is read
 * directly out of linear memory as a `Float64Array`. That keeps the whole
 * interop surface to the twenty lines below.
 *
 * The views are *windows into WebAssembly memory*, not copies. Two
 * consequences worth knowing:
 *
 *  - They go stale the moment the engine grows its memory, because growing
 *    swaps the underlying ArrayBuffer and detaches every existing view. So a
 *    fresh view is taken after each call rather than cached.
 *  - They must be copied before being handed to Vue's reactivity, or a later
 *    recompute mutates values a component is still rendering.
 */

export type Metrics = {
  rows: number
  medianLatency: number
  p95Latency: number
  avgWords: number
  c2xx: number
  c3xx: number
  c4xx: number
  c5xx: number
  issues: number
  health: number
  totalMiB: number
  corpus: number
}

export type PlanJob = {
  name: string
  severity: number
  reach: number
  effort: number
  score: number
}

export type Row = {
  code: number
  depth: number
  words: number
  inlinks: number
  latency: number
  severity: number
}

const JOB_NAMES = [
  'Server errors',
  'Broken links',
  'Thin content',
  'Redirect chains',
  'Slow pages',
]

type Exports = {
  memory: WebAssembly.Memory
  generate: (count: number, seed: number) => number
  recompute: (classMask: number, maxDepth: number) => number
  histogram: (buckets: number) => number
  rows_ptr: () => number
  rows_len: () => number
  metrics_ptr: () => number
  plan_ptr: () => number
  stride: () => number
}

export function useEngine() {
  const ready = ref(false)
  const failed = ref(false)
  let wasm: Exports | null = null

  /** A fresh view each time — see the note about detached buffers above. */
  const f64 = (ptr: number, len: number) =>
    new Float64Array(wasm!.memory.buffer, ptr, len)

  async function load(count = 600, seed = 7) {
    try {
      const res = await fetch('/engine/artelier_engine.wasm')
      const { instance } = await WebAssembly.instantiate(await res.arrayBuffer(), {})
      wasm = instance.exports as unknown as Exports
      wasm.generate(count, seed)
      ready.value = true
    } catch {
      // A dashboard that silently shows nothing is worse than one that says
      // the engine did not load, so the page renders an explicit state.
      failed.value = true
    }
  }

  function metrics(): Metrics {
    const m = f64(wasm!.metrics_ptr(), 12)
    return {
      rows: m[0]!, medianLatency: m[1]!, p95Latency: m[2]!, avgWords: m[3]!,
      c2xx: m[4]!, c3xx: m[5]!, c4xx: m[6]!, c5xx: m[7]!,
      issues: m[8]!, health: m[9]!, totalMiB: m[10]!, corpus: m[11]!,
    }
  }

  function plan(): PlanJob[] {
    const p = f64(wasm!.plan_ptr(), 20)
    return JOB_NAMES.map((name, i) => ({
      name,
      severity: p[i * 4]!,
      reach: p[i * 4 + 1]!,
      effort: p[i * 4 + 2]!,
      score: p[i * 4 + 3]!,
    }))
      .filter((j) => j.reach > 0)
      .sort((a, b) => b.score - a.score)
  }

  function rows(limit = 14): Row[] {
    const stride = wasm!.stride()
    const n = Math.min(wasm!.rows_len(), limit)
    const all = f64(wasm!.rows_ptr(), wasm!.rows_len() * stride)
    const out: Row[] = []
    for (let i = 0; i < n; i++) {
      const b = i * stride
      out.push({
        code: all[b]!, depth: all[b + 1]!, words: all[b + 2]!,
        inlinks: all[b + 3]!, latency: all[b + 4]!, severity: all[b + 6]!,
      })
    }
    return out
  }

  function latencyHistogram(buckets = 14) {
    const max = wasm!.histogram(buckets)
    // The histogram is appended after the plan's 20 values.
    return { max, bins: Array.from(f64(wasm!.plan_ptr(), 20 + buckets).slice(20)) }
  }

  function filter(classMask: number, maxDepth: number) {
    wasm!.recompute(classMask, maxDepth)
  }

  return { ready, failed, load, metrics, plan, rows, latencyHistogram, filter }
}
