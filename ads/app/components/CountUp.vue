<script setup lang="ts">
// Counts up to `to` the first time it scrolls into view — once, as an
// arrival, never again. Server-rendered with the final value, so the number is
// right without JavaScript, and a reader who asks for less motion only ever
// sees the final value. When `to` changes later the figure is simply set:
// a value that re-animates on every update is a slot machine, not a reading.
// Assistive tech is given the final value and never the frames in between.
const props = withDefaults(defineProps<{ to: number; decimals?: number; duration?: number }>(), { decimals: 0, duration: 1600 })
const el = ref<HTMLElement>()
const value = ref(props.to)
let counting = false

const format = (n: number) =>
  n.toLocaleString('en-GB', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  })

watch(
  () => props.to,
  (to) => {
    counting = false
    value.value = to
  },
)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  value.value = 0
  counting = true
  const io = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    io.disconnect()
    const start = performance.now()
    const step = (now: number) => {
      if (!counting) return
      const t = Math.min(1, (now - start) / props.duration)
      value.value = props.to * (1 - Math.pow(1 - t, 4))
      if (t < 1) requestAnimationFrame(step)
      else counting = false
    }
    requestAnimationFrame(step)
  })
  io.observe(el.value!)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <span ref="el" class="ads-count-up num"><span aria-hidden="true">{{ format(value) }}</span><span class="sr-only">{{ format(to) }}</span></span>
</template>
