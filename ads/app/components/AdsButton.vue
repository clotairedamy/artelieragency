<script setup lang="ts">
// The ADS button. `.btn` is the raised soft surface; the accent variant is the
// one action per screen, so spend it once.
withDefaults(
  defineProps<{
    variant?: 'default' | 'accent' | 'quiet'
    size?: 'sm' | 'md'
    icon?: string
    iconSize?: number
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  { variant: 'default', size: 'md', iconSize: 16, loading: false, type: 'button', disabled: false },
)
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="{
      'btn-accent': variant === 'accent',
      'btn-quiet': variant === 'quiet',
      'btn-sm': size === 'sm',
    }"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="ads-spinner" style="width: 14px; height: 14px; border-width: 1.5px" aria-hidden="true" />
    <Icon v-else-if="icon" :name="icon" :size="iconSize" />
    <slot />
  </button>
</template>
