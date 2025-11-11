<template>
  <section class="min-h-screen flex flex-col items-start justify-center px-6 py-12 gap-8">
    <div class="max-w-4xl">
      <h2 class="text-4xl font-bold mb-4">About Us</h2>
      <p class="mb-6 opacity-80">Miyan Group crafts memorable experiences through material, motion and quiet details. We blend concrete textures with soft motion.</p>
      <div class="w-full rounded-md overflow-hidden shadow-lg">
        <video :src="siteMedia.heroVideo" class="w-full h-64 object-cover" autoplay muted loop playsinline></video>
      </div>
    </div>
      <div class="max-w-4xl mt-12">
        <section class="mb-8">
          <h3 class="text-2xl font-semibold mb-3">Our Approach</h3>
          <p class="opacity-80">We pursue clarity through material, spacing and motion. Our surfaces are minimal, our movement is considered.</p>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="extra-card">A longer narrative content block to demonstrate scrolling behavior and how the header transitions as the page moves.</div>
          <div class="extra-card">Another block of content to lengthen the page and show overlay fading as the underlying hero video becomes visible.</div>
        </section>
      </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import siteMediaDefaults from '@/utils/siteMediaDefaults'

// Use local defaults only (backend doesn't provide siteMedia)
const siteMedia = siteMediaDefaults
</script>

<style scoped>
video { display: block }
</style>
