/**
 * Shared open/close state for overlays, so any part of the page can open them
 * and the component that owns the markup stays in charge of rendering.
 */

/**
 * A section of a page, as the rail, tab bar and palette list it. Give it `to`
 * when the section is a page of its own (a set of docs, say): the rail then
 * links to that route and follows the URL, rather than an anchor and the
 * scroll position.
 */
export type Section = { id: string; label: string; icon: string; short?: string; tab?: boolean; to?: string }

/** Whether the command palette is open. Shared, so anything can open it. */
export const usePalette = () => useState('palette', () => false)

/** Whether the mobile menu sheet is open. */
export const useMenuSheet = () => useState('menu-sheet', () => false)

/** A named modal/drawer. The id keeps two overlays from colliding. */
export function useModal(id = 'modal') {
  const open = useState(`overlay:${id}`, () => false)
  return {
    open,
    show: () => (open.value = true),
    hide: () => (open.value = false),
    toggle: () => (open.value = !open.value),
  }
}
