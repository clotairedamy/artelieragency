/**
 * The glyphs a toast may carry. All of them confirm something that already
 * happened — there is deliberately no `alert`: an error the reader must act
 * on is a banner (AdsBanner tone="bad"), because a toast leaves before it is
 * read.
 */
export type ToastIcon = 'check' | 'mail' | 'code' | 'arrow' | 'layers'

export type Toast = { id: number; text: string; icon: ToastIcon }

/**
 * Small confirmations for actions that otherwise happen silently. They stack
 * bottom-right and leave on their own; nothing here needs dismissing.
 */
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function push(text: string, icon: ToastIcon = 'check') {
    const id = Date.now() + Math.random()
    // Three at most: a fourth confirmation means nobody is reading them.
    toasts.value = [...toasts.value.slice(-2), { id, text, icon }]
    setTimeout(() => dismiss(id), 2600)
  }

  return { toasts, push, dismiss }
}
