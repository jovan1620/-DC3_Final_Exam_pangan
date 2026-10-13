<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import StatCard from '../components/StatCard.vue'
import { useCanteenStore } from '../stores/canteen'

const { state, totalSales } = useCanteenStore()
const today = ref('')
const itemCount = computed(() => state.items.length)
const activeOrders = computed(() => state.orders.filter((order) => order.status !== 'Completed').length)

// onMounted demonstrates a component lifecycle hook.
onMounted(() => {
  today.value = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
})

</script>

<template>
  <section class="hero-section">
    <div class="hero-copy">
      <p class="eyebrow"><span class="eyebrow-dot"></span> YOUR CAMPUS, SERVED FRESH</p>
      <h1>Good food.<br /><span>Better campus days.</span></h1>
      <p class="hero-description">A simpler way to keep your canteen menu, orders, and inventory running smoothly — all in one place.</p>
      <div class="hero-actions">
        <RouterLink to="/menu" class="button button-primary">Manage the menu <span>↗</span></RouterLink>
        <RouterLink to="/orders" class="button button-outline">View today's orders</RouterLink>
      </div>
      <p class="hero-date">{{ today || 'Your canteen at a glance' }}</p>
    </div>
    <div class="hero-visual" aria-label="Campus canteen illustration">
      <div class="sun-shape"></div>
      <div class="food-plate">
        <span class="plate-leaf">✦</span>
        <span class="plate-food">🥗</span>
        <span class="plate-tomato">●</span>
      </div>
      <div class="float-note note-top">Freshly made <span>✳</span></div>
      <div class="float-note note-bottom"><span class="note-check">✓</span> Lunch is looking good</div>
      <span class="visual-sparkle sparkle-one">✳</span>
      <span class="visual-sparkle sparkle-two">✦</span>
    </div>
  </section>

  <section class="home-overview">
    <div class="section-heading">
      <div><p class="eyebrow">AT A GLANCE</p><h2>A little snapshot</h2></div>
      <RouterLink to="/dashboard" class="subtle-link">View inventory <span>→</span></RouterLink>
    </div>
    <div class="stats-grid">
      <StatCard label="Menu items" :value="itemCount" detail="Across your menu" icon="▤" tone="orange" />
      <StatCard label="Active orders" :value="activeOrders" detail="Being prepared today" icon="↗" tone="green" />
      <StatCard label="Sales completed" :value="`₱${totalSales.toFixed(2)}`" detail="From completed orders" icon="₱" tone="yellow" />
    </div>
  </section>

</template>
