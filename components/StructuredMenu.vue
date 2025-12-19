<template>
  <div
    class="w-full mx-auto p-4 md:px-8"
    :class="showImagesEnabled ? 'max-w-6xl' : 'max-w-2xl md:max-w-3xl'"
    :dir="currentLang === 'fa' ? 'rtl' : 'ltr'"
  >
      <div v-if="sections && sections.length">
          <section
            v-for="(section, sIdx) in sections"
            :key="sIdx"
            class="pb-10 mb-8 md:mb-10 last:pb-0 last:mb-0"
          >
            <h2
              class="text-[1.65rem] md:text-[1.85rem] mb-1"
              :class="isRTL ? 'text-right' : 'text-left'"
            >
              <span v-if="isRTL" class="block font-b-titr mb-1" dir="rtl">{{ translateCopy(section.title) }}</span>
              <span v-else class="block font-cinzel font-light tracking-wide">{{ translateCopy(section.title) }}</span>
            </h2>
            <div class="h-px bg-black/70 mb-6"></div>
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
const runtimeConfig = useRuntimeConfig()

const INTERNAL_MEDIA_HOSTS = new Set([
  'backend',
  'backend:8000',
  'localhost',
  'localhost:3000',
  'localhost:8000',
  '127.0.0.1',
  '127.0.0.1:3000',
  '127.0.0.1:8000',
])

const mediaOrigin = computed(() => {
  const candidates = [runtimeConfig.public?.siteDomain, runtimeConfig.public?.apiBaseUrl]
  for (const raw of candidates) {
    if (!raw) continue
    try {
      const url = new URL(raw)
      return `${url.protocol}//${url.host}`
    } catch (error) {
      // ignore invalid candidate
    }
  }
  if (process.client && typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
})

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
  return !!resolveImageSrc(item)
}

function extractMediaValue(item, key = 'image') {
  if (!item) return ''
  const media = item[key]
  if (!media) return ''
  if (typeof media === 'string') return media
  if (typeof media === 'object') return media.src || media.url || media.path || ''
  return ''
}

function resolveImageSrc(item) {
  const raw = extractMediaValue(item, 'image')
  return normalizeMediaUrl(raw)
}

function resolveVideoSrc(item) {
  const raw = extractMediaValue(item, 'video')
  return normalizeMediaUrl(raw)
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

function normalizeMediaUrl(raw) {
  const value = (raw || '').trim()
  if (!value) return ''

  if (value.startsWith('data:')) return value
  if (value.startsWith('//')) return `https:${value}`

  const baseOrigin = mediaOrigin.value

  try {
    const parsed = new URL(value)
    const hostWithPort = parsed.port ? `${parsed.hostname}:${parsed.port}` : parsed.hostname
    const baseUrl = baseOrigin ? new URL(baseOrigin) : null
    const baseHost = baseUrl ? (baseUrl.port ? `${baseUrl.hostname}:${baseUrl.port}` : baseUrl.hostname) : ''

    if (
      baseUrl &&
      (INTERNAL_MEDIA_HOSTS.has(hostWithPort) || (parsed.protocol === 'http:' && hostWithPort === baseHost && baseOrigin.startsWith('https://')))
    ) {
      parsed.protocol = baseUrl.protocol
      parsed.hostname = baseUrl.hostname
      parsed.port = baseUrl.port
      return parsed.toString()
    }

    return parsed.toString()
  } catch (error) {
    // not an absolute URL; fall through to relative handling
  }

  if (!baseOrigin) return value

  try {
    const normalizedPath = value.startsWith('/') ? value : `/${value}`
    return new URL(normalizedPath, baseOrigin).toString()
  } catch (error) {
    return value
  }
}
</script>

<style scoped>
/* Smooth transitions for interactive elements */
.group {
  transition: all 0.3s ease;
}

.shadow-sm { box-shadow: 0 0.0625rem 0.1875rem rgba(0,0,0,0.06); }

</style>
