<script setup lang="ts">
// The first screen every new user sees, so it gets a component rather than a
// grey sentence. It teaches what appears here, why it is empty, and carries
// the one action that fixes it in the default slot — not in a toolbar nobody
// has looked at. `kind` keeps the two empties apart: `first-run` (never had
// data: the action creates something) and `no-results` (a filter matched
// nothing: the action clears the filter). Different glyph, different copy.
const props = withDefaults(
  defineProps<{ kind?: 'first-run' | 'no-results'; icon?: string; title: string; body?: string }>(),
  { kind: 'first-run', icon: undefined, body: '' },
)
const slots = useSlots()
const glyph = computed(() => props.icon ?? (props.kind === 'no-results' ? 'compass' : 'discovery'))

if (import.meta.dev && !slots.default) {
  console.warn(`[AdsEmpty] "${props.title}" has no action. An empty state carries the action that fills it.`)
}
</script>

<template>
  <div class="ads-empty">
    <span class="glyph"><Icon :name="glyph" :size="20" /></span>
    <h4>{{ title }}</h4>
    <p v-if="body">{{ body }}</p>
    <slot />
  </div>
</template>
