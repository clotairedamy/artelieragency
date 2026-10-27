<script setup lang="ts">
// One row, above the data, holding every control that changes what is shown.
// Saved views turn a repeated set of filters into a named thing a team can
// share. Serialise the whole bar into the URL, so a view can be bookmarked.
withDefaults(
  defineProps<{
    placeholder?: string
    tags?: string[]
    segments?: string[]
    segment?: string
    from?: string
    to?: string
  }>(),
  { placeholder: 'Filter by URL…', tags: () => [], segments: () => ['All', '2xx', '4xx'], segment: 'All', from: '30d', to: 'now' },
)

const emit = defineEmits<{ (e: 'update:segment', v: string): void; (e: 'remove-tag', v: string): void; (e: 'save'): void }>()
</script>

<template>
  <div class="stack gap-3">
    <div class="bar">
      <div class="ads-search">
        <Icon name="compass" :size="16" />
        <input class="ads-field" type="search" :placeholder="placeholder" aria-label="Filter" />
      </div>
      <div class="ads-daterange">
        <span class="num">{{ from }}</span><span class="sep">→</span><span class="num">{{ to }}</span>
      </div>
      <div class="ads-segmented" role="group" aria-label="Status">
        <button
          v-for="s in segments"
          :key="s"
          type="button"
          :class="{ 'is-on': segment === s }"
          :aria-pressed="segment === s"
          @click="emit('update:segment', s)"
        >{{ s }}</button>
      </div>
    </div>

    <div class="saved">
      <span class="ads-label">Saved</span>
      <AdsTag v-for="t in tags" :key="t" :label="t" @remove="emit('remove-tag', t)" />
      <button class="btn btn-quiet" type="button" @click="emit('save')">
        <Icon name="plus" :size="15" />Save this view
      </button>
    </div>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.bar .ads-search {
  flex: 1;
  min-width: 200px;
}

.saved {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
