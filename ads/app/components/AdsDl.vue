<script setup lang="ts">
// Key-value detail, which is what a selected row almost always needs. A
// two-column grid rather than a table, so the values can wrap.
export type DlItem = { term: string; value: string | number }

defineProps<{ items: DlItem[] }>()
</script>

<template>
  <dl class="ads-dl">
    <template v-for="(item, i) in items" :key="i">
      <dt>{{ item.term }}</dt>
      <dd>{{ item.value }}</dd>
    </template>
  </dl>
</template>
