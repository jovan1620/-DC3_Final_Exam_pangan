<script setup>
import { reactive, watch } from 'vue'

// The watcher syncs editable stock drafts when parent inventory changes.
const props = defineProps({ items: { type: Array, required: true } })
const emit = defineEmits(['update-stock', 'delete'])
const drafts = reactive({})

watch(() => props.items, (items) => {
  for (const item of items) drafts[item.id] = item.stock
}, { immediate: true, deep: true })

function saveStock(item) {
  emit('update-stock', item.id, Number(drafts[item.id]))
}
</script>

<template>
  <div class="table-scroll">
    <table class="data-table">
      <thead><tr><th>Inventory item</th><th>Category</th><th>Current stock</th><th>Stock level</th><th>Action</th></tr></thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td><strong>{{ item.name }}</strong></td>
          <td><span class="category-tag">{{ item.category }}</span></td>
          <td>
            <form class="stock-control" @submit.prevent="saveStock(item)">
              <input v-model.number="drafts[item.id]" type="number" min="0" step="1" required :aria-label="`Stock for ${item.name}`" />
              <button class="text-button" type="submit">Update</button>
            </form>
          </td>
          <td><span class="status-pill" :class="item.stock <= 5 ? 'status-low' : 'status-ready'">{{ item.stock <= 5 ? 'Low stock' : 'In stock' }}</span></td>
          <td><button class="text-button danger-text" type="button" @click="emit('delete', item)">Delete record</button></td>
        </tr>
        <tr v-if="items.length === 0"><td colspan="5" class="empty-state">No inventory records available.</td></tr>
      </tbody>
    </table>
  </div>
</template>
