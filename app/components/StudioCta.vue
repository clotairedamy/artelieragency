<script setup lang="ts">
// The home page's close: the kit's CtaBand with the studio's own words, framed
// as the app's "new crawl" dialog. The whole page has spent its accent
// carefully so that this button is the brightest thing on it by the time
// anyone gets here. The page already sets the gutter, so the band drops its own.
</script>

<template>
  <CtaBand
    id="contact"
    v-reveal
    class="studio-cta"
    eyebrow="New project"
    title="Tell us what your users are trying to find out."
    body="Send the screen you are least happy with. You will get a written read on it within two working days — what it is doing to your users, and what we would change first. No deck, no discovery call to book."
  />
</template>

<style scoped>
.studio-cta.ads-cta-band {
  padding: var(--sp-7) 0 var(--sp-4);
}

.studio-cta :deep(.ads-cta-band__inner) {
  padding: 0;
}
</style>
