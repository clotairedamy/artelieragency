<script setup lang="ts">
// A tabbed tour: a pressed-in segmented control picks the screen, and the
// copy changes with it. The visual is the default slot.
//
// It is a real tab set — arrow keys move between screens, one tab in the tab
// order, the panel labelled by its tab — because a row of buttons that swaps
// content is a tab set whether or not it says so.
export type TourScreen = { id: string; label: string; title: string; body: string }

const props = withDefaults(defineProps<{ screens: TourScreen[]; active?: number }>(), { active: 0 })
const emit = defineEmits<{ (e: 'update:active', v: number): void }>()
const uid = useId()

// Indexed by screen, so arrow keys can move focus to the tab they selected.
const tabs: (HTMLButtonElement | null)[] = []

function onKey(e: KeyboardEvent) {
  const n = props.screens.length
  if (!n) return
  const to =
    e.key === 'ArrowRight' ? (props.active + 1) % n
    : e.key === 'ArrowLeft' ? (props.active - 1 + n) % n
    : e.key === 'Home' ? 0
    : e.key === 'End' ? n - 1
    : -1
  if (to < 0) return
  e.preventDefault()
  emit('update:active', to)
  tabs[to]?.focus()
}
</script>

<template>
  <div class="ads-screen-tour">
    <div class="ads-screen-tour__tabs" role="tablist" aria-label="Screens" @keydown="onKey">
      <button
        v-for="(s, i) in screens"
        :id="`${uid}-tab-${s.id}`"
        :key="s.id"
        :ref="(el) => (tabs[i] = el as HTMLButtonElement | null)"
        type="button"
        role="tab"
        class="ads-screen-tour__tab"
        :class="{ 'is-active': i === active }"
        :aria-selected="i === active"
        :aria-controls="i === active ? `${uid}-panel-${s.id}` : undefined"
        :tabindex="i === active ? 0 : -1"
        @click="emit('update:active', i)"
      >
        {{ s.label }}
      </button>
    </div>

    <div
      :id="`${uid}-panel-${screens[active]?.id}`"
      class="ads-screen-tour__stage"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-${screens[active]?.id}`"
    >
      <div class="ads-screen-tour__copy">
        <h3 class="h3">{{ screens[active]?.title }}</h3>
        <p class="body">{{ screens[active]?.body }}</p>
      </div>
      <div class="ads-screen-tour__shot"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.ads-screen-tour {
  display: grid;
  gap: 40px;
  justify-items: center;
}

.ads-screen-tour__tabs {
  display: inline-flex;
  gap: var(--sp-1);
  padding: 6px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.ads-screen-tour__tab {
  border: 0;
  background: transparent;
  color: var(--subdued);
  font: inherit;
  font-size: 0.88rem;
  padding: 10px 20px;
  border-radius: var(--pill);
  cursor: pointer;
  white-space: nowrap;
  transition:
    color var(--dur-control) var(--ease),
    background var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-screen-tour__tab:hover {
  color: var(--text);
}

.ads-screen-tour__tab.is-active {
  color: var(--accent-ink);
  background: var(--accent);
  box-shadow: var(--soft-raised-sm);
}

.ads-screen-tour__stage {
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--sp-7);
  align-items: center;
}

.ads-screen-tour__copy h3 {
  margin-bottom: var(--sp-3);
}

.ads-screen-tour__copy p {
  line-height: 1.65;
}

@media (max-width: 900px) {
  .ads-screen-tour__stage {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .ads-screen-tour__copy {
    text-align: center;
  }
}
</style>
