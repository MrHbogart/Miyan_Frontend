<template>
  <div class="view-shell">
    <section class="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0 hero-fill-safe">
  <video ref="heroVideo" :src="siteMedia.bereshtHeroVideo" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover"/>
        <div
          class="absolute inset-0 transition-all"
          :style="{
            background: `rgba(0,0,0,${modalOverlayAlpha})`,
            transition: overlayTransition
          }"
        ></div>
      </div>
      <div class="relative z-10 text-center px-6 max-w-xs mx-auto">
        <img :src="siteMedia.bereshtLogo" alt="Miyan Beresht" class="w-full h-auto drop-shadow-lg brightness-0 invert" />
      </div>
    </section>
    
    <!-- Toggle Buttons -->
    <div class="nav-placeholder">
    <div ref="navbarSentinel" :style="sentinelStyle"></div>
    <section ref="navbarRef" class="py-2 shadow-sm transition-all" :style="navInlineStyle" :dir="isRTL ? 'rtl' : 'ltr'">
        <div class="w-full px-6 md:px-12">
          <div
            :class="[
              'flex flex-row w-full items-center justify-between gap-2 text-center',
              isRTL ? 'flex-row-reverse' : ''
            ]"
          >
            <NuxtLink
              v-for="item in displayNavItems"
              :key="item.name"
              :to="getLocalizedPath(item.path)"
              class="flex-1 min-w-0 inline-flex items-center justify-center w-full h-full px-3 md:px-4 py-3 transition-transform duration-200 transform-gpu hover:scale-105 uppercase text-base md:text-lg font-semibold"
              :class="[
                { 'font-bold': isActive(item.path) },
                lang === 'en' ? 'font-cinzel font-light tracking-wide' : 'font-b-titr tracking-normal'
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

const navConfig = navigationCopy.miyanBeresht
const langState = useLang()
const lang = computed(() => langState.value)
const isRTL = computed(() => lang.value === 'fa')
const displayNavItems = computed(() => (isRTL.value ? [...navConfig].reverse() : navConfig))
const { childTransition, getLocalizedPath, shiftChild } = useLocalizedChildRoutes(displayNavItems)
const routeKey = computed(() => route.fullPath)

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
}
</style>
