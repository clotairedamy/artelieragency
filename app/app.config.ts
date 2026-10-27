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
  // The Artelier UI Kit's docs under /ui-kit: the same categories for both
  // kits, so switching kit keeps you on the category you were reading. They
  // fill the rail on those pages; `tab` picks the phone tab bar's three.
  docs: {
    kits: [
      {
        to: '/ui-kit',
        label: 'Vue',
        name: 'Artelier UI Kit for Vue',
        icon: 'system',
        categories: [
          { to: '/ui-kit', label: 'Overview', icon: 'dashboard', tab: true },
          { to: '/ui-kit/mcp', label: 'MCP server', short: 'MCP', icon: 'signal', tab: true },
          { to: '/ui-kit/all', label: 'All components', short: 'All', icon: 'grid', tab: true },
          { to: '/ui-kit/surfaces', label: 'Surfaces', icon: 'compass' },
          { to: '/ui-kit/actions', label: 'Actions', icon: 'plus' },
          { to: '/ui-kit/inputs', label: 'Inputs', icon: 'sliders' },
          { to: '/ui-kit/data-display', label: 'Data display', icon: 'chart' },
          { to: '/ui-kit/disclosure', label: 'Disclosure', icon: 'flow' },
          { to: '/ui-kit/navigation', label: 'Navigation', icon: 'arrow' },
          { to: '/ui-kit/feedback', label: 'Feedback', icon: 'alert' },
          { to: '/ui-kit/patterns', label: 'Patterns', icon: 'check' },
          { to: '/ui-kit/elements', label: 'Elements', icon: 'spark' },
          { to: '/ui-kit/sections', label: 'Page sections', icon: 'layers' },
          { to: '/ui-kit/docs', label: 'Docs', icon: 'code' },
        ],
      },
      {
        to: '/ui-kit/rust',
        label: 'Rust',
        name: 'Artelier UI Kit for Rust',
        icon: 'engine',
        categories: [
          { to: '/ui-kit/rust', label: 'Overview', icon: 'dashboard', tab: true },
          { to: '/ui-kit/rust/mcp', label: 'MCP server', short: 'MCP', icon: 'signal', tab: true },
          { to: '/ui-kit/rust/all', label: 'All components', short: 'All', icon: 'grid', tab: true },
          { to: '/ui-kit/rust/surfaces', label: 'Surfaces', icon: 'compass' },
          { to: '/ui-kit/rust/actions', label: 'Actions', icon: 'plus' },
          { to: '/ui-kit/rust/inputs', label: 'Inputs', icon: 'sliders' },
          { to: '/ui-kit/rust/data-display', label: 'Data display', icon: 'chart' },
          { to: '/ui-kit/rust/disclosure', label: 'Disclosure', icon: 'flow' },
          { to: '/ui-kit/rust/navigation', label: 'Navigation', icon: 'arrow' },
          { to: '/ui-kit/rust/feedback', label: 'Feedback', icon: 'alert' },
          { to: '/ui-kit/rust/patterns', label: 'Patterns', icon: 'check' },
          { to: '/ui-kit/rust/elements', label: 'Elements', icon: 'spark' },
          { to: '/ui-kit/rust/sections', label: 'Page sections', icon: 'layers' },
          { to: '/ui-kit/rust/docs', label: 'Docs', icon: 'code' },
        ],
      },
    ],
  },
})
