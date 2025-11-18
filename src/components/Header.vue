<template>
  <header 
    dir="ltr"
    class="fixed w-full top-0 left-0 z-40" 
    :style="[headerStyle, { 
      backgroundColor: `rgba(255,255,255, ${headerBgOpacity})`, 
      borderBottom: headerBgOpacity ? '1px solid rgba(255,255,255,0.06)' : 'none', 
      transition: `background 400ms ease, backdrop-filter 400ms ease` 
    }]"
  >
    <!-- Enhanced status-safe-area overlay for notch / status bar with smooth transitions -->
    <div class="status-safe-area" :style="statusStyle" />
    <div class="max-w-6xl mx-auto px-6 py-4 pt-5 md:pt-4">
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
import { lang } from '@/state/lang'
import siteMediaDefaults from '@/state/siteMediaDefaults'
import { headerHeight, navAttached } from '@/state/headerState'

const { scrolled } = defineProps({ scrolled: { type: Boolean, default: false } })

const route = useRoute()
const isActive = (to) => route.path === to
const siteMedia = siteMediaDefaults

// Header state
const headerBottomY = ref(0)
provide('headerBottomY', headerBottomY)

// Background opacity: header fades when navbar attaches
// Initially: 0.85 (when scrolled), becomes 1 when navbar attaches
const headerTargetOpacity = computed(() => {
  // When navbar is attached, header becomes fully opaque
  if (navAttached.value) return 1
  // Otherwise, follow scroll state (0.85 when scrolled, 0 when not)
  return scrolled ? 0.85 : 0
})
const headerBgOpacity = ref(headerTargetOpacity.value)
watch(headerTargetOpacity, (v) => {
  headerBgOpacity.value = v
}, { immediate: true })

// Header style with backdrop filter
const headerStyle = computed(() => ({
  backdropFilter: scrolled ? 'saturate(120%) blur(6px)' : 'none',
  paddingTop: 'env(safe-area-inset-top)',
  WebkitPaddingTop: 'env(safe-area-inset-top)'
}))

// Update header bottom Y position
function updateHeaderBottom() {
  const el = document.querySelector('header')
  if (!el) {
    headerBottomY.value = -1
    return
  }
  const rect = el.getBoundingClientRect()
  headerBottomY.value = Math.ceil(rect.bottom + window.scrollY)
  
  // Expose header height via CSS variable
  try {
    const h = Math.ceil(rect.height)
    document.documentElement.style.setProperty('--header-height', `${h-2}px`)
    headerHeight.value = h
  } catch (e) {
    // no-op
  }
}

// Status bar styling
const statusStyle = computed(() => ({
  backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : '#000000',
  backdropFilter: scrolled ? 'saturate(120%) blur(6px)' : 'none',
  transition: 'background 400ms ease, backdrop-filter 400ms ease'
}))

// Setup theme meta tags
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
document.documentElement.style.setProperty('--top-bg-color', '#000000')
if (themeMeta) try { themeMeta.setAttribute('content', '#000000') } catch (e) {}

// Watch header opacity to update theme meta
watch(headerBgOpacity, (v) => {
  if (!themeMeta) return
  const opacity = Math.max(0, Math.min(1, Number(v) || 0))
  try { themeMeta.setAttribute('content', opacity > 0.02 ? '#ffffff' : '#000000') } catch (e) {}
}, { immediate: true })

// Setup apple meta tag for status bar
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
  try { appleMeta.setAttribute('content', 'black-translucent') } catch (e) {}
}

// Observe header size changes
let resizeObs = null
onMounted(() => {
  updateHeaderBottom()
  try {
    resizeObs = new ResizeObserver(updateHeaderBottom)
    const el = document.querySelector('header')
    if (el) resizeObs.observe(el)
  } catch (e) {
    window.addEventListener('resize', updateHeaderBottom)
  }
  window.addEventListener('scroll', updateHeaderBottom, { passive: true })
})

onUnmounted(() => {
  if (resizeObs) resizeObs.disconnect()
  window.removeEventListener('resize', updateHeaderBottom)
  window.removeEventListener('scroll', updateHeaderBottom)
})
</script>

<style scoped>
header { 
  height: 10vh; 
  transition: background-color 400ms ease, backdrop-filter 400ms ease;
}

/* Child visibility transitions */
.header-hidden { opacity: 0; transform: translateY(-6px); transition: opacity 320ms ease, transform 320ms cubic-bezier(.2,.9,.2,1) }
.header-visible { opacity: 1; transform: translateY(0); transition: opacity 320ms ease, transform 320ms cubic-bezier(.2,.9,.2,1) }

.header-grid { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; column-gap: 12px; }
.header-logo {
  height: 40px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
@media (min-width: 768px) {
  .header-logo { height: 56px; }
}

.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 300ms cubic-bezier(.19,.9,.33,1.19), filter 300ms cubic-bezier(.19,.9,.33,1.19);
}
.logo-img {
  height: 100%;
  width: auto;
  aspect-ratio: 4/1;
  object-fit: contain;
  filter: brightness(0.96) grayscale(0);
  transition: filter 300ms cubic-bezier(.19,.9,.33,1.19), transform 300ms cubic-bezier(.19,.9,.33,1.19);
}
/* Only non-active gets hover animation */
.logo-link:not(.is-active):hover .logo-img,
.logo-link:not(.is-active):focus .logo-img,
.logo-link:not(.is-active):active .logo-img {
  filter: brightness(1.05);
  transform: scale(1.03) translateY(-1px);
}

/* Status-safe-area overlay styles */
.status-safe-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top);
  z-index: 45;
  transition: background-color 400ms ease, backdrop-filter 400ms ease;
  pointer-events: none;
}

/* English logo text styling */
.logo-text {
  display: inline-flex;
  align-items: center;
  text-align: center;
  height: 100%;
  font-family: 'Cinzel', serif;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: #1f2937;
  line-height: 1;
  padding: 0 6px;
  font-size: 20px;
}
@media (min-width: 768px) {
  .logo-text { font-size: 26px; }
}
.logo-text--center { font-weight: 450; font-size: 24px; }
@media (min-width: 768px) { .logo-text--center { font-size: 26px; } }
.logo-link:not(.is-active):hover .logo-text,
.logo-link:not(.is-active):focus .logo-text,
.logo-link:not(.is-active):active .logo-text {
  filter: brightness(1.05);
  transform: scale(1.03) translateY(-1px);
  transition: transform 300ms cubic-bezier(.19,.9,.33,1.19);
}
</style>
