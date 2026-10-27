// Facts about the studio and its navigation. The dashboard shell, command
// palette and mobile nav read these the same way.
export default defineAppConfig({
  studio: {
    name: 'Artelier',
    domain: 'artelier.agency',
    email: 'studio@artelier.agency',
    tagline: 'A dashboard and data-UI studio.',
    promise: 'We design the dashboard your users live in.',
  },
  // `rail` also lists a page in the foot of the desktop rail.
  pages: [
    { to: '/', label: 'Home', short: 'Home', icon: 'dashboard' },
    { to: '/dashboard-example', label: 'Dashboard example', short: 'Example', icon: 'chart', rail: true },
    { to: '/design-system', label: 'Design system', short: 'System', icon: 'system', rail: true },
    { to: '/ui-kit', label: 'UI Kit', short: 'UI Kit', icon: 'layers', rail: true },
    { to: '/contact', label: 'Start a project', short: 'Contact', icon: 'mail' },
  ],
  nav: [
    { id: 'overview', label: 'Overview', short: 'Overview', icon: 'dashboard', tab: true },
    { id: 'problem', label: 'The problem', short: 'Problem', icon: 'alert' },
    { id: 'services', label: 'What we do', short: 'Services', icon: 'blueprint', tab: true },
    { id: 'process', label: 'Process', short: 'Process', icon: 'growth', tab: true },
    { id: 'principles', label: 'Principles', short: 'Rules', icon: 'compass' },
  ],
})
