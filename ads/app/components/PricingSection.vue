<script setup lang="ts">
// Pricing cards. The recommended plan is told apart by depth and value, never
// by a border or a hue: it stands further off the page, its figure is the
// brightest, and its button carries the one accent. Only the first plan
// marked `featured` gets that treatment — two recommended plans recommend
// nothing, and two accent buttons side by side cancel out.
export type Plan = {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
}

const props = withDefaults(defineProps<{ plans: Plan[]; featuredLabel?: string }>(), { featuredLabel: 'Recommended' })
const emit = defineEmits<{ (e: 'select', plan: Plan): void }>()

const featured = computed(() => props.plans.findIndex((p) => p.featured))
</script>

<template>
  <div class="ads-pricing-section">
    <article
      v-for="(p, i) in plans"
      :key="p.name"
      class="card ads-pricing-section__plan"
      :class="{ 'is-featured': i === featured }"
    >
      <span v-if="i === featured" class="ads-pricing-section__flag">{{ featuredLabel }}</span>
      <h3 class="ads-pricing-section__name">{{ p.name }}</h3>
      <p class="ads-pricing-section__price">
        <span class="ads-pricing-section__amount num">{{ p.price }}</span>
        <span v-if="p.period" class="ads-pricing-section__period">{{ p.period }}</span>
      </p>
      <p class="ads-pricing-section__desc">{{ p.description }}</p>
      <ul class="ads-pricing-section__features" role="list">
        <li v-for="f in p.features" :key="f" class="ads-pricing-section__feature">
          <Icon name="check" :size="15" class="ads-pricing-section__tick" />{{ f }}
        </li>
      </ul>
      <button type="button" class="btn" :class="{ 'btn-accent': i === featured }" @click="emit('select', p)">
        {{ p.cta }}
      </button>
    </article>
  </div>
</template>

<style scoped>
.ads-pricing-section {
  display: grid;
  gap: var(--gutter);
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  align-items: start;
}

.ads-pricing-section__plan {
  position: relative;
  display: grid;
  gap: var(--sp-3);
  justify-items: start;
}

.ads-pricing-section__plan.is-featured {
  box-shadow: var(--soft-raised-lg);
}

.ads-pricing-section__flag {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  font-family: var(--font-label);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.ads-pricing-section__name {
  font-size: 1.05rem;
}

.ads-pricing-section__price {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
}

/* Value carries the recommendation: every other figure sits a step down. */
.ads-pricing-section__amount {
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--text-soft);
}

.ads-pricing-section__plan.is-featured .ads-pricing-section__amount {
  color: var(--text);
}

.ads-pricing-section__period {
  color: var(--subdued);
  font-size: 0.85rem;
}

.ads-pricing-section__desc {
  color: var(--subdued);
  font-size: 0.9rem;
}

.ads-pricing-section__features {
  display: grid;
  gap: var(--sp-2);
  margin: var(--sp-2) 0;
  padding: 0;
  list-style: none;
  font-size: 0.88rem;
  color: var(--text-soft);
}

.ads-pricing-section__feature {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: var(--sp-2);
}

.ads-pricing-section__tick {
  margin-top: 2px;
  color: var(--text);
}
</style>
