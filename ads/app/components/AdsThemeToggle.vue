<script setup lang="ts">
// The theme switch. One glyph that changes shape rather than two icons that
// swap: the sun's rays draw in, and a second disc slides across the body to
// carve it into a crescent. The new theme spreads out from the button — from
// its centre, so a keyboard press starts in the same place as a click.
const { theme, toggle } = useTheme()
const dark = computed(() => theme.value === 'dark')
// Two toggles can be on screen at once (app bar and menu sheet).
const mask = `ads-theme-moon-${useId().replace(/\W/g, '')}`

function onClick(e: MouseEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
}
</script>

<template>
  <button
    class="ads-theme-toggle"
    :class="{ 'is-dark': dark }"
    type="button"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="dark ? 'Light theme' : 'Dark theme'"
    @click="onClick"
  >
    <svg class="ads-theme-toggle__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <mask :id="mask">
        <rect width="24" height="24" fill="#fff" />
        <circle class="ads-theme-toggle__bite" cx="24" cy="2" r="7" fill="#000" />
      </mask>
      <circle class="ads-theme-toggle__body" cx="12" cy="12" r="5" fill="currentColor" :mask="`url(#${mask})`" />
      <g class="ads-theme-toggle__rays" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </g>
    </svg>
  </button>
</template>

<style scoped>
.ads-theme-toggle {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  color: var(--text);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  transition:
    box-shadow var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease);
}

.ads-theme-toggle:active {
  box-shadow: var(--soft-inset-sm);
  transform: translateY(1px);
}

.ads-theme-toggle__svg {
  overflow: visible;
  transition: transform var(--dur-move) var(--ease);
}

.ads-theme-toggle__body {
  transform-origin: 12px 12px;
  transition: r var(--dur-move) var(--ease);
}

.ads-theme-toggle__bite {
  transition:
    cx var(--dur-move) var(--ease),
    cy var(--dur-move) var(--ease);
}

.ads-theme-toggle__rays {
  transform-origin: 12px 12px;
  transition:
    opacity var(--dur-control) var(--ease),
    transform var(--dur-move) var(--ease);
}

.ads-theme-toggle.is-dark .ads-theme-toggle__svg {
  transform: rotate(-40deg);
}

.ads-theme-toggle.is-dark .ads-theme-toggle__body {
  r: 8px;
}

.ads-theme-toggle.is-dark .ads-theme-toggle__bite {
  cx: 17px;
  cy: 8px;
}

.ads-theme-toggle.is-dark .ads-theme-toggle__rays {
  opacity: 0;
  transform: scale(0.5) rotate(45deg);
}

@media (prefers-reduced-motion: reduce) {
  .ads-theme-toggle__svg,
  .ads-theme-toggle__body,
  .ads-theme-toggle__bite,
  .ads-theme-toggle__rays {
    transition: none;
  }
}
</style>
