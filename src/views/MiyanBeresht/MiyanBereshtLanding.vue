<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--beresht brand-surface brand-surface--beresht content-shell"
    :dir="dirAttr"
    :style="landingStyle"
  >
    <div class="hero-copy" data-reveal>
      <p class="overline" :class="textClass">{{ isRTL ? heroCopy.overline.fa : heroCopy.overline.en }}</p>
      <h1 :class="titleClass">
        {{ isRTL ? heroCopy.title.fa : heroCopy.title.en }}
      </h1>
      <p :class="textClass">
        {{ isRTL ? heroCopy.body.fa : heroCopy.body.en }}
      </p>
    </div>

    <div class="beresht-marquee" :style="marqueeStyle">
      <span v-for="(word, index) in marqueeWords" :key="word.en + index">
        {{ isRTL ? word.fa : word.en }}
      </span>
    </div>

    <div class="beresht-roastery" data-reveal>
      <div class="roastery-copy" :class="textClass">
        <p class="overline">{{ isRTL ? roasterySection.overline.fa : roasterySection.overline.en }}</p>
        <h2 :class="titleClass">{{ isRTL ? roasterySection.title.fa : roasterySection.title.en }}</h2>
        <p>{{ isRTL ? roasterySection.body.fa : roasterySection.body.en }}</p>
        <div class="roastery-stats">
          <div class="stat-card" v-for="stat in roasterySection.stats" :key="stat.label.en">
            <span class="stat-label">{{ isRTL ? stat.label.fa : stat.label.en }}</span>
            <span class="stat-value">{{ isRTL ? stat.value.fa : stat.value.en }}</span>
          </div>
        </div>
      </div>
      <div class="roastery-pillars">
        <article v-for="pillar in roasterySection.pillars" :key="pillar.title.en" :class="textClass">
          <h3 :class="titleClass">{{ isRTL ? pillar.title.fa : pillar.title.en }}</h3>
          <p>{{ isRTL ? pillar.copy.fa : pillar.copy.en }}</p>
        </article>
      </div>
    </div>

    <div class="beresht-tasting" data-reveal>
      <div class="tasting-copy" :class="textClass">
        <p class="overline">{{ isRTL ? tastingSection.overline.fa : tastingSection.overline.en }}</p>
        <h2 :class="titleClass">{{ isRTL ? tastingSection.title.fa : tastingSection.title.en }}</h2>
        <p>{{ isRTL ? tastingSection.body.fa : tastingSection.body.en }}</p>
      </div>
      <ul class="tasting-highlights">
        <li v-for="entry in tastingSection.highlights" :key="entry.en">
          {{ isRTL ? entry.fa : entry.en }}
        </li>
      </ul>
    </div>

    <div class="immersive-stack">
      <article
        v-for="(story, idx) in photoStories"
        :key="story.title.en"
        class="story-scene"
        :ref="el => setStoryScene(el, idx)"
        :style="[sceneStyle(idx), storySurface(story.image)]"
      >
        <div class="story-copy">
          <p class="story-overline" :class="textClass">{{ isRTL ? story.overline.fa : story.overline.en }}</p>
          <h3 :class="titleClass">{{ isRTL ? story.title.fa : story.title.en }}</h3>
          <p :class="textClass">{{ isRTL ? story.copy.fa : story.copy.en }}</p>
        </div>
      </article>
    </div>

    <div class="beresht-location" data-reveal>
      <div class="location-copy" :class="textClass">
        <p class="overline">{{ isRTL ? locationInfo.overline.fa : locationInfo.overline.en }}</p>
        <h2 :class="titleClass">{{ isRTL ? locationInfo.title.fa : locationInfo.title.en }}</h2>
        <p>{{ isRTL ? locationInfo.body.fa : locationInfo.body.en }}</p>
        <ul class="location-list">
          <li v-for="(line, idx) in locationLines" :key="`addr-${idx}`">{{ line }}</li>
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
import { ref, computed } from 'vue'
import siteMediaDefaults from '@/state/siteMediaDefaults'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'
import { useSceneProgress } from '@/composables/useSceneProgress'
import { miyanBereshtLandingCopy } from '@/state/siteCopy'


