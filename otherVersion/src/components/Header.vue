<template>
  <header
    ref="headerRef"
    dir="ltr"
    class="site-header fixed top-0 left-0 z-50 w-full"
    :class="headerClasses"
  >
    <div class="status-safe-area" />
    <div class="max-w-6xl mx-auto px-6 py-4 pt-5 md:pt-4">
      <div class="header-grid">
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { lang } from '@/state/lang'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { headerHeight } from '@/state/headerState'
import { scrollY } from '@/state/scrollState'

const route = useRoute()
const siteMedia = siteMediaDefaults
const headerRef = ref(null)

const isActive = (to) => route.path === to

const lastScrollY = ref(0)
const scrollDirection = ref('up')
watch(scrollY, (value) => {
	const delta = value - lastScrollY.value
	if (Math.abs(delta) > 2) {
		scrollDirection.value = delta > 0 ? 'down' : 'up'
	}
	lastScrollY.value = value
})

const isDetached = computed(() => scrollY.value > 16)
const isHidden = computed(() => scrollY.value > 140 && scrollDirection.value === 'down')
const headerClasses = computed(() => ({
	'is-detached': isDetached.value,
	'is-hidden': isHidden.value,
}))

function updateHeaderMetrics() {
	const el = headerRef.value
	if (!el) return
	const rect = el.getBoundingClientRect()
	const height = Math.round(rect.height)
	if (Number.isFinite(height)) {
		headerHeight.value = height
		document.documentElement.style.setProperty('--header-height', `${height}px`)
	}
}

let resizeObserver = null
onMounted(() => {
	updateHeaderMetrics()
	if (typeof window !== 'undefined') {
		window.addEventListener('resize', updateHeaderMetrics)
	}
	try {
		resizeObserver = new ResizeObserver(() => updateHeaderMetrics())
		if (headerRef.value) resizeObserver.observe(headerRef.value)
	} catch (err) {
		resizeObserver = null
	}
})

onUnmounted(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('resize', updateHeaderMetrics)
	}
	if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
.site-header {
  min-height: clamp(3.5rem, 10vh, 5.5rem);
  padding-top: env(safe-area-inset-top);
  transition:
    transform 320ms var(--easing-smooth),
    background-color 320ms var(--easing-smooth),
    box-shadow 320ms var(--easing-smooth),
    border-color 320ms var(--easing-smooth),
    backdrop-filter 320ms var(--easing-smooth);
  transform: translate3d(0, 0, 0);
  background-color: rgba(255, 255, 255, 0);
  border-bottom: 0.0625rem solid rgba(255, 255, 255, 0);
  will-change: transform, background-color, box-shadow;
}
.site-header.is-detached {
  background-color: rgba(255, 255, 255, 0.96);
  border-bottom-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 0.75rem 2.125rem rgba(0, 0, 0, 0.08);
  backdrop-filter: saturate(130%) blur(0.875rem);
}
.site-header.is-hidden {
  transform: translate3d(0, -110%, 0);
}

.header-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  column-gap: 0.75rem;
  transition: opacity 260ms var(--easing-smooth), transform 260ms var(--easing-smooth);
}
.site-header.is-hidden .header-grid {
  opacity: 0;
  transform: translate3d(0, -0.5rem, 0);
}
.header-logo {
  height: clamp(2.5rem, 4vw, 3.5rem);
  margin-inline: 0.5rem;
}

.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: transform 300ms cubic-bezier(.19,.9,.33,1.19), filter 300ms cubic-bezier(.19,.9,.33,1.19);
}
.logo-img {
  height: 100%;
  width: auto;
  max-width: 5.125rem;
  aspect-ratio: 4/1;
  object-fit: contain;
  filter: brightness(0.96) grayscale(0);
  transition: filter 300ms cubic-bezier(.19,.9,.33,1.19), transform 300ms cubic-bezier(.19,.9,.33,1.19);
}
.logo-link.is-active .logo-img {
  filter: brightness(1.12) drop-shadow(0 0.5rem 1.5rem rgba(0,0,0,0.35));
  transform: scale(1.05);
}
.logo-link:not(.is-active):hover .logo-img,
.logo-link:not(.is-active):focus .logo-img,
.logo-link:not(.is-active):active .logo-img {
  filter: brightness(1.05);
  transform: scale(1.03) translateY(-0.0625rem);
}

.status-safe-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top, 0rem);
  z-index: 55;
  pointer-events: none;
  opacity: 0;
  transition: opacity 250ms var(--easing-smooth), background-color 250ms var(--easing-smooth), backdrop-filter 250ms var(--easing-smooth);
}
.site-header.is-detached .status-safe-area {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(130%) blur(0.75rem);
}

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
  padding: 0 0.375rem;
  font-size: 1.25rem;
}
@media (min-width: 48rem) {
  .logo-text { font-size: 1.625rem; }
}
.logo-text--center { font-weight: 450; font-size: 1.5rem; }
@media (min-width: 48rem) { .logo-text--center { font-size: 1.625rem; } }
.logo-link:not(.is-active):hover .logo-text,
.logo-link:not(.is-active):focus .logo-text,
.logo-link:not(.is-active):active .logo-text {
  filter: brightness(1.05);
  transform: scale(1.03) translateY(-0.0625rem);
  transition: transform 300ms cubic-bezier(.19,.9,.33,1.19);
}
</style>
