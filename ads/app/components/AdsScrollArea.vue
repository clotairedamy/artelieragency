<script setup lang="ts">
// A box that scrolls. Scrollbars are hidden site-wide, so the area carries its
// own cue: whichever edge still has content behind it fades out, and the fade
// goes away once you reach that end. It is a labelled, focusable region, so
// the keyboard can scroll it as well.
const props = withDefaults(defineProps<{ label: string; height?: string; axis?: 'y' | 'x' | 'both' }>(), {
  height: '',
  axis: 'y',
})
const el = ref<HTMLElement>()
const more = reactive({ top: false, bottom: false, left: false, right: false })
let ro: ResizeObserver | undefined

function measure() {
  const s = el.value
  if (!s) return
  const y = props.axis !== 'x'
  const x = props.axis !== 'y'
  more.top = y && s.scrollTop > 1
  more.bottom = y && s.scrollTop + s.clientHeight < s.scrollHeight - 1
  more.left = x && s.scrollLeft > 1
  more.right = x && s.scrollLeft + s.clientWidth < s.scrollWidth - 1
}

onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (el.value) {
    ro.observe(el.value)
    for (const c of Array.from(el.value.children)) ro.observe(c)
  }
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div
    ref="el"
    class="ads-scroll-area"
    :class="[
      `is-${axis}`,
      { 'is-more-top': more.top, 'is-more-bottom': more.bottom, 'is-more-left': more.left, 'is-more-right': more.right },
    ]"
    :style="height ? { height } : undefined"
    role="region"
    :aria-label="label"
    tabindex="0"
    @scroll.passive="measure"
  >
    <slot />
  </div>
</template>

<style scoped>
.ads-scroll-area {
  --ads-scroll-area-fade-top: 0px;
  --ads-scroll-area-fade-bottom: 0px;
  --ads-scroll-area-fade-left: 0px;
  --ads-scroll-area-fade-right: 0px;
  overflow: auto;
  border-radius: var(--radius-sm);
  mask-image:
    linear-gradient(
      to bottom,
      transparent 0,
      #000 var(--ads-scroll-area-fade-top),
      #000 calc(100% - var(--ads-scroll-area-fade-bottom)),
      transparent 100%
    ),
    linear-gradient(
      to right,
      transparent 0,
      #000 var(--ads-scroll-area-fade-left),
      #000 calc(100% - var(--ads-scroll-area-fade-right)),
      transparent 100%
    );
  mask-composite: intersect;
}

.ads-scroll-area.is-y {
  overflow-x: hidden;
}

.ads-scroll-area.is-x {
  overflow-y: hidden;
}

.ads-scroll-area.is-more-top {
  --ads-scroll-area-fade-top: var(--sp-6);
}

.ads-scroll-area.is-more-bottom {
  --ads-scroll-area-fade-bottom: var(--sp-6);
}

.ads-scroll-area.is-more-left {
  --ads-scroll-area-fade-left: var(--sp-6);
}

.ads-scroll-area.is-more-right {
  --ads-scroll-area-fade-right: var(--sp-6);
}
</style>
