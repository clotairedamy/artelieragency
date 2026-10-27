// The docs navigation — two kits (Vue and Rust), each with the same categories.
export default defineAppConfig({
  docs: {
    kits: [
      {
        to: '/vue',
        label: 'Artelier Vue',
        icon: 'system',
        categories: [
          { to: '/components', label: 'All components', icon: 'grid' },
          { to: '/surfaces', label: 'Surfaces', icon: 'compass' },
          { to: '/actions', label: 'Actions', icon: 'plus' },
          { to: '/inputs', label: 'Inputs', icon: 'sliders' },
          { to: '/data-display', label: 'Data display', icon: 'chart' },
          { to: '/disclosure', label: 'Disclosure', icon: 'flow' },
          { to: '/navigation', label: 'Navigation', icon: 'arrow' },
          { to: '/feedback', label: 'Feedback', icon: 'alert' },
          { to: '/patterns', label: 'Patterns', icon: 'check' },
          { to: '/elements', label: 'Elements', icon: 'spark' },
          { to: '/sections', label: 'Page sections', icon: 'layers' },
          { to: '/docs', label: 'Docs', icon: 'code' },
        ],
      },
      {
        to: '/rust',
        label: 'Artelier Rust',
        icon: 'engine',
        categories: [
          { to: '/rust/components', label: 'All components', icon: 'grid' },
          { to: '/rust/surfaces', label: 'Surfaces', icon: 'compass' },
          { to: '/rust/actions', label: 'Actions', icon: 'plus' },
          { to: '/rust/inputs', label: 'Inputs', icon: 'sliders' },
          { to: '/rust/data-display', label: 'Data display', icon: 'chart' },
          { to: '/rust/disclosure', label: 'Disclosure', icon: 'flow' },
          { to: '/rust/navigation', label: 'Navigation', icon: 'arrow' },
          { to: '/rust/feedback', label: 'Feedback', icon: 'alert' },
          { to: '/rust/patterns', label: 'Patterns', icon: 'check' },
          { to: '/rust/elements', label: 'Elements', icon: 'spark' },
          { to: '/rust/sections', label: 'Page sections', icon: 'layers' },
          { to: '/rust/docs', label: 'Docs', icon: 'code' },
        ],
      },
    ],
  },
})
