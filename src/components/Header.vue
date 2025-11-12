<template>
  <header 
    :class="['fixed w-full top-0 left-0 z-40 overflow-visible', isCompact ? 'header-compact' : '', navAttached ? 'header-attached' : '']" 
    :style="[headerStyle, { 
      backgroundColor: `rgba(255, 255, 255, ${headerBgOpacity})`, 
      borderBottom: headerBgOpacity > 0.1 ? `1px solid rgba(0, 0, 0, ${0.05 * headerBgOpacity})` : 'none', 
      transition: `background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, height 600ms ${EASING_LUXURY}, box-shadow ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`,
      boxShadow: headerBgOpacity > 0.1 ? `0 2px 24px rgba(0, 0, 0, ${0.06 * headerBgOpacity}), 0 1px 4px rgba(0, 0, 0, ${0.08 * headerBgOpacity})` : 'none'
    }]"
  >
    <!-- Enhanced status-safe-area overlay for notch / status bar with smooth transitions -->
    <div class="status-safe-area" :style="statusStyle" />
    <div class="max-w-6xl mx-auto px-6 py-4 pt-5 md:pt-4 overflow-visible">
      <div :class="['header-grid', scrolled ? 'header-visible' : 'header-hidden']">
        <div class="flex items-center justify-center header-logo">
          <router-link to="/beresht" class="logo-link" :class="{ 'is-active': isActive('/beresht') }">
            <template v-if="lang === 'fa'">
              <img :src="siteMedia.bereshtLogo" alt="Miyan Beresht" class="logo-img" />
            </template>
            <template v-else>
              <span class="logo-text">Miyan Beresht</span>
            </template>
          </router-link>
        </div>
        <div class="flex items-center justify-center header-logo">
          <router-link to="/" class="logo-link" :class="{ 'is-active': isActive('/') }">
            <template v-if="lang === 'fa'">
              <img :src="siteMedia.miyanLogo" alt="Miyan" class="logo-img" />
            </template>
            <template v-else>
              <span class="logo-text logo-text--center">Miyan</span>
            </template>
          </router-link>
        </div>
        <div class="flex items-center justify-center header-logo">
          <router-link to="/madi" class="logo-link" :class="{ 'is-active': isActive('/madi') }">
            <template v-if="lang === 'fa'">
              <img :src="siteMedia.madiLogo" alt="Miyan Madi" class="logo-img" />
            </template>
            <template v-else>
              <span class="logo-text">Miyan Madi</span>
            </template>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, provide, watch } from 'vue'
import { useRoute } from 'vue-router'

const { scrolled } = defineProps({ scrolled: { type: Boolean, default: false } })

// Luxury animation constants
const HEADER_BG_DURATION = 600
const EASING_SMOOTH = 'cubic-bezier(0.4, 0.0, 0.2, 1)'
const EASING_LUXURY = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

const headerStyle = computed(() => ({
  backdropFilter: scrolled ? 'saturate(180%) blur(16px)' : 'none',
  // respect the device safe area (notch / status bar) with smooth transitions
  paddingTop: 'max(env(safe-area-inset-top), 0px)',
  WebkitPaddingTop: 'max(env(safe-area-inset-top), 0px)',
  transition: `backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`
}))

const route = useRoute()
const isActive = (to) => route.path === to
import { lang, setLang } from '@/state/lang'

import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { headerHeight, headerInitialHeight, navAttached } from '@/state/headerState'
// Use local defaults only (backend doesn't provide siteMedia)
const siteMedia = siteMediaDefaults

// Reactive header bottom Y (document space). Provided so descendants (views) can read it.
const headerBottomY = ref(0)
provide('headerBottomY', headerBottomY)

// expose headerHeight values to shared state so views can react to header shrink
// headerHeight and headerInitialHeight are refs imported from shared state
// (they'll be updated in `updateHeaderBottom` below)


