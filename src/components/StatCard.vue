<script setup>
// Props keep this summary card reusable across the landing and dashboard pages.
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  detail: { type: String, default: '' },
  icon: { type: String, default: '•' },
  tone: { type: String, default: 'orange' },
})
</script>

<template>
  <article class="stat-card">
    <span class="stat-icon" :class="`tone-${tone}`" aria-hidden="true">{{ icon }}</span>
    <div>
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">{{ value }}</p>
      <p class="stat-detail">{{ detail }}</p>
    </div>
  </article>
</template>
