<template>
  <section class="w-full h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0 hero-fill-safe">
  <video ref="heroVideo" :src="siteMedia.bereshtHeroVideo" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover"/>
      <div
        class="absolute inset-0 transition-all"
        :style="{
          background: `rgba(0,0,0,${modalOverlayAlpha})`,
          transition: overlayTransition
        }"
      ></div>
    </div>
    <div class="relative z-10 text-center px-6 max-w-xs mx-auto">
      <img :src="siteMedia.bereshtLogo" alt="Miyan Beresht" class="w-full h-auto drop-shadow-lg brightness-0 invert" />
    </div>
  </section>
  
  <!-- Toggle Buttons -->
  <div class="nav-placeholder">
  <div ref="navbarSentinel" :style="sentinelStyle"></div>
  <section ref="navbarRef" class="py-2 shadow-sm transition-all" :style="navInlineStyle" dir="ltr">
      <div class="max-w-4xl mx-auto px-12">
        <div class="flex flex-wrap justify-around">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="{ path: getLocalizedPath(item.path) }"
            class="px-4 md:px-3 py-3 w-1/3 text-center transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-base md:text-lg font-semibold"
            :class="[
              { 'font-bold': $route.name === item.name },
              lang === 'en' ? 'font-cinzel font-light' : 'font-b-titr'
            ]"
          >
            {{ isRTL ? item.label.fa : item.label.en }}
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <!-- Child Router View -->
  <div ref="childSwipe" class="child-swipe-wrapper">
    <Transition :name="childTransition" mode="out-in">
      <router-view :key="$route.fullPath" />
    </Transition>
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
  { name: 'MiyanBereshtDailyMenu', path: 'beresht/daily-menu', label: { fa: 'پخت روز', en: "Today's Special" } },
  { name: 'MiyanBereshtBaseMenu', path: 'beresht/menu', label: { fa: 'منو', en: 'Beresht Menu' } },
  { name: 'MiyanBereshtLanding', path: 'beresht', label: { fa: 'خانه برشت', en: 'Beresht Home' } },
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
