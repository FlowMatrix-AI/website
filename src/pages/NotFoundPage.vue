<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: '404 | FlowMatrix AI',
  meta: [
    {
      name: 'description',
      content: 'Page not found.',
    },
  ],
})
</script>

<template>
  <section>
    <h1>404</h1>
    <p>The page you requested was not found.</p>
    <a href="/">Return home</a>
  </section>
</template>