function updateHeaderBottom() {
  const el = document.querySelector('header')
  if (!el) {
    headerBottomY.value = -1
    return
  }
  const rect = el.getBoundingClientRect()
  headerBottomY.value = Math.ceil(rect.bottom + window.scrollY)
  // Expose header height via CSS variable for sticky navbars
  try {
    const h = Math.ceil(rect.height)
    document.documentElement.style.setProperty('--header-height', `${h-2}px`)
    // update shared header heights
    headerHeight.value = h
    if (!headerInitialHeight.value) headerInitialHeight.value = h
  } catch (e) {
    // no-op
  }
}

// header/background opacity coordination with smooth transitions
const headerTargetOpacity = computed(() => {
  if (navAttached.value) return 0.98
  return scrolled ? 0.92 : 0
})
const headerBgOpacity = ref(headerTargetOpacity.value)
watch(headerTargetOpacity, (v) => {
  headerBgOpacity.value = v
}, { immediate: true })

// Keep the browser UI/status bar coherent with header color where supported
function ensureThemeMeta() {
  let m = document.querySelector('meta[name="theme-color"]')
  if (!m) {
    m = document.createElement('meta')
    m.setAttribute('name', 'theme-color')
    document.head.appendChild(m)
  }
  return m
}
const themeMeta = (typeof window !== 'undefined') ? ensureThemeMeta() : null
// initialize top area to black
document.documentElement.style.setProperty('--top-bg-color', '#000000')
if (themeMeta) try { themeMeta.setAttribute('content', '#000000') } catch (e) {}

// compute top-safe-area style directly from header opacity with luxury transitions
const topBgColor = computed(() => {
  const opacity = Math.max(0, Math.min(1, Number(headerBgOpacity.value) || 0))
  return opacity > 0.02 ? `rgba(255, 255, 255, ${opacity})` : '#000000'
})
const statusStyle = computed(() => ({
  backgroundColor: topBgColor.value,
  backdropFilter: scrolled ? 'saturate(180%) blur(16px)' : 'none',
  transition: `background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`,
  boxShadow: headerBgOpacity.value > 0.1 
    ? `0 1px 8px rgba(0, 0, 0, ${0.04 * headerBgOpacity.value})` 
    : 'none'
}))

// Keep theme meta in sync (solid colors only)
watch(headerBgOpacity, (v) => {
  if (!themeMeta) return
  const opacity = Math.max(0, Math.min(1, Number(v) || 0))
  try { themeMeta.setAttribute('content', opacity > 0.02 ? '#ffffff' : '#000000') } catch (e) { /* no-op */ }
}, { immediate: true })

// Also add apple-mobile-web-app-status-bar-style meta to allow overlaying the status bar
function ensureAppleMeta() {
  let m = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
  if (!m) {
    m = document.createElement('meta')
    m.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
    document.head.appendChild(m)
  }
  return m
}
const appleMeta = (typeof window !== 'undefined') ? ensureAppleMeta() : null
if (appleMeta) {
  try { appleMeta.setAttribute('content', 'black-translucent') } catch (e) { /* no-op */ }
}

let resizeObs = null
onMounted(() => {
  updateHeaderBottom()
  // watch for size changes
  try {
    resizeObs = new ResizeObserver(updateHeaderBottom)
    const el = document.querySelector('header')
    if (el) resizeObs.observe(el)
  } catch (e) {
    // fallback: window resize
    window.addEventListener('resize', updateHeaderBottom)
  }
  // also update on scroll because document scroll affects absolute Y
  window.addEventListener('scroll', updateHeaderBottom, { passive: true })
})
onUnmounted(() => {
  if (resizeObs) resizeObs.disconnect()
  window.removeEventListener('resize', updateHeaderBottom)
  window.removeEventListener('scroll', updateHeaderBottom)
})

const isActiveLocal = isActive
function setLanguage(l) { setLang(l) }

