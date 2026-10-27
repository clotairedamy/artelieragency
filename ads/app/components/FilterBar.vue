<script setup lang="ts">
// One row, above the data, holding every control that changes what is shown.
// Saved views turn a repeated set of filters into a named thing a team can
// share. Serialise the whole bar into the URL, so a view can be bookmarked.
//
// Every control is named: the search field by `searchLabel` (its placeholder
// is an example, never the label), the segmented control by `segmentsLabel`.
// Each saved view is a tag, and a tag is removable — that is what a tag means.
withDefaults(
  defineProps<{
    placeholder?: string
    searchLabel?: string
    tags?: string[]
    segments?: string[]
    segment?: string
    segmentsLabel?: string
    from?: string
    to?: string
  }>(),
  {
    placeholder: 'Filter by URL…',
    searchLabel: 'Filter by URL',
    tags: () => [],
    segments: () => ['All', '2xx', '4xx'],
    segment: 'All',
    segmentsLabel: 'Status',
    from: '30d',
    to: 'now',
  },
)

const query = defineModel<string>('query', { default: '' })

const emit = defineEmits<{ (e: 'update:segment', v: string): void; (e: 'remove-tag', v: string): void; (e: 'save'): void }>()
</script>

<template>
  <div class="ads-filter-bar stack gap-3">
    <div class="ads-filter-bar__controls">
      <div class="ads-search">
        <Icon name="compass" :size="16" />
        <input v-model="query" class="ads-field" type="search" :placeholder="placeholder" :aria-label="searchLabel" />
      </div>
      <div class="ads-daterange">
        <span class="num">{{ from }}</span><span class="sep" aria-hidden="true">→</span><span class="sr-only"> to </span><span class="num">{{ to }}</span>
      </div>
      <div class="ads-segmented" role="group" :aria-label="segmentsLabel">
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

    <div class="ads-filter-bar__saved">
      <span class="ads-label">Saved</span>
      <AdsTag v-for="t in tags" :key="t" :label="t" @remove="emit('remove-tag', t)" />
      <button class="btn btn-quiet" type="button" @click="emit('save')">
        <Icon name="plus" :size="15" />Save this view
      </button>
    </div>
  </div>
</template>

<style scoped>
.ads-filter-bar__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  align-items: center;
}

.ads-filter-bar__controls .ads-search {
  flex: 1;
  min-width: 200px;
}

.ads-filter-bar__saved {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-2);
}
</style>
