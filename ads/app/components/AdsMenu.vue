<script setup lang="ts">
// A menu: a vertical list of actions with optional icons and shortcuts.
export type MenuItem = { label: string; icon?: string; shortcut?: string; action?: () => void }

defineProps<{ items: MenuItem[]; label?: string }>()
</script>

<template>
  <div class="ads-menu" role="menu" :aria-label="label">
    <template v-for="(item, i) in items" :key="i">
      <hr v-if="item.label === '---'" />
      <button v-else type="button" role="menuitem" @click="item.action?.()">
        <Icon v-if="item.icon" :name="item.icon" :size="15" />
        {{ item.label }}
        <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
      </button>
    </template>
  </div>
</template>
