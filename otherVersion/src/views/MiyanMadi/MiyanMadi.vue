<template>
  <section class="hero-shell brand-surface brand-surface--madi w-full h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0 hero-fill-safe">
  <video ref="heroVideo" :src="siteMedia.heroVideo" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover"/>
      <div
        class="absolute inset-0 transition-all"
        :style="{
          background: `rgba(0,0,0,${modalOverlayAlpha})`,
          transition: overlayTransition
        }"
      ></div>
    </div>
    <div class="relative z-10 text-center px-6 max-w-xs mx-auto">
      <img :src="siteMedia.madiLogo" alt="Miyan Madi" class="w-full h-auto drop-shadow-lg brightness-0 invert" />
    </div>
  </section>
  
  <!-- Toggle Buttons -->
  <StickyNavbar
    :items="navItems"
    :build-path="getLocalizedPath"
    :is-rtl="isRTL"
    :active-route="$route.name || ''"
    surface-class="brand-surface brand-surface--madi"
  />

  <!-- Child Router View -->
  <div ref="childSwipe" class="child-swipe-wrapper brand-surface brand-surface--madi">
    <router-view v-slot="{ Component }">
      <Transition :name="childTransition" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { lang } from '@/state/lang'
import { useRoute, useRouter } from 'vue-router'
import StickyNavbar from '@/components/StickyNavbar.vue'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { useHeroIntro } from '@/composables/useHeroIntro'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'

const route = useRoute()
const router = useRouter()
const siteMedia = siteMediaDefaults

const { heroVideo, modalOverlayAlpha, overlayTransition } = useHeroIntro({
  overlayBase: 0.4,
  scrollRange: 380,
})

const childSwipe = ref(null)
const childTransition = ref('swipe-left')

const navItems = [
  { name: 'MiyanMadiLanding', path: 'madi', label: { fa: 'مرور', en: 'Landing' } },
  { name: 'MiyanMadiBaseMenu', path: 'madi/menu', label: { fa: 'منوی اصلی', en: 'Menu' } },
  { name: 'MiyanMadiDailyMenu', path: 'madi/daily-menu', label: { fa: 'پخت روز', en: "Today's Special" } },
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
  const resolved = resolveLang()
  const normalized = p ? p.replace(/^\/+/, '') : ''
  return normalized ? `/${resolved}/${normalized}` : `/${resolved}/`
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
