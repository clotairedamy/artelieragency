<script setup lang="ts">
// The decision before the component: pick the chart form from the job, not
// from a gallery. Most bad charts are the wrong shape, not the wrong colour.
//
// The table is styled through its own classes rather than bare `table`/`td`
// selectors, so de-scoped into the Rust kit's one sheet it styles this table
// and no other.
export type ChartChoiceRow = [job: string, form: string, decides: string]

withDefaults(defineProps<{ rows?: ChartChoiceRow[] }>(), {
  rows: () => [
    ['Change over time', 'Line, or a sparkline beside the figure', 'Minimal grid; label the first and last value, never every point'],
    ['Comparing categories', 'Horizontal bars, ordered by value', 'Never a pie — angle is the hardest encoding to compare'],
    ['One headline number', 'Stat tile with a delta', 'A figure with no comparison is trivia; pair it with a target or a prior period'],
    ['Part of a whole', 'Stacked bar, or just the percentage', 'Two or three parts at most, or it becomes a pie lying down'],
    ['Distribution', 'Histogram or box plot', 'An average hides the shape; show the spread where the spread is the point'],
    ['Density over two axes', 'Heatmap', 'Luminance steps for magnitude — the channel the eye reads fastest'],
    ['Progress to a target', 'Meter with a threshold mark', 'The mark is the component; without it the fill means nothing'],
    ['Relationship', 'Scatter', 'Three series maximum — any two marks can sit side by side'],
  ],
})
</script>

<template>
  <div class="ads-chart-choice">
    <table class="ads-chart-choice__table">
      <caption class="sr-only">Choosing a chart form from the data's job</caption>
      <thead>
        <tr>
          <th scope="col" class="ads-chart-choice__th">The data's job</th>
          <th scope="col" class="ads-chart-choice__th">Form</th>
          <th scope="col" class="ads-chart-choice__th">What decides it</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[0]">
          <th scope="row" class="ads-chart-choice__td ads-chart-choice__job">{{ row[0] }}</th>
          <td class="ads-chart-choice__td">{{ row[1] }}</td>
          <td class="ads-chart-choice__td ads-chart-choice__decides">{{ row[2] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ads-chart-choice {
  width: 100%;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  padding: var(--sp-2) var(--sp-4);
  overflow-x: auto;
}

.ads-chart-choice__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 560px;
}

.ads-chart-choice__th {
  text-align: left;
  font-family: var(--font-label);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subdued);
  font-weight: 500;
  padding: 10px var(--sp-3);
  border-bottom: 1px solid var(--line);
}

.ads-chart-choice__td {
  text-align: left;
  font-weight: inherit;
  padding: 9px var(--sp-3);
  border-bottom: 1px solid var(--line);
  vertical-align: top;
  color: var(--text-soft);
}

.ads-chart-choice__job {
  color: var(--text);
  white-space: nowrap;
}

.ads-chart-choice__decides {
  color: var(--subdued);
}
</style>
