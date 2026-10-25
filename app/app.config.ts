// Everything that is a fact about the studio rather than a fact about a page.
// Kept here so copy changes never mean hunting through components.
export default defineAppConfig({
  studio: {
    name: 'Artelier',
    domain: 'artelier.agency',
    email: 'studio@artelier.agency',
    tagline: 'A dashboard and data-UI studio.',
    // The one sentence the whole site is built to earn.
    promise: 'We design the dashboard your users live in.',
  },
  nav: [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'problem', label: 'The problem', icon: 'alert' },
    { id: 'services', label: 'What we do', icon: 'blueprint' },
    { id: 'lab', label: 'Theme lab', icon: 'theme' },
    { id: 'shelf', label: 'Components', icon: 'system' },
    { id: 'process', label: 'Process', icon: 'ascend' },
    { id: 'principles', label: 'Principles', icon: 'compass' },
  ],
})
