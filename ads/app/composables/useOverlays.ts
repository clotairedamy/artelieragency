/**
 * Shared open/close state for overlays, so any part of the page can open them
 * and the component that owns the markup stays in charge of rendering.
 */

/** A section of a page, as the rail, tab bar and palette list it. */
export type Section = { id: string; label: string; icon: string; short?: string; tab?: boolean }

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
