<script setup lang="ts">
// Explains why a panel is empty, in plain words, with the fix when there is one
// — and the action that applies it, so the empty state is a way forward rather
// than a dead end.
//
// The status is a closed set because the causes are: a panel that has never
// had data ("empty") is a different situation from one whose filters exclude
// everything ("no-results"), and both differ from a failure. The tone is
// carried three ways — the glyph, the words, and the mark's colour — so it
// survives without colour. No stripe, no brand hue: the panel is chrome, and
// chrome is grey; the only colour is the warning state on the mark.
export type DashEmptyStatus = 'empty' | 'no-results' | 'error' | 'forbidden' | 'unconfigured'

const props = withDefaults(
  defineProps<{ title: string; reason?: string; status?: DashEmptyStatus; fix?: string; actionLabel?: string }>(),
  { reason: '', status: 'empty', fix: '', actionLabel: '' },
)

const emit = defineEmits<{ action: [] }>()

const tone = computed(() =>
  props.status === 'forbidden' || props.status === 'error' ? 'warn' : props.status === 'unconfigured' ? 'info' : 'quiet',
)
const glyph = computed(
  () => ({ forbidden: '!', error: '!', unconfigured: '?', 'no-results': '∅', empty: '—' } as const)[props.status],
)
const spoken = computed(
  () =>
    ({ forbidden: 'No access', error: 'Error', unconfigured: 'Not set up', 'no-results': 'No results', empty: 'No data yet' } as const)[
      props.status
    ],
)
const fixText = computed(
  () =>
    props.fix ||
    {
      forbidden: 'Fix the access grant and this panel fills in on its own.',
      unconfigured: 'Add the missing environment variable and redeploy.',
      'no-results': 'Clear a filter to widen the search.',
      empty: 'Nothing to fix. The panel fills in once the data exists.',
      error: '',
    }[props.status],
)
</script>

<template>
  <div class="ads-dash-empty" :class="`is-${tone}`">
    <span class="ads-dash-empty__mark" aria-hidden="true">{{ glyph }}</span>
    <div class="ads-dash-empty__copy">
      <p class="ads-dash-empty__title"><span class="sr-only">{{ spoken }}: </span>{{ title }}</p>
      <p v-if="reason" class="ads-dash-empty__reason">{{ reason }}</p>
      <p v-if="fixText" class="ads-dash-empty__fix">{{ fixText }}</p>
      <button v-if="actionLabel" type="button" class="btn btn-sm ads-dash-empty__action" @click="emit('action')">{{ actionLabel }}</button>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ads-dash-empty {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 18px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-dash-empty__mark {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--subdued);
}

.ads-dash-empty.is-warn .ads-dash-empty__mark { color: var(--warn); }
.ads-dash-empty.is-info .ads-dash-empty__mark { color: var(--text); }

.ads-dash-empty__title { font-size: 0.9rem; font-weight: 500; color: var(--text); margin: 0 0 var(--sp-1); }
.ads-dash-empty__reason { font-size: 0.82rem; color: var(--subdued); margin: 0; max-width: 62ch; }
.ads-dash-empty__fix { font-size: 0.78rem; color: var(--text-soft); margin: var(--sp-2) 0 0; }
.ads-dash-empty__action { margin-top: var(--sp-3); }
</style>
