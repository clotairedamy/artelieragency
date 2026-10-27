<script setup lang="ts">
// Frequently asked questions, on an accordion. Progressive disclosure: show
// the question, let the reader open the answer.
export type Faq = { title: string; body: string }

defineProps<{ faqs: Faq[] }>()
</script>

<template>
  <div class="max faq">
    <AdsAccordion :items="faqs" />
  </div>
</template>

<style scoped>
.faq {
  max-width: 760px;
  margin-inline: auto;
}
</style>
