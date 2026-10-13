<script setup>
// The parent owns CRUD state; this table communicates actions through emits.
defineProps({
  items: { type: Array, required: true },
})
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="table-scroll">
    <table class="data-table">
      <thead>
        <tr><th>Item</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>
            <div class="table-item">
              <img v-if="item.image" :src="item.image" :alt="item.name" />
              <span v-else class="table-photo-placeholder" aria-hidden="true">🍽️</span>
              <strong>{{ item.name }}</strong>
            </div>
          </td>
          <td><span class="category-tag">{{ item.category }}</span></td>
          <td>₱{{ Number(item.price).toFixed(2) }}</td>
          <td>{{ item.stock }}</td>
          <td><span class="status-pill" :class="item.available && item.stock > 0 ? 'status-ready' : 'status-muted'">
            {{ item.available && item.stock > 0 ? 'Available' : 'Sold out' }}
          </span></td>
          <td class="table-actions">
            <button class="text-button" type="button" @click="emit('edit', item)">Edit</button>
            <button class="text-button danger-text" type="button" @click="emit('delete', item)">Delete</button>
          </td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="6" class="empty-state">No menu items match this search.</td></tr>
      </tbody>
    </table>
  </div>
</template>
