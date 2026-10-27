<template>
  <!-- Pages with no sections of their own: the rail keeps the brand and the
       action, and drops the index rather than pointing at anchors that do
       not exist here. -->
  <DashShell :sections="[]">
    <template #tools><UiKitLaunch /></template>
    <slot />
    <StudioFooter />
  </DashShell>
</template>
