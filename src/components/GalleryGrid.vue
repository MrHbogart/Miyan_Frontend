<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <div class="space-y-6">
      <h2 class="text-2xl mb-6 text-center">
        <span v-if="lang === 'fa'" class="block font-b-titr mb-1" dir="rtl">{{ t(galleryTitle) }}</span>
        <span v-else class="block font-cinzel font-light tracking-wide">{{ t(galleryTitle) }}</span>
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <article 
          v-for="(item, idx) in items" 
          :key="idx" 
          class="gallery-item group"
          :style="{ animationDelay: `${idx * 50}ms` }"
        >
          <div @click="openImage(item.image)" class="gallery-item-wrapper">
            <img 
              :src="item.image" 
              :alt="item.title.en" 
              class="gallery-item-image" 
            />
            <div class="gallery-item-overlay">
              <div v-if="lang === 'fa'" class="gallery-item-title font-b-titr text-md" dir="rtl">
                {{ t(item.title) }}
              </div>
              <div v-else class="gallery-item-title font-cinzel text-sm font-light">
                {{ t(item.title) }}
              </div>
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
/* Luxury gallery item animations */
.gallery-item {
  overflow: visible;
  animation: fadeInUp 600ms cubic-bezier(0.4, 0.0, 0.2, 1) both;
  will-change: transform;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.gallery-item-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
  transition: transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.gallery-item-wrapper:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.12);
}

.gallery-item-wrapper:active {
  transform: translateY(-4px) scale(1.01);
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.gallery-item-image {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  transition: transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform;
}

@media (min-width: 768px) {
  .gallery-item-image {
    height: 16rem;
  }
}

.gallery-item-wrapper:hover .gallery-item-image {
  transform: scale(1.08);
  filter: brightness(1.05);
}

.gallery-item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.4), transparent);
  padding: 1.5rem 1rem 1rem;
  color: white;
  transition: opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
              transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(4px);
  opacity: 0.95;
}

.gallery-item-wrapper:hover .gallery-item-overlay {
  opacity: 1;
  transform: translateY(0);
}

.gallery-item-title {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: text-shadow 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.gallery-item-wrapper:hover .gallery-item-title {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}
</style>
