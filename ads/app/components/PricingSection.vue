<script setup lang="ts">
// Pricing cards. The featured plan gets the accent — the one accent on the
// page, spent where it earns.
export type Plan = {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
}

defineProps<{ plans: Plan[] }>()
const emit = defineEmits<{ (e: 'select', plan: Plan): void }>()
</script>

<template>
  <div class="grid plans">
    <article v-for="p in plans" :key="p.name" class="card plan" :class="{ featured: p.featured }">
      <div v-if="p.featured" class="flag">Most popular</div>
      <h3 class="name">{{ p.name }}</h3>
      <div class="price">
        <span class="amount num">{{ p.price }}</span>
        <span v-if="p.period" class="period">{{ p.period }}</span>
      </div>
      <p class="desc">{{ p.description }}</p>
      <ul class="features">
        <li v-for="f in p.features" :key="f">{{ f }}</li>
      </ul>
      <button type="button" class="btn" :class="p.featured ? 'btn-accent' : ''" @click="emit('select', p)">
        {{ p.cta }}
      </button>
    </article>
  </div>
</template>

<style scoped>
.plans {
  display: grid;
  gap: var(--gutter);
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  align-items: start;
}

.plan {
  position: relative;
  display: grid;
  gap: 14px;
  justify-items: start;
  padding: 28px;
}

.plan.featured {
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
}

.flag {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 3px 10px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  font-family: var(--mono);
  font-size: 0.64rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.name {
  font-size: 1.05rem;
  font-weight: 540;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.amount {
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: -0.03em;
}

.period {
  color: var(--subdued);
  font-size: 0.85rem;
}

.desc {
  color: var(--subdued);
  font-size: 0.9rem;
}

.features {
  display: grid;
  gap: 8px;
  margin: 8px 0;
  padding: 0;
  list-style: none;
  font-size: 0.88rem;
  color: var(--text-soft);
}

.features li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 9px;
}

.features li::before {
  content: '✓';
  font-family: var(--mono);
  color: var(--text);
}
</style>
