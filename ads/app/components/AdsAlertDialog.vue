<script setup lang="ts">
// A confirmation dialog — a modal with a title, a description, and a
// cancel/action pair. The accent goes on the action, never on a destructive
// cancel.
withDefaults(
  defineProps<{ title?: string; description?: string; cancelLabel?: string; actionLabel?: string }>(),
  { title: 'Are you sure?', description: '', cancelLabel: 'Cancel', actionLabel: 'Continue' },
)
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ (e: 'action'): void; (e: 'cancel'): void }>()
</script>

<template>
  <AdsModal v-model="open" :title="title">
    <p v-if="description" class="ink-subdued mar-b-4">{{ description }}</p>
    <slot />
    <div class="row gap-3">
      <AdsButton variant="quiet" @click="open = false; emit('cancel')">{{ cancelLabel }}</AdsButton>
      <AdsButton variant="accent" @click="open = false; emit('action')">{{ actionLabel }}</AdsButton>
    </div>
  </AdsModal>
</template>
