<script setup lang="ts">
// The command palette: ⌘K (or /) from anywhere.
//
// It is the most "this is an application" gesture a website can offer, and
// on this one it is also the fastest way around — every section of the page
// you are on, every page, and the handful of actions worth a shortcut, behind
// one text field that filters as you type.
import type { Section } from '~/composables/useOverlays'

const props = defineProps<{ sections: Section[] }>()

const open = usePalette()
const { studio, pages } = useAppConfig()
const { theme, toggle } = useTheme()
const toast = useToast()
const router = useRouter()

type Command = { id: string; group: string; label: string; icon: string; hint?: string; run: () => void }

const query = ref('')
const cursor = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()

const commands = computed<Command[]>(() => [
  ...props.sections.map((s) => ({
    id: `s-${s.id}`,
    group: 'Jump to',
    label: s.label,
    icon: s.icon,
    hint: 'section',
    run: () => {
      document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', `#${s.id}`)
    },
  })),
  ...pages.map((p) => ({
    id: `p-${p.to}`,
    group: 'Pages',
    label: p.label,
    icon: p.icon,
    hint: p.to,
    run: () => router.push(p.to),
  })),
  {
    id: 'a-theme',
    group: 'Actions',
    label: theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    icon: 'theme',
    hint: 'theme',
    run: () => toggle(),
  },
  {
    id: 'a-email',
    group: 'Actions',
    label: 'Copy email address',
    icon: 'mail',
    hint: studio.email,
    run: async () => {
      try {
        await navigator.clipboard.writeText(studio.email)
        toast.push(`Copied ${studio.email}`)
      } catch {
        location.href = `mailto:${studio.email}`
      }
    },
  },
  {
    id: 'a-top',
    group: 'Actions',
    label: 'Back to top',
    icon: 'growth',
    run: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
])

// Subsequence match: "dsys" finds "Design system". Forgiving enough for a
// search box nobody wants to spell carefully in.
function matches(text: string, q: string) {
  let i = 0
  const t = text.toLowerCase()
  for (const ch of q.toLowerCase().replace(/\s+/g, '')) {
    i = t.indexOf(ch, i)
    if (i < 0) return false
    i++
  }
  return true
}

const results = computed(() => commands.value.filter((c) => matches(`${c.label} ${c.group}`, query.value)))

const groups = computed(() => {
  const out: { name: string; items: (Command & { index: number })[] }[] = []
  results.value.forEach((c, index) => {
    let g = out.find((x) => x.name === c.group)
    if (!g) out.push((g = { name: c.group, items: [] }))
    g.items.push({ ...c, index })
  })
  return out
})

watch(query, () => (cursor.value = 0))

watch(open, async (v) => {
  if (!v) return
  query.value = ''
  cursor.value = 0
  await nextTick()
  input.value?.focus()
})

function close() {
  open.value = false
}

function run(c?: Command) {
  if (!c) return
  close()
  c.run()
}

function onKey(e: KeyboardEvent) {
  const n = results.value.length
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    cursor.value = (cursor.value + 1) % Math.max(n, 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    cursor.value = (cursor.value - 1 + n) % Math.max(n, 1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    run(results.value[cursor.value])
  } else if (e.key === 'Escape') {
    close()
  }
}

// Keep the highlighted row in view while arrowing through a long list.
watch(cursor, async () => {
  await nextTick()
  list.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="palette">
      <div v-if="open" class="scrim" @mousedown.self="close">
        <div class="palette" role="dialog" aria-modal="true" aria-label="Command palette" @keydown="onKey">
          <div class="field">
            <Icon name="discovery" :size="20" />
            <input
              ref="input"
              v-model="query"
              type="text"
              placeholder="Search sections, pages and actions…"
              aria-label="Search"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              :aria-activedescendant="results[cursor] ? `cmd-${results[cursor]!.id}` : undefined"
              autocomplete="off"
              spellcheck="false"
            >
            <kbd class="kbd">esc</kbd>
          </div>

          <div id="palette-list" ref="list" class="results" role="listbox">
            <template v-for="g in groups" :key="g.name">
              <p class="group eyebrow">{{ g.name }}</p>
              <button
                v-for="c in g.items"
                :id="`cmd-${c.id}`"
                :key="c.id"
                type="button"
                role="option"
                class="row"
                :aria-selected="c.index === cursor"
                @mousemove="cursor = c.index"
                @click="run(c)"
              >
                <span class="row-icon"><Icon :name="c.icon" :size="18" /></span>
                <span class="row-label">{{ c.label }}</span>
                <span v-if="c.hint" class="row-hint num">{{ c.hint }}</span>
              </button>
            </template>
            <p v-if="!results.length" class="empty body">Nothing matches “{{ query }}”.</p>
          </div>

          <div class="foot num">
            <span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> move</span>
            <span><kbd class="kbd">↵</kbd> open</span>
            <span class="count">{{ results.length }} results</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  justify-items: center;
  align-items: start;
  padding: min(14vh, 120px) 16px 16px;
  background: rgb(10 10 12 / 0.32);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.palette {
  width: min(620px, 100%);
  max-height: min(560px, 76vh);
  display: grid;
  grid-template-rows: auto 1fr auto;
  border-radius: var(--radius-lg);
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
  overflow: hidden;
}

.field {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px;
  padding: 0 14px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--subdued);
}

.field input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 1rem;
  color: var(--text);
}

.field input::placeholder {
  color: var(--subdued);
}

.results {
  overflow-y: auto;
  padding: 2px 8px 8px;
  overscroll-behavior: contain;
}

.group {
  margin: 12px 12px 6px;
  font-size: 0.6rem;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px 8px 8px;
  border-radius: 12px;
  color: var(--text-soft);
  text-align: left;
  transition:
    background 0.18s var(--ease),
    color 0.18s var(--ease);
}

.row[aria-selected='true'] {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--soft-inset-sm);
}

.row-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 10px;
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
}

.row-label {
  flex: 1;
  font-size: 0.93rem;
  font-weight: 500;
}

.row-hint {
  font-size: 0.7rem;
  color: var(--subdued);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 40%;
}

.empty {
  padding: 28px 12px;
  text-align: center;
}

.foot {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 18px;
  border-top: 1px solid var(--line);
  font-size: 0.7rem;
  color: var(--subdued);
}

.foot .kbd {
  margin-right: 4px;
}

.count {
  margin-left: auto;
}

@media (max-width: 640px) {
  .scrim {
    padding-top: 12px;
  }
  .foot span:not(.count) {
    display: none;
  }
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.22s var(--ease);
}

.palette-enter-active .palette,
.palette-leave-active .palette {
  transition: transform 0.28s var(--ease);
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}

.palette-enter-from .palette,
.palette-leave-to .palette {
  transform: translateY(-8px) scale(0.98);
}
</style>
