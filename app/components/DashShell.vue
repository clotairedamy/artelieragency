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
const { nav: siteNav, studio } = useAppConfig()

// Pages that are not the one-pager bring their own section list, so the rail
// is always an index of the page you are actually on rather than a set of
// anchors pointing at sections that do not exist here.
const props = defineProps<{
  sections?: { id: string; label: string; icon: string }[]
  /**
   * Which section is current, when the page tracks that itself. Given one,
   * the rail stops observing and simply follows — which is what keeps it
   * from disagreeing with a finer-grained index on the same page.
   */
  activeId?: string
}>()

const nav = computed(() => props.sections ?? siteNav)

const collapsed = ref(false)
const activeIndex = ref(0)

const active = computed(() => nav.value[activeIndex.value]?.id)

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

  // The rail advertises ⌘K, so ⌘K has to work. A shortcut printed on a
  // button that does nothing is what this studio is selling against.
  const router = useRouter()
  const onKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey)) return
    e.preventDefault()
    router.push('/contact')
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
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
    <!-- Mobile only: the rail has nowhere to go on a phone, so the brand and
         the one action move to a bar across the top. -->
    <header class="topbar">
      <NuxtLink to="/" class="brand">
        <BrandMark :size="26" morph />
        <span class="wordmark">{{ studio.name }}</span>
      </NuxtLink>
      <div class="topbar-actions">
        <NuxtLink class="btn btn-quiet topbar-ds" to="/design-system" aria-label="Design system">
          <Icon name="layers" :size="18" />
        </NuxtLink>
        <NuxtLink class="btn btn-accent topbar-cta" to="/contact">Start a project</NuxtLink>
      </div>
    </header>

    <aside class="rail">
      <NuxtLink to="/" class="rail-brand" :aria-label="studio.name">
        <BrandMark class="mark" :size="collapsed ? 40 : 78" morph />
        <span class="wordmark num">{{ studio.name }}</span>
      </NuxtLink>

      <NuxtLink class="btn btn-accent rail-cta" to="/contact">
        <Icon name="plus" :size="20" />
        <span class="label">Start a project</span>
        <span class="label shortcut num">⌘K</span>
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
      <slot />
    </main>
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

  /* The one filled control in the rail, and the first thing the eye lands
     on — sized like the app's primary action, not like a link. */
  .rail-cta {
    margin: 0 20px;
    justify-content: flex-start;
    gap: 12px;
    padding: 15px 14px;
    font-size: 0.97rem;
    font-weight: 520;
    border-radius: 16px;
  }

  .shortcut {
    margin-left: auto;
    font-size: 0.73rem;
    opacity: 0.5;
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

  /* The action shrinks to the tile column rather than keeping the padding and
     gaps it needs when it has a label — otherwise it is wider than the rail
     it sits in. */
  .collapsed .rail-cta {
    width: 48px;
    padding: 14px 0;
    gap: 0;
    justify-content: center;
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

/* ─── Mobile bars ──────────────────────────────────────────────────────── */

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  background: var(--canvas);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-cta {
  padding: 10px 16px;
  font-size: 0.88rem;
}

.topbar-ds {
  padding: 10px;
}

@media (min-width: 900px) {
  .topbar {
    display: none;
  }
}

@media (max-width: 899px) {
  .panel {
    margin: 0 12px 12px;
    min-height: 0;
  }
}
</style>
