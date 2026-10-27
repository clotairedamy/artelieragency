<script setup lang="ts">
// The window chrome: a rail on the left, the page on a raised frame beside
// it. Measurements are the app's own (app/lib/src/screens/shell.dart) — a
// 232px rail collapsing to 88, 48px tiles at a 15px radius, 62px rows.
//
// The piece that makes it read as this app rather than a generic sidebar is
// the selected row. It is not a pill drawn on the rail; it is a tab cut from
// the frame's own surface, reaching left into the rail with concave fillets
// where it flows back into the frame, so the seam between rail and content
// disappears behind whatever is selected. It slides as you scroll.
//
// A set of pages (docs, say) can use the rail the same way: sections with a
// `to` are links, and the tab follows the URL instead of the scroll. A long
// list scrolls inside the rail, and keeps the selected row in view.
import type { Section } from '../composables/useOverlays'

const { nav: siteNav, pages, studio } = useAppConfig()
const route = useRoute()
const palette = usePalette()

// Pages that are not the one-pager bring their own section list, so the rail
// is always an index of the page you are actually on rather than a set of
// anchors pointing at sections that do not exist here.
const props = defineProps<{
  sections?: Section[]
  /**
   * Which section is current, when the page tracks that itself. Given one,
   * the rail stops observing and simply follows — which is what keeps it
   * from disagreeing with a finer-grained index on the same page.
   */
  activeId?: string
  /** What the list is, for the rail's landmark and the phone menu's heading. */
  navLabel?: string
}>()

const nav = computed<Section[]>(() => props.sections ?? siteNav)

const collapsed = ref(false)
const activeIndex = ref(0)

const active = computed(() => nav.value[activeIndex.value]?.id)

// Sections that are pages: the current one is the longest `to` the route sits
// under, so an overview at /docs does not stay lit on /docs/install.
const routed = computed(() => nav.value.some((n) => n.to))
watch(
  () => route.path,
  (path) => {
    if (!routed.value) return
    let best = -1
    nav.value.forEach((n, i) => {
      if (!n.to || !(path === n.to || path.startsWith(`${n.to}/`))) return
      if (best < 0 || n.to.length > nav.value[best]!.to!.length) best = i
    })
    if (best >= 0) activeIndex.value = best
  },
  { immediate: true },
)

// Keep the selected row in view when the list is taller than the rail.
const railNav = ref<HTMLElement>()
function reveal(smooth: boolean) {
  const el = railNav.value
  const row = el?.querySelectorAll<HTMLElement>('.ads-dash-shell__item')[activeIndex.value]
  if (!el || !row || el.scrollHeight <= el.clientHeight) return
  const top = row.offsetTop
  const bottom = top + row.offsetHeight
  if (top >= el.scrollTop + 14 && bottom <= el.scrollTop + el.clientHeight - 14) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollTo({ top: top - (el.clientHeight - row.offsetHeight) / 2, behavior: smooth && !reduced ? 'smooth' : 'auto' })
}
watch(activeIndex, () => nextTick(() => reveal(true)))

// The app bar's breadcrumb: the section you are reading, or on a page with
// no sections, the page itself — the longest page path the route sits under,
// so /components/rust/inputs still reads as Components.
const page = computed(() =>
  pages
    .filter((p) => route.path === p.to || (p.to !== '/' && route.path.startsWith(`${p.to}/`)))
    .sort((a, b) => b.to.length - a.to.length)[0],
)
const where = computed(() =>
  nav.value.length ? nav.value[activeIndex.value]?.label ?? '' : page.value?.label ?? '',
)

// The rail's foot: the pages marked `rail` in app.config, beside the index.
const railPages = computed(() => pages.filter((p) => p.rail))

// The app bar gains a hairline and a frosted fill once content scrolls
// under it, and not before — at the top it should read as part of the page.
const scrolled = ref(false)

// Follow the page's own notion of position when it has one.
watchEffect(() => {
  if (!props.activeId) return
  const i = nav.value.findIndex((n) => n.id === props.activeId)
  if (i >= 0) activeIndex.value = i
})

