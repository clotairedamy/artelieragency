<script setup lang="ts">
definePageMeta({ layout: 'plain' })
const { studio } = useAppConfig()
useSeo({
  title: 'Privacy',
  path: '/privacy',
  description: 'What artelier.agency collects, which is nothing.',
})
</script>

<template>
  <div class="page">
    <section class="screen">
      <h1 class="h2">Privacy</h1>
      <div class="prose">
        <p class="lede">
          This site sets no cookies, runs no analytics and has no server. There
          is nothing to opt out of.
        </p>
        <p class="body">
          The numbers on the home page — scroll depth, dwell time, frame rate,
          viewport — are measured in your browser so the page can draw them,
          and are discarded when you close the tab. They are never transmitted.
        </p>
        <p class="body">
          The enquiry form composes a message in your own mail client; it does
          not post anywhere. If you write to {{ studio.email }} we keep that
          correspondence for as long as we are talking, and delete it when we
          are not. Ask and we will confirm what we hold.
        </p>
        <p class="body">
          The site is hosted on GitHub Pages, whose own logs are outside our
          control and covered by GitHub's privacy statement.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { padding: 0 clamp(20px, 4vw, 48px); }
.screen { max-width: 62ch; margin: 0 auto; padding: clamp(48px, 7vw, 88px) 0; }
.prose { display: grid; gap: 18px; margin-top: 26px; }
</style>
