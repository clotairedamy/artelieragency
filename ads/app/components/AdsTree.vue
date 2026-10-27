<script setup lang="ts">
// A tree is the right shape for anything with real nesting. Built on nested
// lists so the nesting is in the markup, not only in the indentation.
export type TreeNode = { label: string; count?: number; children?: TreeNode[] }

defineProps<{ nodes: TreeNode[] }>()
</script>

<template>
  <ul class="ads-tree">
    <li v-for="(n, i) in nodes" :key="i">
      <span>
        {{ n.label }}
        <span v-if="n.count !== undefined" class="count">{{ n.count }}</span>
      </span>
      <AdsTree v-if="n.children?.length" :nodes="n.children" />
    </li>
  </ul>
</template>
