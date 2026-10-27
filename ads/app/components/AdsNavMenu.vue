<script setup lang="ts">
// Site navigation with optional sub-pages. Each parent stays a real link, and
// its sub-pages open from a separate small button, so the link works with one
// click and the list works from the keyboard (disclosure, not an ARIA menu —
// these are links, not commands). Escape closes and returns focus to the
// toggle; the current page is marked by aria-current, not by colour alone.
export type NavLink = { label: string; to: string; children?: { label: string; to: string }[] }
withDefaults(defineProps<{ links: NavLink[]; label?: string }>(), { label: 'Primary' })

const uid = useId()
const root = ref<HTMLElement>()
const open = ref<number | null>(null)

function toggle(i: number) {
  open.value = open.value === i ? null : i
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || open.value === null) return
  const i = open.value
  open.value = null
  root.value?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-toggle-${i}`)}`)?.focus()
}

function onFocusout(e: FocusEvent) {
  if (!root.value?.contains(e.relatedTarget as Node)) open.value = null
}

function onDocClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) open.value = null
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <nav ref="root" class="ads-nav-menu" :aria-label="label" @keydown="onKeydown" @focusout="onFocusout">
    <ul class="ads-nav-menu__list">
      <li v-for="(l, i) in links" :key="l.label" class="ads-nav-menu__group">
        <NuxtLink :to="l.to" class="ads-nav-menu__link">{{ l.label }}</NuxtLink>
        <template v-if="l.children?.length">
          <button
            :id="`${uid}-toggle-${i}`"
            type="button"
            class="ads-nav-menu__toggle"
            :aria-expanded="open === i"
            :aria-controls="`${uid}-sub-${i}`"
            :aria-label="`More in ${l.label}`"
            @click="toggle(i)"
          >
            <svg class="ads-nav-menu__chevron" viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
              <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ul v-show="open === i" :id="`${uid}-sub-${i}`" class="ads-nav-menu__drop">
            <li v-for="c in l.children" :key="c.label">
              <NuxtLink :to="c.to" class="ads-nav-menu__sub" @click="open = null">{{ c.label }}</NuxtLink>
            </li>
          </ul>
        </template>
      </li>
    </ul>
    <slot />
  </nav>
</template>

<style scoped>
.ads-nav-menu {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.ads-nav-menu__list {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ads-nav-menu__group {
  position: relative;
  display: flex;
  align-items: center;
}

.ads-nav-menu__link {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 var(--sp-3);
  border-radius: var(--pill);
  color: var(--text-soft);
  font-size: 0.92rem;
  white-space: nowrap;
  transition: color var(--dur-control) var(--ease), box-shadow var(--dur-control) var(--ease);
}

.ads-nav-menu__link:hover,
.ads-nav-menu__toggle:hover {
  color: var(--accent);
}

.ads-nav-menu__link:active,
.ads-nav-menu__toggle:active {
  box-shadow: var(--soft-inset-sm);
}

/* The current page is pressed in and set in full text — shape plus tone. */
.ads-nav-menu__link[aria-current='page'] {
  color: var(--text);
  box-shadow: var(--soft-inset-sm);
}

.ads-nav-menu__toggle {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-left: -6px;
  border-radius: var(--pill);
  color: var(--subdued);
  transition: color var(--dur-control) var(--ease), box-shadow var(--dur-control) var(--ease);
}

.ads-nav-menu__chevron {
  transition: transform var(--dur-control) var(--ease);
}

.ads-nav-menu__toggle[aria-expanded='true'] .ads-nav-menu__chevron {
  transform: rotate(180deg);
}

.ads-nav-menu__drop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  min-width: 190px;
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-lg);
}

.ads-nav-menu__sub {
  display: block;
  padding: 9px var(--sp-3);
  border-radius: 9px;
  color: var(--text-soft);
  font-size: 0.88rem;
  transition: color var(--dur-control) var(--ease), background var(--dur-control) var(--ease);
}

.ads-nav-menu__sub:hover {
  background: var(--hover);
  color: var(--accent);
}

.ads-nav-menu__sub[aria-current='page'] {
  color: var(--text);
}
</style>
