<script setup lang="ts">
// The frame tab: the selected rail item, cut from the frame's own surface and
// reaching into the rail with concave fillets, so rail and content read as one
// piece of material. Used once, for the single selected destination — which is
// why `active` is one index, never a set.
defineProps<{ items: string[]; active: number }>()
</script>

<template>
  <div class="ads-frame-tab">
    <div class="ads-frame-tab__rail">
      <span
        v-for="(item, i) in items"
        :key="item"
        class="ads-frame-tab__row"
        :class="{ 'is-on': i === active }"
        :aria-current="i === active ? 'page' : undefined"
      >
        <span v-if="i === active" class="ads-frame-tab__tab" aria-hidden="true">
          <i class="ads-frame-tab__fillet is-top" /><i class="ads-frame-tab__fillet is-bottom" />
        </span>
        <span class="ads-frame-tab__label">{{ item }}</span>
      </span>
    </div>
    <div class="ads-frame-tab__frame"><slot>Content</slot></div>
  </div>
</template>

<style scoped>
.ads-frame-tab {
  /* The concave corner the tab reaches into the rail with. */
  --fillet: var(--sp-3);
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  min-height: 170px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--rail);
  width: 100%;
}

.ads-frame-tab__rail {
  display: grid;
  align-content: center;
  gap: 2px;
  padding: var(--sp-3) 0;
  position: relative;
}

.ads-frame-tab__row {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: var(--sp-4);
  font-size: 0.88rem;
  color: var(--subdued);
}

.ads-frame-tab__row.is-on {
  color: var(--text);
  font-weight: 600;
}

.ads-frame-tab__label {
  position: relative;
  z-index: 1;
}

.ads-frame-tab__tab {
  position: absolute;
  inset: 0 -2px 0 var(--sp-2);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  background: var(--surface);
}

.ads-frame-tab__fillet {
  position: absolute;
  right: 0;
  width: var(--fillet);
  height: var(--fillet);
}

/* The radial gradients are a mask that cuts the concave corner — shape, not
   decoration, which is the one job a gradient is allowed here. */
.ads-frame-tab__fillet.is-top {
  top: calc(var(--fillet) * -1);
  background: radial-gradient(circle var(--fillet) at top left, transparent var(--fillet), var(--surface) var(--fillet));
}

.ads-frame-tab__fillet.is-bottom {
  bottom: calc(var(--fillet) * -1);
  background: radial-gradient(circle var(--fillet) at bottom left, transparent var(--fillet), var(--surface) var(--fillet));
}

.ads-frame-tab__frame {
  display: grid;
  place-items: center;
  padding: var(--sp-5);
  background: var(--surface);
  color: var(--subdued);
  font-size: 0.9rem;
}
</style>
