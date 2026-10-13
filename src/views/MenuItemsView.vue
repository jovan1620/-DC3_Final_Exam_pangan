<script setup>
import { computed, ref } from 'vue'
import ItemForm from '../components/ItemForm.vue'
import ItemTable from '../components/ItemTable.vue'
import { useCanteenStore } from '../stores/canteen'

const { state, saveItem, deleteItem } = useCanteenStore()
const editingItem = ref(null)
const search = ref('')
const notice = ref('')
// Computed filters the reactive item list as the user types.
const filteredItems = computed(() => state.items.filter((item) =>
  `${item.name} ${item.category}`.toLowerCase().includes(search.value.trim().toLowerCase()),
))
const availableItems = computed(() => state.items.filter((item) => item.available && item.stock > 0))
const categoryIcons = { Meals: '🍛', Snacks: '🥪', Drinks: '🥤', Desserts: '🧁' }

function editItem(item) {
  editingItem.value = { ...item }
  notice.value = ''
}

function save(item) {
  saveItem(item)
  editingItem.value = null
  notice.value = 'Menu item saved successfully.'
}

function removeItem(item) {
  if (!window.confirm(`Delete "${item.name}" from the menu?`)) return
  try {
    deleteItem(item.id)
    notice.value = 'Menu item deleted.'
    if (editingItem.value?.id === item.id) editingItem.value = null
  } catch (error) {
    notice.value = error.message
  }
}
</script>

<template>
  <section class="page-intro">
    <div>
      <p class="eyebrow">THE MENU</p>
      <h1>Menu items</h1>
      <p>Keep the good stuff on the menu and in stock.</p>
    </div>
    <span class="intro-count">{{ state.items.length }} items listed</span>
  </section>
  <p v-if="notice" class="notice-banner" role="status">{{ notice }}</p>
  <section class="customer-menu">
    <div class="customer-menu-heading">
      <div>
        <p class="eyebrow">FRESH FROM THE CANTEEN</p>
        <h2>Today's menu <span class="count-badge">{{ availableItems.length }}</span></h2>
        <p>See what's ready to order today.</p>
      </div>
      <span class="menu-open-label"><i></i> Available now</span>
    </div>
    <div v-if="availableItems.length" class="menu-card-grid">
      <article v-for="item in availableItems" :key="item.id" class="menu-food-card">
        <div class="menu-food-photo">
          <img v-if="item.image" :src="item.image" :alt="item.name" />
          <span v-else class="food-photo-placeholder" aria-hidden="true">{{ categoryIcons[item.category] || '🍽️' }}</span>
          <span class="food-availability"><i></i> Available</span>
        </div>
        <div class="menu-food-details">
          <span class="category-tag">{{ item.category }}</span>
          <h3>{{ item.name }}</h3>
          <div class="menu-food-bottom">
            <strong>₱{{ Number(item.price).toFixed(2) }}</strong>
            <span>{{ item.stock }} in stock</span>
          </div>
        </div>
      </article>
    </div>
    <p v-else class="menu-empty-state">There are no available food items right now. Please check back soon.</p>
  </section>
  <div class="management-layout">
    <ItemForm :initial-item="editingItem" @save="save" @cancel="editingItem = null" />
    <section class="panel listing-panel">
      <div class="panel-heading listing-heading">
        <div><p class="eyebrow">YOUR CANTEEN MENU</p><h2>All items <span class="count-badge">{{ filteredItems.length }}</span></h2></div>
        <label class="search-field">
          <span class="sr-only">Search menu items</span>
          <input v-model="search" type="search" placeholder="Search menu..." />
          <span aria-hidden="true">⌕</span>
        </label>
      </div>
      <ItemTable :items="filteredItems" @edit="editItem" @delete="removeItem" />
      <p class="panel-footnote">Tip: setting stock to zero marks an item as sold out.</p>
    </section>
  </div>
</template>
