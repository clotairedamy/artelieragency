<script setup lang="ts">
// A menu opened on the thing it acts on — right-click, or the Menu key /
// Shift+F10 when the region has focus, because a pointer-only menu is a
// locked door. It follows the menu rules: shortcuts shown on the right,
// destructive items last and below a rule, and never in the accent. Arrow
// keys move, Escape closes and focus goes back to where it was.
export type ContextMenuItem = {
  label: string
  action?: () => void
  shortcut?: string
  destructive?: boolean
  icon?: string
}
const props = withDefaults(defineProps<{ items: ContextMenuItem[]; label?: string }>(), { label: 'Context menu' })

const uid = useId()
const region = ref<HTMLElement>()
const menu = ref<HTMLElement>()
const open = ref(false)
const pos = ref({ x: 0, y: 0 })
let returnTo: HTMLElement | null = null

const safe = computed(() => props.items.filter((i) => !i.destructive))
const risky = computed(() => props.items.filter((i) => i.destructive))

function buttons() {
  return Array.from(menu.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])
}

async function showAt(x: number, y: number) {
  returnTo = document.activeElement as HTMLElement | null
  pos.value = { x, y }
  open.value = true
  await nextTick()
  // Keep the whole menu on screen.
  const r = menu.value?.getBoundingClientRect()
  if (r) {
    pos.value = {
      x: Math.max(8, Math.min(x, window.innerWidth - r.width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - r.height - 8)),
    }
  }
  buttons()[0]?.focus()
}

function onContextmenu(e: MouseEvent) {
  e.preventDefault()
  showAt(e.clientX, e.clientY)
}

function onRegionKeydown(e: KeyboardEvent) {
  if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
    e.preventDefault()
    const r = region.value!.getBoundingClientRect()
    showAt(r.left + 16, r.top + 16)
  }
}

function close(restore = true) {
  open.value = false
  if (restore) returnTo?.focus?.()
  returnTo = null
}

function pick(item: ContextMenuItem) {
  close()
  item.action?.()
}

function onMenuKeydown(e: KeyboardEvent) {
  const list = buttons()
  const i = list.indexOf(document.activeElement as HTMLButtonElement)
  const go = (n: number) => list[(n + list.length) % list.length]?.focus()
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); go(i + 1); break
    case 'ArrowUp': e.preventDefault(); go(i - 1); break
    case 'Home': e.preventDefault(); go(0); break
    case 'End': e.preventDefault(); go(list.length - 1); break
    case 'Escape': e.preventDefault(); close(); break
    case 'Tab': close(false); break
  }
}
</script>

<template>
  <div
    ref="region"
    class="ads-context-menu"
    tabindex="0"
    :aria-describedby="`${uid}-hint`"
    @contextmenu="onContextmenu"
    @keydown="onRegionKeydown"
  >
    <slot />
    <span :id="`${uid}-hint`" class="sr-only">Press Shift+F10 for actions</span>
    <Teleport to="body">
      <div v-if="open" class="ads-context-menu__layer" @click="close()" @contextmenu.prevent="close()">
        <div
          ref="menu"
          class="ads-context-menu__menu"
          role="menu"
          :aria-label="label"
          :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
          @click.stop
          @keydown="onMenuKeydown"
        >
          <button
            v-for="(it, i) in safe"
            :key="`s${i}`"
            type="button"
            role="menuitem"
            tabindex="-1"
            class="ads-context-menu__item"
            @click="pick(it)"
          >
            <Icon v-if="it.icon" :name="it.icon" :size="15" />
            <span>{{ it.label }}</span>
            <kbd v-if="it.shortcut" class="ads-context-menu__shortcut">{{ it.shortcut }}</kbd>
          </button>
          <hr v-if="risky.length && safe.length" class="ads-context-menu__rule" role="separator">
          <button
            v-for="(it, i) in risky"
            :key="`d${i}`"
            type="button"
            role="menuitem"
            tabindex="-1"
            class="ads-context-menu__item"
            @click="pick(it)"
          >
            <Icon v-if="it.icon" :name="it.icon" :size="15" />
            <span>{{ it.label }}</span>
            <kbd v-if="it.shortcut" class="ads-context-menu__shortcut">{{ it.shortcut }}</kbd>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ads-context-menu {
  border-radius: var(--radius-sm);
}

.ads-context-menu__layer {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.ads-context-menu__menu {
  position: fixed;
  display: grid;
  gap: 2px;
  min-width: 190px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-lg);
  animation: ads-context-menu-in var(--dur-control) var(--ease);
}

.ads-context-menu__item {
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

.ads-context-menu__item:hover,
.ads-context-menu__item:focus-visible {
  background: var(--hover);
  color: var(--accent);
}

.ads-context-menu__item:active {
  box-shadow: var(--soft-inset-sm);
}

.ads-context-menu__shortcut {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--subdued);
}

.ads-context-menu__rule {
  height: 1px;
  margin: var(--sp-1) 0;
  border: 0;
  background: var(--line);
}

@keyframes ads-context-menu-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
}
</style>
