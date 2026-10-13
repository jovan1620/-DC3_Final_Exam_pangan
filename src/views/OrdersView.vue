<script setup>
import { ref } from 'vue'
import OrderForm from '../components/OrderForm.vue'
import OrderTable from '../components/OrderTable.vue'
import { useCanteenStore } from '../stores/canteen'

const { state, saveOrder, deleteOrder, updateOrderStatus } = useCanteenStore()
const editingOrder = ref(null)
const notice = ref('')

function editOrder(order) {
  editingOrder.value = { ...order, lines: order.lines.map((line) => ({ ...line })) }
  notice.value = ''
}

function save(order) {
  try {
    saveOrder(order)
    editingOrder.value = null
    notice.value = 'Order saved and inventory updated.'
  } catch (error) {
    notice.value = error.message
  }
}

function removeOrder(order) {
  if (!window.confirm(`Delete order for ${order.customer}? Its reserved stock will be returned.`)) return
  deleteOrder(order.id)
  notice.value = 'Order deleted and stock returned to inventory.'
  if (editingOrder.value?.id === order.id) editingOrder.value = null
}

function changeStatus(id, status) {
  updateOrderStatus(id, status)
  notice.value = `Order status updated to ${status}.`
}
</script>

<template>
  <section class="page-intro">
    <div><p class="eyebrow">SERVICE COUNTER</p><h1>Orders</h1><p>Keep every lunch moving in the right direction.</p></div>
    <span class="intro-count">{{ state.orders.length }} total orders</span>
  </section>
  <p v-if="notice" class="notice-banner" role="status">{{ notice }}</p>
  <div class="management-layout order-layout">
    <OrderForm :initial-order="editingOrder" :items="state.items" @save="save" @cancel="editingOrder = null" />
    <section class="panel listing-panel">
      <div class="panel-heading listing-heading">
        <div><p class="eyebrow">ORDER QUEUE</p><h2>Recent orders <span class="count-badge">{{ state.orders.length }}</span></h2></div>
      </div>
      <OrderTable :orders="state.orders" @edit="editOrder" @delete="removeOrder" @status="changeStatus" />
      <p class="panel-footnote">Order totals are calculated automatically. Reserved stock returns when you delete an order.</p>
    </section>
  </div>
</template>
