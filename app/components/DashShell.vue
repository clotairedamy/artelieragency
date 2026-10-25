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
import type { Section } from '~/composables/useOverlays'

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
}>()

const nav = computed<Section[]>(() => props.sections ?? siteNav)

const collapsed = ref(false)
const activeIndex = ref(0)

const active = computed(() => nav.value[activeIndex.value]?.id)

// The app bar's breadcrumb: the section you are reading, or on a page with
// no sections, the page itself.
const where = computed(() =>
  nav.value.length
    ? nav.value[activeIndex.value]?.label ?? ''
    : pages.find((p) => p.to === route.path)?.label ?? '',
)

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
  if (props.activeId === undefined) {
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
  <div class="shell" :class="{ collapsed }">
    <aside class="rail">
      <NuxtLink to="/" class="rail-brand" :aria-label="studio.name">
        <BrandMark class="mark" :size="collapsed ? 40 : 78" />
        <span class="wordmark num">{{ studio.name }}</span>
      </NuxtLink>

      <hr v-if="nav.length" class="rule">

      <nav v-if="nav.length" class="rail-nav" aria-label="Sections">
        <!-- The tab: a piece of the frame reaching into the rail. One element
             that slides, rather than a background on each row, so moving
             between sections is a single continuous gesture. -->
        <span class="tab" :style="{ transform: `translateY(${activeIndex * 62}px)` }" aria-hidden="true">
          <span class="fillet fillet-top" />
          <span class="fillet fillet-bottom" />
        </span>

        <a
          v-for="(item, i) in nav"
          :key="item.id"
          class="nav-item"
          :class="{ 'is-active': activeIndex === i }"
          :href="`#${item.id}`"
          :aria-current="active === item.id ? 'true' : undefined"
          @click="activeIndex = i"
        >
          <span class="tile"><Icon :name="item.icon" :size="20" /></span>
          <span class="label">{{ item.label }}</span>
        </a>
      </nav>

      <div class="rail-foot">
        <NuxtLink class="nav-item" to="/dashboard-example">
          <span class="tile"><Icon name="chart" :size="20" /></span>
          <span class="label">Dashboard example</span>
        </NuxtLink>

        <NuxtLink class="nav-item" to="/design-system">
          <span class="tile"><Icon name="layers" :size="20" /></span>
          <span class="label">Design system</span>
        </NuxtLink>

        <button
          class="nav-item"
          type="button"
          :aria-expanded="!collapsed"
          :aria-label="collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'"
          @click="toggle"
        >
          <span class="tile collapse-tile"><Icon name="chevrons" :size="20" /></span>
          <span class="label">Collapse</span>
        </button>
      </div>
    </aside>

    <main class="panel">
      <!-- The app bar: where you are, and the three things you might want
           from anywhere — search, appearance, and the one action. -->
      <header class="appbar" :class="{ scrolled }">
        <NuxtLink to="/" class="appbar-brand" :aria-label="studio.name">
          <BrandMark :size="30" />
        </NuxtLink>
        <nav class="crumbs" aria-label="Breadcrumb">
          <NuxtLink to="/" class="crumb-root">{{ studio.name }}</NuxtLink>
          <span class="crumb-sep" aria-hidden="true">/</span>
          <span class="crumb-window">
            <Transition name="crumb" mode="out-in">
              <span :key="where" class="crumb-here" aria-current="location">{{ where }}</span>
            </Transition>
          </span>
        </nav>
        <div class="appbar-tools">
          <button class="search" type="button" aria-label="Search or jump to" @click="palette = true">
            <Icon name="discovery" :size="18" />
            <span class="search-label">Search or jump to…</span>
            <kbd class="kbd">⌘K</kbd>
          </button>
          <ThemeToggle />
          <NuxtLink class="btn btn-accent appbar-cta" to="/contact">Start a project</NuxtLink>
        </div>
      </header>

      <slot />
    </main>

    <MobileNav :sections="nav" :active-index="activeIndex" @select="activeIndex = $event" />
    <CommandPalette :sections="nav" />
    <ToastHost />
  </div>
</template>

<style scoped>
.shell {
  --w: var(--rail-w);
  --row: 62px;
  min-height: 100vh;
  background: var(--canvas);
}

.shell.collapsed {
  --w: var(--rail-w-collapsed);
}

/* ─── Rail ─────────────────────────────────────────────────────────────── */

.rail {
  display: none;
}

@media (min-width: 900px) {
  .rail {
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
    transition: width 0.42s var(--ease);
  }

  .rail-brand {
    display: grid;
    justify-items: center;
    gap: 9px;
    padding: 0 20px;
    color: var(--text);
  }

  .mark {
    transition: width 0.42s var(--ease), height 0.42s var(--ease);
  }

  .rail-brand .wordmark {
    font-size: 0.72rem;
    letter-spacing: 0.38em;
    text-indent: 0.38em;
    text-transform: uppercase;
    color: var(--subdued);
  }

  .rule {
    height: 1px;
    margin: -4px 20px;
    border: 0;
    background: var(--line-strong);
    opacity: 0.55;
  }

  .rail-nav {
    position: relative;
  }

  .rail-foot {
    margin-top: auto;
    display: grid;
    gap: 2px;
  }

  /* Collapsed: the labels go, the tiles stay exactly where they were. The
     tile column is centred in the collapsed rail — (88 − 48) / 2 — so
     collapsing slides nothing sideways. */
  .collapsed .label,
  .collapsed .rail-brand .wordmark {
    opacity: 0;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .collapsed .collapse-tile {
    transform: rotate(180deg);
  }

}

/* ─── The selected tab ─────────────────────────────────────────────────── */

.tab {
  position: absolute;
  top: 0;
  left: 10px;
  right: -2px;
  height: var(--row);
  border-radius: 20px 0 0 20px;
  background: var(--surface);
  transition: transform 0.44s var(--ease);
  will-change: transform;
}

/* The concave corners where the tab flows back into the frame. A quarter
   disc is carved out of a 14px box with a radial gradient — the same shape
   the app paints with a path, for the cost of two pseudo-elements that
   follow the tab wherever it slides. */
.fillet {
  position: absolute;
  right: 0;
  width: 14px;
  height: 14px;
}

.fillet-top {
  top: -14px;
  background: radial-gradient(circle 14px at top left, transparent 14px, var(--surface) 14px);
}

.fillet-bottom {
  bottom: -14px;
  background: radial-gradient(circle 14px at bottom left, transparent 14px, var(--surface) 14px);
}

/* ─── Nav items ────────────────────────────────────────────────────────── */

.nav-item {
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
    color 0.3s var(--ease),
    font-weight 0.3s var(--ease);
}

.nav-item:hover {
  color: var(--text);
}

.nav-item:hover .tile {
  transform: translateY(-1px);
}

.nav-item:active .tile {
  box-shadow: var(--soft-inset-sm);
  transform: translateY(1px);
}

.is-active {
  color: var(--text);
  font-weight: 600;
}

.tile {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 15px;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  transition:
    background 0.3s var(--ease),
    color 0.3s var(--ease),
    box-shadow 0.3s var(--ease),
    transform 0.3s var(--ease);
}

/* The app marks the selected item by giving its glyph the accent and lifting
   the tile, not by filling it in. A second solid block of accent in the rail
   would start competing with the call to action. */
.is-active .tile {
  background: var(--elevated);
  color: var(--accent);
  box-shadow: var(--soft-raised);
}

.label {
  transition: opacity 0.26s var(--ease);
}

/* ─── The panel ────────────────────────────────────────────────────────── */

/* The content floats in one large rounded surface, the way every screen in
   the app does. The canvas is a shade darker, so the panel reads as standing
   out of the page before its shadow is even drawn. */
.panel {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--soft-raised-lg);
  margin: var(--gutter);
  min-height: calc(100vh - var(--gutter) * 2);
  overflow: clip;
}

/* Must come after the base `.panel` rule: its `margin` shorthand would
   otherwise reset the left edge back to the gutter and put the content
   underneath the rail. */
@media (min-width: 900px) {
  .panel {
    margin: var(--gutter) var(--gutter) var(--gutter) var(--w);
    transition: margin-left 0.42s var(--ease);
  }
}

/* ─── Brand, shared ────────────────────────────────────────────────────── */

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  color: var(--text);
}

