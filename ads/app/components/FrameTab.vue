<script setup lang="ts">
// The frame tab: the selected rail item, cut from the frame's own surface and
// reaching into the rail with concave fillets, so rail and content read as one
// piece of material. Used once, for the single selected destination.
defineProps<{ items: string[]; active: number }>()
</script>

<template>
  <div class="seam">
    <div class="rail">
      <span v-for="(item, i) in items" :key="item" class="row" :class="{ 'is-on': i === active }">
        <span v-if="i === active" class="tab"><i class="fillet top" /><i class="fillet bottom" /></span>
        <span class="label">{{ item }}</span>
      </span>
    </div>
    <div class="frame"><slot>Content</slot></div>
  </div>
</template>

<style scoped>
.seam {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  min-height: 170px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--rail);
  width: 100%;
}

.rail {
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 14px 0;
  position: relative;
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: 18px;
  font-size: 0.88rem;
  color: var(--subdued);
}

.row.is-on {
  color: var(--text);
  font-weight: 600;
}

.label {
  position: relative;
  z-index: 1;
}

.tab {
  position: absolute;
  inset: 0 -2px 0 8px;
  border-radius: 16px 0 0 16px;
  background: var(--surface);
}

.fillet {
  position: absolute;
  right: 0;
  width: 12px;
  height: 12px;
}

.fillet.top {
  top: -12px;
  background: radial-gradient(circle 12px at top left, transparent 12px, var(--surface) 12px);
}

.fillet.bottom {
  bottom: -12px;
  background: radial-gradient(circle 12px at bottom left, transparent 12px, var(--surface) 12px);
}

.frame {
  display: grid;
  place-items: center;
  padding: 20px;
  background: var(--surface);
  border-radius: 0;
  color: var(--subdued);
  font-size: 0.9rem;
}
</style>
