<script setup>
import { reactive, ref, watch } from 'vue'

// Props initialize edit mode; emits send validated form data back to the page.
const props = defineProps({
  initialItem: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const categories = ['Meals', 'Snacks', 'Drinks', 'Desserts']
const form = reactive({ name: '', category: 'Meals', price: '', stock: '', available: true, image: '' })
const errorMessage = ref('')
const fileInput = ref(null)
const imageLoading = ref(false)

function resetForm(item = null) {
  Object.assign(form, item
    ? { ...item }
    : { name: '', category: 'Meals', price: '', stock: '', available: true, image: '' })
  errorMessage.value = ''
  imageLoading.value = false
  if (fileInput.value) fileInput.value.value = ''
}

watch(() => props.initialItem, resetForm, { immediate: true })

async function handleImageSelection(event) {
  const file = event.target.files?.[0]
  if (!file) return

  errorMessage.value = ''
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = 'Choose a JPG, PNG, or WebP image.'
    event.target.value = ''
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    errorMessage.value = 'Image must be 8 MB or smaller.'
    event.target.value = ''
    return
  }

  imageLoading.value = true
  const imageUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = imageUrl
    await image.decode()

    const maxDimension = 640
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale)
    canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Your browser could not prepare this image.')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    form.image = canvas.toDataURL('image/jpeg', 0.78)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load this image.'
  } finally {
    URL.revokeObjectURL(imageUrl)
    imageLoading.value = false
  }
}

function removeImage() {
  form.image = ''
  if (fileInput.value) fileInput.value.value = ''
}

function submitForm() {
  const price = Number(form.price)
  const stock = Number(form.stock)
  if (!form.name.trim() || !form.category) {
    errorMessage.value = 'Please enter an item name and choose a category.'
    return
  }
  if (!Number.isFinite(price) || price < 0) {
    errorMessage.value = 'Price must be a valid amount of zero or more.'
    return
  }
  if (!Number.isInteger(stock) || stock < 0) {
    errorMessage.value = 'Stock must be a whole number of zero or more.'
    return
  }
  emit('save', {
    id: props.initialItem?.id,
    name: form.name.trim(),
    category: form.category,
    price,
    stock,
    available: stock > 0 && form.available,
    image: form.image,
  })
  if (!props.initialItem) resetForm()
}
</script>

<template>
  <form class="panel form-panel" @submit.prevent="submitForm">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">MENU MANAGEMENT</p>
        <h2>{{ initialItem ? 'Edit menu item' : 'Add a menu item' }}</h2>
      </div>
      <span class="heading-icon">＋</span>
    </div>
    <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
    <div class="photo-field">
      <label for="item-photo">Food photo <span class="optional-label">Optional</span></label>
      <div class="photo-picker">
        <div class="photo-preview" :class="{ 'photo-preview-empty': !form.image }">
          <img v-if="form.image" :src="form.image" alt="Preview of the selected food" />
          <span v-else aria-hidden="true">🍽️</span>
        </div>
        <div class="photo-picker-actions">
          <input
            id="item-photo"
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            :disabled="imageLoading"
            @change="handleImageSelection"
          />
          <p>JPG, PNG or WebP · up to 8 MB. Photos are compressed and saved in this browser.</p>
          <button v-if="form.image" class="text-button danger-text remove-photo" type="button" @click="removeImage">Remove photo</button>
        </div>
      </div>
      <span v-if="imageLoading" class="help-text" role="status">Preparing photo…</span>
    </div>
    <label>
      Item name
      <input v-model="form.name" type="text" placeholder="e.g. Veggie wrap" required maxlength="60" />
    </label>
    <div class="form-row">
      <label>
        Category
        <select v-model="form.category" required>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </label>
      <label>
        Price (₱)
        <input v-model="form.price" type="number" min="0" step="0.01" placeholder="0.00" required />
      </label>
    </div>
    <div class="form-row">
      <label>
        Stock quantity
        <input v-model="form.stock" type="number" min="0" step="1" placeholder="0" required />
      </label>
      <label class="checkbox-label">
        <input v-model="form.available" type="checkbox" />
        Available to order
      </label>
    </div>
    <div class="form-actions">
      <button class="button button-primary" type="submit" :disabled="imageLoading">{{ initialItem ? 'Save changes' : 'Add item' }}</button>
      <button v-if="initialItem" class="button button-quiet" type="button" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