onMounted(() => {
  try {
    collapsed.value = localStorage.getItem('artelier:rail') === 'collapsed'
  } catch {
    // Private windows and blocked site data throw on access. The rail just
    // starts open, which is the right default anyway.
  }

  // Scroll spy. The trigger line sits a little above the middle of the
  // viewport, so the selected row is the section you are looking at rather
  // than the one whose top edge last crossed zero.
  // Only observe when the page is not telling us where it is. Two
  // observers on one page drift apart and start contradicting each other.
  reveal(false)
  if (props.activeId === undefined && !routed.value) {
    const sections = nav.value
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el)

    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const i = nav.value.findIndex((n) => n.id === entry.target.id)
          if (i >= 0) activeIndex.value = i
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((el) => spy.observe(el))
    onBeforeUnmount(() => spy.disconnect())
  }

  // ⌘K opens the palette from anywhere, and so does / when focus is not in
  // a field — the two conventions people bring from other tools.
  const onKey = (e: KeyboardEvent) => {
    const typing = (e.target as HTMLElement).closest?.('input, textarea, select, [contenteditable]')
    if ((e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
      e.preventDefault()
      palette.value = !palette.value
    }
  }
  const onScroll = () => {
    scrolled.value = window.scrollY > 8
  }
  onScroll()
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('scroll', onScroll)
  })
})

function toggle() {
  collapsed.value = !collapsed.value
  try {
    localStorage.setItem('artelier:rail', collapsed.value ? 'collapsed' : 'open')
  } catch {
    // Not worth failing the interaction over.
  }
}
</script>

