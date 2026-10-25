<script setup lang="ts">
const { studio } = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="foot">
    <div class="inner">
      <div class="left">
        <BrandMark :size="24" />
        <span class="num">{{ studio.domain }}</span>
      </div>
      <nav class="links">
        <NuxtLink to="/dashboard-example">Dashboard example</NuxtLink>
        <NuxtLink to="/design-system">Design system</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
        <a :href="`mailto:${studio.email}`">{{ studio.email }}</a>
        <NuxtLink to="/privacy">Privacy</NuxtLink>
      </nav>
      <span class="num copy">© {{ year }}</span>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  padding: 26px clamp(20px, 4vw, 48px) 34px;
  border-top: 1px solid var(--line);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px 26px;
  max-width: var(--max);
  margin: 0 auto;
  font-size: 0.84rem;
  color: var(--subdued);
}

.left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-soft);
}

.left .num {
  font-size: 0.8rem;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: auto;
}

.links a {
  transition: color 0.25s var(--ease);
}

.links a:hover {
  color: var(--text);
}

.copy {
  font-size: 0.78rem;
}
</style>
