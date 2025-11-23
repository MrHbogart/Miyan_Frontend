<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--madi brand-surface brand-surface--madi content-shell"
    :dir="dirAttr"
    :style="landingStyle"
  >
    <div class="madi-hero" :style="heroOrbitStyle">
      <p class="overline" :class="textClass">{{ isRTL ? heroCopy.overline.fa : heroCopy.overline.en }}</p>
      <h1 data-reveal :class="titleClass">
        {{ isRTL ? heroCopy.title.fa : heroCopy.title.en }}
      </h1>
      <p data-reveal :class="textClass">
        {{ isRTL ? heroCopy.body.fa : heroCopy.body.en }}
      </p>
    </div>

    <div class="madi-atmosphere">
      <div class="mist-line" v-for="n in 3" :key="`primary-${n}`" :style="mistStyle(n)"></div>
      <div class="atmo-copy" data-reveal>
        <h2 :class="titleClass">{{ isRTL ? atmosphereCopy.title.fa : atmosphereCopy.title.en }}</h2>
        <p
          v-for="(paragraph, idx) in atmosphereCopy.paragraphs"
          :key="`atmo-${idx}`"
          :class="textClass"
        >
          {{ isRTL ? paragraph.fa : paragraph.en }}
        </p>
      </div>
    </div>

    <div class="immersive-stack">
      <article
        v-for="(story, idx) in photoStories"
        :key="story.title.en"
        class="story-scene"
        :ref="el => setStoryScene(el, idx)"
        :style="[sceneStyle(idx), storySurface(story.image)]"
      >
        <div class="story-copy" :class="textClass">
          <p class="story-overline">{{ isRTL ? story.overline.fa : story.overline.en }}</p>
          <h3 :class="titleClass">{{ isRTL ? story.title.fa : story.title.en }}</h3>
          <p>{{ isRTL ? story.copy.fa : story.copy.en }}</p>
        </div>
      </article>
    </div>

    <div class="madi-location" data-reveal>
      <div class="location-copy" :class="textClass">
        <p class="overline">{{ isRTL ? locationInfo.overline.fa : locationInfo.overline.en }}</p>
        <h2 :class="titleClass">{{ isRTL ? locationInfo.title.fa : locationInfo.title.en }}</h2>
        <p>{{ isRTL ? locationInfo.body.fa : locationInfo.body.en }}</p>
        <ul class="location-list">
          <li v-for="(line, idx) in locationLines" :key="`madi-address-${idx}`">{{ line }}</li>
        </ul>
        <p class="location-hours">{{ isRTL ? locationInfo.hours.fa : locationInfo.hours.en }}</p>
        <p class="location-phone">{{ isRTL ? locationInfo.phone.fa : locationInfo.phone.en }}</p>
      </div>
      <div class="location-map" role="img" :aria-label="isRTL ? locationInfo.title.fa : locationInfo.title.en">
        <div class="map-canvas">
          <div class="map-grid"></div>
          <div class="map-ring"></div>
          <div class="map-marker">
            <span>{{ isRTL ? locationInfo.mapLabel.fa : locationInfo.mapLabel.en }}</span>
            <small>{{ locationCoordinates }}</small>
          </div>
        </div>
        <div class="map-meta">
          <span>{{ locationCoordinates }}</span>
          <span>{{ isRTL ? locationInfo.cta.fa : locationInfo.cta.en }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'
import { useSceneProgress } from '@/composables/useSceneProgress'
import siteMediaDefaults from '@/state/siteMediaDefaults'
import { miyanMadiLandingCopy } from '@/state/siteCopy'
import { prefetchMenusForBranch } from '@/utils/menuPrefetcher'

const siteMedia = siteMediaDefaults
const landingRoot = ref(null)
const { scrollY, speedFactor } = useScrollVelocity({
  smoothing: 0.2,
  multiplier: 11,
  max: 1.5,
  min: 0.85,
})
const isRTL = computed(() => lang.value === 'fa')
const dirAttr = computed(() => (isRTL.value ? 'rtl' : 'ltr'))
const textClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-sans text-left'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-cinzel font-light text-left'))
const pxToRem = (valuePx) => `${parseFloat((valuePx / 16).toFixed(4))}rem`
const landingStyle = computed(() => ({
  '--viz-velocity': speedFactor.value.toFixed(3)
}))

const heroCopy = miyanMadiLandingCopy.hero
const atmosphereCopy = miyanMadiLandingCopy.atmosphere

const heroOrbitStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 500, 1), 0.75)
  const offsetY = curve * -36 * speedFactor.value
  return {
    transform: `translate3d(0, ${pxToRem(offsetY)}, 0)`
  }
})

function mistStyle(index) {
  const offset = index * 40
  return {
    animationDelay: `${(index * 0.6) / speedFactor.value}s`,
    animationDuration: `${6 / speedFactor.value}s`,
    top: pxToRem(10 + offset)
  }
}

const photoStories = miyanMadiLandingCopy.photoStories.map((story) => ({
  ...story,
  image: siteMedia[story.imageKey],
}))

const locationInfo = miyanMadiLandingCopy.location

const locationLines = computed(() => (isRTL.value ? locationInfo.addressLines.fa : locationInfo.addressLines.en))

const locationCoordinates = computed(() => (isRTL.value ? locationInfo.coordinates.fa : locationInfo.coordinates.en))

