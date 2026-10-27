<script setup lang="ts">
// The UI Kit's place in the app bar, on every page. It is how the studio
// works, shown in the open, so it gets more than a link in the rail, but not
// the accent: that belongs to "Start a project", and one accent per screen is
// the rule the kit itself teaches.
//
// So it earns attention with motion instead. The well beside the name rolls
// through what it covers (Vue, Rust, the MCP server) with the same roll-up the
// breadcrumb uses, so it reads as part of the bar rather than an advert
// dropped into it. It holds still while you point at it, while the tab is
// hidden, and for anyone who asks for less motion, who gets the whole list at
// once instead.
const route = useRoute()
const here = computed(() => route.path === '/ui-kit' || route.path.startsWith('/ui-kit/'))

const words = ['Vue', 'Rust', 'MCP'] as const
const index = ref(0)
const held = ref(false)
const still = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  still.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (still.value) return
  timer = setInterval(() => {
    if (!held.value && !document.hidden) index.value = (index.value + 1) % words.length
  }, 2400)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <NuxtLink
    to="/ui-kit"
    class="ui-kit-launch"
    :class="{ 'is-here': here }"
    :aria-current="here ? 'true' : undefined"
    aria-label="Artelier UI Kit: how the studio builds, in Vue and Rust, with an MCP server"
    @pointerenter="held = true"
    @pointerleave="held = false"
    @focus="held = true"
    @blur="held = false"
  >
    <span class="ui-kit-launch__glyph" aria-hidden="true"><Icon name="layers" :size="15" /></span>
    <span class="ui-kit-launch__name" aria-hidden="true">Artelier <span class="ui-kit-launch__kit">UI Kit</span></span>
    <span class="ui-kit-launch__well" aria-hidden="true">
      <span v-if="still" class="ui-kit-launch__word">{{ words.join(' · ') }}</span>
      <Transition v-else name="ui-kit-launch__roll" mode="out-in">
        <span :key="index" class="ui-kit-launch__word">{{ words[index] }}</span>
      </Transition>
    </span>
  </NuxtLink>
</template>

<style scoped>
/* A raised pill the height of the search well beside it. */
.ui-kit-launch {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--sp-2);
  height: 42px;
  padding: 0 5px 0 6px;
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text);
  transition:
    background var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

/* Hover presses it in, as it is while you are in the kit. */
.ui-kit-launch:hover,
.ui-kit-launch.is-here {
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ui-kit-launch__glyph {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
  transition:
    background var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

/* Pressed in, the glyph's well comes up out of it instead: the depth swaps
   places rather than vanishing. */
.ui-kit-launch:hover .ui-kit-launch__glyph,
.ui-kit-launch.is-here .ui-kit-launch__glyph {
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
}

.ui-kit-launch__name {
  font-size: 0.88rem;
  font-weight: 500;
  white-space: nowrap;
  color: var(--subdued);
}

.ui-kit-launch__kit {
  font-weight: 600;
  color: var(--text);
}

/* The roll. A fixed width, so the pill does not breathe as the words change. */
.ui-kit-launch__well {
  display: inline-grid;
  place-items: center;
  min-width: 52px;
  height: 30px;
  padding: 0 10px;
  overflow: hidden;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ui-kit-launch__word {
  font-family: var(--font-label);
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--text-soft);
}

.ui-kit-launch__roll-enter-active,
.ui-kit-launch__roll-leave-active {
  transition:
    transform var(--dur-control) var(--ease),
    opacity var(--dur-control) var(--ease);
}

.ui-kit-launch__roll-enter-from {
  transform: translateY(70%);
  opacity: 0;
}

.ui-kit-launch__roll-leave-to {
  transform: translateY(-70%);
  opacity: 0;
}

/* Narrower desktops: the name goes, the roll stays — it says the most. */
@media (max-width: 1239px) {
  .ui-kit-launch__name {
    display: none;
  }
}

/* A phone: the glyph alone, beside the search and theme buttons. */
@media (max-width: 899px) {
  .ui-kit-launch {
    padding: 0 5px;
  }

  .ui-kit-launch__well {
    display: none;
  }
}
</style>
