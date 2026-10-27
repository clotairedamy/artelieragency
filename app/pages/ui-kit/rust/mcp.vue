<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'MCP server · Artelier UI Kit for Rust',
  description:
    'An MCP server that gives a model the Artelier UI Kit itself: every component’s schema and source, the tokens and the design rules. It builds Dioxus apps from real components instead of invented ones.',
  path: '/ui-kit/rust/mcp',
})
</script>

<template>
  <UiKitMcp />
</template>
