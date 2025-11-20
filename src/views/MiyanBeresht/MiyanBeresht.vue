<template>
  <section class="w-full h-screen flex items-center justify-center overflow-hidden">
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
  <section ref="navbarRef" class="py-2 shadow-sm transition-all" :style="navInlineStyle" dir="ltr">
      <div class="max-w-4xl mx-auto px-4 md:px-12">
        <div class="flex flex-row w-full items-center justify-between gap-2 text-center">
          <router-link
            v-for="item in displayNavItems"
            :key="item.name"
            :to="{ path: getLocalizedPath(item.path) }"
            class="flex-1 min-w-0 px-3 md:px-4 py-3 transition-transform duration-200 transform-gpu hover:scale-105 uppercase text-base md:text-lg font-semibold"
            :class="[
              { 'font-bold': $route.name === item.name },
              lang === 'en' ? 'font-cinzel font-light tracking-wide' : 'font-b-titr tracking-normal'
            ]"
          >
            {{ isRTL ? item.label.fa : item.label.en }}
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <!-- Child Router View -->
  <div ref="childSwipe" class="child-swipe-wrapper">
    <Transition :name="childTransition" mode="out-in">
      <router-view :key="$route.fullPath" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { lang } from '@/state/lang'
import { useNavbarAttachment } from '@/composables/useNavbarAttachment'
import siteMediaDefaults from '@/state/siteMediaDefaults'
import { useHeroIntro } from '@/composables/useHeroIntro'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'
import { useLocalizedChildRoutes } from '@/composables/useLocalizedChildRoutes'

const siteMedia = siteMediaDefaults

const { heroVideo, modalOverlayAlpha, overlayTransition } = useHeroIntro({
  overlayBase: 0.4,
  scrollRange: 380,
})

const navbarRef = ref(null)
const navbarSentinel = ref(null)
const { navInlineStyle, sentinelStyle } = useNavbarAttachment(navbarRef, navbarSentinel)
const childSwipe = ref(null)

const navConfig = [
  { name: 'MiyanBereshtDailyMenu', path: 'beresht/daily-menu', label: { fa: 'پخت روز', en: "Today's Special" } },
  { name: 'MiyanBereshtBaseMenu', path: 'beresht/menu', label: { fa: 'منو', en: 'Beresht Menu' } },
  { name: 'MiyanBereshtLanding', path: 'beresht', label: { fa: 'خانه برشت', en: 'Beresht Home' } },
]

const isRTL = computed(() => lang.value === 'fa')
const displayNavItems = computed(() => (isRTL.value ? [...navConfig].reverse() : navConfig))
const { childTransition, getLocalizedPath, shiftChild } = useLocalizedChildRoutes(displayNavItems)

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
</style>