.wordmark {
  font-size: 1.12rem;
  font-weight: 560;
  letter-spacing: -0.03em;
}

/* ─── App bar ──────────────────────────────────────────────────────────── */

/* Sticks to the top of the window inside the panel. The panel clips rather
   than scrolls, so sticky still works against the page. */
.appbar {
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
    background 0.3s var(--ease),
    border-color 0.3s var(--ease),
    backdrop-filter 0.3s var(--ease);
}

.appbar.scrolled {
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  border-bottom-color: var(--line);
}

.appbar-brand {
  display: none;
  color: var(--text);
}

.crumbs {
  display: flex;
  align-items: baseline;
  gap: 9px;
  min-width: 0;
  font-size: 0.92rem;
}

.crumb-root {
  color: var(--subdued);
  transition: color 0.2s var(--ease);
}

.crumb-root:hover {
  color: var(--text);
}

.crumb-sep {
  color: var(--line-strong);
}

/* The current crumb rolls up into place as the section changes, so moving
   through the page reads as moving through screens. */
.crumb-window {
  display: inline-block;
  overflow: hidden;
  min-width: 0;
}

.crumb-here {
  display: inline-block;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
}

.crumb-enter-active,
.crumb-leave-active {
  transition:
    transform 0.26s var(--ease),
    opacity 0.26s var(--ease);
}

.crumb-enter-from {
  transform: translateY(70%);
  opacity: 0;
}

.crumb-leave-to {
  transform: translateY(-70%);
  opacity: 0;
}

.appbar-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.search {
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
  transition: color 0.2s var(--ease);
}

.search:hover {
  color: var(--text);
}

.search .kbd {
  margin-left: auto;
}

.appbar-cta {
  padding: 11px 18px;
  font-size: 0.9rem;
}

/* ─── Phone ────────────────────────────────────────────────────────────── */

/* The panel goes edge to edge — on a 390px screen a floating frame is a
   24px margin of nothing — and leaves room at the bottom for the tab bar.
   The app bar takes the brand, and keeps search and appearance as icons. */
@media (max-width: 899px) {
  .panel {
    margin: 0;
    min-height: 100vh;
    border-radius: 0;
    box-shadow: none;
    padding-bottom: calc(92px + env(safe-area-inset-bottom));
  }

  .appbar {
    height: 64px;
    gap: 12px;
  }

  .appbar-brand {
    display: block;
  }

  .crumb-root,
  .crumb-sep {
    display: none;
  }

  .crumbs {
    padding-left: 12px;
    border-left: 1px solid var(--line-strong);
    font-size: 0.95rem;
  }

  .search {
    min-width: 0;
    width: 42px;
    padding: 0;
    justify-content: center;
    background: var(--raised);
    box-shadow: var(--soft-raised-sm);
    color: var(--text);
  }

  .search-label,
  .search .kbd,
  .appbar-cta {
    display: none;
  }
}

@media (min-width: 900px) and (max-width: 1180px) {
  .search {
    min-width: 0;
  }
  .search-label {
    display: none;
  }
}
</style>
