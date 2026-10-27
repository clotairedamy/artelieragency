<script setup lang="ts">
// A right-hand detail panel. In a dashboard this is where a selected row
// explains itself, so the table never has to leave the screen.
</script>

<template>
  <div class="ads-drawer">
    <div class="main"><slot /></div>
    <div class="panel"><slot name="panel" /></div>
  </div>
</template>