<template>
  <div class="ads-dash-shell" :class="{ 'is-collapsed': collapsed }">
    <aside class="ads-dash-shell__rail">
      <NuxtLink to="/" class="ads-dash-shell__brand" :aria-label="studio.name">
        <BrandMark class="ads-dash-shell__mark" :size="collapsed ? 40 : 78" />
        <span class="ads-dash-shell__wordmark num">{{ studio.name }}</span>
      </NuxtLink>

      <hr v-if="nav.length" class="ads-dash-shell__rule">

      <!-- Anything the list needs above it: a switch between two sets of
           docs, say. -->
      <slot name="rail" />

      <nav v-if="nav.length" ref="railNav" class="ads-dash-shell__nav" :aria-label="navLabel ?? 'Sections'">
        <!-- The tab: a piece of the frame reaching into the rail. One element
             that slides, rather than a background on each row, so moving
             between sections is a single continuous gesture. -->
        <span class="ads-dash-shell__tab" :style="{ transform: `translateY(${activeIndex * 62}px)` }" aria-hidden="true">
          <span class="ads-dash-shell__fillet ads-dash-shell__fillet-top" />
          <span class="ads-dash-shell__fillet ads-dash-shell__fillet-bottom" />
        </span>

        <template v-for="(item, i) in nav" :key="item.id">
          <NuxtLink
            v-if="item.to"
            class="ads-dash-shell__item"
            :class="{ 'is-active': activeIndex === i }"
            :to="item.to"
            :aria-current="activeIndex === i ? 'page' : undefined"
          >
            <span class="ads-dash-shell__tile"><Icon :name="item.icon" :size="20" /></span>
            <span class="ads-dash-shell__label">{{ item.label }}</span>
          </NuxtLink>
          <a
            v-else
            class="ads-dash-shell__item"
            :class="{ 'is-active': activeIndex === i }"
            :href="`#${item.id}`"
            :aria-current="active === item.id ? 'true' : undefined"
            @click="activeIndex = i"
          >
            <span class="ads-dash-shell__tile"><Icon :name="item.icon" :size="20" /></span>
            <span class="ads-dash-shell__label">{{ item.label }}</span>
          </a>
        </template>
      </nav>

      <div class="ads-dash-shell__foot">
        <NuxtLink
          v-for="p in railPages"
          :key="p.to"
          class="ads-dash-shell__item"
          :class="{ 'is-active': page?.to === p.to }"
          :to="p.to"
          :aria-current="page?.to === p.to ? 'page' : undefined"
        >
          <span class="ads-dash-shell__tile"><Icon :name="p.icon" :size="20" /></span>
          <span class="ads-dash-shell__label">{{ p.label }}</span>
        </NuxtLink>

        <button
          class="ads-dash-shell__item"
          type="button"
          :aria-expanded="!collapsed"
          :aria-label="collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'"
          @click="toggle"
        >
          <span class="ads-dash-shell__tile ads-dash-shell__collapse-tile"><Icon name="chevrons" :size="20" /></span>
          <span class="ads-dash-shell__label">Collapse</span>
        </button>
      </div>
    </aside>

    <main class="ads-dash-shell__panel">
      <!-- The app bar: where you are, and the three things you might want
           from anywhere — search, appearance, and the one action. The
           `tools` slot puts the product's own destination ahead of them;
           keep it free of the accent, which belongs to the action. -->
      <header class="ads-dash-shell__appbar" :class="{ 'is-scrolled': scrolled }">
        <NuxtLink to="/" class="ads-dash-shell__appbar-brand" :aria-label="studio.name">
          <BrandMark :size="30" />
        </NuxtLink>
        <nav class="ads-dash-shell__crumbs" aria-label="Breadcrumb">
          <NuxtLink to="/" class="ads-dash-shell__crumb-root">{{ studio.name }}</NuxtLink>
          <span class="ads-dash-shell__crumb-sep" aria-hidden="true">/</span>
          <span class="ads-dash-shell__crumb-window">
            <Transition name="ads-dash-shell__crumb" mode="out-in">
              <span :key="where" class="ads-dash-shell__crumb-here" aria-current="location">{{ where }}</span>
            </Transition>
          </span>
        </nav>
        <div class="ads-dash-shell__tools">
          <slot name="tools" />
          <button class="ads-dash-shell__search" type="button" aria-label="Search or jump to" @click="palette = true">
            <Icon name="discovery" :size="18" />
            <span class="ads-dash-shell__search-label">Search or jump to…</span>
            <kbd class="kbd">⌘K</kbd>
          </button>
          <AdsThemeToggle />
          <NuxtLink class="btn btn-accent ads-dash-shell__cta" to="/contact">Start a project</NuxtLink>
        </div>
      </header>

      <slot />
    </main>

    <MobileNav :sections="nav" :active-index="activeIndex" :heading="navLabel" @select="activeIndex = $event" />
    <CommandPalette :sections="nav" />
    <AdsToastHost />
  </div>
</template>

<style scoped>
.ads-dash-shell {
  --w: var(--rail-w);
  --row: 62px;
  min-height: 100vh;
  background: var(--canvas);
}

.ads-dash-shell.is-collapsed {
  --w: var(--rail-w-collapsed);
}

/* ─── Rail ─────────────────────────────────────────────────────────────── */

.ads-dash-shell__rail {
  display: none;
}

