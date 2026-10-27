<script setup lang="ts">
// A single message in a thread: avatar, name/time, and a bubble.
withDefaults(defineProps<{ name?: string; mine?: boolean; time?: string }>(), { name: '', mine: false, time: '' })
</script>

<template>
  <div class="msg" :class="{ mine }">
    <AdsAvatar v-if="name && !mine" :name="name" :size="32" />
    <div class="msg-col">
      <div v-if="name || time" class="msg-meta">
        <span v-if="name" class="msg-name">{{ name }}</span>
        <time v-if="time" class="msg-time num">{{ time }}</time>
      </div>
      <AdsBubble :mine="mine"><slot /></AdsBubble>
    </div>
  </div>
</template>

<style scoped>
.msg {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.msg.mine {
  justify-content: flex-end;
}

.msg-col {
  display: grid;
  gap: 4px;
  min-width: 0;
  max-width: 80%;
}

.msg.mine .msg-col {
  justify-items: end;
}

.msg-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.msg-name {
  font-size: 0.78rem;
  color: var(--text-soft);
}

.msg-time {
  font-size: 0.68rem;
  color: var(--subdued);
}
</style>
