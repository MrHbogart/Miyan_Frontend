<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8">
    <!-- Reuse the StructuredMenu component so project items match menu items in design & behaviour -->
     
    <StructuredMenu :menu="menu" />
  </div>
</template>

<script setup>
import StructuredMenu from '@/components/StructuredMenu.vue'
import { computed } from 'vue'

import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'
const { data: projects } = useDataFetcher(api.getMiyanGallery)

// Map the gallery/projects data to the menu shape expected by StructuredMenu
// API returns: { id, title_en, title_fa, image, ... }
// Need to transform to: { name, description, image, price }
const menu = computed(() => {
  const list = (projects && projects.value) ? projects.value : []
  return {
    title: { fa: 'پروژه‌ها', en: 'Projects' },
    subtitle: null,
    sections: [
      {
        title: { fa: 'پروژه‌ها', en: 'Projects' },
        items: (Array.isArray(list) ? list : []).map(p => ({
          name: { fa: p.title_fa || '', en: p.title_en || '' },
          description: null,
          image: p.image,
          price: null,
        })),
      },
    ],
  }
})
</script>
