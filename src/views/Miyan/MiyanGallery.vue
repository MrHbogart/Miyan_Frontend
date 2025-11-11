<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8">
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
const galleryItems = computed(() => galleryData.value || [])

function t(obj) {
  if (typeof obj === 'string') return obj
  if (!obj) return ''
  return obj.en || obj.fa || ''
}

// pass items directly; GalleryGrid uses the 'lang' store to localize titles
</script>

