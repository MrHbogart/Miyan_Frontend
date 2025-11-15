<template>
  <div class="min-h-screen brand-surface brand-surface--miyan flex flex-col items-center py-8 w-full">
    <div class="content-shell content-shell--flush w-full">
      <GalleryGrid :items="galleryItems" :galleryTitle="(lang === 'fa' ? 'گالری' : 'Gallery')" />
    </div>
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
