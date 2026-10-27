// Where everything lives. The server reads the kit from disk on every call, so
// it is never staler than the files it describes. Paths resolve from this
// file (dist/ or src/ inside ads/mcp/), or from the environment when the
// server is installed somewhere else.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/** The kit root: the `ads/` folder (holds app/, ads-rs/, mcp/). */
export const ADS_ROOT = resolve(process.env.ARTELIER_ADS_ROOT ?? join(here, '..', '..'))

/** The repository that holds the kit and its documentation site. */
export const REPO_ROOT = resolve(process.env.ARTELIER_REPO_ROOT ?? join(ADS_ROOT, '..'))

/** The Rust crate. */
export const RUST_ROOT = resolve(process.env.ARTELIER_ADS_RS ?? join(ADS_ROOT, 'ads-rs'))

export const VUE_COMPONENTS_DIR = join(ADS_ROOT, 'app', 'components')
export const VUE_CSS_DIR = join(ADS_ROOT, 'app', 'assets', 'css')
export const RUST_CSS_DIR = join(RUST_ROOT, 'assets', 'css')

/** The four shared stylesheets, in load order. */
export const GLOBAL_CSS = ['tokens.css', 'base.css', 'ads.css', 'ads-utility.css']

export function readText(path: string): string | null {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return null
  }
}

export function isDir(path: string): boolean {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

export function mtime(path: string): number {
  try {
    return statSync(path).mtimeMs
  } catch {
    return -1
  }
}

const SKIP = new Set(['node_modules', '.nuxt', '.output', 'dist', 'target', '.git'])

/** Every file under `dir` with one of the extensions, skipping build output. */
export function walk(dir: string, exts: string[]): string[] {
  const out: string[] = []
  if (!isDir(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p, exts))
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(p)
  }
  return out.sort()
}

export function exists(path: string): boolean {
  return existsSync(path)
}

/** Relative path for display, from the repository root. */
export function rel(path: string): string {
  return path.startsWith(REPO_ROOT) ? path.slice(REPO_ROOT.length + 1) : path
}

/** A small mtime-keyed cache, so repeated calls do not re-parse unchanged files. */
export function cached<T>(store: Map<string, { m: number; v: T }>, path: string, make: () => T): T {
  const m = mtime(path)
  const hit = store.get(path)
  if (hit && hit.m === m) return hit.v
  const v = make()
  store.set(path, { m, v })
  return v
}
