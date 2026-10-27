<script setup lang="ts">
// Explains why a panel is empty, in plain words, with the fix when there is one.
const props = withDefaults(
  defineProps<{ title: string; reason?: string; status?: string; fix?: string }>(),
  { reason: '', status: 'empty', fix: '' },
)

const tone = computed(() =>
  props.status === 'forbidden' || props.status === 'error' ? 'warn' : props.status === 'unconfigured' ? 'info' : 'quiet',
)
const glyph = computed(() => ({ forbidden: '!', error: '!', unconfigured: '?', empty: '—' }[props.status] ?? '—'))
const fixText = computed(() =>
  props.fix || ({ forbidden: 'Fix the access grant and this panel fills in on its own.', unconfigured: 'Add the missing environment variable and redeploy.', empty: 'Nothing to fix. The panel fills in once the data exists.' }[props.status] ?? ''),
)
</script>

<template>
  <div class="de" :class="`de--${tone}`">
    <span class="de-mark" aria-hidden="true">{{ glyph }}</span>
    <div>
      <p class="de-title">{{ title }}</p>
      <p v-if="reason" class="de-reason">{{ reason }}</p>
      <p v-if="fixText" class="de-fix">{{ fixText }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.de {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 18px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  border-left: 3px solid var(--subdued);
}

.de--warn { border-left-color: var(--warn); }
.de--info { border-left-color: var(--brand-secondary); }
.de--quiet { border-left-color: var(--subdued); }

.de-mark {
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

.de-title { font-size: 0.9rem; font-weight: 500; color: var(--text); margin: 0 0 4px; }
.de-reason { font-size: 0.82rem; color: var(--subdued); margin: 0; max-width: 62ch; }
.de-fix { font-size: 0.78rem; color: var(--text-soft); margin: 8px 0 0; }
</style>
