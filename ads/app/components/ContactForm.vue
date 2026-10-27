<script setup lang="ts">
// The contact form. This is the ADS version of a classic "contact sales"
// form: the same fields, composed from AdsField / AdsChoice / AdsButton
// instead of a pile of utility classes.
const toast = useToast()

const form = reactive({
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  country: '',
  phone: '',
  message: '',
  agree: false,
})

const submitting = ref(false)

const countries = [
  { label: 'US', value: 'US' },
  { label: 'CA', value: 'CA' },
  { label: 'EU', value: 'EU' },
  { label: 'GB', value: 'GB' },
]

async function submit() {
  submitting.value = true
  // Simulate a request; wire this to $fetch('/api/contact') in a real app.
  await new Promise((r) => setTimeout(r, 900))
  submitting.value = false
  toast.push('Message sent — we will reply within a day.', 'check')
  Object.assign(form, { firstName: '', lastName: '', company: '', email: '', country: '', phone: '', message: '', agree: false })
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <div class="grid-2">
      <AdsField v-model="form.firstName" label="First name" name="first-name" autocomplete="given-name" required />
      <AdsField v-model="form.lastName" label="Last name" name="last-name" autocomplete="family-name" required />
    </div>

    <AdsField v-model="form.company" label="Company" name="company" autocomplete="organization" />

    <AdsField v-model="form.email" label="Email" type="email" name="email" autocomplete="email" required />

    <div class="stack gap-2">
      <span class="field-label">Phone number</span>
      <div class="phone">
        <select v-model="form.country" class="country" aria-label="Country">
          <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
        <input v-model="form.phone" type="tel" name="phone-number" autocomplete="tel" placeholder="123-456-7890" />
      </div>
    </div>

    <AdsField v-model="form.message" label="Message" type="textarea" name="message" rows="4" />

    <AdsChoice v-model="form.agree" kind="checkbox">
      By selecting this, you agree to our
      <NuxtLink to="/" class="ads-link">privacy policy</NuxtLink>.
    </AdsChoice>

    <div class="submit">
      <AdsButton type="submit" variant="accent" :loading="submitting" icon="arrow" style="width: 100%">
        Let&rsquo;s talk
      </AdsButton>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 20px;
  width: 100%;
  max-width: 560px;
  margin-inline: auto;
}

.grid-2 {
  display: grid;
  gap: 20px;
}

@media (min-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}

.field-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
}

/* The phone field: a select and an input sharing one pressed well. */
.phone {
  display: flex;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  overflow: hidden;
}

.phone .country {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--subdued);
  font: inherit;
  font-size: 0.9rem;
  padding: 11px 8px 11px 14px;
  cursor: pointer;
}

.phone input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.92rem;
  padding: 11px 14px 11px 8px;
}

.phone input::placeholder {
  color: var(--subdued);
}

.submit {
  margin-top: 6px;
}
</style>