const landingRoot = ref(null)
const { scrollY, speedFactor } = useScrollVelocity({
  smoothing: 0.24,
  multiplier: 9,
  max: 1.4,
  min: 0.85,
})
const siteMedia = siteMediaDefaults
const isRTL = computed(() => lang.value === 'fa')
const dirAttr = computed(() => (isRTL.value ? 'rtl' : 'ltr'))
const textClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-sans text-left'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-cinzel font-light text-left'))
const pxToRem = (valuePx) => `${parseFloat((valuePx / 16).toFixed(4))}rem`
const landingStyle = computed(() => ({
  '--viz-velocity': speedFactor.value.toFixed(3)
}))

const marqueeWords = miyanBereshtLandingCopy.marqueeWords

const heroCopy = miyanBereshtLandingCopy.hero

const roasterySection = miyanBereshtLandingCopy.roastery

const tastingSection = miyanBereshtLandingCopy.tasting

const locationInfo = miyanBereshtLandingCopy.location

const marqueeStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 400, 1), 0.7)
  const offsetPx = curve * -80 * speedFactor.value
  return {
    transform: `translateX(${pxToRem(offsetPx)})`
  }
})

const photoStories = miyanBereshtLandingCopy.photoStories.map((story) => ({
  ...story,
  image: siteMedia[story.imageKey],
}))

const storySections = ref([])
const setStoryScene = (el, idx) => {
  storySections.value[idx] = el || null
}
const { sceneProgress } = useSceneProgress(storySections, {
  easePower: 1.15,
  springPoint: 0.64,
  holdFactor: 0.42,
})
function sceneStyle(idx) {
  const p = sceneProgress.value[idx] ?? 0
  const translate = (1 - p) * 55
  const scale = 0.9 + p * 0.1
  return {
    transform: `translate3d(0, ${pxToRem(translate)}, 0) scale(${scale})`,
    opacity: 0.4 + p * 0.6
  }
}

function storySurface(image) {
  return { '--story-image': `url("${image}")` }
}

const locationLines = computed(() => (isRTL.value ? locationInfo.addressLines.fa : locationInfo.addressLines.en))

const locationCoordinates = computed(() => (isRTL.value ? locationInfo.coordinates.fa : locationInfo.coordinates.en))

useRevealObserver(landingRoot, { threshold: 0.15 })
</script>

<style scoped>
.landing-shell {
  position: relative;
  min-height: 100vh;
  padding: clamp(4rem, 7vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(5rem + env(safe-area-inset-bottom));
  background: transparent;
  color: #241308;
  --viz-velocity: 1;
}
.landing-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 247, 228, 0.5), transparent 65%);
  pointer-events: none;
  z-index: 0;
  opacity: 0.25;
}
.landing-shell > * {
  position: relative;
  z-index: 1;
}

