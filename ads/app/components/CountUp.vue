<script setup lang="ts">
// Counts up to `to` the first time it scrolls into view. Server-rendered with
// the final value, so the number is right without JavaScript.
const props = withDefaults(defineProps<{ to: number; decimals?: number; duration?: number }>(), { decimals: 0, duration: 1600 })
const el = ref<HTMLElement>()
const value = ref(props.to)

const format = (n: number) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  })

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  value.value = 0
  const io = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    io.disconnect()
    const start = performance.now()
    const duration = props.duration ?? 1600
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      value.value = props.to * (1 - Math.pow(1 - t, 4))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
  io.observe(el.value!)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <span ref="el" class="num">{{ format(value) }}</span>
</template>
