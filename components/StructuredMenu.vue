<template>
  <div class="w-full max-w-6xl mx-auto p-4 md:px-8" :dir="currentLang === 'fa' ? 'rtl' : 'ltr'">
      <div class="space-y-6" v-if="sections && sections.length">
          <section v-for="(section, sIdx) in sections" :key="sIdx" class="pb-8 last:pb-0">
            <h2 class="text-2xl mb-6 text-center">
              <span v-if="isRTL" class="block font-b-titr mb-1" dir="rtl">{{ translateCopy(section.title) }}</span>
              <span v-else class="block font-cinzel font-light tracking-wide">{{ translateCopy(section.title) }}</span>
            </h2>
        <div class="grid gap-6 md:gap-8">
          <article v-for="(item, idx) in (section.items || [])" :key="idx" class="group px-0 md:px-6">
            <div
              v-if="item && item.name"
              :class="[
                'grid gap-4 items-start',
                showMedia(item) ? 'md:grid-cols-2' : 'grid-cols-1'
              ]"
              dir="ltr"
            >
              <div :class="isRTL ? 'order-2 md:order-2' : 'order-2 md:order-1'">
                <div class="mb-4" :dir="isRTL ? 'rtl' : 'ltr'">
                  <div class="flex items-start justify-between gap-4">
                    <div :class="[isRTL ? 'order-1 text-right flex-1' : 'order-2 text-left flex-1']">
                      <h3 class="mb-2">
                        <span v-if="isRTL" class="block font-b-titr text-xl mb-1">{{ translateCopy(item.name) }}</span>
                        <span v-else class="block font-cinzel text-lg font-medium">{{ translateCopy(item.name) }}</span>
                      </h3>
                    </div>

                    <div
                      v-if="item.price"
                      class="text-gray-700 min-w-[3rem]"
                      :class="isRTL ? 'order-1 text-left font-b-titr text-lg' : 'order-2 text-right font-cinzel font-light text-base'"
                      dir="ltr"
                    >
                      {{ translateCopy(item.price) }}
                    </div>
                  </div>

                  <p v-if="item.description" class="text-gray-500" :class="isRTL ? 'text-right' : 'text-left'">
                    <span v-if="isRTL" class="block font-b-titr text-sm mb-1">{{ translateCopy(item.description) }}</span>
                    <span v-else class="block font-cinzel text-sm font-light">{{ translateCopy(item.description) }}</span>
                  </p>
                </div>
              </div>

              <div
                v-if="showMedia(item)"
                :class="isRTL ? 'order-1 md:order-1 overflow-hidden' : 'order-1 md:order-2 overflow-hidden'"
                @click="openItemMedia(item)"
              >
                <img
                  :src="resolveImageSrc(item)"
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
      :show="!!selectedMedia"
      :image-src="selectedMedia?.image || ''"
      :image-alt="selectedMedia?.alt || ''"
      :video-src="selectedMedia?.video || ''"
      @close="selectedMedia = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageModal from './ImageModal.vue'
import { useLang } from '~/composables/useLang'

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
})

const selectedMedia = ref(null)
const langState = useLang()
const currentLang = computed(() => langState.value)
const isRTL = computed(() => currentLang.value === 'fa')
const showImagesEnabled = computed(() => {
  const menu = props.menu || {}
  if (typeof menu.show_images === 'boolean') return menu.show_images
  if (typeof menu.pictureless === 'boolean') return !menu.pictureless
  return true
})

// Get sections directly from menu.sections
// The API/mock data structure has sections at the top level
const sections = computed(() => {
  if (!props.menu || !props.menu.sections) {
    return []
  }
  return props.menu.sections
})

function openItemMedia(item) {
  if (!showMedia(item)) return
  selectedMedia.value = {
    image: resolveImageSrc(item),
    video: resolveVideoSrc(item),
    alt: resolveItemAlt(item),
  }
}

function showMedia(item) {
  if (!showImagesEnabled.value) return false
  return hasImage(item)
}

// Determine if an item has a usable image
function hasImage(item) {
  if (!item) return false
  const img = item.image
  if (!img) return false
  if (typeof img === 'string') return img.trim().length > 0
  if (typeof img === 'object') {
    // common shapes: { src: '...', url: '...' }
    const src = img.src || img.url || img.path || ''
    return typeof src === 'string' && src.trim().length > 0
  }
  return false
}

function resolveImageSrc(item) {
  if (!item) return ''
  const img = item.image
  if (!img) return ''
  if (typeof img === 'string') return img
  if (typeof img === 'object') return img.src || img.url || img.path || ''
  return ''
}

function resolveVideoSrc(item) {
  if (!item || !item.video) return ''
  const video = item.video
  if (typeof video === 'string') return video
  if (typeof video === 'object') return video.src || video.url || video.path || ''
  return ''
}

function resolveItemAlt(item) {
  if (!item || !item.name) return ''
  if (typeof item.name === 'string') return item.name
  if (typeof item.name === 'object') {
    return item.name.en || item.name.fa || ''
  }
  return ''
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
