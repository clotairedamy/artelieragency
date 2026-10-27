// Where you are in the UI Kit's docs: which kit, and the same page in the
// other one. The rail, the kit switch and the overview all ask this.
export function useUiKit() {
  const { docs } = useAppConfig()
  const route = useRoute()

  // The longest kit root the route sits under: /ui-kit/rust/inputs is Rust.
  const kit = computed(
    () =>
      [...docs.kits]
        .sort((a, b) => b.to.length - a.to.length)
        .find((k) => route.path === k.to || route.path.startsWith(`${k.to}/`)) ?? docs.kits[0]!,
  )

  // The same category in another kit, or its overview when there is none.
  function sameIn(target: (typeof docs.kits)[number]) {
    const rest = route.path.slice(kit.value.to.length)
    return target.categories.some((c) => c.to === target.to + rest) ? target.to + rest : target.to
  }

  // The kit's categories as the rail's sections.
  const sections = computed(() =>
    kit.value.categories.map((c) => ({ id: `kit${c.to.replaceAll('/', '-')}`, ...c })),
  )

  return { kits: docs.kits, kit, sameIn, sections }
}
