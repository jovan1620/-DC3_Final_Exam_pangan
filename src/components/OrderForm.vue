<script setup>
import { computed, reactive, ref, watch } from 'vue'

// Props/emits connect this child form to its page; computed keeps the total live.
const props = defineProps({
  initialOrder: { type: Object, default: null },
  items: { type: Array, required: true },
})
const emit = defineEmits(['save', 'cancel'])
const form = reactive({ customer: '', lines: [], status: 'Pending' })
const errorMessage = ref('')
const total = computed(() => form.lines.reduce((sum, line) => {
  const item = props.items.find((entry) => entry.id === line.itemId)
  return sum + (item ? item.price * Number(line.quantity || 0) : 0)
}, 0))

function resetForm(order = null) {
  Object.assign(form, order
    ? { customer: order.customer, lines: order.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity })), status: order.status }
    : { customer: '', lines: [], status: 'Pending' })
  errorMessage.value = ''
}

watch(() => props.initialOrder, resetForm, { immediate: true })

function addLine() {
  const availableItem = props.items.find((item) => item.available && item.stock > 0)
  form.lines.push({ itemId: availableItem?.id ?? '', quantity: 1 })
}

function submitForm() {
  if (!form.customer.trim()) {
    errorMessage.value = 'Please enter the customer name.'
    return
  }
  if (form.lines.length === 0) {
    errorMessage.value = 'Add at least one menu item to the order.'
    return
  }

  const combined = new Map()
  for (const line of form.lines) {
    const item = props.items.find((entry) => entry.id === line.itemId)
    const quantity = Number(line.quantity)
    const previouslyReserved = props.initialOrder?.lines
      .filter((oldLine) => oldLine.itemId === line.itemId)
      .reduce((sum, oldLine) => sum + oldLine.quantity, 0) ?? 0
    if (!item || (!item.available && previouslyReserved === 0) || !Number.isInteger(quantity) || quantity < 1) {
      errorMessage.value = 'Choose an available item and enter a whole quantity greater than zero.'
      return
    }
    combined.set(item.id, (combined.get(item.id) ?? 0) + quantity)
  }

  for (const [itemId, quantity] of combined) {
    const item = props.items.find((entry) => entry.id === itemId)
    const previouslyReserved = props.initialOrder?.lines
      .filter((line) => line.itemId === itemId)
      .reduce((sum, line) => sum + line.quantity, 0) ?? 0
    if (quantity > item.stock + previouslyReserved) {
      errorMessage.value = `Only ${item.stock + previouslyReserved} ${item.name} available for this order.`
      return
    }
  }

  emit('save', {
    id: props.initialOrder?.id,
    customer: form.customer.trim(),
    status: form.status,
    lines: form.lines.map((line) => {
      const item = props.items.find((entry) => entry.id === line.itemId)
      return { itemId: item.id, name: item.name, price: item.price, quantity: Number(line.quantity) }
    }),
  })
  if (!props.initialOrder) resetForm()
}
</script>

<template>
  <form class="panel form-panel" @submit.prevent="submitForm">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">ORDER MANAGEMENT</p>
        <h2>{{ initialOrder ? 'Edit order' : 'Create an order' }}</h2>
      </div>
      <span class="heading-icon">↗</span>
    </div>
    <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
    <label>
      Customer name
      <input v-model="form.customer" type="text" placeholder="e.g. Taylor Morgan" required maxlength="60" />
    </label>
    <div class="line-items-heading">
      <span>Order items</span>
      <button class="text-button" type="button" :disabled="items.every((item) => !item.available || item.stock < 1)" @click="addLine">＋ Add item</button>
    </div>
    <p v-if="items.every((item) => !item.available || item.stock < 1)" class="help-text">Add stock to a menu item before creating an order.</p>
    <div v-for="(line, index) in form.lines" :key="index" class="order-line">
      <select v-model="line.itemId" required aria-label="Menu item">
        <option disabled value="">Select item</option>
        <option v-for="item in items.filter((entry) => (entry.available && entry.stock > 0) || initialOrder?.lines.some((old) => old.itemId === entry.id))" :key="item.id" :value="item.id">
          {{ item.name }} — ₱{{ Number(item.price).toFixed(2) }}
        </option>
      </select>
      <input v-model="line.quantity" type="number" min="1" step="1" required aria-label="Quantity" />
      <button class="icon-button" type="button" aria-label="Remove order item" @click="form.lines.splice(index, 1)">×</button>
    </div>
    <button v-if="form.lines.length === 0 && items.some((item) => item.available && item.stock > 0)" class="button button-outline add-first-line" type="button" @click="addLine">＋ Add first item</button>
    <label v-if="initialOrder">
      Status
      <select v-model="form.status">
        <option>Pending</option><option>Preparing</option><option>Completed</option>
      </select>
    </label>
    <div class="order-total"><span>Order total</span><strong>₱{{ total.toFixed(2) }}</strong></div>
    <div class="form-actions">
      <button class="button button-primary" type="submit">{{ initialOrder ? 'Save changes' : 'Place order' }}</button>
      <button v-if="initialOrder" class="button button-quiet" type="button" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
