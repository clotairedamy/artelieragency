<script setup lang="ts">
// The docs shell, in the Artelier shape: a rail on the left, the page on a
// raised frame, and an app bar along the top. The rail's selected row is a
// tab cut from the frame's own surface.
const { docs } = useAppConfig()
const route = useRoute()
const mobileOpen = ref(false)

const kit = computed(() => (route.path.startsWith('/rust') ? 'rust' : 'vue'))
const activeKit = computed(() => docs.kits.find((k) => k.to === `/${kit.value}`) ?? docs.kits[0])
const activeIndex = computed(() => Math.max(0, activeKit.value.categories.findIndex((c) => route.path === c.to)))
const where = computed(() => activeKit.value.categories[activeIndex.value]?.label ?? activeKit.value.label)

watch(() => route.fullPath, () => (mobileOpen.value = false))
</script>

<template>
  <div class="shell">
    <aside class="rail">
      <NuxtLink to="/vue" class="rail-brand" aria-label="Artelier Design System">
        <BrandMark :size="44" class="mark" />
        <span class="wordmark">Artelier</span>
      </NuxtLink>

      <hr class="rule">

      <nav class="rail-nav" aria-label="Components">
        <span class="tab" :style="{ transform: `translateY(${activeIndex * 56}px)` }" aria-hidden="true">
          <span class="fillet fillet-top" />
          <span class="fillet fillet-bottom" />
        </span>

        <NuxtLink
          v-for="(c, i) in activeKit.categories"
          :key="c.to"
          :to="c.to"
          class="nav-item"
          :class="{ 'is-active': i === activeIndex }"
        >
          <span class="tile"><Icon :name="c.icon" :size="20" /></span>
          <span class="label">{{ c.label }}</span>
        </NuxtLink>
      </nav>

      <div class="rail-foot">
        <a class="nav-item" href="https://artelier.agency/design-system" target="_blank" rel="noopener">
          <span class="tile"><Icon name="layers" :size="20" /></span>
          <span class="label">Design system</span>
        </a>
      </div>
    </aside>

    <main class="panel">
      <header class="appbar">
        <div class="crumbs">
          <span class="crumb-root">{{ activeKit.label }}</span>
          <span class="crumb-sep" aria-hidden="true">/</span>
          <span class="crumb-here">{{ where }}</span>
        </div>

        <div class="appbar-tools">
          <div class="kit-switch" role="tablist" aria-label="Kit">
            <NuxtLink v-for="k in docs.kits" :key="k.to" :to="k.to" class="kit-btn" :class="{ on: kit === (k.to === '/rust' ? 'rust' : 'vue') }">
              {{ k.to === '/rust' ? 'Rust' : 'Vue' }}
            </NuxtLink>
          </div>
          <AdsThemeToggle />
          <button type="button" class="burger" :aria-expanded="mobileOpen" aria-label="Menu" @click="mobileOpen = true">
            <Icon name="grid" :size="18" />
          </button>
        </div>
      </header>

      <div class="content">
        <NuxtPage />
      </div>
    </main>

    <!-- Mobile sheet -->
    <div v-if="mobileOpen" class="m-nav" @click.self="mobileOpen = false">
      <div class="m-sheet">
        <header class="m-head">
          <NuxtLink to="/vue" class="m-brand" @click="mobileOpen = false">
            <BrandMark :size="30" />
            <span class="m-title">Artelier</span>
          </NuxtLink>
          <button type="button" class="m-close" aria-label="Close" @click="mobileOpen = false">×</button>
        </header>
        <div class="m-kits">
          <NuxtLink v-for="k in docs.kits" :key="k.to" :to="k.to" class="m-kit" :class="{ on: kit === (k.to === '/rust' ? 'rust' : 'vue') }">
            {{ k.to === '/rust' ? 'Rust' : 'Vue' }}
          </NuxtLink>
        </div>
        <nav class="m-cats" aria-label="Components">
          <NuxtLink v-for="c in activeKit.categories" :key="c.to" :to="c.to" class="m-cat" :class="{ on: route.path === c.to }">
            <Icon :name="c.icon" :size="16" />
            <span>{{ c.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </div>

    <AdsToastHost />
  </div>
</template>

<style scoped>
.shell {
  --w: var(--rail-w);
  --row: 56px;
  min-height: 100vh;
  background: var(--canvas);
}

/* ─── Rail ──────────────────────────────────────────────────────────── */
.rail {
  display: none;
}

@media (min-width: 900px) {
  .rail {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 20;
    width: var(--w);
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 26px 0 18px;
    background: var(--rail);
  }

  .rail-brand {
    display: grid;
    justify-items: center;
    gap: 10px;
    padding: 0 20px;
    color: var(--text);
  }

  .mark {
    display: block;
  }

  .rail-brand .wordmark {
    font-size: 0.72rem;
    letter-spacing: 0.38em;
    text-indent: 0.38em;
    text-transform: uppercase;
    color: var(--subdued);
  }

  .rule {
    height: 1px;
    margin: -4px 20px;
    border: 0;
    background: var(--line-strong);
    opacity: 0.55;
  }

  .rail-nav {
    position: relative;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .rail-foot {
    margin-top: auto;
    display: grid;
    gap: 2px;
  }
}

/* ─── The selected tab ──────────────────────────────────────────────── */
.tab {
  position: absolute;
  top: 0;
  left: 10px;
  right: -2px;
  height: var(--row);
  border-radius: 20px 0 0 20px;
  background: var(--surface);
  transition: transform 0.44s var(--ease);
  will-change: transform;
}

.fillet {
  position: absolute;
  right: 0;
  width: 14px;
  height: 14px;
}

.fillet-top {
  top: -14px;
  background: radial-gradient(circle 14px at top left, transparent 14px, var(--surface) 14px);
}

.fillet-bottom {
  bottom: -14px;
  background: radial-gradient(circle 14px at bottom left, transparent 14px, var(--surface) 14px);
}

/* ─── Nav items ─────────────────────────────────────────────────────── */
.nav-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: var(--row);
  padding-left: 20px;
  color: var(--subdued);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: -0.012em;
  text-align: left;
  transition: color 0.3s var(--ease), font-weight 0.3s var(--ease);
}

.nav-item:hover {
  color: var(--text);
}

.nav-item:hover .tile {
  transform: translateY(-1px);
}

.is-active {
  color: var(--text);
  font-weight: 600;
}

.tile {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 14px;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  transition: background 0.3s var(--ease), color 0.3s var(--ease), box-shadow 0.3s var(--ease), transform 0.3s var(--ease);
}

.is-active .tile {
  background: var(--elevated);
  color: var(--accent);
  box-shadow: var(--soft-raised);
}

/* ─── The panel ─────────────────────────────────────────────────────── */
.panel {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--soft-raised-lg);
  margin: var(--gutter);
  min-height: calc(100vh - var(--gutter) * 2);
  overflow: clip;
}

@media (min-width: 900px) {
  .panel {
    margin: var(--gutter) var(--gutter) var(--gutter) var(--w);
  }
}

/* ─── App bar ───────────────────────────────────────────────────────── */
.appbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 72px;
  padding: 0 clamp(16px, 3vw, 32px);
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
}

