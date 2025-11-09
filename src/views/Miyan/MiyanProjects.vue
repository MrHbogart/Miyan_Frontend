<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8">
    <!-- Reuse the StructuredMenu component so project items match menu items in design & behaviour -->
     
    <StructuredMenu :menu="menu" />
  </div>
</template>

<script setup>
import StructuredMenu from '@/components/StructuredMenu.vue'

// import projects from '@/data/miyanProjects.js'

import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'
const { data: projects, loading, error } = useDataFetcher(api.getMiyanGallery)

// Map the projects data to the menu shape expected by StructuredMenu
const menu = {
  title: { fa: 'پروژه‌ها', en: 'Projects' },
  subtitle: null,
  sections: [
    {
      title: { fa: 'پروژه‌ها', en: 'Projects' },
      items: projects.map(p => ({
        name: p.title,
        description: p.description,
        image: p.image,
        price: null,
      })),
    },
  ],
}
</script>
