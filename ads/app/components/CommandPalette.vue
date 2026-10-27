<script setup lang="ts">
// The command palette: ⌘K (or /) from anywhere.
//
// It is the most "this is an application" gesture a website can offer, and
// on this one it is also the fastest way around — every section of the page
// you are on, every page, and the handful of actions worth a shortcut, behind
// one text field that filters as you type.
import type { Section } from '../composables/useOverlays'

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

// Jumps are instant for anyone who has asked the system for less motion.
const behavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

const commands = computed<Command[]>(() => [
  ...props.sections.map((s) => ({
    id: `s-${s.id}`,
    group: 'Jump to',
    label: s.label,
    icon: s.icon,
    hint: s.to ?? 'section',
    run: () => {
      if (s.to) return router.push(s.to)
      document.getElementById(s.id)?.scrollIntoView({ behavior: behavior() })
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
    run: () => window.scrollTo({ top: 0, behavior: behavior() }),
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

// Focus goes to the field on open and back to whatever opened the palette on
// close, so a keyboard user ends up where they started.
let opener: HTMLElement | null = null
watch(open, async (v) => {
  if (!v) {
    if (opener?.isConnected) opener.focus({ preventScroll: true })
    opener = null
    return
  }
  opener = document.activeElement as HTMLElement | null
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
    <Transition name="ads-command-palette__pop">
      <div v-if="open" class="ads-command-palette" @mousedown.self="close">
        <div class="ads-command-palette__dialog" role="dialog" aria-modal="true" aria-label="Command palette" @keydown="onKey">
          <div class="ads-command-palette__field">
            <Icon name="discovery" :size="20" />
            <input
              ref="input"
              v-model="query"
              type="text"
              placeholder="Search sections, pages and actions…"
              aria-label="Search sections, pages and actions"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              :aria-activedescendant="results[cursor] ? `cmd-${results[cursor]!.id}` : undefined"
              autocomplete="off"
              spellcheck="false"
            >
            <kbd class="kbd">esc</kbd>
          </div>

          <div id="palette-list" ref="list" class="ads-command-palette__results" role="listbox" aria-label="Results">
            <div v-for="g in groups" :key="g.name" role="group" :aria-label="g.name">
              <p class="eyebrow ads-command-palette__group" aria-hidden="true">{{ g.name }}</p>
              <button
                v-for="c in g.items"
                :id="`cmd-${c.id}`"
                :key="c.id"
                type="button"
                role="option"
                class="ads-command-palette__row"
                :aria-selected="c.index === cursor"
                @mousemove="cursor = c.index"
                @click="run(c)"
              >
                <span class="ads-command-palette__row-icon"><Icon :name="c.icon" :size="18" /></span>
                <span class="ads-command-palette__row-label">{{ c.label }}</span>
                <span v-if="c.hint" class="ads-command-palette__row-hint num">{{ c.hint }}</span>
              </button>
            </div>
            <p v-if="!results.length" class="body ads-command-palette__empty">Nothing matches “{{ query }}”.</p>
          </div>

          <div class="ads-command-palette__foot num">
            <span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> move</span>
            <span><kbd class="kbd">↵</kbd> open</span>
            <span class="ads-command-palette__count" aria-live="polite">{{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ads-command-palette {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  justify-items: center;
  align-items: start;
  padding: min(14vh, 120px) var(--sp-4) var(--sp-4);
  background: rgb(10 10 12 / 0.32);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.ads-command-palette__dialog {
  width: min(620px, 100%);
  max-height: min(560px, 76vh);
  display: grid;
  grid-template-rows: auto 1fr auto;
  border-radius: var(--radius-lg);
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
  overflow: hidden;
}

.ads-command-palette__field {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin: var(--sp-3);
  padding: 0 14px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--subdued);
}

.ads-command-palette__field input {
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

.ads-command-palette__field input::placeholder {
  color: var(--subdued);
}

.ads-command-palette__results {
  overflow-y: auto;
  padding: 2px var(--sp-2) var(--sp-2);
  overscroll-behavior: contain;
}

.ads-command-palette__group {
  margin: var(--sp-3) var(--sp-3) 6px;
  font-size: 0.6rem;
}

.ads-command-palette__row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  width: 100%;
  padding: var(--sp-2) var(--sp-3) var(--sp-2) var(--sp-2);
  border-radius: 12px;
  color: var(--text-soft);
  text-align: left;
  transition:
    background var(--dur-control) var(--ease),
    color var(--dur-control) var(--ease);
}

.ads-command-palette__row[aria-selected='true'] {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--soft-inset-sm);
}

.ads-command-palette__row-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 10px;
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
}

.ads-command-palette__row-label {
  flex: 1;
  font-size: 0.93rem;
  font-weight: 500;
}

.ads-command-palette__row-hint {
  font-size: 0.7rem;
  color: var(--subdued);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 40%;
}

.ads-command-palette__empty {
  padding: 28px var(--sp-3);
  text-align: center;
}

.ads-command-palette__foot {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: 10px 18px;
  border-top: 1px solid var(--line);
  font-size: 0.7rem;
  color: var(--subdued);
}

.ads-command-palette__foot .kbd {
  margin-right: var(--sp-1);
}

.ads-command-palette__count {
  margin-left: auto;
}

@media (max-width: 640px) {
  .ads-command-palette {
    padding-top: var(--sp-3);
  }
  .ads-command-palette__foot span:not(.ads-command-palette__count) {
    display: none;
  }
}

.ads-command-palette__pop-enter-active,
.ads-command-palette__pop-leave-active {
  transition: opacity var(--dur-control) var(--ease);
}

.ads-command-palette__pop-enter-active .ads-command-palette__dialog,
.ads-command-palette__pop-leave-active .ads-command-palette__dialog {
  transition: transform var(--dur-control) var(--ease);
}

.ads-command-palette__pop-enter-from,
.ads-command-palette__pop-leave-to {
  opacity: 0;
}

.ads-command-palette__pop-enter-from .ads-command-palette__dialog,
.ads-command-palette__pop-leave-to .ads-command-palette__dialog {
  transform: translateY(-8px) scale(0.98);
}
</style>
