<script setup lang="ts">
// A banner: a condition that persists, and stays until it is resolved — the
// place for an error the reader must act on, which a toast would carry away
// before it was read. `tone` is a closed set. The glyph and a short word carry
// the state, so it survives without its colour; colour is spent only on the
// glyph, and only for `warn` and `bad`. An error is announced as an alert;
// anything else waits its turn.
type Tone = 'info' | 'warn' | 'bad'

const props = withDefaults(defineProps<{ text: string; tone?: Tone; icon?: string }>(), {
  tone: 'info',
  icon: undefined,
})

const GLYPH: Record<Tone, string> = { info: 'signal', warn: 'alert', bad: 'alert' }
const WORD: Record<Tone, string> = { info: '', warn: 'Warning', bad: 'Action needed' }
const glyph = computed(() => props.icon ?? GLYPH[props.tone])
</script>

<template>
  <div class="ads-banner" :role="tone === 'bad' ? 'alert' : 'status'">
    <span class="glyph ads-banner__glyph" :class="`is-${tone}`"><Icon :name="glyph" :size="17" /></span>
    <span class="ads-banner__body">
      <strong v-if="WORD[tone]" class="ads-banner__tone">{{ WORD[tone] }}</strong>
      {{ text }}
    </span>
    <slot name="actions" />
  </div>
</template>

<style scoped>
.ads-banner__body {
  flex: 1;
  min-width: 0;
}

.ads-banner__tone {
  margin-right: var(--sp-2);
  font-weight: 600;
  color: var(--text);
}

.ads-banner .ads-banner__glyph.is-warn {
  color: var(--warn);
}

.ads-banner .ads-banner__glyph.is-bad {
  color: var(--bad);
}
</style>
