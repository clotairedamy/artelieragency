<script setup lang="ts">
// One message in a thread. The name sits in the meta line, so the avatar is
// decoration and stays out of the reading order. Your own messages drop the
// avatar and lean right; the time is a figure, so it is set in the data face.
withDefaults(defineProps<{ name?: string; mine?: boolean; time?: string }>(), { name: '', mine: false, time: '' })
</script>

<template>
  <div class="ads-message" :class="{ 'is-mine': mine }">
    <AdsAvatar v-if="name && !mine" :name="name" :size="32" decorative />
    <div class="ads-message__col">
      <div v-if="name || time" class="ads-message__meta">
        <span v-if="name" class="ads-message__name">{{ name }}</span>
        <time v-if="time" class="ads-message__time num">{{ time }}</time>
      </div>
      <AdsBubble :mine="mine"><slot /></AdsBubble>
    </div>
  </div>
</template>

<style scoped>
.ads-message {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
}

.ads-message.is-mine {
  justify-content: flex-end;
}

.ads-message__col {
  display: grid;
  gap: var(--sp-1);
  min-width: 0;
  max-width: 80%;
}

.ads-message.is-mine .ads-message__col {
  justify-items: end;
}

.ads-message__meta {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
}

.ads-message__name {
  font-size: 0.78rem;
  color: var(--text-soft);
}

.ads-message__time {
  font-size: 0.68rem;
  color: var(--subdued);
}
</style>
