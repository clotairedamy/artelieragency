// Raw source of every component in the kit, so the docs can offer a
// "copy this file" action: paste it into your own app/components/ and it is
// yours to change.
const raw = import.meta.glob('../../app/components/*.vue', {
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
