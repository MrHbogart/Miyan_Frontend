<template>
  <header
    dir="ltr"
    class="fixed w-full top-0 left-0 z-40"
    :style="[
      headerStyle,
      {
        backgroundColor: `rgba(255,255,255, ${headerBgOpacity})`,
        borderBottom: headerBgOpacity ? '0px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 240ms ease, backdrop-filter 240ms ease'
      }
    ]"
  >
    <div class="status-safe-area" :style="statusStyle" />
    <div class="max-w-6xl mx-auto px-6 py-4 pt-5 md:pt-4">
      <div :class="['header-grid', scrolled ? 'header-visible' : 'header-hidden']">
        <div class="flex items-center justify-center header-logo">
          <NuxtLink :to="linkTargets.beresht" class="logo-link" :class="{ 'is-active': isActive(linkTargets.beresht) }">
            <template v-if="lang === 'fa'">
              <img :src="siteMedia.bereshtLogo" alt="Miyan Beresht" class="logo-img" />
            </template>
            <template v-else>
              <span class="logo-text">Miyan Beresht</span>
            </template>
          </NuxtLink>
        </div>
        <div class="flex items-center justify-center header-logo">
          <NuxtLink :to="linkTargets.home" class="logo-link" :class="{ 'is-active': isActive(linkTargets.home) }">
            <template v-if="lang === 'fa'">
              <img :src="siteMedia.miyanLogo" alt="Miyan" class="logo-img" />
            </template>
            <template v-else>
              <span class="logo-text logo-text--center">Miyan</span>
            </template>
          </NuxtLink>
        </div>
        <div class="flex items-center justify-center header-logo">
          <NuxtLink :to="linkTargets.madi" class="logo-link" :class="{ 'is-active': isActive(linkTargets.madi) }">
            <template v-if="lang === 'fa'">
              <img :src="siteMedia.madiLogo" alt="Miyan Madi" class="logo-img" />
            </template>
            <template v-else>
              <span class="logo-text">Miyan Madi</span>
            </template>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import siteMediaDefaults from '~/state/siteMediaDefaults'
import { useHeaderHeight, useNavAttached } from '~/composables/useHeaderState'

const { scrolled } = defineProps({ scrolled: { type: Boolean, default: false } })

const route = useRoute()
const langState = useLang()
const siteMedia = siteMediaDefaults
const headerHeight = useHeaderHeight()
const navAttached = useNavAttached()

const linkTargets = computed(() => {
  const currentLang = langState.value || 'fa'
  const toPath = (slug = '') => {
    const normalized = slug.replace(/^\/+/, '')
    return normalized ? `/${currentLang}/${normalized}` : `/${currentLang}/`
  }
  return {
    home: toPath(''),
    beresht: toPath('beresht'),
    madi: toPath('madi'),
  }
})

const isActive = (targetPath) => route.path.startsWith(targetPath)
const lang = computed(() => langState.value)

const headerTargetOpacity = computed(() => (navAttached.value ? 1 : (scrolled ? 0.85 : 0)))
const headerBgOpacity = ref(headerTargetOpacity.value)
watch(headerTargetOpacity, (v) => {
  headerBgOpacity.value = v
}, { immediate: true })

const headerStyle = computed(() => ({
  backdropFilter: scrolled ? 'saturate(120%) blur(5px)' : 'none',
  paddingTop: 'env(safe-area-inset-top)',
  WebkitPaddingTop: 'env(safe-area-inset-top)'
}))

const statusStyle = computed(() => ({
  backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : '#000000',
  backdropFilter: scrolled ? 'saturate(120%) blur(5px)' : 'none',
  transition: 'background 240ms ease, backdrop-filter 240ms ease'
}))

function updateHeaderBottom() {
  if (typeof document === 'undefined') return
  const el = document.querySelector('header')
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  try {
    const h = Math.ceil(rect.height)
    document.documentElement.style.setProperty('--header-height', `${Math.max(0, h - 2)}px`)
    headerHeight.value = h
  } catch (e) {
    // noop
  }
}

function ensureThemeMeta() {
  if (typeof document === 'undefined') return null
  let m = document.querySelector('meta[name="theme-color"]')
  if (!m) {
    m = document.createElement('meta')
    m.setAttribute('name', 'theme-color')
    document.head.appendChild(m)
  }
  return m
}

const themeMeta = process.client ? ensureThemeMeta() : null
if (themeMeta) {
  try { themeMeta.setAttribute('content', '#000000') } catch (e) {}
}

watch(headerBgOpacity, (v) => {
  if (!themeMeta) return
  const opacity = Math.max(0, Math.min(1, Number(v) || 0))
  try { themeMeta.setAttribute('content', opacity > 0.02 ? '#ffffff' : '#000000') } catch (e) {}
}, { immediate: true })

function ensureAppleMeta() {
  if (typeof document === 'undefined') return null
  let m = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
  if (!m) {
    m = document.createElement('meta')
    m.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
    document.head.appendChild(m)
  }
  return m
}

const appleMeta = process.client ? ensureAppleMeta() : null
if (appleMeta) {
  try { appleMeta.setAttribute('content', 'black-translucent') } catch (e) {}
}

let resizeObs = null
onMounted(() => {
  if (typeof window === 'undefined') return
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
  if (typeof window === 'undefined') return
  if (resizeObs) resizeObs.disconnect()
  window.removeEventListener('resize', updateHeaderBottom)
  window.removeEventListener('scroll', updateHeaderBottom)
})
</script>

<style scoped>
header {
  height: 10vh;
  transition: background-color 240ms ease, backdrop-filter 240ms ease;
}

.header-hidden {
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 200ms ease, transform 200ms ease;
}

.header-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 200ms ease, transform 200ms ease;
}

.header-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  column-gap: 12px;
}

.header-logo {
  height: 40px;
  margin-inline: 0.5rem;
}

@media (min-width: 768px) {
  .header-logo {
    height: 56px;
  }
}

.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  border-radius: 0;
  transition: transform 200ms ease, filter 200ms ease;
}

.logo-img {
  height: 100%;
  width: auto;
  aspect-ratio: 4/1;
  object-fit: contain;
  filter: brightness(0.96);
  transition: filter 200ms ease, transform 200ms ease;
}

.logo-link:not(.is-active):hover .logo-img,
.logo-link:not(.is-active):focus .logo-img,
.logo-link:not(.is-active):active .logo-img {
  filter: brightness(1.04);
  transform: scale(1.02) translateY(-1px);
}

.status-safe-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top);
  z-index: 45;
  transition: background-color 240ms ease, backdrop-filter 240ms ease;
  pointer-events: none;
}
</style>
