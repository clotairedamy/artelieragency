<script setup lang="ts">
// A menu: everything a reader can do to one record, in one place. Destructive
// items always go last, below a rule — the menu sorts them there itself, so a
// "Delete" can never land first under the pointer. Shortcuts sit beside their
// item in the data face, because a menu is how a reader learns them.
export type MenuItem = {
  label: string
  icon?: string
  shortcut?: string
  destructive?: boolean
  action?: () => void
}

const props = defineProps<{ items: MenuItem[]; label: string }>()
const root = ref<HTMLElement>()

const isRule = (item: MenuItem) => item.label === '---'

// Ordinary items keep their order and their `---` rules; destructive ones are
// lifted out and set after a single rule of their own.
const groups = computed(() => {
  const safe = props.items.filter((i) => !i.destructive)
  while (safe.length && isRule(safe[safe.length - 1]!)) safe.pop()
  const danger = props.items.filter((i) => i.destructive && !isRule(i))
  return { safe, danger }
})

// Arrow keys walk the items, as they do in every native menu.
function onKeydown(e: KeyboardEvent) {
  const buttons = [...(root.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])]
  if (!buttons.length) return
  const at = buttons.indexOf(document.activeElement as HTMLButtonElement)
  const next = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: buttons.length - 1 }[e.key]
  if (next === undefined) return
  e.preventDefault()
  buttons[(next + buttons.length) % buttons.length]!.focus()
}
</script>

<template>
  <div ref="root" class="ads-menu" role="menu" :aria-label="label" @keydown="onKeydown">
    <template v-for="(item, i) in groups.safe" :key="`s${i}`">
      <hr v-if="isRule(item)" />
      <button v-else type="button" role="menuitem" @click="item.action?.()">
        <Icon v-if="item.icon" :name="item.icon" :size="15" />
        {{ item.label }}
        <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
      </button>
    </template>
    <template v-if="groups.danger.length">
      <hr v-if="groups.safe.length" />
      <button v-for="(item, i) in groups.danger" :key="`d${i}`" type="button" role="menuitem" @click="item.action?.()">
        <Icon v-if="item.icon" :name="item.icon" :size="15" />
        {{ item.label }}
        <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
      </button>
    </template>
  </div>
</template>
