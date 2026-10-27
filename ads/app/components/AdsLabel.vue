<script setup lang="ts">
// A form label, above its field — in the label face, like every label in the
// system. It is the global `.ads-label`, so it cannot drift from the field
// labels the rules page shows. A field always has one: placeholder text is
// gone exactly when it is needed.
defineProps<{ for?: string }>()
</script>

<template>
  <label class="ads-label" :for="$props.for"><slot /></label>
</template>
