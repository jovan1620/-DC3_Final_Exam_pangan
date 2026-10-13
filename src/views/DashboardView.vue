<script setup>
import { computed, ref } from 'vue'
import InventoryTable from '../components/InventoryTable.vue'
import StatCard from '../components/StatCard.vue'
import { useCanteenStore } from '../stores/canteen'

const { state, totalSales, updateStock, deleteItem } = useCanteenStore()
const notice = ref('')
// Computed summary values update with inventory changes.
const lowStockItems = computed(() => state.items.filter((item) => item.stock <= 5))
const availableCount = computed(() => state.items.filter((item) => item.available && item.stock > 0).length)

function saveStock(id, stock) {
  try {
    updateStock(id, stock)
    notice.value = 'Inventory quantity updated.'
  } catch (error) {
    notice.value = error.message
  }
}

function removeItem(item) {
  if (!window.confirm(`Delete the inventory record for "${item.name}"?`)) return
  try {
    deleteItem(item.id)
    notice.value = 'Inventory record deleted.'
  } catch (error) {
    notice.value = error.message
  }
}
</script>

<template>
  <section class="page-intro">
    <div><p class="eyebrow">THE BIG PICTURE</p><h1>Inventory &amp; sales</h1><p>A clear view of what is moving — and what needs a top-up.</p></div>
    <span class="intro-count">{{ availableCount }} items available</span>
  </section>
  <p v-if="notice" class="notice-banner" role="status">{{ notice }}</p>
  <section class="stats-grid dashboard-stats">
    <StatCard label="Menu items" :value="state.items.length" detail="Total records" icon="▤" tone="orange" />
    <StatCard label="Available now" :value="availableCount" detail="Ready to order" icon="✓" tone="green" />
    <StatCard label="Low stock" :value="lowStockItems.length" detail="Five or fewer remaining" icon="!" tone="yellow" />
    <StatCard label="Total sales" :value="`₱${totalSales.toFixed(2)}`" detail="Completed orders only" icon="₱" tone="orange" />
  </section>
  <section class="panel inventory-panel">
    <div class="panel-heading listing-heading">
      <div><p class="eyebrow">STOCK CONTROL</p><h2>Inventory records <span class="count-badge">{{ state.items.length }}</span></h2></div>
      <span class="stock-note"><span class="stock-dot"></span> Low stock at 5 or fewer</span>
    </div>
    <InventoryTable :items="state.items" @update-stock="saveStock" @delete="removeItem" />
  </section>
  <section v-if="lowStockItems.length > 0" class="low-stock-panel">
    <div class="warning-mark">!</div>
    <div><strong>Heads up — these items need a restock</strong><p>{{ lowStockItems.map((item) => `${item.name} (${item.stock})`).join(' · ') }}</p></div>
  </section>
  <section v-else class="success-panel">
    <span>✓</span><p><strong>Stock is looking good.</strong> No menu items are low on stock.</p>
  </section>
</template>
