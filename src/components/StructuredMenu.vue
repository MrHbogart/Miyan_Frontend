<template>
  <div class="w-full max-w-6xl mx-auto p-4">
      <div class="space-y-6" v-if="normalizedMenu && normalizedMenu.sections && normalizedMenu.sections.length">
          <section v-for="(section, sIdx) in normalizedMenu.sections" :key="sIdx" class="pb-8 last:pb-0">
            <h2 class="text-2xl mb-6 text-center">
              <span v-if="currentLang === 'fa'" class="block font-b-titr mb-1" dir="rtl">{{ t(section.title) }}</span>
              <span v-else class="block font-cinzel font-light tracking-wide">{{ t(section.title) }}</span>
            </h2>
        <div class="grid gap-6 md:gap-8">
          <article v-for="(item, idx) in (section.items || [])" :key="idx" class="group" v-if="item">
            <div class="grid md:grid-cols-2 gap-4 items-start">
              <div :class="currentLang === 'fa' ? 'order-2 md:order-2' : 'order-2 md:order-1'">
                <div class="mb-4">
                  <div :class="['flex items-baseline justify-between', currentLang === 'fa' ? 'flex-row-reverse' : '']">
                    <h3 class="mb-2">
                      <span v-if="currentLang === 'fa'" class="block font-b-titr text-xl mb-1" dir="rtl">{{ t(item.name) }}</span>
                      <span v-else class="block font-cinzel text-lg font-medium">{{ t(item.name) }}</span>
                    </h3>

                    <div v-if="item.price" class="text-gray-600 ml-4">
                      <span v-if="currentLang === 'fa'" class="block font-b-titr text-lg text-right" dir="rtl">{{ t(item.price) }}</span>
                      <span v-else class="block font-cinzel font-light">{{ t(item.price) }}</span>
                    </div>
                  </div>

                  <p v-if="item.description" class="text-gray-500">
                    <span v-if="currentLang === 'fa'" class="block font-b-titr text-sm mb-1" dir="rtl">{{ t(item.description) }}</span>
                    <span v-else class="block font-cinzel text-sm font-light">{{ t(item.description) }}</span>
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
                  class="w-full h-40 md:h-56 object-cover transform transition-transform duration-300 group-hover:scale-105"
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
  // `menu` can be either:
  // - an object with a `sections` array: { sections: [...] }
  // - an array of sections directly: [ { title, items } ]
  // - a single section-like object with `items`
  menu: {
    type: [Object, Array],
    required: true,
  },
})

const selectedImage = ref(null)
const currentLang = computed(() => lang.value)

// Normalize incoming `menu` into an object with `sections: []` so the
// template can always rely on `normalizedMenu.sections` being an array.
const normalizedMenu = computed(() => {
  const m = props.menu
  if (!m) return { sections: [] }
  if (Array.isArray(m)) {
    // already an array of sections
    return { sections: m }
  }
  if (m.sections && Array.isArray(m.sections)) {
    return m
  }
  if (m.items && Array.isArray(m.items)) {
    // single-section shape -> wrap into sections
    return { sections: [{ title: m.title || {}, items: m.items }] }
  }
  // Unknown shape, try to coerce safe structure
  return { sections: [] }
})

function openImage(imageSrc) {
  selectedImage.value = imageSrc
}

// helper to read localized field (expects object with { fa, en })
function t(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  if (typeof obj !== 'object') return ''
  // Safely access properties with fallbacks
  const value = obj[currentLang.value] || obj['fa'] || obj['en'] || ''
  return String(value)
}
</script>

<style scoped>
/* Smooth transitions for interactive elements */
.group {
  transition: all 0.3s ease;
}

.shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
</style>

