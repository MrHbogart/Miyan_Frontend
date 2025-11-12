<template>
  <section class="w-full h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
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
  <div class="nav-placeholder">
  <div ref="navbarSentinel" :style="sentinelStyle"></div>
  <section ref="navbarRef" class="py-2 shadow-sm transition-all duration-300" :style="navInlineStyle">
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex justify-center gap-4">
          <router-link
            :to="{ path: getLocalizedPath('madi') }"
            class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-lg md:text-xl font-semibold"
            :class="[{ 'font-bold': $route.name === 'MiyanMadiBaseMenu' }, { 'font-cinzel font-light': lang === 'en' }]"
          >
            {{ lang === 'fa' ? 'منوی اصلی' : 'Menu' }}
          </router-link>
          <router-link
            :to="{ path: getLocalizedPath('madi/daily-menu') }"
            class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-lg md:text-xl font-semibold"
            :class="[{ 'font-bold': $route.name === 'MiyanMadiDailyMenu' }, { 'font-cinzel font-light': lang === 'en' }]"
          >
            {{ lang === 'fa' ? 'پخت روز' : "Today's Special" }}
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <!-- Child Router View -->
  <div ref="childSwipe" class="child-swipe-wrapper">
    <router-view />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { lang } from '@/state/lang'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { headerHeight, headerInitialHeight, navAttached } from '@/state/headerState'

// Use local defaults only (backend doesn't provide siteMedia)
const siteMedia = siteMediaDefaults

// fetch madi menu from backend to build an overview
const { data: madiMenuData } = useDataFetcher(api.getMadiMenu, { autoLoad: true, initialValue: null })
const allMenuItems = computed(() => {
  const d = madiMenuData.value
  if (!d) return []
  const menu = Array.isArray(d) ? (d[0] || {}) : d
  const sections = menu.sections || []
  return sections.flatMap(s => s.items || [])
})
const overview = computed(() => allMenuItems.value.slice(0, 3).map(i => ({ img: i.image, title: i.name })))

// overview is computed from backend-fetched menu items
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
const heroVideo = ref(null)
// simpler attachment state: when navbar hits header it becomes attached
const attached = ref(false)
const navHeight = ref(0)
const detachTop = ref(null)
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