@media (min-width: 900px) {
  .ads-dash-shell__rail {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 20;
    width: var(--w);
    display: flex;
    flex-direction: column;
    gap: 22px;
    /* No horizontal padding: the selected tab has to reach the rail's right
       edge and 2px past it. Each child indents itself instead. */
    padding: 26px 0 18px;
    background: var(--rail);
    transition: width var(--dur-move) var(--ease);
  }

  .ads-dash-shell__brand {
    display: grid;
    justify-items: center;
    gap: 9px;
    padding: 0 20px;
    color: var(--text);
  }

  .ads-dash-shell__mark {
    transition: width var(--dur-move) var(--ease), height var(--dur-move) var(--ease);
  }

  .ads-dash-shell__wordmark {
    font-size: 0.72rem;
    font-weight: 560;
    letter-spacing: 0.38em;
    text-indent: 0.38em;
    text-transform: uppercase;
    color: var(--subdued);
  }

  .ads-dash-shell__rule {
    height: 1px;
    margin: -4px 20px;
    border: 0;
    background: var(--line-strong);
    opacity: 0.55;
  }

  /* The list scrolls when it is taller than the rail, with no scrollbar —
     a row cut off at the edge says there is more. It reaches 2px past the
     rail, as the tab does, and pads 14px top and bottom for the fillets, so
     the scroll box clips neither. */
  .ads-dash-shell__nav {
    position: relative;
    flex: 0 1 auto;
    min-height: 0;
    margin: -14px -2px -14px 0;
    padding: 14px 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
  }

  .ads-dash-shell__nav::-webkit-scrollbar {
    display: none;
  }

  .ads-dash-shell__foot {
    flex: none;
    margin-top: auto;
    display: grid;
    gap: 2px;
  }

  /* Collapsed: the labels go, the tiles stay exactly where they were. The
     tile column is centred in the collapsed rail — (88 − 48) / 2 — so
     collapsing slides nothing sideways. */
  .ads-dash-shell.is-collapsed .ads-dash-shell__label,
  .ads-dash-shell.is-collapsed .ads-dash-shell__wordmark {
    opacity: 0;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .ads-dash-shell.is-collapsed .ads-dash-shell__collapse-tile {
    transform: rotate(180deg);
  }
}

/* ─── The selected tab ─────────────────────────────────────────────────── */

.ads-dash-shell__tab {
  position: absolute;
  top: 14px;
  left: 10px;
  right: 0;
  height: var(--row);
  border-radius: var(--radius) 0 0 var(--radius);
  background: var(--surface);
  transition: transform var(--dur-move) var(--ease);
  will-change: transform;
}

/* The concave corners where the tab flows back into the frame. A quarter
   disc is carved out of a 14px box with a radial gradient — the same shape
   the app paints with a path, for the cost of two elements that follow the
   tab wherever it slides. */
.ads-dash-shell__fillet {
  position: absolute;
  right: 0;
  width: 14px;
  height: 14px;
}

.ads-dash-shell__fillet-top {
  top: -14px;
  background: radial-gradient(circle 14px at top left, transparent 14px, var(--surface) 14px);
}

.ads-dash-shell__fillet-bottom {
  bottom: -14px;
  background: radial-gradient(circle 14px at bottom left, transparent 14px, var(--surface) 14px);
}

/* ─── Nav items ────────────────────────────────────────────────────────── */

.ads-dash-shell__item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: var(--row);
  padding-left: 20px;
  color: var(--subdued);
  font-size: 0.97rem;
  font-weight: 500;
  letter-spacing: -0.012em;
  text-align: left;
  transition:
    color var(--dur-control) var(--ease),
    font-weight var(--dur-control) var(--ease);
}

/* Hover brightens the label and leaves the tile where it is: in this style
   a surface presses in, it never lifts toward the pointer. */
.ads-dash-shell__item:hover {
  color: var(--text);
}

.ads-dash-shell__item:active .ads-dash-shell__tile {
  box-shadow: var(--soft-inset-sm);
  transform: translateY(1px);
}

.ads-dash-shell__item.is-active {
  color: var(--text);
  font-weight: 600;
}

.ads-dash-shell__tile {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 15px;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  transition:
    background var(--dur-control) var(--ease),
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease);
}

/* The app marks the selected item by giving its glyph the accent and lifting
   the tile, not by filling it in. A second solid block of accent in the rail
   would start competing with the call to action. */
.ads-dash-shell__item.is-active .ads-dash-shell__tile {
  background: var(--elevated);
  color: var(--accent);
  box-shadow: var(--soft-raised);
}

.ads-dash-shell__label {
  transition: opacity var(--dur-control) var(--ease);
}

/* ─── The panel ────────────────────────────────────────────────────────── */

/* The content floats in one large rounded surface, the way every screen in
   the app does. The canvas is a shade darker, so the panel reads as standing
   out of the page before its shadow is even drawn. */
.ads-dash-shell__panel {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--soft-raised-lg);
  margin: var(--gutter);
  min-height: calc(100vh - var(--gutter) * 2);
  overflow: clip;
}

/* Must come after the base panel rule: its `margin` shorthand would
   otherwise reset the left edge back to the gutter and put the content
   underneath the rail. */
