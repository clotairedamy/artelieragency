// Raw source of every Rust file in the kit (ads-rs/src), so the docs can show
// the Dioxus components' source alongside the Vue ones.
const raw = import.meta.glob('../../ads-rs/src/**/*.rs', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export type RustFile = { path: string; content: string }

function rel(path: string): string {
  const i = path.lastIndexOf('/src/')
  return i >= 0 ? path.slice(i + 5) : path
}

export function useRustSource() {
  const files: RustFile[] = Object.entries(raw)
    .map(([path, content]) => ({ path: rel(path), content }))
    .sort((a, b) => a.path.localeCompare(b.path))
  return { files }
}
