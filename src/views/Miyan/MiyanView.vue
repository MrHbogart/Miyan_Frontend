<template>
  <div>
    <!-- Hero Section -->
    <section class="w-full h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0 hero-fill-safe">
          <video ref="heroVideo" 
            :src="siteMedia.miyanHeroVideo" 
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

    <MiyanLanding />
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
import MiyanLanding from './MiyanLanding.vue'

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
  { name: 'MiyanLanding', path: '', label: { fa: 'خانه', en: 'Home' } },
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
@media (max-width: 768px) {
  video {
    object-position: calc(50% - 150px) center !important;
  }
}
</style>