.crumbs {
  display: flex;
  align-items: baseline;
  gap: 9px;
  min-width: 0;
  font-size: 0.92rem;
}

.crumb-root {
  color: var(--subdued);
  white-space: nowrap;
}

.crumb-sep {
  color: var(--line-strong);
}

.crumb-here {
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.appbar-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.kit-switch {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.kit-btn {
  padding: 7px 15px;
  border-radius: var(--pill);
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--subdued);
  transition: color 0.2s var(--ease), background 0.2s var(--ease), box-shadow 0.2s var(--ease);
}

.kit-btn.on {
  color: var(--accent-ink);
  background: var(--accent);
  box-shadow: var(--soft-raised-sm);
}

.burger {
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
}

.content {
  padding: clamp(20px, 4vw, 40px);
}

/* ─── Mobile sheet ──────────────────────────────────────────────────── */
.m-nav {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: flex-end;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}

.m-sheet {
  display: grid;
  align-content: start;
  gap: 18px;
  width: min(360px, 92vw);
  height: 100%;
  overflow-y: auto;
  padding: 20px 18px;
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.m-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.m-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.m-title {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text);
}

.m-close {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
  font-size: 1.2rem;
}

.m-kits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.m-kit {
  display: grid;
  place-items: center;
  height: 44px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
  font-size: 0.9rem;
  font-weight: 500;
}

.m-kit.on {
  color: var(--accent-ink);
  background: var(--accent);
  box-shadow: var(--soft-raised-sm);
}

.m-cats {
  display: grid;
  gap: 4px;
}

.m-cat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  font-size: 0.92rem;
}

.m-cat:hover {
  background: var(--hover);
  color: var(--text);
}

.m-cat.on {
  color: var(--accent-ink);
  background: var(--accent);
}

@media (max-width: 900px) {
  .kit-switch {
    display: none;
  }
  .burger {
    display: grid;
  }
}
</style>
