<script setup>
import { RouterLink } from 'vue-router'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Menu Items', to: '/menu' },
  { label: 'Orders', to: '/orders' },
  { label: 'Inventory', to: '/dashboard' },
]
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="Campus Canteen home">
      <span class="brand-mark">CC</span>
      <span>Campus Canteen<small>MANAGEMENT</small></span>
    </RouterLink>
    <nav class="main-nav" aria-label="Main navigation">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
        {{ link.label }}
      </RouterLink>
    </nav>
    <span class="open-indicator"><i></i> Canteen open</span>
  </header>
</template>
