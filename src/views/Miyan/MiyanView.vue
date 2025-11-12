<template>
  <div>
    <!-- Hero Section -->
    <section class="w-full h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <video ref="heroVideo" 
            :src="siteMedia.heroVideo" 
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

    <!-- Navigation -->
    <div class="nav-placeholder">
      <div ref="navbarSentinel" :style="sentinelStyle"></div>
      <section 
        ref="navbarRef" 
        class="py-2 shadow-sm transition-all duration-300" 
        :style="navInlineStyle"
      >
        <div class="max-w-4xl mx-auto px-6">
          <div class="flex justify-center gap-4">
            <router-link
              :to="{ path: getLocalizedPath('') }"
              class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-lg md:text-xl font-semibold"
              :class="[{ 
                'font-bold': $route.name === 'MiyanGallery' 
              }, { 
                'font-cinzel font-light': lang === 'en' 
              }]"
            >
              {{ lang === 'fa' ? 'گالری' : 'Gallery' }}
            </router-link>
            <router-link
              :to="{ path: getLocalizedPath('projects') }"
              class="px-6 py-3 rounded-[1px] transition-transform duration-200 transform-gpu hover:scale-105 uppercase tracking-wide text-lg md:text-xl font-semibold"
              :class="[{ 
                'font-bold': $route.name === 'MiyanProjects' 
              }, { 
                'font-cinzel font-light': lang === 'en' 
              }]"
            >
              {{ lang === 'fa' ? 'پروژه‌ها' : 'Projects' }}
            </router-link>
          </div>
        </div>
      </section>
    </div>
    <!-- Smooth overlay used during attach/detach animations -->
      <section
        ref="overlayRef"
        v-show="overlayVisible"
        class="fixed left-0 right-0 z-60 pointer-events-none"
        style="will-change: top, background, backdrop-filter;"
      >
        <div class="max-w-4xl mx-auto px-6">
          <div class="flex justify-center gap-4"></div>
        </div>
      </section>
  </div>
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

