<template>
  <div>
    <!-- Hero Section -->
    <section class="relative w-full h-screen flex items-center justify-center overflow-hidden">
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

    <Transition :name="childTransition" mode="out-in">
      <MiyanLanding :key="route.fullPath" />
    </Transition>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useHeroIntro } from '@/composables/useHeroIntro'
import { useLocalizedChildRoutes } from '@/composables/useLocalizedChildRoutes'
import { navigationCopy } from '@/state/siteCopy'
import siteMediaDefaults from '@/state/siteMediaDefaults'
import MiyanLanding from './MiyanLanding.vue'

const siteMedia = siteMediaDefaults
const route = useRoute()

const { heroVideo, modalOverlayAlpha, overlayTransition } = useHeroIntro({
  overlayBase: 0.4,
  scrollRange: 380,
})

const { childTransition } = useLocalizedChildRoutes(navigationCopy.miyan)
</script>

<style scoped>
.nav-placeholder {
  position: relative;
}

.nav-placeholder section {
  width: 100%;
}
@media (max-width: 768px) and (orientation: portrait) {
  video {
    object-position: calc(50% - 150px) center !important;
  }
}

@media (orientation: landscape) {
  video {
    object-position: center center !important;
  }

  .hero-fill-safe {
    left: 0;
    right: 0;
    width: 100vw;
    max-width: 100vw;
  }
}
</style>
