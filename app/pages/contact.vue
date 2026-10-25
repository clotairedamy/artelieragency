<script setup lang="ts">
definePageMeta({ layout: 'plain' })
const { studio } = useAppConfig()

useSeo({
  title: 'Start a project',
  path: '/contact',
  description:
    'Send Artelier the screen you are least happy with and get a written read on it within two working days.',
})

// The site is statically hosted, so there is no endpoint to post to. Rather
// than embed a third-party form and hand a stranger the enquiries, the panel
// composes a mail message in the visitor's own client. It is a plainer
// mechanism and nothing sits in between.
const name = ref('')
const company = ref('')
const url = ref('')
const brief = ref('')

const ready = computed(() => name.value.trim().length > 1 && brief.value.trim().length > 12)

const mailto = computed(() => {
  const subject = `Project enquiry — ${company.value.trim() || name.value.trim() || 'new'}`
  const body = [
    `Name: ${name.value.trim()}`,
    `Company: ${company.value.trim() || '—'}`,
    `Product URL: ${url.value.trim() || '—'}`,
    '',
    brief.value.trim(),
  ].join('\n')
  return `mailto:${studio.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})
</script>

<template>
  <div class="page">
    <section class="screen">
      <header class="screen-head">
        <div>
          <h1 class="screen-title">New project</h1>
          <p class="screen-sub num">one form · no call required</p>
        </div>
        <NuxtLink class="btn btn-quiet" to="/">← Back</NuxtLink>
      </header>

      <div class="body-grid">
        <form class="card form" @submit.prevent>
          <div class="field">
            <label class="eyebrow" for="f-name">Your name</label>
            <input id="f-name" v-model="name" class="input" type="text" autocomplete="name" required>
          </div>

          <div class="row">
            <div class="field">
              <label class="eyebrow" for="f-company">Company</label>
              <input id="f-company" v-model="company" class="input" type="text" autocomplete="organization">
            </div>
            <div class="field">
              <label class="eyebrow" for="f-url">Product URL</label>
              <input id="f-url" v-model="url" class="input" type="url" placeholder="https://">
            </div>
          </div>

          <div class="field">
            <label class="eyebrow" for="f-brief">
              The screen you are least happy with
              <span class="count num">{{ brief.length }}</span>
            </label>
            <textarea
              id="f-brief"
              v-model="brief"
              class="input"
              rows="7"
              placeholder="What it is meant to answer, who looks at it, and what goes wrong when they do."
              required
            />
          </div>

          <div class="actions">
            <a
              class="btn btn-accent"
              :class="{ disabled: !ready }"
              :href="ready ? mailto : undefined"
              :aria-disabled="!ready"
            >
              Send enquiry
              <Icon name="arrow" :size="18" />
            </a>
            <span class="body hint">Opens in your mail app — nothing is submitted to this site.</span>
          </div>
        </form>

        <aside class="card side">
          <span class="eyebrow">What happens next</span>
          <ol class="steps">
            <li><span class="num s">01</span> A written read on the screen, inside two working days.</li>
            <li><span class="num s">02</span> If it looks like a fit, a scope and a fixed price.</li>
            <li><span class="num s">03</span> If it does not, we say so and point you somewhere better.</li>
          </ol>
          <a class="btn" :href="`mailto:${studio.email}`">
            <Icon name="mail" :size="18" />
            {{ studio.email }}
          </a>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding: 0 clamp(20px, 4vw, 48px);
}

.screen {
  max-width: var(--max);
  margin: 0 auto;
  padding: clamp(28px, 4vw, 44px) 0 clamp(64px, 8vw, 96px);
}

.screen-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
}

.screen-title {
  font-size: clamp(1.7rem, 3vw, 2.1rem);
  font-weight: 560;
  letter-spacing: -0.03em;
}

.screen-sub {
  margin-top: 4px;
  font-size: 0.78rem;
  color: var(--subdued);
}

.body-grid {
  display: grid;
  gap: var(--gutter);
  padding-top: 36px;
}

@media (min-width: 900px) {
  .body-grid {
    grid-template-columns: 1.5fr 1fr;
    align-items: start;
  }
}

.form {
  display: grid;
  gap: 20px;
}

.row {
  display: grid;
  gap: 20px;
}

@media (min-width: 560px) {
  .row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.field {
  display: grid;
  gap: 9px;
}

.field label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.count {
  font-size: 0.7rem;
  color: var(--subdued);
  letter-spacing: 0;
}

/* Inputs are wells: the same shape as a card, pressed into the page instead
   of standing out of it. */
.input {
  width: 100%;
  padding: 13px 15px;
  font: inherit;
  font-size: 0.94rem;
  color: var(--text);
  background: var(--surface);
  border: 0;
  border-radius: var(--radius-sm);
  box-shadow: var(--soft-inset);
  resize: vertical;
}

.input::placeholder {
  color: var(--subdued);
}

.input:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 4px;
}

.disabled {
  opacity: 0.45;
  pointer-events: none;
}

.hint {
  font-size: 0.8rem;
}

.side {
  display: grid;
  gap: 18px;
  justify-items: start;
}

.steps {
  display: grid;
  gap: 14px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
  color: var(--text-soft);
}

.steps li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
}

.s {
  font-size: 0.76rem;
  color: var(--accent);
}
</style>
