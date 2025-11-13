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
        class="py-2 shadow-sm transition-all" 
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

    <!-- Child Router View -->
    <div ref="childSwipe" class="child-swipe-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { lang } from '@/state/lang'
import { useRoute, useRouter } from 'vue-router'
import { useNavbarAttachment } from '@/composables/useNavbarAttachment'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { headerHeight, navAttached } from '@/state/headerState'

const route = useRoute()
const router = useRouter()
const siteMedia = siteMediaDefaults

// Hero video and overlay animation
const heroVideo = ref(null)
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

// Navbar attachment using simplified composable
const navbarRef = ref(null)
const navbarSentinel = ref(null)
const { navInlineStyle, sentinelStyle } = useNavbarAttachment(navbarRef, navbarSentinel)

// Fetch data
useDataFetcher(api)

function getLocalizedPath(p) {
  const seg = route.path.split('/').filter(Boolean)[0]
  const currentLang = seg === 'en' || seg === 'fa' ? seg : lang.value
  return `/${currentLang}/${p}`
}

// Lifecycle
onMounted(() => {
  animationComplete = false
  startIntroTransition()
  
  // Reset scroll on reload
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo({ top: 0 })

  // Start intro animation when video is ready
  const v = heroVideo.value
  if (v && v.readyState >= 3) {
    startIntroTransition()
  } else if (v) {
    const onCan = () => { startIntroTransition(); v.removeEventListener('canplay', onCan) }
    v.addEventListener('canplay', onCan)
  }

  window.addEventListener('scroll', setAlphaFromScroll, { passive: true })

  // Swipe gesture handlers for child views
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
  const swipeEl = document.querySelector('.child-swipe-wrapper')
  if (swipeEl && swipeEl.__swipeCleanup) swipeEl.__swipeCleanup()
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
