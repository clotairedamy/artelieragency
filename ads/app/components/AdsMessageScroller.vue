<script setup lang="ts">
// A scrollable column that stays pinned to the newest message.
const el = ref<HTMLElement>()
const props = defineProps<{ stick?: boolean }>()

onMounted(() => {
  if (props.stick === false) return
  el.value?.scrollTo({ top: el.value.scrollHeight })
})
</script>

<template>
  <div ref="el" class="scroller"><slot /></div>
</template>

<style scoped>
.scroller {
  display: grid;
  gap: 12px;
  align-content: start;
  overflow-y: auto;
  padding: 4px 2px;
}
</style>
