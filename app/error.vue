<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
useHead({ title: `${props.error.statusCode} · Artelier` })
</script>

<template>
  <div class="shell">
    <div class="card panel">
      <span class="num code">{{ error.statusCode }}</span>
      <h1 class="h2">This screen does not exist.</h1>
      <p class="lede">
        Which, given what we do for a living, is a little embarrassing.
      </p>
      <NuxtLink class="btn btn-accent" to="/">
        Back to the overview
        <Icon name="arrow" :size="18" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
  background: var(--canvas);
}
.panel {
  display: grid;
  gap: 16px;
  justify-items: start;
  max-width: 46ch;
  padding: clamp(28px, 5vw, 48px);
}
.code { font-size: 0.86rem; color: var(--accent); }
</style>
