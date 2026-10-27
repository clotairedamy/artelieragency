<script setup lang="ts">
// Phone navigation: a tab bar along the bottom, where a thumb can reach it,
// and a sheet behind "More" for everything that does not fit in four slots.
//
// On a page with sections the tabs are sections, and the raised pill slides
// to whichever one you are reading. On a page without, they are the pages —
// the first four, as a thumb can only tell four apart; the rest are in the
// sheet. A section that is a page of its own (it has a `to`) is a link.
import type { Section } from '../composables/useOverlays'

const props = defineProps<{ sections: Section[]; activeIndex: number; heading?: string }>()
const emit = defineEmits<{ select: [index: number] }>()

const { pages, studio } = useAppConfig()
const route = useRoute()
const sheet = useMenuSheet()
const palette = usePalette()

type Tab = { key: string; label: string; icon: string; href?: string; to?: string; index?: number }

// The longest page path the route sits under, so /docs/install keeps /docs lit.
const currentPage = computed(
  () =>
    pages
      .filter((p) => route.path === p.to || (p.to !== '/' && route.path.startsWith(`${p.to}/`)))
      .sort((a, b) => b.to.length - a.to.length)[0]?.to,
)

const tabs = computed<Tab[]>(() => {
  if (props.sections.length) {
    const flagged = props.sections.filter((s) => s.tab)
    const picked = (flagged.length ? flagged : props.sections).slice(0, 4)
    return picked.map((s) => ({
      key: s.id,
      label: s.short ?? s.label,
      icon: s.icon,
      href: s.to ? undefined : `#${s.id}`,
      to: s.to,
      index: props.sections.indexOf(s),
    }))
  }
  return pages.slice(0, 4).map((p) => ({ key: p.to, label: p.short, icon: p.icon, to: p.to }))
})

