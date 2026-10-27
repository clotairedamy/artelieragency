<script setup lang="ts">
// The ADS button. `.btn` is the raised soft surface; the accent variant is the
// one action per screen, so spend it once. A destructive action never gets the
// accent — the accent means "the thing to do", and deleting is not it — so
// `destructive` pins the button to the default weight whatever variant is
// asked for. The confirm that follows it says the verb, not "OK".
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'accent' | 'quiet'
    size?: 'sm' | 'md'
    icon?: string
    iconSize?: number
    loading?: boolean
    destructive?: boolean
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  { variant: 'default', size: 'md', iconSize: 16, loading: false, destructive: false, type: 'button', disabled: false },
)

const weight = computed(() => (props.destructive && props.variant === 'accent' ? 'default' : props.variant))

if (import.meta.dev && props.destructive && props.variant === 'accent') {
  console.warn('[AdsButton] A destructive action cannot take the accent; rendering the default weight.')
}
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="{
      'btn-accent': weight === 'accent',
      'btn-quiet': weight === 'quiet',
      'btn-sm': size === 'sm',
    }"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="ads-spinner ads-button__spinner" aria-hidden="true" />
    <Icon v-else-if="icon" :name="icon" :size="iconSize" />
    <slot />
  </button>
</template>

<style scoped>
.btn .ads-button__spinner {
  width: 14px;
  height: 14px;
  border-width: 1.5px;
}
</style>
