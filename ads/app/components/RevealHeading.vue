<script setup lang="ts">
// A heading rendered one block per line, so a deliberate break lands where it
// was written.
withDefaults(
  defineProps<{ lines: string[]; tag?: string; size?: 'display' | 'title' | 'statement' }>(),
  { tag: 'h2', size: 'title' },
)
</script>

<template>
  <component :is="tag" class="rv" :class="`rv--${size}`">
    <span v-for="(line, i) in lines" :key="i" class="rv-line">{{ line }}</span>
  </component>
</template>

<style scoped>
.rv {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text);
  text-wrap: balance;
  margin: 0;
}

.rv-line {
  display: block;
}

.rv--display {
  font-size: clamp(2.6rem, 5.4vw, 4.4rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
}

.rv--title {
  font-size: clamp(1.9rem, 3.4vw, 2.75rem);
  line-height: 1.08;
  letter-spacing: -0.012em;
}

.rv--statement {
  font-size: clamp(1.6rem, 2.8vw, 2.25rem);
  line-height: 1.18;
  letter-spacing: -0.01em;
}
</style>
