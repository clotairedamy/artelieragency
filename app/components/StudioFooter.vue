<script setup lang="ts">
// The kit's footer with the studio's own links, credited to Clotaire. The kit owns the
// shape; the site only says where things are.
const { studio } = useAppConfig()

const links = [
  { to: '/dashboard-example', label: 'Dashboard example' },
  { to: '/design-system', label: 'Design system' },
  { to: '/ui-kit', label: 'UI Kit' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
]
</script>

<template>
  <SiteFooter :links="links" :domain="studio.domain" :owner="studio.owner.name" :owner-href="studio.owner.href" />
</template>
