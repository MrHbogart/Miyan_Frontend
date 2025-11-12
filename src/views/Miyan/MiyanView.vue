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
    <div class="nav-placeholder overflow-visible">
      <div ref="navbarSentinel" :style="sentinelStyle"></div>
      <section 
        ref="navbarRef" 
        class="navbar-section" 
        :style="navInlineStyle"
      >
        <div class="max-w-4xl mx-auto px-6">
          <div class="flex justify-center gap-4 md:gap-6">
            <router-link
              :to="{ path: getLocalizedPath('') }"
              class="navbar-link"
              :class="[{ 
                'navbar-link--active': $route.name === 'MiyanGallery' 
              }, { 
                'font-cinzel font-light': lang === 'en' 
              }]"
            >
              {{ lang === 'fa' ? 'گالری' : 'Gallery' }}
            </router-link>
            <router-link
              :to="{ path: getLocalizedPath('projects') }"
              class="navbar-link"
              :class="[{ 
                'navbar-link--active': $route.name === 'MiyanProjects' 
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
    <!-- transform-only overlay used during attach/detach to avoid layout reflow -->
    <section
      ref="overlayRef"
      v-show="overlayVisible"
      class="navbar-overlay fixed left-0 right-0 z-60 pointer-events-none overflow-visible"
      :style="{ top: '0px', willChange: 'transform', transform: 'translateY(0)' }"
    ></section>
  </div>
  <div ref="childSwipe" class="child-swipe-wrapper overflow-visible">
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { lang } from '@/state/lang'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { useNavbarAttachment } from '@/composables/useNavbarAttachment'

// Use local defaults only (backend doesn't provide siteMedia)
const siteMedia = siteMediaDefaults

// Navbar attachment logic using composable
const navbarRef = ref(null)
const navbarSentinel = ref(null)
const overlayRef = ref(null)

const routes = [
  { path: '', name: 'MiyanGallery' },
  { path: 'projects', name: 'MiyanProjects' }
]

const {
  navInlineStyle,
  sentinelStyle,
  overlayVisible
} = useNavbarAttachment(navbarRef, navbarSentinel, overlayRef, routes)

// Enhanced overlay animation parameters with luxury transitions
const overlayStart = 1
const overlayBase = 0.4
const overlayMin = 0
const maxScroll = 380
const fadeMs = 1800
const EASING_LUXURY = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const EASING_SMOOTH = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

const modalOverlayAlpha = ref(overlayStart)
const overlayTransition = ref(`background ${fadeMs}ms ${EASING_LUXURY}`)
let animationComplete = false

function setAlphaFromScroll() {
  if (!animationComplete) return
  const y = window.scrollY || window.pageYOffset
  const t = Math.min(1, y / maxScroll)
  modalOverlayAlpha.value = overlayBase - t * (overlayBase - overlayMin)
}
function startIntroTransition() {
  modalOverlayAlpha.value = overlayStart
  overlayTransition.value = `background ${fadeMs}ms ${EASING_LUXURY}`
  setTimeout(() => {
    modalOverlayAlpha.value = overlayBase
    setTimeout(() => {
      animationComplete = true
      overlayTransition.value = `background 400ms ${EASING_SMOOTH}`
    }, fadeMs)
  }, 20)
}

// Hero video reference
const heroVideo = ref(null)

onMounted(() => {
  animationComplete = false
  startIntroTransition()
  window.addEventListener('scroll', setAlphaFromScroll, { passive: true })
  
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
  const swipeEl = document.querySelector('.child-swipe-wrapper')
  if (swipeEl && swipeEl.__swipeCleanup) swipeEl.__swipeCleanup()
})

function getLocalizedPath(p) {
  const seg = route.path.split('/').filter(Boolean)[0]
  const currentLang = seg === 'en' || seg === 'fa' ? seg : lang.value
  return `/${currentLang}/${p}`
}
</script>


<style scoped>
/* Luxury navbar styles */
.nav-placeholder {
  position: relative;
  overflow: visible;
}

.nav-placeholder section {
  width: 100%;
}

.navbar-section {
  padding: 1rem 0;
  overflow: visible;
}

.navbar-link {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 1rem;
  font-weight: 600;
  position: relative;
  overflow: visible;
  color: #1a1a1a;
}

@media (min-width: 768px) {
  .navbar-link {
    font-size: 1.125rem;
    padding: 0.875rem 2rem;
  }
}

.navbar-link::after {
  content: '';
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.4), transparent);
  border-radius: 2px;
  transition: transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.navbar-link:hover {
  transform: translateY(-2px);
  color: #0a0a0a;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.navbar-link--active {
  font-weight: 700;
  color: #0a0a0a;
}

.navbar-link--active::after {
  transform: translateX(-50%) scaleX(1);
}

.navbar-link:active {
  transform: translateY(0);
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.navbar-overlay {
  overflow: visible;
}

.navbar-sticky { 
  position: sticky; 
  top: var(--header-height); 
  z-index: 30; 
}

@media (min-width: 768px) { 
  .navbar-sticky { 
    top: var(--header-height); 
  } 
}

.rtl { 
  direction: rtl; 
  unicode-bidi: plaintext; 
}

.font-vazir { 
  font-family: 'Vazirmatn', Tahoma, serif; 
}

.font-cinzel { 
  font-family: 'Cinzel', serif; 
}
</style>
