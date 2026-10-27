// Everything that is a fact about the studio rather than a fact about a page.
// Kept here so copy changes never mean hunting through components.
export default defineAppConfig({
  studio: {
    name: 'Artelier',
    domain: 'artelier.agency',
    email: 'studio@artelier.agency',
    // Who is behind the studio, credited in the footer.
    owner: { name: 'Clotaire', href: 'https://clotairedamy.com' },
    tagline: 'A dashboard and data-UI studio.',
    // The one sentence the whole site is built to earn.
    promise: 'We design the dashboard your users live in.',
  },
  // Every page, for the command palette, the phone tab bar and its menu.
  // `rail` also lists a page in the foot of the desktop rail.
  pages: [
    { to: '/', label: 'Home', short: 'Home', icon: 'dashboard' },
    { to: '/dashboard-example', label: 'Dashboard example', short: 'Example', icon: 'chart', rail: true },
    { to: '/design-system', label: 'Design system', short: 'System', icon: 'system', rail: true },
    { to: '/ui-kit', label: 'UI Kit', short: 'UI Kit', icon: 'layers', rail: true },
    { to: '/contact', label: 'Start a project', short: 'Contact', icon: 'mail' },
  ],
  // Sections of the home page. `short` is the phone tab bar's label, and
  // `tab` puts a section in the bar itself rather than behind More.
  nav: [
    { id: 'overview', label: 'Overview', short: 'Overview', icon: 'dashboard', tab: true },
    { id: 'problem', label: 'The problem', short: 'Problem', icon: 'alert' },
    { id: 'services', label: 'What we do', short: 'Services', icon: 'blueprint', tab: true },
    { id: 'lab', label: 'Theme lab', short: 'Theme', icon: 'theme' },
    { id: 'shelf', label: 'Components', short: 'Charts', icon: 'system', tab: true },
    { id: 'process', label: 'Process', short: 'Process', icon: 'growth', tab: true },
    { id: 'principles', label: 'Principles', short: 'Rules', icon: 'compass' },
  ],
})
