<script setup lang="ts">
// The design system's only navigation.
//
// Two rules make it behave:
//
// 1. One selection. Only a component is ever "selected"; its group is shown
//    as an ancestor, in a different and quieter treatment. A group header
//    that lights up the same way as an entry is a second answer to "where
//    am I", and two answers read as neither.
// 2. The selection is the component you are looking at, not the last
//    boundary you crossed. Only component anchors are observed — group
//    headings are not — so scrolling through a section never parks the
//    highlight on its title.
const { adsGroups } = useAdsManifest()

// The single source of truth for position on this page; the rail reads it.
const active = useAdsActive()
const list = ref<HTMLElement>()

// The group containing the selected entry. Derived, never separately
// tracked, so the two can never disagree.
const activeGroup = computed(
  () => adsGroups.find((g) => g.items.some((i) => i.id === active.value))?.id ?? '',
)

onMounted(() => {
  const ids = adsGroups.flatMap((g) => g.items.map((i) => i.id))
  let frame = 0

  // Chosen by position rather than by intersection.
  //
  // An IntersectionObserver can only report *that* several anchors overlap
  // the band, not which one you are reading. Picking the first intersecting
  // entry in document order gets it wrong whenever two blocks overlap the
  // band at once — which, with specimens this tall, is most of the time:
  // jump to Diverging and the highlight sticks on Sequential, because
  // Sequential's tail is still on screen and comes first in the list.
  //
  // So: the selected entry is the last one whose top has crossed a trigger
  // line a quarter of the way down the viewport. That is the heading you
  // have most recently passed, which is the thing you are looking at.
  const pick = () => {
    const line = window.innerHeight * 0.25
    let bestId = ids[0] ?? ''
    let bestTop = -Infinity

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const top = el.getBoundingClientRect().top
      if (top <= line && top > bestTop) {
        bestTop = top
        bestId = id
      }
    }
    if (bestId) active.value = bestId
  }

  const onScroll = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(pick)
  }

  pick()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })
})

// Keep the selection visible without dragging the page with it.
watch(active, (id) => {
  const el = list.value?.querySelector<HTMLElement>(`[data-for="${id}"]`)
  if (!el || !list.value) return
  const box = list.value.getBoundingClientRect()
  const row = el.getBoundingClientRect()
  if (row.top < box.top + 8 || row.bottom > box.bottom - 8) {
    el.scrollIntoView({ block: 'nearest' })
  }
})

const activeLabel = computed(() => {
  for (const g of adsGroups) {
    const hit = g.items.find((i) => i.id === active.value)
    if (hit) return `${g.label} · ${hit.label}`
  }
  // Before anything is in view the label would just repeat the word beside
  // it, so it says how much is in here instead.
  return `${adsGroups.reduce((n, g) => n + g.items.length, 0)} entries`
})
</script>

<template>
  <nav ref="list" class="contents" aria-label="Design system contents">
    <!-- Narrow screens get the same list behind a disclosure rather than a
         second navigation of their own. -->
    <details class="narrow">
      <summary>
        <span class="ads-label">Contents</span>
        <span class="here num">{{ activeLabel }}</span>
      </summary>
      <div class="narrow-list">
        <template v-for="g in adsGroups" :key="g.id">
          <span class="group">{{ g.label }}</span>
          <a v-for="i in g.items" :key="i.id" class="item" :href="`#${i.id}`">{{ i.label }}</a>
        </template>
      </div>
    </details>

    <div class="wide">
      <p class="ads-label index-head">Contents</p>
      <template v-for="g in adsGroups" :key="g.id">
        <span class="group" :class="{ ancestor: activeGroup === g.id }">{{ g.label }}</span>
        <a
          v-for="i in g.items"
          :key="i.id"
          class="item"
          :data-for="i.id"
          :class="{ on: active === i.id }"
          :href="`#${i.id}`"
          :aria-current="active === i.id ? 'true' : undefined"
        >{{ i.label }}</a>
      </template>
    </div>
  </nav>
</template>

<style scoped>
/* ─── Wide: a sticky column ────────────────────────────────────────────── */

.wide {
  display: none;
}

/* `display: contents` here would dissolve the nav out of the page grid and
   promote its two children into it — which is exactly how the column went
   missing. The nav stays a real box and becomes the scroll container. */
@media (min-width: 1100px) {
  .narrow {
    display: none;
  }

  .contents {
    position: sticky;
    top: var(--gutter);
    max-height: calc(100vh - var(--gutter) * 2);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 10px;
  }

  .wide {
    display: grid;
    align-content: start;
    gap: 1px;
  }
}

.index-head {
  margin: 0 0 10px;
  padding-left: 11px;
}

/* ─── Group headings ───────────────────────────────────────────────────── */

/* A heading, not a destination: no hover, no selected state. Its only job
   when you are inside it is to brighten slightly, so the eye can find the
   selected entry's neighbourhood without competing with it. */
.group {
  margin-top: 14px;
  padding: 6px 11px;
  font-family: var(--font-label);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--subdued);
  opacity: 0.75;
  transition:
    color 0.25s var(--ease),
    opacity 0.25s var(--ease);
}

.group:first-of-type {
  margin-top: 0;
}

.group.ancestor {
  color: var(--text-soft);
  opacity: 1;
}

/* ─── Entries ──────────────────────────────────────────────────────────── */

.item {
  position: relative;
  padding: 6px 11px;
  border-radius: 7px;
  font-size: 0.83rem;
  color: var(--subdued);
  transition:
    color 0.2s var(--ease),
    background 0.2s var(--ease);
}

.item:hover {
  color: var(--text);
  background: var(--hover);
}

/* The single selection on the page. */
.item.on {
  color: var(--text);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm), inset 2px 0 0 var(--accent);
}

/* ─── Narrow: one disclosure ───────────────────────────────────────────── */

.narrow {
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
}

.narrow summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  cursor: pointer;
  list-style: none;
}

.narrow summary::-webkit-details-marker {
  display: none;
}

.here {
  font-size: 0.74rem;
  color: var(--text-soft);
  text-align: right;
}

.narrow-list {
  display: grid;
  gap: 1px;
  padding: 0 10px 12px;
  max-height: 60vh;
  overflow-y: auto;
}


</style>
