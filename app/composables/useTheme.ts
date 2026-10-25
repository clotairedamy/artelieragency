export type Theme = 'light' | 'dark'

const KEY = 'artelier:theme'
const CHROME: Record<Theme, string> = { light: '#e2e2e6', dark: '#131315' }

/**
 * The site's theme: light unless the visitor has chosen dark.
 *
 * The saved choice is applied by an inline script in the document head
 * (nuxt.config.ts) before anything paints, so this only has to keep the DOM,
 * storage and the browser chrome in step when the visitor changes it.
 */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  function write(t: Theme) {
    theme.value = t
    const root = document.documentElement
    if (t === 'dark') root.dataset.theme = 'dark'
    else delete root.dataset.theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CHROME[t])
    try {
      localStorage.setItem(KEY, t)
    } catch {
      // Private windows throw on access. The switch still works for the visit.
    }
  }

  /**
   * Switch theme. Given the point the switch was made from, the new theme
   * spreads out from it as a circle — a view transition, so the whole page
   * changes in one frame rather than each surface easing on its own clock.
   */
  function set(t: Theme, from?: { x: number; y: number }) {
    if (t === theme.value) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduced) return write(t)
    const root = document.documentElement
    root.style.setProperty('--vt-x', from ? `${from.x}px` : '50%')
    root.style.setProperty('--vt-y', from ? `${from.y}px` : '0px')
    document.startViewTransition(() => write(t))
  }

  function toggle(from?: { x: number; y: number }) {
    set(theme.value === 'dark' ? 'light' : 'dark', from)
  }

  return { theme, set, toggle }
}