.landing-shell--beresht {
  background-image:
    radial-gradient(circle at 12% 8%, rgba(255, 255, 255, 0.92), transparent 55%),
    radial-gradient(circle at 82% 2%, rgba(255, 255, 255, 0.7), transparent 60%),
    linear-gradient(185deg, #ffffff 0%, #fffefb 42%, #fffdf5 78%, #ffffff 100%);
}

.beresht-hero {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.hero-emblem {
  flex: 0 0 12.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
  border: none;
  background: transparent;
  box-shadow: none;
  transform: translateY(2.5rem);
  opacity: 0;
  transition: transform calc(1200ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(1200ms / var(--viz-velocity, 1)) ease;
}

.hero-emblem img {
  width: 100%;
  height: auto;
}

.hero-copy {
  flex: 1;
  min-width: 17.5rem;
  transform: translateY(2.5rem);
  opacity: 0;
  transition: transform calc(1200ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(1200ms / var(--viz-velocity, 1)) ease;
}

.hero-copy h1 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  line-height: 1.2;
  margin: 1rem 0;
  font-weight: 400;
}

.hero-copy p {
  color: rgba(38, 28, 18, 0.8);
  line-height: 1.7;
}

.overline {
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: rgba(95, 61, 39, 0.6);
}

.beresht-marquee {
  display: flex;
  gap: 2rem;
  overflow: hidden;
  font-size: clamp(1rem, 2vw, 1.3rem);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.55;
  color: rgba(178, 117, 82, 0.75);
  margin-bottom: 3rem;
  transition: transform calc(1100ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1);
}

.beresht-roastery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: clamp(1.5rem, 4vw, 2.75rem);
  padding: clamp(1.75rem, 4vw, 3rem);
  background: rgba(255, 255, 255, 0.78);
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.roastery-copy p {
  color: rgba(38, 28, 18, 0.8);
  line-height: 1.7;
}

.roastery-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.stat-card {
  padding: 0.6rem 0;
  border-radius: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.6;
}

.stat-value {
  display: block;
  margin-top: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
}

.roastery-pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.roastery-pillars article {
  background: transparent;
  border-radius: 0;
  padding: 1rem 0;
  box-shadow: none;
  border: none;
}

.beresht-tasting {
  margin-top: clamp(2rem, 5vw, 3rem);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 0;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.5rem;
  align-items: center;
  box-shadow: none;
}

.tasting-highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.tasting-highlights li {
  padding: 0.65rem 0.85rem;
  border-radius: 0;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: transparent;
  color: rgba(36, 19, 8, 0.8);
  border: none;
}

.beresht-location {
  margin-top: clamp(3rem, 6vw, 4.5rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: clamp(1.5rem, 4vw, 2.5rem);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 0;
  border: none;
  background: rgba(19, 10, 6, 0.92);
  color: #f9f6f0;
}

.beresht-location p,
.beresht-location li {
  color: rgba(249, 246, 240, 0.85);
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
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent),
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.35));
  min-height: 14rem;
  border: none;
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(0deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 2.5rem 2.5rem;
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
  color: #f9f6f0;
  padding: 0;
  border-radius: 0;
  text-align: center;
  box-shadow: none;
  min-width: 10rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.map-marker small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.5;
}

.map-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.8;
  border-radius: 0;
  border: none;
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

.roastery-copy h2,
.tasting-copy h2,
.location-copy h2 {
  font-family: 'Cinzel', serif;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.roastery-copy p,
.tasting-copy p,
.location-copy p,
.roastery-pillars article p,
.tasting-highlights li {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .beresht-panels {
    display: none;
  }
}

.beresht-panels {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.panel {
  border: none;
  padding: 0 0 1.5rem;
  min-height: auto;
  position: relative;
  transform: translateY(2.5rem);
  opacity: 0;
  transition: transform calc(1200ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(1200ms / var(--viz-velocity, 1)) ease;
}

.panel h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.panel p,
.panel ul {
  color: rgba(80, 50, 34, 0.85);
  line-height: 1.7;
}

.panel ul {
  padding-left: 0;
  list-style: none;
  border-left: none;
  margin-left: 0.5rem;
  padding-left: 1.25rem;
}

.hero-emblem.is-visible,
.hero-copy.is-visible,
.panel.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.immersive-stack {
  margin-top: clamp(3rem, 6vw, 5rem);
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  position: relative;
  overflow: visible;
  scroll-snap-type: y proximity;
  padding-bottom: clamp(3rem, 5vw, 4rem);
}

.story-scene {
  position: sticky;
  top: clamp(2.5rem, 18vh, 7rem);
  isolation: isolate;
  width: 100%;
  margin: auto;
  min-height: min(100vh, 60rem);
  padding: clamp(1.75rem, 3vw, 2.75rem);
  overflow: hidden;
  color: rgba(40, 24, 15, 0.92);
  box-shadow: 0 12px 36px rgba(8, 4, 2, 0.15);
  scroll-snap-align: start;
  background: rgba(255, 255, 255, 0.85);
}

.story-scene::before {
  content: '';
  position: absolute;
  inset: -5%;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  transform: scale(1.02);
  filter: none;
  transition: transform 1400ms ease;
}

.story-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
}

.story-scene:hover::before {
  transform: scale(1.025);
}

.story-copy {
  position: absolute;
  bottom: var(--story-copy-gutter);
  left: var(--story-copy-gutter);
  right: var(--story-copy-gutter);
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  color: rgba(255, 215, 72, 0.9);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  max-width: min(36rem, calc(100% - (var(--story-copy-gutter) * 2)));
}

.story-overline {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  color: rgba(255, 145, 0, 0.962);
}

[dir="ltr"] .story-copy { text-align: left; }
[dir="rtl"] .story-copy { text-align: right; }

@media (max-width: 48rem) {
  .beresht-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
