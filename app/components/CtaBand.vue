<script setup lang="ts">
// The close, framed as the app's "new crawl" dialog: a panel with one filled
// action in it. The whole site has spent its accent carefully so that this
// button is the brightest thing on the page by the time anyone reaches it.
const { studio } = useAppConfig()
</script>

<template>
  <section id="contact" class="band">
    <div v-reveal class="panel card">
      <span class="eyebrow">New project</span>
      <h2 class="h2">Tell us what your users are trying to find out.</h2>
      <p class="lede">
        Send the screen you are least happy with. You will get a written read
        on it within two working days — what it is doing to your users, and
        what we would change first. No deck, no discovery call to book.
      </p>
      <div class="actions">
        <NuxtLink class="btn btn-accent" to="/contact">
          Start a project
          <Icon name="arrow" :size="18" />
        </NuxtLink>
        <a class="btn" :href="`mailto:${studio.email}`">
          <Icon name="mail" :size="18" />
          {{ studio.email }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.band {
  padding: 40px 0 16px;
}

.panel {
  display: grid;
  gap: 16px;
  justify-items: start;
  padding: clamp(28px, 5vw, 52px);
}

.panel .lede {
  max-width: 56ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}
</style>
