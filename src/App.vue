<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app-shell">
    <NavBar />
    <main class="page-container">
      <RouterView />
    </main>
    <footer class="app-footer">
      <span>Campus Canteen</span>
      <span>Simple tools for a better lunch break.</span>
    </footer>
  </div>
</template>
