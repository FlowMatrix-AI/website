<script setup lang="ts">
import { useHead } from '@unhead/vue'
import templates from '../data/templates.json'

type Template = {
  slug: string
  title: string
}

const templateList = templates as Template[]

useHead({
  title: 'Free Templates | FlowMatrix AI',
  meta: [
    {
      name: 'description',
      content: 'Browse free FlowMatrix AI templates.',
    },
  ],
})
</script>

<template>
  <section>
    <h1>Free Templates</h1>
    <ul>
      <li v-for="template in templateList" :key="template.slug">
        <a :href="`/free/${template.slug}`">{{ template.title }}</a>
      </li>
    </ul>
  </section>
</template>