// overlay animation parameters (match other Miyan variants)
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
const detachTop = ref(null)
const overlayRef = ref(null)
const overlayVisible = ref(false)
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
function updateDetachTop() {
  if (navbarRef.value) {
    const r = navbarRef.value.getBoundingClientRect()
    detachTop.value = Math.round(r.top)
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

// simpler attachment state driven by sentinel position
const heroVideo = ref(null)
const attached = ref(false)
const isNavFixed = computed(() => attached.value)
const HEADER_BG_DURATION = 500
const NAV_TOP_DURATION = 350
const NAV_RETURN_DURATION = 400

const navTargetOpacity = computed(() => (isNavFixed.value ? 0.85 : 1))
const navBgOpacity = ref(navTargetOpacity.value)
watch(navTargetOpacity, (v) => { navBgOpacity.value = v }, { immediate: true })

watch(attached, (newVal) => { navAttached.value = !!newVal }, { immediate: true })

// Smooth attach/detach animation using overlay technique
async function runAttachSequenceView() {
  if (!navbarRef.value || !overlayRef.value) return
  
  const navbarRect = navbarRef.value.getBoundingClientRect()
  const headerH = headerHeight.value || 0
  const startTop = navbarRect.top + window.scrollY
  
  // Clone navbar content to overlay at current position
  overlayRef.value.innerHTML = navbarRef.value.innerHTML
  overlayRef.value.style.top = `${startTop}px`
  overlayRef.value.style.left = '0'
  overlayRef.value.style.width = '100vw'
  overlayRef.value.style.padding = '0.5rem 0'
  overlayRef.value.style.backgroundColor = `rgba(255,255,255, 1)`
  overlayRef.value.style.backdropFilter = 'none'
  overlayRef.value.style.boxShadow = 'none'
  overlayRef.value.style.transition = 'none'
  overlayRef.value.style.transform = 'translateY(0)'
  overlayRef.value.style.opacity = '1'
  overlayVisible.value = true
  
  // Force reflow to ensure overlay is rendered
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  
  // Smoothly animate to header position with backdrop filter
  overlayRef.value.style.transition = `top ${NAV_RETURN_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background ${HEADER_BG_DURATION}ms ease, backdrop-filter ${HEADER_BG_DURATION}ms ease, box-shadow ${HEADER_BG_DURATION}ms ease`
  overlayRef.value.style.top = `${headerH}px`
  overlayRef.value.style.backgroundColor = `rgba(255,255,255, 0.85)`
  overlayRef.value.style.backdropFilter = 'saturate(120%) blur(6px)'
  overlayRef.value.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
  
  // Wait for animation to complete
  await new Promise(r => setTimeout(r, NAV_RETURN_DURATION + 30))
  
  // Hide original navbar and show attached state
  if (navbarRef.value) navbarRef.value.style.visibility = 'hidden'
  navAttached.value = true
  overlayVisible.value = false
}

async function runDetachSequenceView() {
  if (!navbarRef.value || !overlayRef.value) return
  
  const headerH = headerHeight.value || 0
  
  // Show original navbar first (but keep it invisible during animation)
  navAttached.value = false
  
  // Force layout recalculation to get natural position
  if (navbarRef.value) {
    navbarRef.value.style.visibility = 'hidden'
  }
  
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  
  // Calculate where navbar should be in natural flow
  const sentinelRect = navbarSentinel.value?.getBoundingClientRect()
  const targetTop = sentinelRect ? sentinelRect.top + window.scrollY : headerH + 100
  
  // Clone to overlay at header position with attached styling
  overlayRef.value.innerHTML = navbarRef.value.innerHTML
  overlayRef.value.style.top = `${headerH}px`
  overlayRef.value.style.left = '0'
  overlayRef.value.style.width = '100vw'
  overlayRef.value.style.padding = '0.5rem 0'
  overlayRef.value.style.backgroundColor = `rgba(255,255,255, 0.85)`
  overlayRef.value.style.backdropFilter = 'saturate(120%) blur(6px)'
  overlayRef.value.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
  overlayRef.value.style.transition = 'none'
  overlayRef.value.style.transform = 'translateY(0)'
  overlayRef.value.style.opacity = '1'
  overlayVisible.value = true
  
  // Force reflow
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  
  // Smoothly animate to natural position, removing backdrop filter
  overlayRef.value.style.transition = `top ${NAV_RETURN_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background ${HEADER_BG_DURATION}ms ease, backdrop-filter ${HEADER_BG_DURATION}ms ease, box-shadow ${HEADER_BG_DURATION}ms ease`
  overlayRef.value.style.top = `${targetTop}px`
  overlayRef.value.style.backgroundColor = `rgba(255,255,255, 1)`
  overlayRef.value.style.backdropFilter = 'none'
  overlayRef.value.style.boxShadow = 'none'
  
  // Wait for animation to complete
  await new Promise(r => setTimeout(r, NAV_RETURN_DURATION + 30))
  
  // Show original navbar again
  if (navbarRef.value) navbarRef.value.style.visibility = ''
  overlayVisible.value = false
  detachTop.value = null
}

watch(attached, (newVal, oldVal) => {
  if (oldVal === false && newVal === true) {
    runAttachSequenceView()
  } else if (oldVal === true && newVal === false) {
    runDetachSequenceView()
  }
})

const navInlineStyle = computed(() => {
  const baseStyle = {
    backgroundColor: `rgba(255,255,255, ${navBgOpacity.value})`,
    backdropFilter: isNavFixed.value ? 'saturate(120%) blur(6px)' : 'none',
    transition: `background ${HEADER_BG_DURATION}ms ease, backdrop-filter ${HEADER_BG_DURATION}ms ease`
  }
  
  if (isNavFixed.value) {
    // Fixed state (attached to header) - smooth transition
    return {
      ...baseStyle,
      position: 'fixed',
      top: 'var(--header-height)',
      left: '0',
      width: '100vw',
      zIndex: '30',
      transform: 'translateY(0)',
      transition: `top ${NAV_TOP_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background ${HEADER_BG_DURATION}ms ease, backdrop-filter ${HEADER_BG_DURATION}ms ease`
    }
  }

  // Normal flow state - no special positioning needed
  return {
    ...baseStyle,
    position: 'relative',
    transform: 'translateY(0)',
    transition: `background ${HEADER_BG_DURATION}ms ease, backdrop-filter ${HEADER_BG_DURATION}ms ease`
  }
})

const sentinelStyle = computed(() => {
  const delta = (headerInitialHeight.value && headerHeight.value) ? Math.max(0, headerInitialHeight.value - headerHeight.value) : 0
  const h = Math.max(0, (navHeight.value || 0) - delta)
  if (isNavFixed.value || overlayVisible.value) {
    return { 
      height: `${navHeight.value || h}px`, 
      transition: `height ${NAV_RETURN_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`, 
      backgroundColor: 'var(--surface, #fff)' 
    }
  }
  return { 
    height: '0px', 
    transition: `height ${NAV_RETURN_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`, 
    backgroundColor: 'var(--surface, #fff)' 
  }
})

watch(isNavFixed, (v) => { navAttached.value = !!v }, { immediate: true })

onMounted(() => {
  animationComplete = false
  startIntroTransition()
  window.addEventListener('scroll', setAlphaFromScroll, { passive: true })
  // init sticky measurements
  // reset scroll on reload
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo({ top: 0 })

  // video intro: wait for canplay then start
  const v = heroVideo.value
  if (v && v.readyState >= 3) {
    startIntroTransition()
  } else if (v) {
    const onCan = () => { startIntroTransition(); v.removeEventListener('canplay', onCan) }
    v.addEventListener('canplay', onCan)
  } else {
    startIntroTransition()
  }

  updateNavTop(); updateNavHeight(); onScrollTrack(); checkAttachment()
  window.addEventListener('scroll', onScrollTrack, { passive: true })
  window.addEventListener('scroll', () => { checkAttachment() }, { passive: true })
  window.addEventListener('resize', () => { updateNavTop(); updateNavHeight(); onScrollTrack(); checkAttachment() })
  window.addEventListener('load', () => { updateNavTop(); updateNavHeight(); onScrollTrack(); checkAttachment() })

  // swipe handlers for child views
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
      if (Math.abs(dy) > Math.abs(dx)) return
      e.preventDefault()
    }
    const onTouchEnd = () => {
      moving = false
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        const path = route.path
        const seg = path.split('/').filter(Boolean)
        const langSeg = seg[0] === 'en' || seg[0] === 'fa' ? seg[0] : lang.value
        const a = `/${langSeg}`
        // implement a generic sibling switch: if path ends with 'projects' go to '', else go to 'projects'
        const base = `/${langSeg}/` 
        const projects = `/${langSeg}/projects`
        if (dx < 0) {
          if (path !== projects) router.push({ path: projects })
        } else {
          if (path !== base) router.push({ path: base })
        }
      }
      dx = 0; dy = 0
    }
    swipeEl.addEventListener('touchstart', onTouchStart, { passive: true })
    swipeEl.addEventListener('touchmove', onTouchMove, { passive: false })
    swipeEl.addEventListener('touchend', onTouchEnd)
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
.font-cinzel { font-family: 'Cinzel', serif; }

.nav-placeholder {
  position: relative;
}

.nav-placeholder section {
  width: 100%;
}


.navbar-sticky { position: sticky; top: var(--header-height); z-index: 30; }
@media (min-width: 768px) { .navbar-sticky { top: var(--header-height); } }
</style>
