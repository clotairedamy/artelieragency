<script setup lang="ts">
// A tree is the right shape for anything with real nesting. Built on nested
// lists so the nesting is in the markup, not only in the indentation. Counts
// are figures, so they are set in tabular mono and right-aligned on the row.
export type TreeNode = { label: string; count?: number; children?: TreeNode[] }

defineProps<{ nodes: TreeNode[] }>()
</script>

<template>
  <ul class="ads-tree">
    <li v-for="(n, i) in nodes" :key="i">
      <span>
        {{ n.label }}
        <span v-if="n.count !== undefined" class="count num">{{ n.count.toLocaleString('en-GB') }}</span>
      </span>
      <AdsTree v-if="n.children?.length" :nodes="n.children" />
    </li>
  </ul>
</template>
