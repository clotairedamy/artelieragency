<script setup lang="ts">
// The site navigation: brand left, links in the middle, one accent CTA and the
// theme switch right. Collapses to a burger and a menu sheet on a phone.
export type NavLink = { to: string; label: string }

withDefaults(
  defineProps<{ links?: NavLink[]; ctaTo?: string; ctaLabel?: string }>(),
  {
    links: () => [
      { to: '/', label: 'Overview' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/contact', label: 'Contact' },
    ],
    ctaTo: '/contact',
    ctaLabel: 'Start a project',
  },
)

const route = useRoute()
const sheet = useMenuSheet()
watch(() => route.path, () => (sheet.value = false))
</script>

<template>
  <header class="nav">
    <div class="bar max">
      <NuxtLink to="/" class="brand-link" aria-label="Artelier home"><BrandMark /></NuxtLink>

      <nav class="links" aria-label="Main">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="link">{{ l.label }}</NuxtLink>
      </nav>

      <div class="actions">
        <AdsThemeToggle />
        <NuxtLink v-if="ctaTo" :to="ctaTo" class="btn btn-accent btn-sm">{{ ctaLabel }}</NuxtLink>
        <button class="burger" type="button" :aria-expanded="sheet" aria-label="Menu" @click="sheet = !sheet">
          <Icon :name="sheet ? 'plus' : 'grid'" :size="18" :style="sheet ? 'rotate:45deg' : undefined" />
        </button>
      </div>
    </div>

    <Transition name="drop">
      <nav v-if="sheet" class="sheet" aria-label="Mobile">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        <NuxtLink v-if="ctaTo" :to="ctaTo" class="btn btn-accent">{{ ctaLabel }}</NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 60;
  background: color-mix(in srgb, var(--canvas) 82%, transparent);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  box-shadow: 0 1px 0 var(--line);
}

.bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  height: 72px;
  padding: 0 clamp(20px, 4vw, 48px);
}

.brand-link {
  justify-self: start;
}

.links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.link {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-soft);
  padding: 8px 0;
  transition: color 0.25s var(--ease);
}

.link:hover,
.link.router-link-active {
  color: var(--text);
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-self: end;
}

.burger {
  display: none;
}

.sheet {
  display: none;
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 860px) {
  .links {
    display: none;
  }
  .actions .btn {
    display: none;
  }
  .burger {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: var(--text);
    background: var(--raised);
    box-shadow: var(--soft-raised-sm);
  }
  .bar {
    grid-template-columns: 1fr auto;
  }
  .sheet {
    display: grid;
    gap: 4px;
    padding: 8px 28px 28px;
  }
  .sheet a:not(.btn) {
    padding: 14px 0;
    font-size: 0.86rem;
    color: var(--text-soft);
    border-bottom: 1px solid var(--line);
  }
  .sheet .btn {
    margin-top: 18px;
    justify-self: start;
  }
}
</style>
