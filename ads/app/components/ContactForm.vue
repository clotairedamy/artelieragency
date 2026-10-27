<script setup lang="ts">
// The contact form. The ADS version of a classic "contact sales" form,
// composed from AdsField / AdsChoice / AdsButton.
//
// Every field has a visible label above it — a placeholder disappears exactly
// when it is needed. The browser's own bubbles are switched off so each error
// can say what to do rather than that something is wrong, sit under the field
// it belongs to, and take focus. A failed send is not a toast: the reader
// must act on it, so it would be a banner.
export type ContactMessage = {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  message: string
}

withDefaults(defineProps<{ privacyTo?: string }>(), { privacyTo: '/privacy' })
const emit = defineEmits<{ (e: 'submit', data: ContactMessage): void }>()

const toast = useToast()
const uid = useId()
const root = ref<HTMLFormElement>()

const blank = () => ({ firstName: '', lastName: '', company: '', email: '', phone: '', message: '', agree: false })
const form = reactive(blank())
const tried = ref(false)
const submitting = ref(false)

const errors = computed(() => {
  if (!tried.value) return {} as Record<string, string>
  const e: Record<string, string> = {}
  if (!form.firstName.trim()) e.firstName = 'Enter your first name.'
  if (!form.lastName.trim()) e.lastName = 'Enter your last name.'
  if (!form.email.trim()) e.email = 'Enter your email address, so we can reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter an email address like name@company.com.'
  if (!form.message.trim()) e.message = 'Tell us what you need — a sentence or two is enough.'
  if (!form.agree) e.agree = 'Tick the box to agree to the privacy policy, so we can keep your message.'
  return e
})

const order = ['firstName', 'lastName', 'email', 'message', 'agree'] as const
const fieldId = (key: string) => `${uid}-${key}`

async function submit() {
  tried.value = true
  await nextTick()
  const first = order.find((k) => errors.value[k])
  if (first) {
    const target = first === 'agree' ? root.value?.querySelector<HTMLElement>('.ads-contact-form__consent input') : document.getElementById(fieldId(first))
    target?.focus()
    return
  }
  submitting.value = true
  const { agree: _agree, ...data } = form
  emit('submit', { ...data })
  // Simulated; wire the `submit` event to $fetch('/api/contact') in a real app.
  await new Promise((r) => setTimeout(r, 900))
  submitting.value = false
  toast.push('Message sent — we will reply within a day.', 'check')
  Object.assign(form, blank())
  tried.value = false
}
</script>

<template>
  <form ref="root" class="ads-contact-form" novalidate @submit.prevent="submit">
    <div class="ads-contact-form__row">
      <AdsField :id="fieldId('firstName')" v-model="form.firstName" label="First name" name="first-name" autocomplete="given-name" :error="errors.firstName" required />
      <AdsField :id="fieldId('lastName')" v-model="form.lastName" label="Last name" name="last-name" autocomplete="family-name" :error="errors.lastName" required />
    </div>

    <AdsField v-model="form.company" label="Company" name="company" autocomplete="organization" hint="Optional." />

    <AdsField :id="fieldId('email')" v-model="form.email" label="Email" type="email" name="email" autocomplete="email" :error="errors.email" required />

    <AdsField
      v-model="form.phone"
      label="Phone number"
      type="tel"
      name="phone"
      autocomplete="tel"
      hint="Optional. Include the country code, e.g. +44 20 7946 0000."
    />

    <AdsField :id="fieldId('message')" v-model="form.message" label="Message" type="textarea" name="message" :rows="4" :error="errors.message" required />

    <div class="ads-contact-form__consent">
      <AdsChoice v-model="form.agree" kind="checkbox" label="I agree to the privacy policy">
        I agree to the <NuxtLink :to="privacyTo" class="ads-link">privacy policy</NuxtLink>.
      </AdsChoice>
      <p v-if="errors.agree" class="ads-contact-form__error" role="alert">
        <Icon name="alert" :size="14" />{{ errors.agree }}
      </p>
    </div>

    <AdsButton type="submit" variant="accent" :loading="submitting" icon="arrow" class="ads-contact-form__submit">
      Send message
    </AdsButton>
  </form>
</template>

<style scoped>
.ads-contact-form {
  display: grid;
  gap: var(--sp-5);
  width: 100%;
  max-width: 560px;
  margin-inline: auto;
}

.ads-contact-form__row {
  display: grid;
  gap: var(--sp-5);
}

@media (min-width: 640px) {
  .ads-contact-form__row {
    grid-template-columns: 1fr 1fr;
  }
}

.ads-contact-form__consent {
  display: grid;
  gap: var(--sp-2);
}

/* Same voice as a field's error: the words carry it, the glyph backs them up,
   the colour is the third signal, not the first. */
.ads-contact-form__error {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 0.76rem;
  color: var(--bad);
}

.ads-contact-form__submit {
  width: 100%;
  margin-top: var(--sp-1);
}
</style>
