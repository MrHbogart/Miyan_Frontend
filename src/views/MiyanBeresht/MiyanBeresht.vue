<template>
  <section class="w-full h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
  <video :src="siteMedia.heroVideo" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover"/>
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
    <section ref="navbarRef" class="bg-white py-2 shadow-sm transition-all duration-300" :style="navInlineStyle">
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex justify-center gap-4">
          <router-link
            :to="{ path: getLocalizedPath('beresht') }"
            class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-base md:text-lg"
            :class="[{ 'font-bold': $route.name === 'MiyanBereshtBaseMenu' }, { 'font-cinzel font-light': lang === 'en' }]"
          >
            {{ lang === 'fa' ? 'منوی اصلی' : 'Menu' }}
          </router-link>
          <router-link
            :to="{ path: getLocalizedPath('beresht/daily-menu') }"
            class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-base md:text-lg"
            :class="[{ 'font-bold': $route.name === 'MiyanBereshtDailyMenu' }, { 'font-cinzel font-light': lang === 'en' }]"
          >
            {{ lang === 'fa' ? 'پخت روز' : "Today's Special" }}
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <!-- Child Router View -->
  <router-view />
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { lang } from '@/state/lang'
import { useRoute } from 'vue-router'
const route = useRoute()
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'
import siteMediaDefaults from '@/utils/siteMediaDefaults'

const { data: siteMediaData } = useDataFetcher(api.getSiteMedia, { autoLoad: true, initialValue: {} })
const siteMedia = computed(() => {
  const apiVal = siteMediaData.value || {}
  return {
    heroVideo: apiVal.heroVideo || siteMediaDefaults.heroVideo,
    miyanLogo: apiVal.miyanLogo || siteMediaDefaults.miyanLogo,
    bereshtLogo: apiVal.bereshtLogo || siteMediaDefaults.bereshtLogo,
    madiLogo: apiVal.madiLogo || siteMediaDefaults.madiLogo,
  }
})

function getLocalizedPath(p) {
  const seg = route.path.split('/').filter(Boolean)[0]
  const currentLang = seg === 'en' || seg === 'fa' ? seg : lang.value
  return `/${currentLang}/${p}`
}
const overlayStart = 1
const overlayBase = 0.4
const overlayMin = 0
const maxScroll = 380
const fadeMs = 1500
const modalOverlayAlpha = ref(overlayStart)
const overlayTransition = ref(`background ${fadeMs}ms cubic-bezier(.55,.06,.21,.95)`)
let animationComplete = false
function setAlphaFromScroll() {
  if (!animationComplete) return
  const y = window.scrollY || window.pageYOffset
  const t = Math.min(1, y / maxScroll)
  modalOverlayAlpha.value = overlayBase - t * (overlayBase - overlayMin)
}
function startIntroTransition() {
  modalOverlayAlpha.value = overlayStart
  overlayTransition.value = `background ${fadeMs}ms cubic-bezier(.55,.06,.21,.95)`
  setTimeout(() => {
    modalOverlayAlpha.value = overlayBase
    setTimeout(() => {
      animationComplete = true
      overlayTransition.value = 'background 340ms cubic-bezier(.46,1.2,.34,1.01)'
    }, fadeMs)
  }, 20)
}
// dynamic sticky below 10vh header
const navbarRef = ref(null)
const navbarSentinel = ref(null)
const navHeight = ref(0)
const scrollY = ref(window.scrollY || 0)
const navbarTopY = ref(-1)
let rafId = null

function updateNavTop() {
  const el = navbarSentinel.value || navbarRef.value
  if (el) {
    const r = el.getBoundingClientRect()
    navbarTopY.value = Math.ceil(r.top + window.scrollY)
  } else {
    navbarTopY.value = -1
  }
}
function updateNavHeight() {
  if (navbarRef.value) navHeight.value = navbarRef.value.offsetHeight || 0
}
function onScrollTrack() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    scrollY.value = window.scrollY || window.pageYOffset
    updateNavTop()
    rafId = null
  })
}
const headerHeightVh = 9
const isNavFixed = computed(() => {
  const thresholdPx = Math.round(window.innerHeight * 0.9)
  return (scrollY.value || 0) >= thresholdPx
})
const navInlineStyle = computed(() => {
  if (!isNavFixed.value) return {}
  return {
    position: 'fixed',
    top: 'var(--header-height)',
    left: '0',
    width: '100vw',
    zIndex: '30',
    transition: 'top 200ms ease'
  }
})
const sentinelStyle = computed(() => {
  if (!isNavFixed.value) return {}
  const delta = Math.max(0, Math.round(window.innerHeight * 0.01))
  const h = Math.max(0, (navHeight.value || 0) - delta)
  return { height: `${h}px`, transition: 'height 200ms ease' }
})

onMounted(() => {
  animationComplete = false
  startIntroTransition()
  window.addEventListener('scroll', setAlphaFromScroll, { passive: true })
  // init sticky measurements
  updateNavTop(); updateNavHeight(); onScrollTrack()
  window.addEventListener('scroll', onScrollTrack, { passive: true })
  window.addEventListener('resize', () => { updateNavTop(); updateNavHeight(); onScrollTrack() })
  window.addEventListener('load', () => { updateNavTop(); updateNavHeight(); onScrollTrack() })
})
onUnmounted(() => {
  window.removeEventListener('scroll', setAlphaFromScroll)
  window.removeEventListener('scroll', onScrollTrack)
  window.removeEventListener('resize', () => { updateNavTop(); updateNavHeight(); onScrollTrack() })
  window.removeEventListener('load', () => { updateNavTop(); updateNavHeight(); onScrollTrack() })
  if (rafId) cancelAnimationFrame(rafId)
})
</script>
<style scoped>
@keyframes fadein-menu {
  from { opacity: 0; transform: translateY(12px) scale(.97); }
  to { opacity: 1; transform: none; }
}
.animate-fadein-menu {
  opacity: 0;
  animation: fadein-menu 1.5s cubic-bezier(.47,.19,.17,1.03) both;
}
.group-hover\:scale-102:hover { transform: scale(1.02); }
.group-hover\:brightness-104:hover { filter: brightness(1.04); }
.group-active\:scale-97:active { transform: scale(0.97); }
.rtl { direction: rtl; unicode-bidi: plaintext; }
.font-vazir { font-family: 'Vazirmatn', Tahoma, serif; }

.nav-placeholder {
  position: relative;
}

.nav-placeholder section {
  width: 100%;
}

.navbar-sticky { position: sticky; top: var(--header-height); z-index: 30; }

@media (min-width: 768px) { .navbar-sticky { top: var(--header-height); } }
</style>
