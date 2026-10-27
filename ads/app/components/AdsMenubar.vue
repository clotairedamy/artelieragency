<script setup lang="ts">
// An application menu bar — File, Edit, View — for a tool, not for site
// navigation (that is AdsNavMenu). It behaves like a desktop menu bar: Left
// and Right walk the bar, Down or Enter opens a menu, Escape closes it and
// hands focus back to its title. Inside a menu, shortcuts sit on the right and
// destructive items go last, below a rule. Hover reaches for the accent.
export type MenubarChild = { label: string; to?: string; action?: () => void; shortcut?: string; destructive?: boolean }
export type MenubarItem = { label: string; to?: string; children?: MenubarChild[] }
const props = withDefaults(defineProps<{ items: MenubarItem[]; label?: string }>(), { label: 'Menu' })

const uid = useId()
const bar = ref<HTMLElement>()
const open = ref<number | null>(null)
const focusIndex = ref(0)

function ordered(children: MenubarChild[] = []) {
  return [...children.filter((c) => !c.destructive), ...children.filter((c) => c.destructive)]
}

function firstRisky(children: MenubarChild[] = []) {
  const safe = children.filter((c) => !c.destructive).length
  return safe && safe < children.length ? safe : -1
}

function tops() {
  return Array.from(bar.value?.querySelectorAll<HTMLElement>('.ads-menubar__top') ?? [])
}

function subItems(i: number) {
  return Array.from(bar.value?.querySelectorAll<HTMLElement>(`#${CSS.escape(`${uid}-menu-${i}`)} [role="menuitem"]`) ?? [])
}

async function openMenu(i: number, focus: 'first' | 'last' | 'none' = 'first') {
  open.value = i
  focusIndex.value = i
  await nextTick()
  const items = subItems(i)
  if (focus === 'first') items[0]?.focus()
  else if (focus === 'last') items[items.length - 1]?.focus()
}

function closeMenu(refocus = true) {
  const i = open.value
  open.value = null
  if (refocus && i !== null) tops()[i]?.focus()
}

function moveTop(i: number) {
  const n = props.items.length
  const next = (i + n) % n
  focusIndex.value = next
  if (open.value !== null && props.items[next]?.children?.length) openMenu(next)
  else {
    open.value = null
    tops()[next]?.focus()
  }
}

function onTopKeydown(i: number, e: KeyboardEvent) {
  const hasMenu = !!props.items[i]?.children?.length
  switch (e.key) {
    case 'ArrowRight': e.preventDefault(); moveTop(i + 1); break
    case 'ArrowLeft': e.preventDefault(); moveTop(i - 1); break
    case 'Home': e.preventDefault(); moveTop(0); break
    case 'End': e.preventDefault(); moveTop(props.items.length - 1); break
    case 'ArrowDown':
    case 'Enter':
    case ' ':
      if (hasMenu) { e.preventDefault(); openMenu(i) }
      break
    case 'ArrowUp':
      if (hasMenu) { e.preventDefault(); openMenu(i, 'last') }
      break
    case 'Escape':
      if (open.value !== null) { e.preventDefault(); closeMenu() }
      break
  }
}

function onMenuKeydown(i: number, e: KeyboardEvent) {
  const items = subItems(i)
  const at = items.indexOf(document.activeElement as HTMLElement)
  const go = (n: number) => items[(n + items.length) % items.length]?.focus()
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); go(at + 1); break
    case 'ArrowUp': e.preventDefault(); go(at - 1); break
    case 'Home': e.preventDefault(); go(0); break
    case 'End': e.preventDefault(); go(items.length - 1); break
    case 'ArrowRight': e.preventDefault(); moveTop(i + 1); break
    case 'ArrowLeft': e.preventDefault(); moveTop(i - 1); break
    case 'Escape': e.preventDefault(); closeMenu(); break
    case 'Tab': open.value = null; break
  }
}

function pick(c: MenubarChild) {
  closeMenu()
  c.action?.()
}

function onFocusout(e: FocusEvent) {
  if (!bar.value?.contains(e.relatedTarget as Node)) open.value = null
}
</script>

<template>
  <div ref="bar" class="ads-menubar" role="menubar" :aria-label="label" @focusout="onFocusout">
    <div v-for="(it, i) in items" :key="it.label" class="ads-menubar__group">
      <NuxtLink
        v-if="it.to && !it.children?.length"
        :to="it.to"
        class="ads-menubar__top"
        role="menuitem"
        :tabindex="focusIndex === i ? 0 : -1"
        @keydown="onTopKeydown(i, $event)"
      >{{ it.label }}</NuxtLink>
      <template v-else>
        <button
          type="button"
          class="ads-menubar__top"
          role="menuitem"
          aria-haspopup="menu"
          :aria-expanded="open === i"
          :aria-controls="`${uid}-menu-${i}`"
          :tabindex="focusIndex === i ? 0 : -1"
          @click="open === i ? closeMenu(false) : openMenu(i, 'none')"
          @keydown="onTopKeydown(i, $event)"
        >
          {{ it.label }}
          <svg class="ads-menubar__chevron" viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div
          v-show="open === i"
          :id="`${uid}-menu-${i}`"
          class="ads-menubar__menu"
          role="menu"
          :aria-label="it.label"
          @keydown="onMenuKeydown(i, $event)"
        >
          <template v-for="(c, k) in ordered(it.children)" :key="c.label">
            <hr v-if="k === firstRisky(it.children)" class="ads-menubar__rule" role="separator">
            <NuxtLink
              v-if="c.to"
              :to="c.to"
              class="ads-menubar__item"
              role="menuitem"
              tabindex="-1"
              @click="closeMenu(false)"
            >
              <span>{{ c.label }}</span>
              <kbd v-if="c.shortcut" class="ads-menubar__shortcut">{{ c.shortcut }}</kbd>
            </NuxtLink>
            <button v-else type="button" class="ads-menubar__item" role="menuitem" tabindex="-1" @click="pick(c)">
              <span>{{ c.label }}</span>
              <kbd v-if="c.shortcut" class="ads-menubar__shortcut">{{ c.shortcut }}</kbd>
            </button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ads-menubar {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: 6px;
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
}

.ads-menubar__group {
  position: relative;
}

.ads-menubar__top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 var(--sp-3);
  border-radius: var(--pill);
  color: var(--text-soft);
  font-size: 0.9rem;
  white-space: nowrap;
  transition: color var(--dur-control) var(--ease), box-shadow var(--dur-control) var(--ease);
}

.ads-menubar__top:hover {
  color: var(--accent);
}

.ads-menubar__top:active,
.ads-menubar__top[aria-expanded='true'] {
  box-shadow: var(--soft-inset-sm);
}

.ads-menubar__chevron {
  color: var(--subdued);
  transition: transform var(--dur-control) var(--ease);
}

.ads-menubar__top[aria-expanded='true'] .ads-menubar__chevron {
  transform: rotate(180deg);
}

.ads-menubar__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  min-width: 200px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-lg);
}

.ads-menubar__item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  width: 100%;
  padding: var(--sp-2) 10px;
  border-radius: 8px;
  color: var(--text-soft);
  font-size: 0.86rem;
  text-align: left;
  transition: color var(--dur-control) var(--ease), background var(--dur-control) var(--ease);
}

.ads-menubar__item:hover,
.ads-menubar__item:focus-visible {
  background: var(--hover);
  color: var(--accent);
}

.ads-menubar__shortcut {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--subdued);
}

.ads-menubar__rule {
  height: 1px;
  margin: var(--sp-1) 0;
  border: 0;
  background: var(--line);
}
</style>
