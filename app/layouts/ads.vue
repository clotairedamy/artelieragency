<script setup lang="ts">
// The rail carries the twelve groups, with their icons and the sliding tab.
// Its selection is derived from the index's — never observed separately —
// so the two always describe the same place at two granularities.
const { adsGroups } = useAdsManifest()
const active = useAdsActive()

const sections = adsGroups.map((g) => ({ id: g.id, label: g.label, icon: g.icon }))
const activeId = computed(() => adsGroupOf(active.value) || sections[0]!.id)
</script>

<template>
  <DashShell :sections="sections" :active-id="activeId">
    <template #tools><UiKitLaunch /></template>
    <slot />
    <StudioFooter />
  </DashShell>
</template>
