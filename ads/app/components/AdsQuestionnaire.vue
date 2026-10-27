<script setup lang="ts">
// One question at a time, with how far along you are written as figures as
// well as drawn. A chosen answer presses in and takes a tick — the accent is
// kept for the one button that moves you on, which stays disabled until the
// question is answered. Moving between questions puts focus on the new
// question, so a screen reader hears it straight away.
export type Question = { id: string; text: string; options: string[]; multi?: boolean }

const props = withDefaults(defineProps<{ questions: Question[]; submitLabel?: string }>(), {
  submitLabel: 'Send answers',
})
const emit = defineEmits<{ (e: 'done', answers: Record<string, string[]>): void }>()
const step = ref(0)
const answers = reactive<Record<string, string[]>>({})
const heading = ref<HTMLElement>()

const current = computed(() => props.questions[step.value])
const total = computed(() => props.questions.length)
const progress = computed(() => (total.value ? ((step.value + 1) / total.value) * 100 : 0))
const answered = computed(() => !!current.value && (answers[current.value.id]?.length ?? 0) > 0)
const last = computed(() => step.value >= total.value - 1)

function chosen(opt: string) {
  return !!current.value && (answers[current.value.id] ?? []).includes(opt)
}

function toggle(opt: string) {
  const q = current.value
  if (!q) return
  const cur = answers[q.id] ?? []
  answers[q.id] = q.multi ? (cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]) : [opt]
}

async function go(n: number) {
  step.value = n
  await nextTick()
  heading.value?.focus()
}

function next() {
  if (!answered.value) return
  if (!last.value) go(step.value + 1)
  else emit('done', { ...answers })
}
</script>

<template>
  <div class="ads-questionnaire">
    <div class="ads-questionnaire__progress" aria-hidden="true">
      <span class="ads-questionnaire__bar" :style="{ width: `${progress}%` }" />
    </div>
    <p class="ads-questionnaire__count num">
      <span class="sr-only">Question </span>{{ step + 1 }}<span aria-hidden="true"> / </span><span class="sr-only"> of </span>{{ total }}
    </p>
    <h3 ref="heading" class="ads-questionnaire__question h3" tabindex="-1">{{ current?.text }}</h3>
    <div
      class="ads-questionnaire__options"
      role="group"
      :aria-label="current?.multi ? 'Choose any that apply' : 'Choose one'"
    >
      <button
        v-for="o in current?.options ?? []"
        :key="o"
        type="button"
        class="ads-questionnaire__option"
        :class="{ 'is-on': chosen(o) }"
        :aria-pressed="chosen(o)"
        @click="toggle(o)"
      >
        <Icon v-if="chosen(o)" name="check" :size="13" />
        {{ o }}
      </button>
    </div>
    <div class="ads-questionnaire__foot">
      <button v-if="step > 0" type="button" class="btn btn-quiet" @click="go(step - 1)">Previous question</button>
      <button type="button" class="btn btn-accent" :disabled="!answered" @click="next">
        {{ last ? submitLabel : 'Next question' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ads-questionnaire {
  display: grid;
  gap: var(--sp-4);
  max-width: 560px;
}

.ads-questionnaire__progress {
  height: 6px;
  overflow: hidden;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-questionnaire__bar {
  display: block;
  height: 100%;
  border-radius: var(--pill);
  background: var(--text-soft);
  transition: width var(--dur-move) var(--ease);
}

.ads-questionnaire__count {
  margin: 0;
  color: var(--subdued);
}

.ads-questionnaire__question {
  margin: 0;
}

.ads-questionnaire__options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.ads-questionnaire__option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px var(--sp-4);
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
  transition:
    color var(--dur-control) var(--ease),
    background var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-questionnaire__option:hover {
  color: var(--accent);
}

.ads-questionnaire__option:active,
.ads-questionnaire__option.is-on {
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-questionnaire__option.is-on {
  color: var(--text);
}

.ads-questionnaire__foot {
  display: flex;
  gap: var(--sp-2);
  margin-top: var(--sp-1);
}
</style>
