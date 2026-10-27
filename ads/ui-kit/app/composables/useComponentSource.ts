// Raw source of every component in the kit, so each docs page can show the
// whole file behind the component it documents.
const raw = import.meta.glob('../../../app/components/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function useComponentSource() {
  function source(name: string) {
    const key = Object.keys(raw).find((k) => k.endsWith(`/${name}.vue`))
    return key ? (raw[key] ?? '') : ''
  }

  return { source }
}
