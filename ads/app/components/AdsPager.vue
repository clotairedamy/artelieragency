<script setup lang="ts">
// Pagination.
withDefaults(defineProps<{ page: number; pages: number }>(), { page: 1, pages: 1 })
const emit = defineEmits<{ (e: 'change', page: number): void }>()
</script>

<template>
  <nav class="ads-pager" aria-label="Pagination">
    <button type="button" :disabled="page <= 1" @click="emit('change', page - 1)">‹</button>
    <button
      v-for="n in pages"
      :key="n"
      type="button"
      :class="{ 'is-on': n === page }"
      :aria-current="n === page ? 'page' : undefined"
      @click="emit('change', n)"
    >
      {{ n }}
    </button>
    <button type="button" :disabled="page >= pages" @click="emit('change', page + 1)">›</button>
  </nav>
</template>
