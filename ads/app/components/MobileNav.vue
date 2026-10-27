<script setup lang="ts">
// Phone navigation: a tab bar along the bottom, where a thumb can reach it,
// and a sheet behind "More" for everything that does not fit in four slots.
//
// On a page with sections the tabs are sections, and the raised pill slides
// to whichever one you are reading. On a page without, they are the pages.
import type { Section } from '~/composables/useOverlays'

const props = defineProps<{ sections: Section[]; activeIndex: number }>()
const emit = defineEmits<{ select: [index: number] }>()

const { pages, studio } = useAppConfig()
const route = useRoute()
const sheet = useMenuSheet()
const palette = usePalette()

type Tab = { key: string; label: string; icon: string; href?: string; to?: string; index?: number }

const tabs = computed<Tab[]>(() => {
  if (props.sections.length) {
    const flagged = props.sections.filter((s) => s.tab)
    const picked = (flagged.length ? flagged : props.sections).slice(0, 4)
    return picked.map((s) => ({
      key: s.id,
      label: s.short ?? s.label,
      icon: s.icon,
      href: `#${s.id}`,
      index: props.sections.indexOf(s),
    }))
  }
  return pages.map((p) => ({ key: p.to, label: p.short, icon: p.icon, to: p.to }))
})

// Which slot the pill sits under. A section that is not in the bar lights
// up More instead, so the pill always says where you are.
const pill = computed(() => {
  if (sheet.value) return tabs.value.length
  const i = props.sections.length
    ? tabs.value.findIndex((t) => t.index === props.activeIndex)
    : tabs.value.findIndex((t) => t.to === route.path)
  return i < 0 ? tabs.value.length : i
})

function pick(t: Tab) {
  if (t.index !== undefined) emit('select', t.index)
}

function pickSection(i: number) {
  emit('select', i)
  sheet.value = false
}

// ─── Sheet: drag down to dismiss ─────────────────────────────────────────
const drag = ref(0)
let startY = 0
let dragging = false

function onDown(e: PointerEvent) {
  dragging = true
  startY = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
  if (dragging) drag.value = Math.max(0, e.clientY - startY)
}
function onUp() {
  if (!dragging) return
  dragging = false
  if (drag.value > 90) sheet.value = false
  drag.value = 0
}

watch(() => route.fullPath, () => (sheet.value = false))

// The page underneath should not scroll while the sheet is up.
watch(sheet, (v) => document.documentElement.classList.toggle('sheet-open', v))

function openSearch() {
  sheet.value = false
  palette.value = true
}
</script>

<template>
  <nav class="tabbar" aria-label="Primary">
    <span class="pill" :style="{ transform: `translateX(${pill * 100}%)` }" aria-hidden="true" />
    <template v-for="t in tabs" :key="t.key">
      <a v-if="t.href" class="tab" :class="{ on: pill === tabs.indexOf(t) }" :href="t.href" @click="pick(t)">
        <Icon :name="t.icon" :size="21" />
        <span>{{ t.label }}</span>
      </a>
      <NuxtLink v-else class="tab" :class="{ on: pill === tabs.indexOf(t) }" :to="t.to!">
        <Icon :name="t.icon" :size="21" />
        <span>{{ t.label }}</span>
      </NuxtLink>
    </template>
    <button class="tab" :class="{ on: pill === tabs.length }" type="button" :aria-expanded="sheet" @click="sheet = !sheet">
      <Icon name="grid" :size="21" />
      <span>More</span>
    </button>
  </nav>

  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="sheet" class="backdrop" @click.self="sheet = false">
        <div
          class="sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          :style="drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined"
          @keydown.esc="sheet = false"
        >
          <div class="grab" @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
            <span class="handle" />
          </div>

          <button class="search" type="button" @click="openSearch">
            <Icon name="discovery" :size="18" />
            Search or jump to…
          </button>

          <template v-if="sections.length">
            <p class="eyebrow">On this page</p>
            <div class="grid">
              <a
                v-for="(s, i) in sections"
                :key="s.id"
                class="item"
                :class="{ on: i === activeIndex }"
                :href="`#${s.id}`"
                @click="pickSection(i)"
              >
                <span class="item-icon"><Icon :name="s.icon" :size="19" /></span>
                <span>{{ s.label }}</span>
              </a>
            </div>
          </template>

          <p class="eyebrow">Pages</p>
          <div class="grid">
            <NuxtLink v-for="p in pages" :key="p.to" class="item" :class="{ on: route.path === p.to }" :to="p.to">
              <span class="item-icon"><Icon :name="p.icon" :size="19" /></span>
              <span>{{ p.label }}</span>
            </NuxtLink>
          </div>

          <div class="sheet-foot">
            <div class="theme-row">
              <AdsThemeToggle />
              <span class="body">Appearance</span>
            </div>
            <a class="num mail" :href="`mailto:${studio.email}`">{{ studio.email }}</a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ─── Tab bar ──────────────────────────────────────────────────────────── */

.tabbar {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 40;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 6px;
  border-radius: 24px;
  background: color-mix(in srgb, var(--raised) 86%, transparent);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  box-shadow: var(--soft-raised-lg);
}

/* One fifth of the bar, less the padding: the same width as a tab, so
   translating it by whole widths lands it exactly under the next one. */
.pill {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 6px;
  width: calc((100% - 12px) / 5);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  transition: transform 0.45s var(--ease);
}

.tab {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 3px;
  padding: 8px 2px 7px;
  min-width: 0;
  color: var(--subdued);
  font-size: 0.64rem;
  font-weight: 560;
  letter-spacing: 0.01em;
  transition: color 0.3s var(--ease);
  -webkit-tap-highlight-color: transparent;
}

.tab span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab svg {
  transition: transform 0.35s var(--ease);
}

.tab.on {
  color: var(--text);
}

.tab.on svg {
  transform: translateY(-1px) scale(1.06);
}

.tab:active svg {
  transform: scale(0.9);
}

@media (min-width: 900px) {
  .tabbar {
    display: none;
  }
}

/* ─── Sheet ────────────────────────────────────────────────────────────── */

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  background: rgb(10 10 12 / 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.sheet {
  width: 100%;
  max-height: 84vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: grid;
  gap: 12px;
  padding: 0 18px calc(22px + env(safe-area-inset-bottom));
  border-radius: 28px 28px 0 0;
  background: var(--surface);
  box-shadow: var(--soft-raised-lg);
  transition: transform 0.4s var(--ease);
}

.grab {
  display: grid;
  place-items: center;
  height: 30px;
  margin: 0 -18px;
  touch-action: none;
  cursor: grab;
}

.handle {
  width: 40px;
  height: 5px;
  border-radius: 99px;
  background: var(--line-strong);
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--subdued);
  font-size: 0.95rem;
}

.eyebrow {
  margin: 8px 4px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-soft);
  transition:
    box-shadow 0.25s var(--ease),
    transform 0.25s var(--ease);
}

.item:active {
  box-shadow: var(--soft-inset-sm);
  transform: translateY(1px);
}

.item.on {
  color: var(--text);
  box-shadow: var(--soft-inset-sm);
}

.item-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 11px;
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
}

.sheet-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.theme-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-row .body {
  margin: 0;
}

.mail {
  font-size: 0.72rem;
  color: var(--subdued);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s var(--ease);
}

.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.42s var(--ease);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}
</style>
