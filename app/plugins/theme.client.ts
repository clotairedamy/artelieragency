// Reads the theme the head script already applied. After hydration, not
// before: the server rendered every toggle in the light state, and changing
// the state first would make the client's first render disagree with that
// markup. Suspense resolving is the point the async layout and page have
// hydrated too; updating then just re-renders the toggles.
export default defineNuxtPlugin((nuxtApp) => {
  const theme = useState<Theme>('theme', () => 'light')
  nuxtApp.hook('app:suspense:resolve', () => {
    theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  })
})