function checkAttachment() {
  const sent = navbarSentinel.value
  if (!sent) return
  const rect = sent.getBoundingClientRect()
  const headerH = headerHeight.value || 0
  const shouldAttach = rect.top <= headerH + 1
  if (shouldAttach !== attached.value) attached.value = shouldAttach
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
// keep legacy computed for backward compat but prefer `attached` for animations
const isNavFixed = computed(() => attached.value)
// navbar animation timings and opacity syncing
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

// Watch for detachment (transition from fixed to non-fixed)
// sync shared navAttached state so Header can change transparency when navbar attaches
watch(attached, (newVal) => { navAttached.value = !!newVal }, { immediate: true })

// coordinate short attach/detach windows for smooth animations
watch(attached, (newVal, oldVal) => {
  if (oldVal === false && newVal === true) {
    // Start attach: placeholder stays full, navbar starts at 0 and animates up to -1vh
    isAttaching.value = true
    // trigger the upward animation on next frame
    requestAnimationFrame(() => { requestAnimationFrame(() => { isAttaching.value = false }) })
    // ensure returning flag holds placeholder during the animation window
    isReturningToFlow.value = true
    setTimeout(() => { isReturningToFlow.value = false }, NAV_RETURN_DURATION)
  }
  if (oldVal === true && newVal === false) {
    // capture current visual top so detachment doesn't 'drop' from a different position
    if (navbarRef.value) {
      const r = navbarRef.value.getBoundingClientRect()
      detachTop.value = Math.round(r.top)
    }
    // Detach: render navbar 1vh higher immediately, then animate it down 1vh
    isDetaching.value = true
    // trigger the downward animation on next frame
    requestAnimationFrame(() => { requestAnimationFrame(() => { isDetaching.value = false }) })
    // keep returning state so placeholder animates back to full height
    isReturningToFlow.value = true
    setTimeout(() => { isReturningToFlow.value = false; detachTop.value = null }, NAV_RETURN_DURATION)
  }
}, { immediate: true })

const navInlineStyle = computed(() => {
  const baseStyle = {
    backgroundColor: `rgba(255,255,255, ${navBgOpacity.value})`,
    transition: `background ${HEADER_BG_DURATION}ms ease`
  }
  
  if (!isNavFixed.value) {
    // Not fixed - either returning to flow, detaching, attaching, or already there
    if (isDetaching.value || isReturningToFlow.value) {
      // During detachment/return we render the navbar as an overlay at detachTop
      const topPx = (detachTop.value != null) ? `${detachTop.value}px` : 'var(--header-height)'
      const tr = isDetaching.value ? 'translateY(-1vh)' : 'translateY(0)'
      return {
        ...baseStyle,
        position: 'fixed',
        top: topPx,
        left: '0',
        width: '100vw',
        zIndex: '60',
        transform: tr,
        transition: `transform ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1), background ${HEADER_BG_DURATION}ms ease`
      }
    }

    if (isAttaching.value) {
      // initial attach state: start at translateY(0) then RAF will flip isAttaching and animate to -1vh
      return {
        ...baseStyle,
        position: 'fixed',
        top: 'var(--header-height)',
        left: '0',
        width: '100vw',
        zIndex: '60',
        transform: 'translateY(0)',
        transition: `transform ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1), background ${HEADER_BG_DURATION}ms ease`
      }
    }

    // fully in-flow (no special animation), render as non-fixed
    return {
      ...baseStyle,
      transform: 'translateY(0)',
      transition: `transform ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1), background ${HEADER_BG_DURATION}ms ease`
    }

    // fully in-flow (no special animation), render as non-fixed
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
    transform: 'translateY(0)',
    transition: `top ${NAV_TOP_DURATION}ms cubic-bezier(.2,.9,.2,1), background ${HEADER_BG_DURATION}ms ease`
  }
})
// placeholder height should reduce together with header height reduction
const sentinelStyle = computed(() => {
  // header reduction delta: initial - current
  const delta = (headerInitialHeight.value && headerHeight.value) ? Math.max(0, headerInitialHeight.value - headerHeight.value) : 0
  const h = Math.max(0, (navHeight.value || 0) - delta)
  // Keep the placeholder height while the navbar is fixed or while it is returning/attaching/detaching
  if (isNavFixed.value || isReturningToFlow.value || isAttaching.value || isDetaching.value) {
    const basePx = navHeight.value || h
    // Attachment: during isAttaching we keep full height then animate to reduced (-1vh)
    if (isAttaching.value) return { height: `${basePx}px`, transition: 'height 0ms', backgroundColor: 'var(--surface, #fff)' }
    // Attached final or returning: compute target using calc to mix px and vh
    if (isNavFixed.value && !isAttaching.value) return { height: `calc(${basePx}px - 1vh)`, transition: `height ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1)`, backgroundColor: 'var(--surface, #fff)' }
    // Detaching: start reduced and animate to full
    if (isDetaching.value || isReturningToFlow.value) return { height: `${basePx}px`, transition: `height ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1)`, backgroundColor: 'var(--surface, #fff)' }
    return { height: `${basePx}px`, transition: `height ${NAV_RETURN_DURATION}ms cubic-bezier(.34,.5,.8,1)`, backgroundColor: 'var(--surface, #fff)' }
  }
  // when not fixed and not returning, collapse the placeholder
  return { height: '0px', transition: `height 0ms`, backgroundColor: 'var(--surface, #fff)' }
})

// sync shared navAttached state so Header can change transparency when navbar attaches
watch(isNavFixed, (v) => { navAttached.value = !!v }, { immediate: true })

onMounted(() => {
  animationComplete = false
  // ensure reload starts from top
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo({ top: 0 })

  // wait for video to be ready then start intro transition
  const v = heroVideo.value
  if (v && v.readyState >= 3) {
    startIntroTransition()
  } else if (v) {
    const onCan = () => { startIntroTransition(); v.removeEventListener('canplay', onCan) }
    v.addEventListener('canplay', onCan)
  } else {
    startIntroTransition()
  }

  window.addEventListener('scroll', setAlphaFromScroll, { passive: true })
  // init sticky measurements
  updateNavTop(); updateNavHeight(); onScrollTrack(); checkAttachment()
  window.addEventListener('scroll', onScrollTrack, { passive: true })
  window.addEventListener('scroll', () => { checkAttachment() }, { passive: true })
  window.addEventListener('resize', () => { updateNavTop(); updateNavHeight(); onScrollTrack(); checkAttachment() })
  window.addEventListener('load', () => { updateNavTop(); updateNavHeight(); onScrollTrack(); checkAttachment() })

  // Setup swipe handlers for child view switching
  const swipeEl = document.querySelector('.child-swipe-wrapper')
  if (swipeEl) {
    let startX = 0, startY = 0, dx = 0, dy = 0, moving = false
    const threshold = 60
    const onTouchStart = (e) => {
      const t = e.touches && e.touches[0]
      startX = t ? t.clientX : e.clientX
      startY = t ? t.clientY : e.clientY
      moving = true
    }
    const onTouchMove = (e) => {
      if (!moving) return
      const t = e.touches && e.touches[0]
      dx = (t ? t.clientX : e.clientX) - startX
      dy = (t ? t.clientY : e.clientY) - startY
      // if vertical scroll is dominant, ignore
      if (Math.abs(dy) > Math.abs(dx)) return
      e.preventDefault()
    }
    const onTouchEnd = () => {
      moving = false
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        // navigate between the two child routes
        const path = route.path
        const seg = path.split('/').filter(Boolean)
        const langSeg = seg[0] === 'en' || seg[0] === 'fa' ? seg[0] : lang.value
        const base = `/${langSeg}/madi`
        const daily = `/${langSeg}/madi/daily-menu`
        if (dx < 0) {
          // swipe left -> go to daily
          if (path !== daily) {
            router.push({ path: daily })
          }
        } else {
          // swipe right -> go to base
          if (path !== base) {
            router.push({ path: base })
          }
        }
      }
      dx = 0; dy = 0
    }
    swipeEl.addEventListener('touchstart', onTouchStart, { passive: true })
    swipeEl.addEventListener('touchmove', onTouchMove, { passive: false })
    swipeEl.addEventListener('touchend', onTouchEnd)
    // store removal functions on element for cleanup
    swipeEl.__swipeCleanup = () => {
      swipeEl.removeEventListener('touchstart', onTouchStart)
      swipeEl.removeEventListener('touchmove', onTouchMove)
      swipeEl.removeEventListener('touchend', onTouchEnd)
    }
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', setAlphaFromScroll)
  window.removeEventListener('scroll', onScrollTrack)
  window.removeEventListener('resize', () => { updateNavTop(); updateNavHeight(); onScrollTrack() })
  window.removeEventListener('load', () => { updateNavTop(); updateNavHeight(); onScrollTrack() })
  const swipeEl = document.querySelector('.child-swipe-wrapper')
  if (swipeEl && swipeEl.__swipeCleanup) swipeEl.__swipeCleanup()
  if (rafId) cancelAnimationFrame(rafId)
})

function getLocalizedPath(p) {
  // build a path that preserves current lang if present
  const seg = route.path.split('/').filter(Boolean)[0]
  const currentLang = seg === 'en' || seg === 'fa' ? seg : lang.value
  return `/${currentLang}/${p}`
}
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
</style>
