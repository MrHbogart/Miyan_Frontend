<template>
  <div class="view-shell">
    <section class="relative w-full flex items-center justify-center overflow-hidden"
      :style="{ height: 'calc(var(--app-vh-fixed, var(--vh, 1vh)) * 100)' }">
      <div class="absolute inset-0 z-0 hero-fill-safe">
        <video ref="heroVideo" :src="siteMedia.madiHeroVideo" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover hero-video"/>
        <div
          class="absolute inset-0 transition-all"
          :style="{
            background: `rgba(0,0,0,${modalOverlayAlpha})`,
            transition: overlayTransition
          }"
        ></div>
      </div>
      <div class="relative z-10 text-center px-6 max-w-xs mx-auto hero-content">
        <img :src="siteMedia.madiLogo" alt="Miyan Madi" class="w-full h-auto drop-shadow-lg brightness-0 invert" />
      </div>
    </section>
    
    <!-- Toggle Buttons -->
    <div class="nav-placeholder">
    <div ref="navbarSentinel" :style="sentinelStyle"></div>
    <section ref="navbarRef" class="shadow-sm transition-all flex justify-center" :style="navInlineStyle" :dir="isRTL ? 'rtl' : 'ltr'">
        <div class="nav-inner">
          <div
            :class="[
              'flex flex-row w-full items-center justify-between gap-1 text-center',
              isRTL ? 'flex-row-reverse' : ''
            ]"
          >
            <NuxtLink
              v-for="item in displayNavItems"
              :key="item.name"
              :to="getLocalizedPath(item.path)"
              class="flex-1 min-w-0 inline-flex items-center justify-center w-full h-full px-4 md:px-6 py-3.5 md:py-4 transition-transform duration-200 transform-gpu hover:scale-105 uppercase text-base md:text-lg font-semibold nav-link"
              :class="[
                { 'font-bold nav-link--active': isActive(item.path) },
                { 'font-cinzel tracking-wide': !isRTL },
                { 'font-b-titr tracking-normal': isRTL }
              ]"
            >
              {{ isRTL ? item.label.fa : item.label.en }}
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>

    <!-- Child Router View -->
    <div ref="childSwipe" class="child-swipe-wrapper">
      <Transition :name="childTransition" mode="out-in">
        <div :key="routeKey">
          <slot />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNavbarAttachment } from '@/composables/useNavbarAttachment'
import siteMediaDefaults from '@/state/siteMediaDefaults'
import { useHeroIntro } from '@/composables/useHeroIntro'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'
import { useLocalizedChildRoutes } from '@/composables/useLocalizedChildRoutes'
import { useMenuPrefetch } from '@/composables/useMenuData'
import { navigationCopy } from '@/state/siteCopy'
import { useLang } from '~/composables/useLang'

const siteMedia = siteMediaDefaults
const route = useRoute()

const { heroVideo, modalOverlayAlpha, overlayTransition } = useHeroIntro({
  overlayBase: 0.4,
  scrollRange: 380,
})

const navbarRef = ref(null)
const navbarSentinel = ref(null)
const { navInlineStyle, sentinelStyle } = useNavbarAttachment(navbarRef, navbarSentinel)
const childSwipe = ref(null)

const navConfig = navigationCopy.miyanMadi
const langState = useLang()
const lang = computed(() => langState.value)
const isRTL = computed(() => lang.value === 'fa')
const displayNavItems = computed(() => (isRTL.value ? [...navConfig].reverse() : navConfig))
const { childTransition, getLocalizedPath, shiftChild } = useLocalizedChildRoutes(displayNavItems)
const routeKey = computed(() => route.fullPath)

useMenuPrefetch('madi')

const isActive = (rawPath = '') => {
  const normalized = rawPath.replace(/^\/+/, '')
  const segments = route.path.split('/').filter(Boolean).slice(1)
  return segments.join('/') === normalized
}

useSwipeNavigation(childSwipe, {
  onLeft: () => shiftChild(1),
  onRight: () => shiftChild(-1),
})
</script>

<style scoped>
.nav-placeholder {
  position: relative;
  padding-left: 0;
  padding-right: 0;
}

.nav-placeholder section {
  width: 100%;
}

.view-shell {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  min-height: calc(var(--app-vh-fixed, var(--vh, 1vh)) * 100);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background: var(--surface, #fdfcfa);
}

.hero-video {
  transition: transform 320ms cubic-bezier(.2,.9,.25,1), opacity 260ms ease;
  will-change: transform, opacity;
  min-width: 100%;
  min-height: 100%;
  transform-origin: center center;
}
.hero-content {
  transition: transform 420ms cubic-bezier(.2,.9,.25,1), opacity 320ms ease;
  will-change: transform, opacity;
}

.nav-link {
  color: inherit;
  background: transparent;
  transition: background-color 200ms ease, box-shadow 200ms ease, color 200ms ease;
}

.nav-link--active {
  background: rgba(var(--nav-active-rgb, 251, 251, 251), var(--nav-active-alpha, 0.45)); /* follows navbar opacity */
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.01);
}

</style>
