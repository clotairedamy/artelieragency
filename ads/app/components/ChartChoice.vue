<script setup lang="ts">
// The decision before the component: pick the chart form from the job, not
// from a gallery. Most bad charts are the wrong shape, not the wrong colour.
export type ChartChoiceRow = [job: string, form: string, decides: string]

withDefaults(defineProps<{ rows?: ChartChoiceRow[] }>(), {
  rows: () => [
    ['Change over time', 'Line, or a sparkline beside the figure', 'Minimal grid; label the first and last value, never every point'],
    ['Comparing categories', 'Horizontal bars, ordered by value', 'Never a pie — angle is the hardest encoding to compare'],
    ['One headline number', 'Stat tile with a delta', 'A figure with no comparison is trivia; pair it with a target or a prior period'],
    ['Part of a whole', 'Stacked bar, or just the percentage', 'Two or three parts at most, or it becomes a pie lying down'],
    ['Distribution', 'Histogram or box plot', 'An average hides the shape; show the spread where the spread is the point'],
    ['Density over two axes', 'Heatmap', 'Opacity for magnitude — the channel the eye reads fastest'],
    ['Progress to a target', 'Meter with a threshold mark', 'The mark is the component; without it the fill means nothing'],
    ['Relationship', 'Scatter', 'Three series maximum — any two marks can sit side by side'],
  ],
})
</script>

<template>
  <div class="choice">
    <table>
      <thead>
        <tr><th>The data's job</th><th>Form</th><th>What decides it</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[0]">
          <td class="job">{{ row[0] }}</td>
          <td class="form">{{ row[1] }}</td>
          <td class="dim">{{ row[2] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.choice {
  width: 100%;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  padding: 8px 16px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 560px;
}

th {
  text-align: left;
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subdued);
  font-weight: 500;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
}

td {
  padding: 9px 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
  color: var(--text-soft);
}

.job {
  color: var(--text);
  white-space: nowrap;
}
</style>
