export type Toast = { id: number; text: string; icon: string }

/**
 * Small confirmations for actions that otherwise happen silently — copying
 * an address, switching a setting. They stack bottom-right (above the tab
 * bar on a phone) and leave on their own; nothing here needs dismissing.
 */
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function push(text: string, icon = 'check') {
    const id = Date.now() + Math.random()
    // Three at most: a fourth confirmation means nobody is reading them.
    toasts.value = [...toasts.value.slice(-2), { id, text, icon }]
    setTimeout(() => dismiss(id), 2600)
  }

  return { toasts, push, dismiss }
}
