<script setup lang="ts">
const email = ref('')
const country = ref('')
const agree = ref(true)
const notify = ref(false)
const range = ref(50)
const num = ref(3)
const rangePreset = ref('30d')

const fieldCode = `<AdsField v-model="email" label="Email" type="email" hint="We never share it." />
<AdsField v-model="msg" label="Message" type="textarea" />
<AdsField v-model="c" label="Country" type="select" :options="[{ label: 'US', value: 'US' }]" />`

const numberCode = `<AdsNumber v-model="num" :min="0" :max="10" label="Count" />`

const daterangeCode = `<AdsDaterange v-model="range" from="2026-09-25" to="2026-10-25" :presets="['7d', '30d', '90d', 'Custom']" />`

const choiceCode = `<AdsChoice v-model="agree" kind="checkbox">I agree</AdsChoice>
<AdsChoice v-model="opt" kind="radio" name="opt" value="a">Option A</AdsChoice>
<AdsChoice v-model="notify" kind="switch">Email me</AdsChoice>`

const rangeCode = `<AdsRange v-model="range" :min="0" :max="100" label="Volume" />`

const tagCode = `<AdsTag label="status: 4xx" @remove="…" />`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Inputs</p>
      <h1 class="title face-display">Inputs</h1>
      <p class="lede">Things that take a value. Every field is a well — a raised input reads as something to press.</p>
    </header>

    <ComponentDoc
      id="adsfield"
      name="AdsField"
      description="A labelled text input, textarea, select or search. Label above, hint below, error replacing the hint."
      :code="fieldCode"
      :props="[
        { name: 'label', type: 'string', default: '' },
        { name: 'modelValue', type: 'string | number', default: '' },
        { name: 'type', type: 'text | email | password | tel | number | search | date | textarea | select', default: 'text' },
        { name: 'hint', type: 'string', default: '' },
        { name: 'error', type: 'string', default: '', desc: 'Shows the error state and message.' },
        { name: 'options', type: '{ label, value }[]', default: '—', desc: 'For select.' },
      ]"
    >
      <div class="stack gap-3 block" style="max-width: 360px">
        <AdsField v-model="email" label="Email" type="email" hint="We never share it." />
        <AdsField v-model="country" label="Country" type="select" :options="[{ label: 'US', value: 'US' }, { label: 'EU', value: 'EU' }]" />
        <AdsField label="Invalid" error="This field needs a value." />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsnumber"
      name="AdsNumber"
      description="A figure with steppers, right-aligned and monospaced so it lines up with the values it will be compared against."
      :code="numberCode"
      :props="[
        { name: 'modelValue', type: 'number', default: '0' },
        { name: 'min / max / step', type: 'number', default: '0 / ∞ / 1' },
        { name: 'label', type: 'string', default: '' },
      ]"
    >
      <div class="stack gap-2"><AdsNumber v-model="num" :min="0" :max="10" label="Count" /><span class="dim size-sm">value: {{ num }}</span></div>
    </ComponentDoc>

    <ComponentDoc
      id="adsdaterange"
      name="AdsDaterange"
      description="The most-used control on any dashboard. ISO dates in the data face, presets beside them."
      :code="daterangeCode"
      :props="[
        { name: 'from / to', type: 'string', default: 'ISO dates' },
        { name: 'presets', type: 'string[]', default: '7d / 30d / 90d / Custom' },
        { name: 'modelValue', type: 'string', default: '—' },
      ]"
    >
      <AdsDaterange v-model="rangePreset" from="2026-09-25" to="2026-10-25" />
    </ComponentDoc>

    <ComponentDoc
      id="adschoice"
      name="AdsChoice"
      description="Three shapes for three meanings: many-of (checkbox), one-of (radio), and a setting that takes effect the moment it is flipped (switch)."
      :code="choiceCode"
      :props="[
        { name: 'kind', type: 'checkbox | radio | switch', default: 'checkbox' },
        { name: 'label', type: 'string', default: '—' },
        { name: 'modelValue', type: 'boolean', default: 'false' },
        { name: 'name / value', type: 'string', default: '—', desc: 'For radio groups.' },
      ]"
    >
      <div class="stack gap-3">
        <AdsChoice v-model="agree" kind="checkbox">I agree to the terms</AdsChoice>
        <AdsChoice v-model="notify" kind="switch">Email me updates</AdsChoice>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsrange"
      name="AdsRange"
      description="A continuous value where the approximate position matters more than the exact figure — but the figure is shown anyway."
      :code="rangeCode"
      :props="[
        { name: 'modelValue', type: 'number', default: '0' },
        { name: 'min / max / step', type: 'number', default: '0 / 100 / 1' },
        { name: 'label', type: 'string', default: '' },
      ]"
    >
      <div class="block" style="max-width: 320px"><AdsRange v-model="range" label="Concurrency" /> <span class="num size-sm">{{ range }}</span></div>
    </ComponentDoc>

    <ComponentDoc
      id="adstag"
      name="AdsTag"
      description="A filter the reader applied and can take off again. Distinct from a status chip, which cannot be removed — the dismiss affordance is the whole difference."
      :code="tagCode"
      :props="[
        { name: 'label', type: 'string', default: '—' },
        { name: 'removable', type: 'boolean', default: 'true' },
      ]"
    >
      <div class="row gap-3"><AdsTag label="status: 4xx" /><AdsTag label="depth ≤ 3" /><AdsTag label="indexable" /></div>
    </ComponentDoc>
  </div>
</template>

<style scoped>
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}
</style>
