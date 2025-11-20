<template>
  <div class="w-full max-w-6xl mx-auto p-4" :dir="currentLang === 'fa' ? 'rtl' : 'ltr'">
      <div class="space-y-6" v-if="sections && sections.length">
          <section v-for="(section, sIdx) in sections" :key="sIdx" class="pb-8 last:pb-0">
            <h2 class="text-2xl mb-6 text-center">
              <span v-if="currentLang === 'fa'" class="block font-b-titr mb-1" dir="rtl">{{ translateCopy(section.title) }}</span>
              <span v-else class="block font-cinzel font-light tracking-wide">{{ translateCopy(section.title) }}</span>
            </h2>
        <div class="grid gap-6 md:gap-8">
          <article v-for="(item, idx) in (section.items || [])" :key="idx" class="group">
            <div v-if="item && item.name" class="grid md:grid-cols-2 gap-4 items-start">
              <div :class="currentLang === 'fa' ? 'order-2 md:order-2' : 'order-2 md:order-1'">
                <div class="mb-4">
                  <div :class="['flex items-baseline justify-between gap-4', currentLang === 'fa' ? 'flex-row-reverse text-right' : 'text-left']">
                    <h3 class="mb-2">
                      <span v-if="currentLang === 'fa'" class="block font-b-titr text-xl mb-1" dir="rtl">{{ translateCopy(item.name) }}</span>
                      <span v-else class="block font-cinzel text-lg font-medium">{{ translateCopy(item.name) }}</span>
                    </h3>

                    <div
                      v-if="item.price"
                      class="text-gray-700"
                      :class="currentLang === 'fa' ? 'font-b-titr text-lg order-first' : 'font-cinzel font-light text-base'"
                    >
                      {{ translateCopy(item.price) }}
                    </div>
                  </div>

                  <p v-if="item.description" class="text-gray-500" :class="currentLang === 'fa' ? 'text-right' : ''">
                    <span v-if="currentLang === 'fa'" class="block font-b-titr text-sm mb-1" dir="rtl">{{ translateCopy(item.description) }}</span>
                    <span v-else class="block font-cinzel text-sm font-light">{{ translateCopy(item.description) }}</span>
                  </p>
                </div>
              </div>

              <div
                v-if="item.image"
                :class="currentLang === 'fa' ? 'order-1 md:order-1 overflow-hidden rounded-sm' : 'order-1 md:order-2 overflow-hidden rounded-sm'"
                @click="openImage(item.image)"
              >
                <img
                  :src="item.image"
                  :alt="(item.name && typeof item.name === 'object') ? (item.name.en || item.name.fa || '') : (item.name || '')"
                  class="w-full h-40 md:h-56 object-cover transform transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <ImageModal
      :show="!!selectedImage"
      :image-src="selectedImage"
      @close="selectedImage = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageModal from './ImageModal.vue'
import { lang } from '@/state/lang'

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
})

const selectedImage = ref(null)
const currentLang = computed(() => lang.value)

// Get sections directly from menu.sections
// The API/mock data structure has sections at the top level
const sections = computed(() => {
  if (!props.menu || !props.menu.sections) {
    return []
  }
  return props.menu.sections
})

function openImage(imageSrc) {
  selectedImage.value = imageSrc
}

// Helper to read localized field (expects object with { fa, en })
function translateCopy(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  if (typeof obj !== 'object') return ''
  const value = obj[currentLang.value] || obj['fa'] || obj['en'] || ''
  return String(value)
}
</script>

<style scoped>
/* Smooth transitions for interactive elements */
.group {
  transition: all 0.3s ease;
}

.shadow-sm { box-shadow: 0 0.0625rem 0.1875rem rgba(0,0,0,0.06); }
</style>
