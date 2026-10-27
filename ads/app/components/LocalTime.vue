<script setup lang="ts">
// The time in the studio, and whether anyone is at the desk. More useful than
// an address: it tells you when to expect a reply.
//
// The dot is never the only signal: the state is always written beside it,
// so the reading survives a desaturated screen.
const props = withDefaults(
  defineProps<{ city?: string; time?: string; open?: boolean; state?: string }>(),
  { city: 'Colorado Springs', time: '', open: true, state: '' },
)

const label = computed(() => props.state || (props.open ? 'At the desk' : 'Out of hours'))
</script>

<template>
  <p class="ads-local-time">
    <span class="ads-local-time__dot" :class="{ 'is-off': !open }" aria-hidden="true" />
    <span>{{ city }}</span>
    <time class="ads-local-time__time num">{{ time || '··:··' }}</time>
    <span class="ads-local-time__state">{{ label }}</span>
  </p>
</template>

<style scoped>
.ads-local-time {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-1) 10px;
  font-size: 0.82rem;
  color: var(--text-soft);
  margin: 0;
}

.ads-local-time__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ok);
}

.ads-local-time__dot.is-off {
  background: var(--subdued);
}

.ads-local-time__time {
  color: var(--text);
}

.ads-local-time__state {
  color: var(--subdued);
}
</style>
