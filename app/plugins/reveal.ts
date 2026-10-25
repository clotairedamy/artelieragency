// A `v-reveal` directive: the element fades and rises once, the first time it
// scrolls into view. One shared observer rather than one per element, and it
// stops observing as soon as an element has shown, so a long page does not
// carry a hundred live callbacks.
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  const ensure = () => {
    if (observer) return observer
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('in')
          observer!.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      el.setAttribute('data-reveal', '')
      // Reduced motion is handled in CSS, but there is no sense in running an
      // observer whose only job is to add a class that does nothing.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('in')
        return
      }
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`
      ensure().observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
