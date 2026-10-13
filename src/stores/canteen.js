import { computed, reactive, watch } from 'vue'

const STORAGE_KEY = 'campus-canteen-data'

const sampleData = {
  items: [
    { id: 'item-1', name: 'Chicken Rice Bowl', category: 'Meals', price: 8.5, stock: 18, available: true },
    { id: 'item-2', name: 'Garden Sandwich', category: 'Snacks', price: 5.25, stock: 4, available: true },
    { id: 'item-3', name: 'Iced Lemon Tea', category: 'Drinks', price: 2.5, stock: 24, available: true },
    { id: 'item-4', name: 'Banana Muffin', category: 'Desserts', price: 3.75, stock: 0, available: false },
  ],
  orders: [
    {
      id: 'order-1',
      customer: 'Avery Tan',
      lines: [{ itemId: 'item-1', name: 'Chicken Rice Bowl', price: 8.5, quantity: 1 }],
      total: 8.5,
      status: 'Completed',
      createdAt: '2026-10-12T10:00:00.000Z',
    },
    {
      id: 'order-2',
      customer: 'Jordan Lee',
      lines: [{ itemId: 'item-3', name: 'Iced Lemon Tea', price: 2.5, quantity: 2 }],
      total: 5,
      status: 'Preparing',
      createdAt: '2026-10-13T11:30:00.000Z',
    },
  ],
}

function loadData() {
  if (typeof window === 'undefined') return structuredClone(sampleData)

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return structuredClone(sampleData)

    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed.items) && Array.isArray(parsed.orders)) {
      parsed.items = parsed.items.map((item) => normalizeItemAvailability({ ...item }))
      return parsed
    }

    console.error('Saved canteen data has an unexpected format; sample data will be loaded.')
  } catch (error) {
    console.error('Unable to load saved canteen data; sample data will be loaded.', error)
  }

  return structuredClone(sampleData)
}

function normalizeItemAvailability(item) {
  if (!item) return item
  const isAvailable = item.available ?? true
  item.available = Boolean(isAvailable) && Number(item.stock) > 0
  return item
}

const state = reactive(loadData())

// Watch demonstrates reactive side effects and persists every CRUD change.
watch(
  state,
  (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch (error) {
      console.error('Unable to save canteen data to localStorage.', error)
    }
  },
  { deep: true },
)

const totalSales = computed(() =>
  state.orders
    .filter((order) => order.status === 'Completed')
    .reduce((sum, order) => sum + Number(order.total), 0),
)

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function saveItem(item) {
  const normalizedItem = normalizeItemAvailability({ ...item })
  if (normalizedItem.id) {
    const index = state.items.findIndex((existing) => existing.id === normalizedItem.id)
    if (index !== -1) state.items[index] = normalizedItem
    return
  }
  state.items.unshift({ ...normalizedItem, id: makeId('item') })
}

function deleteItem(id) {
  const linkedOrder = state.orders.some((order) => order.lines.some((line) => line.itemId === id))
  if (linkedOrder) throw new Error('This item is part of an order and cannot be deleted yet.')
  state.items = state.items.filter((item) => item.id !== id)
}

function updateStock(id, stock) {
  if (!Number.isInteger(stock) || stock < 0) throw new RangeError('Stock must be a whole number of zero or more.')
  const item = state.items.find((entry) => entry.id === id)
  if (!item) throw new Error('The selected inventory item no longer exists.')
  item.stock = stock
  normalizeItemAvailability(item)
}

function restoreOrderStock(order) {
  for (const line of order.lines) {
    const item = state.items.find((entry) => entry.id === line.itemId)
    if (item) {
      item.stock += line.quantity
      normalizeItemAvailability(item)
    }
  }
}

function subtractOrderStock(lines) {
  for (const line of lines) {
    const item = state.items.find((entry) => entry.id === line.itemId)
    if (!item || item.stock < line.quantity || !item.available) {
      throw new Error(`${line.name} does not have enough available stock.`)
    }
  }
  for (const line of lines) {
    const item = state.items.find((entry) => entry.id === line.itemId)
    item.stock -= line.quantity
    normalizeItemAvailability(item)
  }
}

function saveOrder(order) {
  const lines = order.lines.map((line) => ({ ...line }))
  if (order.id) {
    const index = state.orders.findIndex((existing) => existing.id === order.id)
    if (index === -1) throw new Error('The selected order no longer exists.')
    const previous = state.orders[index]
    restoreOrderStock(previous)
    try {
      subtractOrderStock(lines)
      state.orders[index] = {
        ...order,
        lines,
        total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      }
    } catch (error) {
      subtractOrderStock(previous.lines)
      throw error
    }
    return
  }

  subtractOrderStock(lines)
  state.orders.unshift({
    ...order,
    id: makeId('order'),
    lines,
    total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    createdAt: new Date().toISOString(),
  })
}

function deleteOrder(id) {
  const order = state.orders.find((entry) => entry.id === id)
  if (!order) return
  restoreOrderStock(order)
  state.orders = state.orders.filter((entry) => entry.id !== id)
}

function updateOrderStatus(id, status) {
  const order = state.orders.find((entry) => entry.id === id)
  if (!order) throw new Error('The selected order no longer exists.')
  order.status = status
}

export function useCanteenStore() {
  return {
    state,
    totalSales,
    saveItem,
    deleteItem,
    updateStock,
    saveOrder,
    deleteOrder,
    updateOrderStatus,
  }
}
