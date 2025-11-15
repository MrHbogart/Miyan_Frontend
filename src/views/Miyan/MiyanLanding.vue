<template>
<section
  ref="landingRoot"
  class="landing-shell brand-surface brand-surface--miyan content-shell"
  :dir="dirAttr"
  :style="landingStyle"
>
    <div class="viewport-stack">
      <article
        v-for="(scene, idx) in heroScenes"
        :key="scene.title.en"
        class="viewport-panel"
        :class="[`viewport-panel--${scene.kind}`]"
        :style="[panelSurface(scene.image), sceneStylePanel(idx)]"
        :ref="el => setScene(el, idx)"
      >
        <div class="panel-overlay"></div>
        <div class="panel-media">
          <div class="media-fill"></div>
        </div>
        <div class="panel-copy" :class="textClass">
          <p class="panel-overline">{{ isRTL ? scene.overline.fa : scene.overline.en }}</p>
          <h2 :class="titleClass">{{ isRTL ? scene.title.fa : scene.title.en }}</h2>
          <p>{{ isRTL ? scene.lede.fa : scene.lede.en }}</p>
          <div class="panel-meta" v-if="scene.meta">
            <span>{{ isRTL ? scene.meta.fa : scene.meta.en }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'
import { useSceneProgress } from '@/composables/useSceneProgress'
import miyanGallery from '@/assets/images/miyan-gallery-sunrise.jpg'
import miyanTexture from '@/assets/images/miyan-texture-close.jpg'
import miyanEvening from '@/assets/images/miyan-gathering-night.jpg'

const landingRoot = ref(null)
const { scrollY, speedFactor } = useScrollVelocity({
  smoothing: 0.22,
  multiplier: 10,
  max: 1.45,
  min: 0.85,
})
const isRTL = computed(() => lang.value === 'fa')
const dirAttr = computed(() => (isRTL.value ? 'rtl' : 'ltr'))
const pxToRem = (valuePx) => `${parseFloat((valuePx / 16).toFixed(4))}rem`

const landingStyle = computed(() => ({
  '--viz-velocity': speedFactor.value.toFixed(3)
}))

const textClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-sans text-left'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-cinzel font-light text-left'))

const heroCopy = {
  overline: { fa: 'میان', en: 'Miyan' },
  title: { fa: 'خطوط ساده، لمس صمیمی', en: 'Simple lines, gentle tactility' },
  accent: { fa: 'همه چیز آهسته پیش می‌رود', en: 'Everything moves slowly' },
  lede: {
    fa: 'مواد خام و نور کم‌رنگ را کنار هم می‌گذاریم تا مهمان بدون عجله نفس بکشد.',
    en: 'We pair raw materials with dim light so every guest breathes without rush.'
  }
}

const heroScenes = [
  {
    kind: 'arrival',
    image: miyanGallery,
    overline: { fa: 'میهمان', en: 'Guest' },
    title: { fa: 'ورود آرام', en: 'Slow arrival' },
    lede: {
      fa: 'نور سفید با لایه‌ای از رز ملایم، گام اول را نرم می‌کند.',
      en: 'White light with a faint rose tint cushions the first step.',
    },
    meta: { fa: '٠٨:٣٠ صبح', en: '08:30' },
  },
  {
    kind: 'material',
    image: miyanTexture,
    overline: { fa: 'مواد', en: 'Materials' },
    title: { fa: 'بافت صمیمی', en: 'Tactile notes' },
    lede: {
      fa: 'چوب صیقل‌خورده و فولاد مات با مه سفید ترکیب می‌شوند.',
      en: 'Polished wood and matte steel blend beneath white mist.',
    },
    meta: { fa: 'تنفس ٣٢ ثانیه', en: '32 second breath' },
  },
  {
    kind: 'sound',
    image: miyanEvening,
    overline: { fa: 'ریتم', en: 'Cadence' },
    title: { fa: 'صداهای آهسته', en: 'Muted cadence' },
    lede: {
      fa: 'تن‌های پایین هم‌زمان با نور گرم حرکت می‌کنند.',
      en: 'Low tones move in sync with the amber glow.',
    },
    meta: { fa: '٦٢ دسی‌بل', en: '62 dB' },
  },
  {
    kind: 'gallery',
    image: miyanEvening,
    overline: { fa: 'گالری', en: 'Gallery' },
    title: { fa: 'سایه‌های بلند', en: 'Long shadows' },
    lede: {
      fa: 'سایه‌ها روی بتن حرکت می‌کنند و قاب‌ها نفس می‌کشند.',
      en: 'Shadows sweep across concrete while frames exhale.',
    },
    meta: { fa: '٢٢ قاب', en: '22 frames' },
  },
]

const heroAccentStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 600, 1), 0.8)
  const offsetPx = curve * -45 * speedFactor.value
  return {
    transform: `translate3d(0, ${pxToRem(offsetPx)}, 0)`
  }
})

const panelGlowStyle = computed(() => ({}))

function panelSurface(image) {
  return { '--panel-image': `url("${image}")` }
}

const heroSections = ref([])
const storySections = ref([])

const setScene = (el, idx) => {
  heroSections.value[idx] = el || null
}
const setStoryScene = (el, idx) => {
  storySections.value[idx] = el || null
}

