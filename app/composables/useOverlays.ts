/** Whether the command palette is open. Shared, so anything can open it. */
export const usePalette = () => useState('palette', () => false)

/** Whether the mobile menu sheet is open. */
export const useMenuSheet = () => useState('menu-sheet', () => false)

/** A section of a page, as the rail, tab bar and palette list it. */
export type Section = { id: string; label: string; icon: string; short?: string; tab?: boolean }
