<script setup lang="ts">
// A vertical trail of steps — a deploy, an order, an approval — threaded by
// one hairline. It speaks the same language as the stepper: done is filled and
// ticked, the current step is ringed and marked aria-current, what is still to
// come is pressed in. Each state is also written out for screen readers, so
// nothing rides on the fill alone. Times are figures, so they are in the data
// face.
export type TraceStep = { title: string; meta?: string; state?: 'done' | 'now' | 'todo' }
const props = defineProps<{ steps: TraceStep[]; label?: string }>()

const STATE_TEXT = { done: 'Done', now: 'In progress', todo: 'To do' } as const
function stateOf(s: TraceStep, i: number) {
  return s.state ?? (i === 0 ? 'done' : 'todo')
}
</script>

<template>
  <ol class="ads-trace" :aria-label="props.label">
    <li
      v-for="(s, i) in steps"
      :key="s.title"
      class="ads-trace__step"
      :class="`is-${stateOf(s, i)}`"
      :aria-current="stateOf(s, i) === 'now' ? 'step' : undefined"
    >
      <span class="ads-trace__dot" aria-hidden="true">
        <Icon v-if="stateOf(s, i) === 'done'" name="check" :size="10" />
      </span>
      <div class="ads-trace__body">
        <span class="ads-trace__title">
          {{ s.title }}<span class="sr-only">, {{ STATE_TEXT[stateOf(s, i)] }}</span>
        </span>
        <span v-if="s.meta" class="ads-trace__meta num">{{ s.meta }}</span>
      </div>
      <span v-if="i < steps.length - 1" class="ads-trace__line" aria-hidden="true" />
    </li>
  </ol>
</template>

<style scoped>
.ads-trace {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ads-trace__step {
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: var(--sp-3);
  padding-bottom: var(--sp-5);
}

.ads-trace__step:last-child {
  padding-bottom: 0;
}

.ads-trace__dot {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-trace__step.is-done .ads-trace__dot {
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: var(--soft-raised-sm);
}

.ads-trace__step.is-now .ads-trace__dot {
  background: var(--raised);
  box-shadow: var(--soft-raised-sm), 0 0 0 2px var(--accent);
}

.ads-trace__line {
  position: absolute;
  top: 22px;
  bottom: 4px;
  left: 8.5px;
  width: 1px;
  background: var(--line);
}

.ads-trace__body {
  display: grid;
  gap: 2px;
}

.ads-trace__title {
  font-size: 0.92rem;
  color: var(--text-soft);
}

.ads-trace__step.is-now .ads-trace__title {
  color: var(--text);
  font-weight: 540;
}

.ads-trace__step.is-todo .ads-trace__title {
  color: var(--subdued);
}

.ads-trace__meta {
  font-size: 0.72rem;
  color: var(--subdued);
}
</style>
