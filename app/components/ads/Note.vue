<script setup lang="ts">
// The annotation layer.
//
// Wraps a region of the dashboard and, when Explain is on, marks it with a
// number and opens a note saying which ADS component it is and which rule it
// follows. Off, it adds nothing but a wrapper — the dashboard has to be a
// real dashboard first and a teaching aid second, or neither is convincing.
defineProps<{
  n: number
  component: string
  href: string
  rule: string
  on: boolean
}>()
</script>

<template>
  <div class="note-wrap" :class="{ on }">
    <span v-if="on" class="pin num" aria-hidden="true">{{ n }}</span>
    <slot />
    <Transition name="note">
      <aside v-if="on" class="note">
        <div class="note-head">
          <span class="num pin-inline">{{ n }}</span>
          <NuxtLink class="note-name" :to="`/design-system${href}`">
            {{ component }}
            <Icon name="arrow" :size="13" />
          </NuxtLink>
        </div>
        <p>{{ rule }}</p>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.note-wrap {
  position: relative;
  display: grid;
  gap: 10px;
}

/* The highlight is a ring rather than a fill: the region underneath still
   has to be readable while it is being explained. */
.note-wrap.on > :slotted(*) {
  outline: 1px solid var(--line-strong);
  outline-offset: 5px;
  border-radius: var(--radius);
}

.pin {
  position: absolute;
  top: -11px;
  left: -11px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.68rem;
  box-shadow: var(--soft-raised-sm);
}

.note {
  display: grid;
  gap: 7px;
  padding: 13px 15px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm), inset 2px 0 0 var(--accent);
}

.note-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pin-inline {
  font-size: 0.66rem;
  color: var(--subdued);
}

.note-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 0.93rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
  transition: color 0.2s var(--ease);
}

.note-name:hover {
  color: var(--accent);
}

.note p {
  margin: 0;
  max-width: 78ch;
  font-size: 0.85rem;
  color: var(--subdued);
}

.note-enter-active,
.note-leave-active {
  transition:
    opacity 0.28s var(--ease),
    transform 0.28s var(--ease);
}

.note-enter-from,
.note-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
