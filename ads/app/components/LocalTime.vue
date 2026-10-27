<script setup lang="ts">
// The time in the studio, and whether anyone is at the desk. More useful than
// an address: it tells you when to expect a reply.
withDefaults(
  defineProps<{ city?: string; time?: string; open?: boolean; state?: string }>(),
  { city: 'Colorado Springs', time: '', open: true, state: '' },
)
</script>

<template>
  <p class="lt">
    <span class="lt-dot" :class="{ 'is-off': !open }" aria-hidden="true" />
    <span>{{ city }}</span>
    <time class="lt-time num">{{ time || '··:··' }}</time>
    <span v-if="state" class="lt-state">{{ state }}</span>
  </p>
</template>

<style scoped>
.lt {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  font-size: 0.82rem;
  color: var(--text-soft);
  margin: 0;
}

.lt-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ok);
}

.lt-dot.is-off {
  background: var(--subdued);
}

.lt-time {
  color: var(--text);
}

.lt-state {
  color: var(--subdued);
}
</style>
