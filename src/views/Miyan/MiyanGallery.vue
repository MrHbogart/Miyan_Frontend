<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8">
    <!-- Use the new GalleryGrid component for a gallery-appropriate layout -->
    <GalleryGrid :items="galleryItems" :galleryTitle="(lang === 'fa' ? 'گالری' : 'Gallery')" />
  </div>
</template>

<script setup>
import GalleryGrid from '@/components/GalleryGrid.vue'
import galleryItems from '@/data/miyanGallery.js'
import { lang } from '@/state/lang'

function t(obj) {
  return typeof obj === 'string' ? obj : (obj && (obj[window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.app? 'en' : 'en']))
}

// pass items directly; GalleryGrid uses the 'lang' store to localize titles
</script>

