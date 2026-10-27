<script setup lang="ts">
// A row of wordmarks, for "used by" or partner logos. Kept monochrome so they
// do not compete with the data; the accent is not spent here.
defineProps<{ names?: string[] }>()
</script>

<template>
  <div class="marquee">
    <span v-for="(n, i) in names ?? ['Northwind', 'Vantage', 'Halo', 'Meridian', 'Atlas', 'Orbital']" :key="i" class="wordmark">
      {{ n }}
    </span>
  </div>
</template>

<style scoped>
.marquee {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 40px;
  justify-content: center;
  align-items: center;
}

.wordmark {
  font-family: var(--font-label);
  font-size: 0.82rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--subdued);
  white-space: nowrap;
}
</style>