// Compact header when page is beyond 91vh
const scrollY = ref(window.scrollY || 0)
const viewportH = ref(window.innerHeight || 0)
function onScrollHeader() {
  scrollY.value = window.scrollY || window.pageYOffset
}
function onResizeHeader() {
  viewportH.value = window.innerHeight || 0
}
const isCompact = computed(() => {
  // Trigger at 90vh
  const threshold = Math.round((viewportH.value || window.innerHeight) * 0.9)
  return (scrollY.value || 0) >= threshold
})
onMounted(() => {
  window.addEventListener('scroll', onScrollHeader, { passive: true })
  window.addEventListener('resize', onResizeHeader)
  onResizeHeader(); onScrollHeader()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScrollHeader)
  window.removeEventListener('resize', onResizeHeader)
})
</script>

<style scoped>
.logo { color: var(--brand, #2b2b2b); font-family: Inter, ui-sans-serif; }
header { 
  height: 10vh; 
  transition: height 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, background-color, backdrop-filter;
}
.header-compact { height: 9vh; }
.header-attached { height: calc(10vh - 1vh); }

/* Elegant child visibility transitions with luxury easing */
.header-hidden { 
  opacity: 0; 
  transform: translateY(-8px) scale(0.98); 
  transition: opacity 500ms cubic-bezier(0.4, 0.0, 0.2, 1), 
              transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.header-visible { 
  opacity: 1; 
  transform: translateY(0) scale(1); 
  transition: opacity 600ms cubic-bezier(0.4, 0.0, 0.2, 1), 
              transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.header-visible .logo, .header-visible nav, .header-visible button { 
  opacity: 1; 
  transform: none;
  transition: opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.header-hidden .logo, .header-hidden nav, .header-hidden button { 
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.header-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  align-items: center; 
  column-gap: 12px;
  overflow: visible;
}

.header-logo {
  height: 40px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  overflow: visible;
}
@media (min-width: 768px) {
  .header-logo { height: 56px; }
}

.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  border-radius: 10px;
  padding: 4px 8px;
  transition: transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              filter 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
              box-shadow 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  position: relative;
  overflow: visible;
}

.logo-link.is-active {
  filter: brightness(1);
}

.logo-link.is-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 2px;
  transition: width 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.logo-img {
  height: 100%;
  width: auto;
  max-width: 82px;
  aspect-ratio: 4/1;
  object-fit: contain;
  filter: brightness(0.98) grayscale(0);
  transition: filter 400ms cubic-bezier(0.4, 0.0, 0.2, 1), 
              transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Elegant hover animations for non-active logos */
.logo-link:not(.is-active):hover .logo-img,
.logo-link:not(.is-active):focus .logo-img {
  filter: brightness(1.08) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
  transform: scale(1.04) translateY(-2px);
}

.logo-link:not(.is-active):active .logo-img {
  transform: scale(1.02) translateY(-1px);
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Enhanced status-safe-area overlay with luxury transitions */
.status-safe-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top);
  z-index: 45;
  transition: background-color 600ms cubic-bezier(0.4, 0.0, 0.2, 1), 
              backdrop-filter 600ms cubic-bezier(0.4, 0.0, 0.2, 1),
              box-shadow 600ms cubic-bezier(0.4, 0.0, 0.2, 1);
  pointer-events: none;
  overflow: visible;
}

/* Enhanced English logo text styling with luxury animations */
.logo-text {
  display: inline-flex;
  align-items: center;
  text-align: center;
  height: 100%;
  font-family: 'Cinzel', serif;
  font-weight: 400;
  letter-spacing: 0.03em;
  color: #1a1a1a;
  line-height: 1;
  padding: 0 6px;
  font-size: 20px;
  transition: color 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
              transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              text-shadow 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
@media (min-width: 768px) {
  .logo-text { font-size: 26px; }
}
.logo-text--center { font-weight: 450; font-size: 24px; }
@media (min-width: 768px) { .logo-text--center { font-size: 28px; } }

.logo-link:not(.is-active):hover .logo-text,
.logo-link:not(.is-active):focus .logo-text {
  color: #0a0a0a;
  transform: scale(1.05) translateY(-2px);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  font-weight: 500;
}

.logo-link:not(.is-active):active .logo-text {
  transform: scale(1.02) translateY(-1px);
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
</style>
