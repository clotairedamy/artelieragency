<script setup lang="ts">
// A trace: a vertical trail of steps, with a line threading through them.
export type TraceStep = { title: string; meta?: string; state?: 'done' | 'now' | 'todo' }
defineProps<{ steps: TraceStep[] }>()
</script>

<template>
  <ol class="trace">
    <li v-for="(s, i) in steps" :key="s.title" class="trace-step" :class="s.state ?? (i === 0 ? 'done' : 'todo')">
      <span class="trace-dot" aria-hidden="true" />
      <div class="trace-body">
        <span class="trace-title">{{ s.title }}</span>
        <span v-if="s.meta" class="trace-meta num">{{ s.meta }}</span>
      </div>
      <span v-if="i < steps.length - 1" class="trace-line" aria-hidden="true" />
    </li>
  </ol>
</template>

<style scoped>
.trace {
  display: grid;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.trace-step {
  position: relative;
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 12px;
  padding-bottom: 20px;
}

.trace-step:last-child {
  padding-bottom: 0;
}

.trace-dot {
  position: relative;
  z-index: 1;
  width: 12px;
  height: 12px;
  margin-top: 3px;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.trace-step.done .trace-dot {
  background: var(--accent);
}

.trace-step.now .trace-dot {
  background: var(--text);
  box-shadow: 0 0 0 4px var(--surface), var(--soft-raised-sm);
}

.trace-line {
  position: absolute;
  left: 5.5px;
  top: 18px;
  bottom: 2px;
  width: 1px;
  background: var(--line-strong);
}

.trace-body {
  display: grid;
  gap: 2px;
}

.trace-title {
  font-size: 0.92rem;
  color: var(--text);
}

.trace-step.todo .trace-title {
  color: var(--text-soft);
}

.trace-meta {
  font-size: 0.72rem;
  color: var(--subdued);
}
</style>
