<script setup lang="ts">
// A questionnaire: one question at a time, with a progress readout.
export type Question = { id: string; text: string; options: string[]; multi?: boolean }

const props = defineProps<{ questions: Question[] }>()
const emit = defineEmits<{ (e: 'done', answers: Record<string, string[]>): void }>()
const step = ref(0)
const answers = reactive<Record<string, string[]>>({})

const current = computed(() => props.questions[step.value])
const progress = computed(() => (props.questions.length ? ((step.value + 1) / props.questions.length) * 100 : 0))

function toggle(opt: string) {
  const q = current.value
  if (!q) return
  const cur = answers[q.id] ?? []
  answers[q.id] = q.multi ? (cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]) : [opt]
}

function next() {
  if (step.value < props.questions.length - 1) step.value++
  else emit('done', { ...answers })
}
</script>

<template>
  <div class="q">
    <div class="q-progress" aria-hidden="true">
      <span class="q-bar" :style="{ width: `${progress}%` }" />
    </div>
    <p class="q-count num">{{ step + 1 }} / {{ questions.length }}</p>
    <h3 class="h3">{{ current?.text }}</h3>
    <div class="q-opts">
      <button
        v-for="o in current?.options ?? []"
        :key="o"
        type="button"
        class="q-opt"
        :class="{ on: answers[current?.id ?? '']?.includes(o) }"
        @click="toggle(o)"
      >{{ o }}</button>
    </div>
    <div class="q-foot">
      <button v-if="step > 0" type="button" class="btn btn-quiet" @click="step--">Back</button>
      <button type="button" class="btn btn-accent" @click="next">{{ step < questions.length - 1 ? 'Next' : 'Finish' }}</button>
    </div>
  </div>
</template>

<style scoped>
.q {
  display: grid;
  gap: 16px;
  max-width: 560px;
}

.q-progress {
  height: 6px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  overflow: hidden;
}

.q-bar {
  display: block;
  height: 100%;
  border-radius: var(--pill);
  background: var(--accent);
  transition: width 0.3s var(--ease);
}

.q-count {
  margin: 0;
  color: var(--subdued);
}

.q h3 {
  margin: 0;
}

.q-opts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.q-opt {
  padding: 10px 16px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
  transition: color 0.2s var(--ease), background 0.2s var(--ease), box-shadow 0.2s var(--ease);
}

.q-opt:hover {
  color: var(--text);
}

.q-opt.on {
  color: var(--accent-ink);
  background: var(--accent);
  box-shadow: var(--soft-raised-sm);
}

.q-foot {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
</style>
