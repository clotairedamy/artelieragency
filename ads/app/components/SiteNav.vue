<script setup lang="ts">
// The site navigation: brand left, links in the middle, the theme switch and a
// call to action right. Collapses to a menu button and a sheet on a phone.
//
// The bar sits over every screen, so its CTA is default weight unless asked.
// The hero or the closing band owns the one accent; a sticky bar that spent
// it too would double it on every screen it passes over.
//
// The brand link is the mark plus the Wordmark. When the name is shown, it is
// the link's accessible name; homeLabel names the link only when it is the
// bare mark.
export type NavLink = { to: string; label: string }

const props = withDefaults(
  defineProps<{ links?: NavLink[]; ctaTo?: string; ctaLabel?: string; ctaAccent?: boolean; homeLabel?: string; brandName?: string }>(),
  {
    links: () => [
      { to: '/', label: 'Overview' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/contact', label: 'Contact' },
    ],
    ctaTo: '/contact',
    ctaLabel: 'Start a project',
    ctaAccent: false,
    homeLabel: 'Home',
    brandName: 'Artelier',
  },
)

const route = useRoute()
const sheet = useMenuSheet()
const sheetId = useId()
const burger = ref<HTMLButtonElement>()
const sheetEl = ref<HTMLElement>()

watch(() => route.path, () => (sheet.value = false))

// Opening moves focus into the sheet; Escape closes it and hands focus back
// to the button that opened it, so a keyboard reader never loses their place.
watch(sheet, async (open) => {
  if (!open) return
  await nextTick()
  sheetEl.value?.querySelector<HTMLElement>('a')?.focus()
})

function close(returnFocus = true) {
  if (!sheet.value) return
  sheet.value = false
  if (returnFocus) burger.value?.focus()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && sheet.value) close()
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

const ctaClass = computed(() => (props.ctaAccent ? 'btn btn-accent' : 'btn'))
</script>

<template>
  <header class="ads-site-nav">
    <div class="ads-site-nav__bar max">
      <NuxtLink to="/" class="ads-site-nav__brand" :aria-label="brandName ? undefined : homeLabel">
        <BrandMark :size="28" /><Wordmark v-if="brandName" :text="brandName" />
      </NuxtLink>

      <nav class="ads-site-nav__links" aria-label="Main">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="ads-site-nav__link" active-class="is-active">
          {{ l.label }}
        </NuxtLink>
      </nav>

      <div class="ads-site-nav__actions">
        <AdsThemeToggle />
        <NuxtLink v-if="ctaTo" :to="ctaTo" :class="[ctaClass, 'btn-sm ads-site-nav__cta']">{{ ctaLabel }}</NuxtLink>
        <button
          ref="burger"
          class="ads-site-nav__burger"
          type="button"
          :aria-expanded="sheet"
          :aria-controls="sheetId"
          aria-label="Menu"
          @click="sheet = !sheet"
        >
          <Icon :name="sheet ? 'plus' : 'grid'" :size="18" class="ads-site-nav__burger-glyph" :class="{ 'is-open': sheet }" />
        </button>
      </div>
    </div>

    <Transition name="ads-site-nav__drop">
      <nav v-if="sheet" :id="sheetId" ref="sheetEl" class="ads-site-nav__sheet" aria-label="Main">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="ads-site-nav__sheet-link"
          active-class="is-active"
          @click="close(false)"
        >
          {{ l.label }}
        </NuxtLink>
        <NuxtLink v-if="ctaTo" :to="ctaTo" :class="[ctaClass, 'ads-site-nav__sheet-cta']" @click="close(false)">
          {{ ctaLabel }}
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.ads-site-nav {
  position: sticky;
  top: 0;
  z-index: 60;
  background: color-mix(in srgb, var(--canvas) 82%, transparent);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  box-shadow: 0 1px 0 var(--line);
}

.ads-site-nav__bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--sp-5);
  height: var(--sp-8);
  padding: 0 clamp(20px, 4vw, 48px);
}

.ads-site-nav__brand {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--text);
  text-decoration: none;
}

.ads-site-nav__links {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
}

.ads-site-nav__link {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-soft);
  padding: var(--sp-2) 0;
  transition: color var(--dur-control) var(--ease);
}

.ads-site-nav__link:hover,
.ads-site-nav__link.is-active {
  color: var(--text);
}

.ads-site-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  justify-self: end;
}

.ads-site-nav__burger,
.ads-site-nav__sheet {
  display: none;
}

.ads-site-nav__burger-glyph {
  transition: rotate var(--dur-control) var(--ease);
}

/* The plus turned a quarter is the close cross; the glyph set has no x. */
.ads-site-nav__burger-glyph.is-open {
  rotate: 45deg;
}

.ads-site-nav__drop-enter-active,
.ads-site-nav__drop-leave-active {
  transition:
    opacity var(--dur-move) var(--ease),
    transform var(--dur-move) var(--ease);
}

.ads-site-nav__drop-enter-from,
.ads-site-nav__drop-leave-to {
  opacity: 0;
  transform: translateY(calc(-1 * var(--sp-2)));
}

@media (max-width: 860px) {
  .ads-site-nav__links,
  .ads-site-nav__cta {
    display: none;
  }
  .ads-site-nav__bar {
    grid-template-columns: 1fr auto;
  }
  /* Pressed in while the sheet is open: the shadow inversion says "on". */
  .ads-site-nav__burger {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--pill);
    color: var(--text);
    background: var(--raised);
    box-shadow: var(--soft-raised-sm);
    transition: box-shadow var(--dur-control) var(--ease);
  }
  .ads-site-nav__burger:active,
  .ads-site-nav__burger[aria-expanded='true'] {
    box-shadow: var(--soft-inset-sm);
  }
  .ads-site-nav__sheet {
    display: grid;
    gap: var(--sp-1);
    padding: var(--sp-2) clamp(20px, 4vw, 48px) var(--sp-6);
  }
  .ads-site-nav__sheet-link {
    padding: var(--sp-3) 0;
    font-size: 0.86rem;
    color: var(--text-soft);
    border-bottom: 1px solid var(--line);
  }
  .ads-site-nav__sheet-link.is-active {
    color: var(--text);
  }
  .ads-site-nav__sheet-cta {
    margin-top: var(--sp-4);
    justify-self: start;
  }
}
</style>