const storySections = ref([])
const setStoryScene = (el, idx) => {
  storySections.value[idx] = el || null
}
const { sceneProgress } = useSceneProgress(storySections, {
  easePower: 1.2,
  springPoint: 0.6,
  holdFactor: 0.45,
})

function sceneStyle(idx) {
  const progress = sceneProgress.value[idx] ?? 0
  const translate = (1 - progress) * 34
  const scale = 0.9 + progress * 0.08
  return {
    transform: `translate3d(0, ${pxToRem(translate)}, 0) scale(${scale})`,
    opacity: 0.45 + progress * 0.55,
  }
}

function storySurface(image) {
  return { '--story-image': `url("${image}")` }
}

useRevealObserver(landingRoot, { threshold: 0.18 })

onMounted(() => {
  prefetchMenusForBranch('madi')
})
</script>

<style scoped>
.landing-shell {
  position: relative;
  min-height: 100vh;
  padding: clamp(4rem, 7vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(5rem + env(safe-area-inset-bottom));
  color: #0f2535;
  --viz-velocity: 1;
}
.landing-shell::before {
  content: '';
  position: absolute;
  inset: 2.5rem;
  pointer-events: none;
  opacity: 0.25;
}
.landing-shell > * {
  position: relative;
  z-index: 1;
}

.landing-shell--madi {
  background: radial-gradient(circle at 20% 20%, rgba(173, 220, 255, 0.4), transparent 55%),
    radial-gradient(circle at 80% 10%, rgba(209, 232, 255, 0.45), transparent 60%),
    linear-gradient(180deg, #f7fbff 0%, #f0f6ff 70%, #e7f1ff 100%);
}

.madi-hero {
  max-width: 45rem;
  transition: transform calc(700ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1);
}

.overline {
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.6;
}

.madi-hero h1 {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  line-height: 1.3;
  margin: 1rem 0;
  font-weight: 400;
}

.madi-hero p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(28, 67, 95, 0.8);
}

.madi-atmosphere {
  position: relative;
  border: none;
  padding: clamp(1rem, 3vw, 1.75rem) 0;
  overflow: hidden;
  min-height: 16.25rem;
  background: transparent;
  box-shadow: none;
}

.mist-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3.75rem;
  background: linear-gradient(90deg, transparent, rgba(163, 209, 255, 0.4), transparent);
  opacity: 0;
  animation: mistDrift 6s ease-in-out infinite;
}

.atmo-copy {
  position: relative;
  z-index: 2;
  max-width: 32.5rem;
  transform: translateY(2.5rem);
  opacity: 0;
  transition: transform calc(800ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1),
    opacity calc(800ms / var(--viz-velocity, 1)) ease;
}

.atmo-copy h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.atmo-copy p {
  color: rgba(23, 60, 94, 0.78);
  line-height: 1.7;
}

.atmo-copy.is-visible {
  transform: translateY(0);
  opacity: 1;
}

.immersive-stack {
  margin: clamp(2rem, 5vw, 3.5rem) 0;
  display: grid;
  gap: clamp(1.5rem, 4vw, 2rem);
  position: relative;
  padding-bottom: clamp(3rem, 4vw, 4rem);
}

.story-scene {
  position: sticky;
  top: clamp(2.5rem, 20vh, 6rem);
  min-height: min(100vh, 52rem);
  border-radius: 0;
  overflow: hidden;
  background: rgba(10, 36, 58, 0.6);
  box-shadow: none;
  isolation: isolate;
}

.story-scene::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  filter: grayscale(0.1);
  opacity: 0.8;
}

.story-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(1, 18, 35, 0.95), rgba(1, 18, 35, 0.2));
}

.story-copy {
  position: relative;
  z-index: 1;
  padding: clamp(1.5rem, 4vw, 3rem);
  color: #e8f5ff;
  max-width: 32rem;
}

.story-copy h3 {
  margin: 0.15rem 0 0.6rem;
}

.story-copy p {
  margin: 0;
  line-height: 1.6;
}

.story-overline {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  color: rgba(183, 214, 255, 0.85);
}

.madi-location {
  margin: clamp(3rem, 6vw, 4.5rem) 0 0;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 0;
  border: none;
  background: rgba(6, 52, 92, 0.9);
  color: #e8f5ff;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.madi-location p,
.madi-location li {
  color: rgba(232, 245, 255, 0.85);
}

.location-list {
  margin: 0.75rem 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-weight: 500;
}

.location-map {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.map-canvas {
  position: relative;
  border-radius: 0;
  overflow: hidden;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15), transparent),
    linear-gradient(150deg, rgba(19, 87, 133, 0.9), rgba(7, 36, 62, 0.95));
  min-height: 14rem;
  border: none;
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(0deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 2.75rem 2.75rem;
  opacity: 0.25;
}

.map-ring {
  display: none;
}

.map-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  background: transparent;
  color: #e8f5ff;
  padding: 0;
  border-radius: 0;
  min-width: 9rem;
  text-align: center;
  box-shadow: none;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.map-marker small {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.75rem;
  opacity: 0.55;
}

.map-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.7;
  border: none;
  border-radius: 0;
}

.location-hours {
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 0.6rem;
}

.location-phone {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.2rem;
  letter-spacing: 0.12em;
}

.location-copy h2 {
  font-family: 'Cinzel', serif;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.location-copy p,
.location-list li {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
}

@keyframes mistDrift {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  60% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(40%);
    opacity: 0;
  }
}

@media (max-width: 48rem) {
  .landing-shell {
    padding-top: 4rem;
  }
}
</style>
