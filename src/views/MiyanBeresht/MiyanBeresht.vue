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
  <section ref="navbarRef" class="py-2 shadow-sm transition-all duration-300" :style="navInlineStyle">
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex justify-center gap-4">
          <router-link
            :to="{ path: getLocalizedPath('beresht') }"
            class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-lg md:text-xl font-semibold"
            :class="[{ 'font-bold': $route.name === 'MiyanBereshtBaseMenu' }, { 'font-cinzel font-light': lang === 'en' }]"
          >
            {{ lang === 'fa' ? 'منوی اصلی' : 'Menu' }}
          </router-link>
          <router-link
            :to="{ path: getLocalizedPath('beresht/daily-menu') }"
            class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-lg md:text-xl font-semibold"
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { lang } from '@/state/lang'
import { useRoute } from 'vue-router'
const route = useRoute()
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { headerHeight, headerInitialHeight, navAttached } from '@/state/headerState'

// Use local defaults only (backend doesn't provide siteMedia)
const siteMedia = siteMediaDefaults

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

const HEADER_BG_DURATION = 500
const NAV_TOP_DURATION = 240
const NAV_RETURN_DURATION = 300

// Track when navbar is returning to flow (animates smoothly back to position)
const isReturningToFlow = ref(false)
// short-lived flags to coordinate attach/detach animations and placeholder hold
const isAttaching = ref(false)
const isDetaching = ref(false)

const navTargetOpacity = computed(() => (isNavFixed.value ? 0.85 : 1))
const navBgOpacity = ref(navTargetOpacity.value)
watch(navTargetOpacity, (v) => { navBgOpacity.value = v }, { immediate: true })

// Watch for attach/detach and coordinate short animations
watch(isNavFixed, (newVal, oldVal) => {
  if (oldVal === false && newVal === true) {
    isAttaching.value = true
    setTimeout(() => { isAttaching.value = false }, NAV_RETURN_DURATION)
  }
  if (oldVal === true && newVal === false) {
    isDetaching.value = true
    isReturningToFlow.value = true
    setTimeout(() => { isDetaching.value = false }, 80)
    setTimeout(() => { isReturningToFlow.value = false }, NAV_RETURN_DURATION)
  }
})

const navInlineStyle = computed(() => {
  const baseStyle = {
    backgroundColor: `rgba(255,255,255, ${navBgOpacity.value})`,
    transition: `background ${HEADER_BG_DURATION}ms ease`
  }
  
  if (!isNavFixed.value) {
    // Not fixed - either returning to flow, detaching, attaching, or already there
    if (isDetaching.value) {
      return {
        ...baseStyle,
        position: 'fixed',
        top: 'var(--header-height)',
        left: '0',
        width: '100vw',
        zIndex: '60',
        transform: 'translateY(0)',
        transition: `background ${HEADER_BG_DURATION}ms ease`
      }
    }
    if (isReturningToFlow.value || isAttaching.value) {
      return {
        ...baseStyle,
        position: 'fixed',
        top: 'var(--header-height)',
        left: '0',
        width: '100vw',
        zIndex: '60',
        transform: 'translateY(-8px)',
        transition: `transform ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1), background ${HEADER_BG_DURATION}ms ease`
      }
    }
    return {
      ...baseStyle,
      transform: 'translateY(0)',
      transition: `transform ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1), background ${HEADER_BG_DURATION}ms ease`
    }
  }
  
  // Fixed state (attached to header)
  return {
    ...baseStyle,
    position: 'fixed',
    top: 'var(--header-height)',
    left: '0',
    width: '100vw',
    zIndex: '30',
    transition: `top ${NAV_TOP_DURATION}ms cubic-bezier(.2,.9,.2,1), background ${HEADER_BG_DURATION}ms ease`
  }
})

const sentinelStyle = computed(() => {
  const delta = (headerInitialHeight.value && headerHeight.value) ? Math.max(0, headerInitialHeight.value - headerHeight.value) : 0
  const h = Math.max(0, (navHeight.value || 0) - delta)
  if (isNavFixed.value || isReturningToFlow.value || isAttaching.value || isDetaching.value) {
    const t = (isReturningToFlow.value || isAttaching.value) ? `height ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1)` : 'height 0ms'
    return { height: `${h}px`, transition: t, backgroundColor: 'var(--surface, #fff)' }
  }
  return { height: '0px', transition: `height 0ms`, backgroundColor: 'var(--surface, #fff)' }
})

watch(isNavFixed, (v) => { navAttached.value = !!v }, { immediate: true })

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
