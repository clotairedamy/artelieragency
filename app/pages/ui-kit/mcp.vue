<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'MCP server · Artelier UI Kit for Vue',
  description:
    'An MCP server that gives a model the Artelier UI Kit itself: every component’s schema and source, the tokens and the design rules. It builds apps from real components instead of invented ones.',
  path: '/ui-kit/mcp',
})
</script>

<template>
  <UiKitMcp />
</template>
