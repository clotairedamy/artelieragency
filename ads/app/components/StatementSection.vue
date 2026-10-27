<script setup lang="ts">
// A statement: a few deliberate lines, then a ruled ledger of facts.
defineProps<{ lines: string[]; facts?: { term: string; value: string }[] }>()
</script>

<template>
  <section class="statement">
    <RevealHeading :lines="lines" size="statement" tag="p" />
    <dl v-if="facts?.length" class="ads-dl statement-facts">
      <template v-for="f in facts" :key="f.term">
        <dt>{{ f.term }}</dt>
        <dd>{{ f.value }}</dd>
      </template>
    </dl>
  </section>
</template>

<style scoped>
.statement {
  display: grid;
  gap: 28px;
}

.statement-facts {
  max-width: 46rem;
}
</style>
