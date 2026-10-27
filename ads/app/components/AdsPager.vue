<script setup lang="ts">
// Pagination: which slice of the table you are looking at. Page numbers are
// figures, so they are monospaced. Past seven pages the row shows the ends
// and the neighbours of the current page with a gap between — every page
// stays two clicks away, and "page 400" is still reachable, which infinite
// scroll would not allow.
const props = withDefaults(defineProps<{ page?: number; pages?: number }>(), { page: 1, pages: 1 })
const emit = defineEmits<{ (e: 'change', page: number): void; (e: 'update:page', page: number): void }>()

const items = computed<(number | 'gap')[]>(() => {
  const { page, pages } = props
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))
  const out: (number | 'gap')[] = []
  ;[...keep].sort((a, b) => a - b).forEach((n, i, all) => {
    if (i && n - all[i - 1]! > 1) out.push('gap')
    out.push(n)
  })
  return out
})

function go(n: number) {
  if (n < 1 || n > props.pages || n === props.page) return
  emit('update:page', n)
  emit('change', n)
}
</script>

<template>
  <nav class="ads-pager" aria-label="Pagination">
    <button type="button" aria-label="Previous page" :disabled="page <= 1" @click="go(page - 1)">‹</button>
    <template v-for="(n, i) in items" :key="n === 'gap' ? `gap${i}` : n">
      <span v-if="n === 'gap'" class="ads-pager__gap" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        :class="{ 'is-on': n === page }"
        :aria-label="`Page ${n}`"
        :aria-current="n === page ? 'page' : undefined"
        @click="go(n)"
      >
        {{ n }}
      </button>
    </template>
    <button type="button" aria-label="Next page" :disabled="page >= pages" @click="go(page + 1)">›</button>
  </nav>
</template>

<style scoped>
.ads-pager__gap {
  min-width: var(--sp-5);
  text-align: center;
  font-family: var(--mono);
  font-size: 0.78rem;
  color: var(--subdued);
}
</style>
