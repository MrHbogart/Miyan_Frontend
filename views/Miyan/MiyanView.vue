<template>
  <div>
    <!-- Hero Section -->
    <section class="w-full h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0 hero-fill-safe">
          <video 
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
import siteMediaDefaults from '~/state/siteMediaDefaults'
import { useHeroIntro } from '~/composables/useHeroIntro'
import MiyanLanding from './MiyanLanding.vue'

const siteMedia = siteMediaDefaults

const { modalOverlayAlpha, overlayTransition } = useHeroIntro({
  overlayBase: 0.35,
  scrollRange: 320,
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
