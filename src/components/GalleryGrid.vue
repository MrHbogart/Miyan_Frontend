<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <div class="space-y-6">
      <h2 class="text-2xl mb-6 text-center">
        <span v-if="lang === 'fa'" class="block font-b-titr mb-1" dir="rtl">{{ t(galleryTitle) }}</span>
        <span v-else class="block font-cinzel font-light tracking-wide">{{ t(galleryTitle) }}</span>
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <article v-for="(item, idx) in items" :key="idx" class="group overflow-hidden">
          <div @click="openImage(item.image)" class="relative">
            <img :src="item.image" :alt="item.title.en" class="w-full h-48 md:h-64 object-cover transform transition-transform duration-300 group-hover:scale-105" />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white">
              <div v-if="lang === 'fa'" class="font-b-titr text-md" dir="rtl">{{ t(item.title) }}</div>
              <div v-else class="font-cinzel text-sm font-light">{{ t(item.title) }}</div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>

  <ImageModal :show="!!selectedImage" :image-src="selectedImage" @close="selectedImage = null" />
</template>

<script setup>
import { ref } from 'vue'
import ImageModal from './ImageModal.vue'
import { lang } from '@/state/lang'

const props = defineProps({
  galleryTitle: { type: String, default: null },
  items: { type: Array, required: true }
})

const selectedImage = ref(null)

function openImage(src) {
  selectedImage.value = src
}

function t(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[lang.value] ?? obj['fa'] ?? obj['en'] ?? ''
}

</script>

<style scoped>
.group { transition: all 0.3s ease; }
</style>
