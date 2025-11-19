<template>
  <div>
    <!-- Hero Section -->
    <section class="w-full h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0 hero-fill-safe">
          <video ref="heroVideo" 
            :src="siteMedia.miyanHeroVideo" 
            autoplay 
            muted 
            loop 
            playsinline 
            class="absolute inset-0 w-full h-full object-cover"
          />
        <div
          class="absolute inset-0 transition-all"
          :style="{ 
            background: `rgba(0,0,0,${modalOverlayAlpha})`, 
            transition: overlayTransition 
          }"
        ></div>
      </div>
      <div class="relative z-10 text-center px-6 max-w-xs mx-auto">
        <img 
          :src="siteMedia.miyanLogo" 
          alt="Miyan Logo" 
          class="w-full h-auto drop-shadow-lg brightness-0 invert"
        />
      </div>
    </section>
    <MiyanLanding />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { lang } from '@/state/lang'
import { useRoute, useRouter } from 'vue-router'
import { useNavbarAttachment } from '@/composables/useNavbarAttachment'
import siteMediaDefaults from '@/state/siteMediaDefaults'
import { useHeroIntro } from '@/composables/useHeroIntro'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'
import MiyanLanding from './MiyanLanding.vue'

const route = useRoute()
const router = useRouter()
const siteMedia = siteMediaDefaults

const { heroVideo, modalOverlayAlpha, overlayTransition } = useHeroIntro({
  overlayBase: 0.4,
  scrollRange: 380,
})

// Navbar attachment using simplified composable
const navbarRef = ref(null)
const navbarSentinel = ref(null)
const { navInlineStyle, sentinelStyle } = useNavbarAttachment(navbarRef, navbarSentinel)
const childSwipe = ref(null)
const childTransition = ref('swipe-left')

const navItems = [
  { name: 'MiyanGallery', path: 'gallery', label: { fa: 'گالری', en: 'Gallery' } },
  { name: 'MiyanLanding', path: '', label: { fa: 'خانه', en: 'Home' } },
  { name: 'MiyanProjects', path: 'projects', label: { fa: 'پروژه‌ها', en: 'Projects' } },
]

const isRTL = computed(() => lang.value === 'fa')
const childRouteOrder = navItems.map(item => item.name)
let previousChildName = route.name || childRouteOrder[0]

watch(() => route.name, (nextName) => {
  if (!nextName) return
  const fromIndex = childRouteOrder.indexOf(previousChildName)
  const toIndex = childRouteOrder.indexOf(nextName)
  if (fromIndex === -1 || toIndex === -1) {
    previousChildName = nextName
    return
  }
  childTransition.value = toIndex > fromIndex ? 'swipe-left' : 'swipe-right'
  previousChildName = nextName
}, { immediate: true })

function resolveLang() {
  const seg = route.params.lang
  if (seg === 'en' || seg === 'fa') return seg
  const pathSeg = route.path.split('/').filter(Boolean)[0]
  if (pathSeg === 'en' || pathSeg === 'fa') return pathSeg
  return lang.value
}

function getLocalizedPath(p) {
  const currentLang = resolveLang()
  const normalized = p ? p.replace(/^\/+/, '') : ''
  return normalized ? `/${currentLang}/${normalized}` : `/${currentLang}/`
}

function shiftChild(step) {
  const currentName = route.name
  const currentIndex = childRouteOrder.indexOf(currentName)
  if (currentIndex === -1) return
  const targetIndex = currentIndex + step
  if (targetIndex < 0 || targetIndex >= childRouteOrder.length) return
  const targetName = childRouteOrder[targetIndex]
  router.push({ name: targetName, params: { lang: resolveLang() } })
}

useSwipeNavigation(childSwipe, {
  onLeft: () => shiftChild(1),
  onRight: () => shiftChild(-1),
})
</script>

<style scoped>
.nav-placeholder {
  position: relative;
}

.nav-placeholder section {
  width: 100%;
}
</style>
