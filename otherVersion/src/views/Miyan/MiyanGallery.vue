<template>
  <div class="min-h-screen brand-surface brand-surface--miyan flex flex-col items-center py-8">
    <!-- Use the new GalleryGrid component for a gallery-appropriate layout -->
    <GalleryGrid :items="galleryItems" :galleryTitle="(lang === 'fa' ? 'گالری' : 'Gallery')" />
  </div>
</template>

<script setup>
import GalleryGrid from '@/components/GalleryGrid.vue'
import { lang } from '@/state/lang'
import { computed } from 'vue'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'

const { data: galleryData } = useDataFetcher(api.getMiyanGallery, { autoLoad: true, initialValue: [] })

// Transform gallery API format (title_en, title_fa) to GalleryGrid format (title as object)
const galleryItems = computed(() => {
  const items = galleryData.value || []
  return (Array.isArray(items) ? items : []).map(item => ({
    ...item,
    title: { fa: item.title_fa || '', en: item.title_en || '' }
  }))
})
</script>
