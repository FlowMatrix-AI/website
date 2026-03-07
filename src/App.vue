<script setup lang="ts">
import NavBar from './components/layout/NavBar.vue';
import Footer from './components/layout/Footer.vue';
import { useAnalyticsHead } from './composables/useAnalytics';

useAnalyticsHead();
</script>

<template>
  <div class="page-shell">
    <div class="grain-overlay" aria-hidden="true" />
    <NavBar />

    <main id="main-content" class="page-main">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
