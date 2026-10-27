<script setup lang="ts">
// A button that holds only a glyph. Round or square, accent or soft.
withDefaults(
  defineProps<{
    icon: string
    label: string
    round?: boolean
    accent?: boolean
    size?: number
    type?: 'button' | 'submit'
  }>(),
  { round: false, accent: false, size: 18, type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    class="ads-icon-button"
    :class="{ 'is-round': round, 'is-accent': accent }"
    :aria-label="label"
  >
    <Icon :name="icon" :size="size" />
  </button>
</template>
