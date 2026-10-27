// The ADS docs/reference app. It extends the layer so every component,
// composable and stylesheet is available, then adds pages that document them.
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  extends: ['..'],
  devtools: { enabled: false },
})
