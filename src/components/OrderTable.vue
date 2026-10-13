<script setup>
// Props render shared order data; emits report edits and status changes.
const props = defineProps({
  orders: { type: Array, required: true },
})
const emit = defineEmits(['edit', 'delete', 'status'])

function itemSummary(order) {
  return order.lines.map((line) => `${line.name} × ${line.quantity}`).join(', ')
}
</script>

<template>
  <div class="table-scroll">
    <table class="data-table orders-table">
      <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td><strong>#{{ order.id.slice(-5).toUpperCase() }}</strong><small class="sub-cell">{{ new Date(order.createdAt).toLocaleDateString() }}</small></td>
          <td>{{ order.customer }}</td>
          <td class="items-summary">{{ itemSummary(order) }}</td>
          <td><strong>₱{{ Number(order.total).toFixed(2) }}</strong></td>
          <td>
            <select class="status-select" :value="order.status" :class="`status-${order.status.toLowerCase()}`" :aria-label="`Status for ${order.customer}`" @change="emit('status', order.id, $event.target.value)">
              <option>Pending</option><option>Preparing</option><option>Completed</option>
            </select>
          </td>
          <td class="table-actions">
            <button class="text-button" type="button" @click="emit('edit', order)">Edit</button>
            <button class="text-button danger-text" type="button" @click="emit('delete', order)">Delete</button>
          </td>
        </tr>
        <tr v-if="orders.length === 0"><td colspan="6" class="empty-state">No orders yet. Create one to get started.</td></tr>
      </tbody>
    </table>
  </div>
</template>
