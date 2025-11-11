<template>
  <header :class="['fixed w-full top-0 left-0 z-40 transition-all duration-500', scrolled ? 'backdrop-blur-sm bg-white/70 border-b border-white/6 shadow-sm' : 'bg-transparent', isCompact ? 'header-compact' : '']" :style="headerStyle">
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
import { computed, ref, onMounted, onUnmounted, provide } from 'vue'
import { useRoute } from 'vue-router'

const { scrolled } = defineProps({ scrolled: { type: Boolean, default: false } })
const headerStyle = computed(() => ({
  backdropFilter: scrolled ? 'saturate(120%) blur(6px)' : 'none'
}))

const route = useRoute()
const isActive = (to) => route.path === to
import { lang, setLang } from '../state/lang'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'

const { data: siteMediaData } = useDataFetcher(api.getSiteMedia, { autoLoad: true, initialValue: {} })
const siteMedia = computed(() => siteMediaData.value || {})

// Reactive header bottom Y (document space). Provided so descendants (views) can read it.
const headerBottomY = ref(0)
provide('headerBottomY', headerBottomY)

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
  } catch (e) {
    // no-op
  }
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
header { height: 10vh; transition: height 500ms ease; }
.header-compact { height: 9vh; }

/* child visibility transitions */
.header-hidden { opacity: 0; transform: translateY(-6px); transition: opacity 420ms ease, transform 420ms cubic-bezier(.2,.9,.2,1) }
.header-visible { opacity: 1; transform: translateY(0); transition: opacity 420ms ease, transform 420ms cubic-bezier(.2,.9,.2,1) }
.header-visible .logo, .header-visible nav, .header-visible button { opacity: 1; transform: none }
.header-hidden .logo, .header-hidden nav, .header-hidden button { opacity: 0 }
.header-grid { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; column-gap: 12px; }
.header-logo {
  height: 40px;
  @apply mx-2;
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
  transition: transform 430ms cubic-bezier(.19,.9,.33,1.19), filter 430ms cubic-bezier(.19,.9,.33,1.19);
}
.logo-img {
  height: 100%;
  width: auto;
  max-width: 82px;
  aspect-ratio: 4/1;
  object-fit: contain;
  filter: brightness(0.96) grayscale(0);
  transition: filter 430ms cubic-bezier(.19,.9,.33,1.19), transform 430ms cubic-bezier(.19,.9,.33,1.19);
}
/* Only non-active gets hover animation */
.logo-link:not(.is-active):hover .logo-img,
.logo-link:not(.is-active):focus .logo-img,
.logo-link:not(.is-active):active .logo-img {
  filter: brightness(1.05);
  transform: scale(1.03) translateY(-1px);
  font-weight: 600;
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
  color: #1f2937; /* gray-800 */
  line-height: 1;
  padding: 0 6px;
  /* size tuned to match image height container (40px mobile, 56px md) */
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
  font-weight: 600;
}
</style>
