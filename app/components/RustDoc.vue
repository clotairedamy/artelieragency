<script setup lang="ts">
// A Rust component, documented like a Vue one. The preview renders the Vue
// twin: both kits draw the same classes from the same stylesheets, so what
// you see is what the Dioxus component draws.
defineProps<{
  id: string
  name: string
  description?: string
  code: string
  file: string
  source: string
}>()
</script>

<template>
  <ComponentDoc
    :id="id"
    :name="name"
    :description="description"
    :code="code"
    language="rust"
    :source="source"
    :file="`ads/ads-rs/src/${file}`"
  >
    <slot />
  </ComponentDoc>
</template>