const { sceneProgress: heroProgress } = useSceneProgress(heroSections, {
  easePower: 1.1,
  springPoint: 0.55,
  holdFactor: 0.35,
})

const { sceneProgress } = useSceneProgress(storySections, {
  easePower: 1.25,
  springPoint: 0.62,
  holdFactor: 0.4,
  releaseCurve: 0.8,
})
function sceneStylePanel(idx) {
  const p = heroProgress.value?.[idx] ?? 0
  const translate = (1 - p) * 60
  const scale = 0.94 + p * 0.06
  const blur = 2 + (1 - p) * 6
  return {
    transform: `translate3d(0, ${pxToRem(translate)}, 0) scale(${scale})`,
    filter: `hue-rotate(${(idx + 1) * 8 * p}deg) blur(${blur}px)`,
    opacity: 0.45 + p * 0.55,
  }
}

function sceneStyle(idx) {
  const p = sceneProgress.value[idx] ?? 0
  const translate = (1 - p) * 50
  const scale = 0.88 + p * 0.12
  return {
    transform: `translate3d(0, ${pxToRem(translate)}, 0) scale(${scale})`,
    opacity: 0.35 + p * 0.65
  }
}

function storySurface(image) {
  return { '--story-image': `url("${image}")` }
}

useRevealObserver(landingRoot, { threshold: 0.2 })
</script>

<style scoped>
.landing-shell {
  position: relative;
  min-height: 100vh;
  padding: clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(6rem + env(safe-area-inset-bottom));
  background: transparent;
  color: #0b0b0b;
  --viz-velocity: 1;
}
.landing-shell::before {
  content: '';
  position: absolute;
  inset: 3rem;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
}
.landing-shell > * {
  position: relative;
  z-index: 1;
}

.landing-hero {
  max-width: 60rem;
  margin: 0 auto 4rem;
  transition: transform 600ms cubic-bezier(.32,.72,.29,.99);
}

.overline {
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.65;
}

.headline {
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  line-height: 1.05;
  margin: 1rem 0;
  font-weight: 300;
}

.headline .accent {
  display: block;
  font-weight: 600;
}

.lede {
  max-width: 38.75rem;
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.8;
}

.hero-pillars {
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13.75rem, 1fr));
  gap: 1.25rem;
}

.pillar {
  background: transparent;
  border: none;
  padding-bottom: 1rem;
  display: flex;
  gap: 0.875rem;
  align-items: center;
  transform: translateY(1.5rem);
  opacity: 0;
  transition: transform 700ms cubic-bezier(.2,.8,.2,1), opacity 700ms ease;
  transition-delay: calc(var(--delay) / var(--viz-velocity, 1));
  border-bottom: 1px solid rgba(11, 11, 11, 0.08);
}

.pillar.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.pillar-index {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  opacity: 0.5;
}

.pillar-title {
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.pillar-copy {
  font-size: 0.9rem;
  opacity: 0.7;
}

.landing-panels {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
}

.panel {
  border: none;
  padding: 0;
  background: transparent;
  position: relative;
  transform: translateY(1.875rem);
  opacity: 0;
  transition: transform calc(750ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1),
    opacity calc(750ms / var(--viz-velocity, 1)) ease;
}

.panel.is-visible {
  transform: translateY(0);
  opacity: 1;
}

.panel h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.panel p {
  line-height: 1.7;
  opacity: 0.78;
}

.panel-grid {
  display: grid;
  gap: 1rem;
}

.moment-card {
  border: none;
  padding: 0.5rem 0;
  background: transparent;
  transition: transform calc(400ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1);
}

.moment-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.moment-copy {
  font-size: 0.92rem;
  opacity: 0.7;
  line-height: 1.6;
}

.immersive-stack {
  margin-top: clamp(3rem, 6vw, 5rem);
  display: grid;
  gap: clamp(2rem, 5vw, 3rem);
  position: relative;
  overflow: visible;
  scroll-snap-type: y proximity;
  padding-bottom: clamp(3rem, 6vw, 5rem);
}

.story-scene {
  position: sticky;
  top: clamp(3rem, 18vh, 8rem);
  isolation: isolate;
  width: 100%;
  min-height: clamp(20rem, 75vh, 34rem);
  padding: clamp(2rem, 4vw, 3.5rem);
  border-radius: clamp(0.6rem, 1.5vw, 1rem);
  overflow: hidden;
  color: #f9f7f2;
  opacity: 0.85;
  scroll-snap-align: start;
}

.story-scene::before {
  content: '';
  position: absolute;
  inset: -5%;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  filter: saturate(1.15) contrast(1.05);
  transform: scale(1.05);
  transition: transform 900ms cubic-bezier(.22,.74,.28,.96), opacity 600ms ease;
}

.story-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(4,7,11,0.75), rgba(14,17,23,0.35));
  mix-blend-mode: multiply;
}

.story-scene:hover::before {
  transform: scale(1.1);
}

.story-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  color: rgba(249, 247, 242, 0.92);
}

.story-overline {
  letter-spacing: 0.4em;
  font-size: 0.72rem;
  opacity: 0.7;
  text-transform: uppercase;
}

@media (max-width: 48rem) {
  .landing-shell {
    padding-top: 4rem;
  }

  .hero-pillars {
    grid-template-columns: 1fr;
  }
}
</style>
