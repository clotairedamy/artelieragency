<script setup lang="ts">
// A tabbed tour: a pressed-in segmented control picks the screen, and the
// copy changes with it. The visual is the default slot.
export type TourScreen = { id: string; label: string; title: string; body: string }

withDefaults(defineProps<{ screens: TourScreen[]; active?: number }>(), { active: 0 })
const emit = defineEmits<{ (e: 'update:active', v: number): void }>()
</script>

<template>
  <div class="tour">
    <div class="tabs" role="tablist" aria-label="Screens">
      <button
        v-for="(s, i) in screens"
        :key="s.id"
        role="tab"
        :aria-selected="i === active"
        :class="{ on: i === active }"
        @click="emit('update:active', i)"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="stage">
      <div class="copy">
        <h3 class="h3">{{ screens[active]?.title }}</h3>
        <p class="body">{{ screens[active]?.body }}</p>
      </div>
      <div class="shot"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.tour {
  display: grid;
  gap: 40px;
  justify-items: center;
}

.tabs {
  display: inline-flex;
  gap: 4px;
  padding: 6px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs button {
  border: 0;
  background: transparent;
  color: var(--subdued);
  font: inherit;
  font-size: 0.88rem;
  padding: 10px 20px;
  border-radius: var(--pill);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s var(--ease), background 0.2s var(--ease), box-shadow 0.3s var(--ease);
}

.tabs button:hover {
  color: var(--text);
}

.tabs button.on {
  color: var(--accent-ink);
  background: var(--accent);
  box-shadow: var(--soft-raised-sm);
}

.stage {
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  align-items: center;
}

.copy h3 {
  margin-bottom: 12px;
}

.copy p {
  line-height: 1.65;
}

@media (max-width: 900px) {
  .stage {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .copy {
    text-align: center;
  }
}
</style>
