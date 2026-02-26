<script setup lang="ts">
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div class="page-shell">
    <div class="grain-overlay" aria-hidden="true" />
    <NavBar />

    <main class="page-main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <Footer />
  </div>
</template>