// Which slot the pill sits under. A section that is not in the bar lights
// up More instead, so the pill always says where you are.
const pill = computed(() => {
  if (sheet.value) return tabs.value.length
  const i = props.sections.length
    ? tabs.value.findIndex((t) => t.index === props.activeIndex)
    : tabs.value.findIndex((t) => t.to === currentPage.value)
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

// The page underneath should not scroll while the sheet is up. Focus goes
// into the sheet when it opens, so Escape and the keyboard work at once, and
// back to whatever opened it when it closes.
const searchBtn = ref<HTMLButtonElement>()
let opener: HTMLElement | null = null
watch(sheet, async (v) => {
  document.documentElement.classList.toggle('sheet-open', v)
  if (v) {
    opener = document.activeElement as HTMLElement | null
    await nextTick()
    searchBtn.value?.focus()
  } else {
    if (opener?.isConnected) opener.focus({ preventScroll: true })
    opener = null
  }
})

function openSearch() {
  sheet.value = false
  palette.value = true
}
</script>

<template>
  <nav class="ads-mobile-nav" aria-label="Primary" :style="{ '--slots': tabs.length + 1 }">
    <span class="ads-mobile-nav__pill" :style="{ transform: `translateX(${pill * 100}%)` }" aria-hidden="true" />
    <template v-for="t in tabs" :key="t.key">
      <a
        v-if="t.href"
        class="ads-mobile-nav__tab"
        :class="{ 'is-active': pill === tabs.indexOf(t) }"
        :href="t.href"
        :aria-current="pill === tabs.indexOf(t) ? 'location' : undefined"
        @click="pick(t)"
      >
        <Icon :name="t.icon" :size="21" />
        <span>{{ t.label }}</span>
      </a>
      <NuxtLink
        v-else
        class="ads-mobile-nav__tab"
        :class="{ 'is-active': pill === tabs.indexOf(t) }"
        :to="t.to!"
        :aria-current="pill === tabs.indexOf(t) ? 'page' : undefined"
      >
        <Icon :name="t.icon" :size="21" />
        <span>{{ t.label }}</span>
      </NuxtLink>
    </template>
    <button
      class="ads-mobile-nav__tab"
      :class="{ 'is-active': pill === tabs.length }"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="sheet"
      @click="sheet = !sheet"
    >
      <Icon name="grid" :size="21" />
      <span>More</span>
    </button>
  </nav>

  <Teleport to="body">
    <Transition name="ads-mobile-nav__open">
      <div v-if="sheet" class="ads-mobile-nav__backdrop" @click.self="sheet = false">
        <div
          class="ads-mobile-nav__sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          :style="drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined"
          @keydown.esc="sheet = false"
        >
          <div class="ads-mobile-nav__grab" @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
            <span class="ads-mobile-nav__handle" />
          </div>

          <button ref="searchBtn" class="ads-mobile-nav__search" type="button" @click="openSearch">
            <Icon name="discovery" :size="18" />
            Search or jump to…
          </button>

          <template v-if="sections.length">
            <p class="eyebrow ads-mobile-nav__heading">{{ heading ?? 'On this page' }}</p>
            <div class="ads-mobile-nav__grid">
              <template v-for="(s, i) in sections" :key="s.id">
                <NuxtLink
                  v-if="s.to"
                  class="ads-mobile-nav__item"
                  :class="{ 'is-active': i === activeIndex }"
                  :to="s.to"
                  :aria-current="i === activeIndex ? 'page' : undefined"
                >
                  <span class="ads-mobile-nav__item-icon"><Icon :name="s.icon" :size="19" /></span>
                  <span>{{ s.label }}</span>
                </NuxtLink>
                <a
                  v-else
                  class="ads-mobile-nav__item"
                  :class="{ 'is-active': i === activeIndex }"
                  :href="`#${s.id}`"
                  :aria-current="i === activeIndex ? 'location' : undefined"
                  @click="pickSection(i)"
                >
                  <span class="ads-mobile-nav__item-icon"><Icon :name="s.icon" :size="19" /></span>
                  <span>{{ s.label }}</span>
                </a>
              </template>
            </div>
          </template>

          <p class="eyebrow ads-mobile-nav__heading">Pages</p>
          <div class="ads-mobile-nav__grid">
            <NuxtLink
              v-for="p in pages"
              :key="p.to"
              class="ads-mobile-nav__item"
              :class="{ 'is-active': currentPage === p.to }"
              :to="p.to"
              :aria-current="currentPage === p.to ? 'page' : undefined"
            >
              <span class="ads-mobile-nav__item-icon"><Icon :name="p.icon" :size="19" /></span>
              <span>{{ p.label }}</span>
            </NuxtLink>
          </div>

          <div class="ads-mobile-nav__foot">
            <div class="ads-mobile-nav__theme">
              <AdsThemeToggle />
              <span class="body">Appearance</span>
            </div>
            <a class="num ads-mobile-nav__mail" :href="`mailto:${studio.email}`">{{ studio.email }}</a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ─── Tab bar ──────────────────────────────────────────────────────────── */

.ads-mobile-nav {
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

/* One slot of the bar, less the padding: the same width as a tab, so
   translating it by whole widths lands it exactly under the next one. The
   bar says how many slots it has, so the two cannot drift apart. */
.ads-mobile-nav__pill {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 6px;
  width: calc((100% - 12px) / var(--slots, 5));
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  transition: transform var(--dur-move) var(--ease);
}

.ads-mobile-nav__tab {
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
  transition: color var(--dur-control) var(--ease);
  -webkit-tap-highlight-color: transparent;
}

.ads-mobile-nav__tab span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ads-mobile-nav__tab svg {
  transition: transform var(--dur-control) var(--ease);
}

.ads-mobile-nav__tab.is-active {
  color: var(--text);
}

.ads-mobile-nav__tab.is-active svg {
  transform: translateY(-1px) scale(1.06);
}

.ads-mobile-nav__tab:active svg {
  transform: scale(0.9);
}

@media (min-width: 900px) {
  .ads-mobile-nav {
    display: none;
  }
}

/* ─── Sheet ────────────────────────────────────────────────────────────── */

.ads-mobile-nav__backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  background: rgb(10 10 12 / 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.ads-mobile-nav__sheet {
  width: 100%;
  max-height: 84vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: grid;
  gap: var(--sp-3);
  padding: 0 18px calc(22px + env(safe-area-inset-bottom));
  border-radius: 28px 28px 0 0;
  background: var(--surface);
  box-shadow: var(--soft-raised-lg);
  transition: transform var(--dur-move) var(--ease);
}

.ads-mobile-nav__grab {
  display: grid;
  place-items: center;
  height: 30px;
  margin: 0 -18px;
  touch-action: none;
  cursor: grab;
}

.ads-mobile-nav__handle {
  width: 40px;
  height: 5px;
  border-radius: var(--pill);
  background: var(--line-strong);
}

.ads-mobile-nav__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 var(--sp-4);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--subdued);
  font-size: 0.95rem;
}

.ads-mobile-nav__heading {
  margin: var(--sp-2) var(--sp-1) 0;
}

.ads-mobile-nav__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ads-mobile-nav__item {
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
    box-shadow var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease);
}

.ads-mobile-nav__item:active {
  box-shadow: var(--soft-inset-sm);
  transform: translateY(1px);
}

.ads-mobile-nav__item.is-active {
  color: var(--text);
  box-shadow: var(--soft-inset-sm);
}

.ads-mobile-nav__item-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 11px;
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
}

.ads-mobile-nav__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-top: var(--sp-2);
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.ads-mobile-nav__theme {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.ads-mobile-nav__theme .body {
  margin: 0;
}

.ads-mobile-nav__mail {
  font-size: 0.72rem;
  color: var(--subdued);
}

.ads-mobile-nav__open-enter-active,
.ads-mobile-nav__open-leave-active {
  transition: opacity var(--dur-control) var(--ease);
}

.ads-mobile-nav__open-enter-active .ads-mobile-nav__sheet,
.ads-mobile-nav__open-leave-active .ads-mobile-nav__sheet {
  transition: transform var(--dur-move) var(--ease);
}

.ads-mobile-nav__open-enter-from,
.ads-mobile-nav__open-leave-to {
  opacity: 0;
}

.ads-mobile-nav__open-enter-from .ads-mobile-nav__sheet,
.ads-mobile-nav__open-leave-to .ads-mobile-nav__sheet {
  transform: translateY(100%);
}
</style>