@media (min-width: 900px) {
  .ads-dash-shell__panel {
    margin: var(--gutter) var(--gutter) var(--gutter) var(--w);
    transition: margin-left var(--dur-move) var(--ease);
  }
}

/* ─── App bar ──────────────────────────────────────────────────────────── */

/* Sticks to the top of the window inside the panel. The panel clips rather
   than scrolls, so sticky still works against the page. */
.ads-dash-shell__appbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 72px;
  padding: 0 clamp(16px, 3vw, 32px);
  border-bottom: 1px solid transparent;
  transition:
    background var(--dur-control) var(--ease),
    border-color var(--dur-control) var(--ease),
    backdrop-filter var(--dur-control) var(--ease);
}

.ads-dash-shell__appbar.is-scrolled {
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  border-bottom-color: var(--line);
}

.ads-dash-shell__appbar-brand {
  display: none;
  color: var(--text);
}

.ads-dash-shell__crumbs {
  display: flex;
  align-items: baseline;
  gap: 9px;
  min-width: 0;
  font-size: 0.92rem;
}

.ads-dash-shell__crumb-root {
  color: var(--subdued);
  transition: color var(--dur-control) var(--ease);
}

.ads-dash-shell__crumb-root:hover {
  color: var(--text);
}

.ads-dash-shell__crumb-sep {
  color: var(--line-strong);
}

/* The current crumb rolls up into place as the section changes, so moving
   through the page reads as moving through screens. */
.ads-dash-shell__crumb-window {
  display: inline-block;
  overflow: hidden;
  min-width: 0;
}

.ads-dash-shell__crumb-here {
  display: inline-block;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
}

.ads-dash-shell__crumb-enter-active,
.ads-dash-shell__crumb-leave-active {
  transition:
    transform var(--dur-control) var(--ease),
    opacity var(--dur-control) var(--ease);
}

.ads-dash-shell__crumb-enter-from {
  transform: translateY(70%);
  opacity: 0;
}

.ads-dash-shell__crumb-leave-to {
  transform: translateY(-70%);
  opacity: 0;
}

.ads-dash-shell__tools {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.ads-dash-shell__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  padding: 0 10px 0 14px;
  min-width: 240px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--subdued);
  font-size: 0.88rem;
  transition: color var(--dur-control) var(--ease);
}

.ads-dash-shell__search:hover {
  color: var(--text);
}

.ads-dash-shell__search .kbd {
  margin-left: auto;
}

.ads-dash-shell__cta {
  padding: 11px 18px;
  font-size: 0.9rem;
}

/* ─── Phone ────────────────────────────────────────────────────────────── */

/* The panel goes edge to edge — on a 390px screen a floating frame is a
   24px margin of nothing — and leaves room at the bottom for the tab bar.
   The app bar takes the brand, and keeps search and appearance as icons. */
@media (max-width: 899px) {
  .ads-dash-shell__panel {
    margin: 0;
    min-height: 100vh;
    border-radius: 0;
    box-shadow: none;
    padding-bottom: calc(92px + env(safe-area-inset-bottom));
  }

  .ads-dash-shell__appbar {
    height: 64px;
    gap: 12px;
  }

  .ads-dash-shell__appbar-brand {
    display: block;
  }

  .ads-dash-shell__crumb-root,
  .ads-dash-shell__crumb-sep {
    display: none;
  }

  .ads-dash-shell__crumbs {
    padding-left: 12px;
    border-left: 1px solid var(--line-strong);
    font-size: 0.95rem;
  }

  .ads-dash-shell__search {
    min-width: 0;
    width: 42px;
    padding: 0;
    justify-content: center;
    background: var(--raised);
    box-shadow: var(--soft-raised-sm);
    color: var(--text);
  }

  .ads-dash-shell__search-label,
  .ads-dash-shell__search .kbd,
  .ads-dash-shell__cta {
    display: none;
  }
}

@media (min-width: 900px) and (max-width: 1180px) {
  .ads-dash-shell__search {
    min-width: 0;
  }
  .ads-dash-shell__search-label {
    display: none;
  }
}
</style>
