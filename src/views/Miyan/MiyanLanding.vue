<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--miyan brand-surface brand-surface--miyan"
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

    <!-- HYBRID MARQUEE: Beresht-style scroll-driven translateX, keeps Miyan word list -->
    <div class="miyan-marquee" :style="marqueeStyle" aria-hidden="true">
      <span v-for="(word, index) in marqueeWords" :key="word.en + index" class="marquee-item">
        {{ isRTL ? word.fa : word.en }}
      </span>
    </div>

    <div class="miyan-hero-panel" data-reveal>
      <div class="hero-media" :style="[heroBackgroundStyle, heroMediaMotion]">
        <div class="hero-media-gradient" aria-hidden="true"></div>
      </div>
      <div class="hero-copy-block" :class="textClass" :style="heroCopyMotion">
        <p class="overline">{{ isRTL ? heroCopy.overline.fa : heroCopy.overline.en }}</p>
        <h1 :class="titleClass">{{ isRTL ? heroCopy.title.fa : heroCopy.title.en }}</h1>
        <p>{{ isRTL ? heroCopy.body.fa : heroCopy.body.en }}</p>
        <div class="hero-highlights" aria-hidden="true">
          <span v-for="entry in heroHighlights" :key="entry.en">
            {{ isRTL ? entry.fa : entry.en }}
          </span>
        </div>
      </div>
    </div>

    <div class="miyan-modal-panel">
      <div class="modal-body" data-reveal :class="textClass">
        <p class="modal-overline">{{ isRTL ? modalCopy.overline.fa : modalCopy.overline.en }}</p>
        <h2 :class="titleClass">{{ isRTL ? modalCopy.title.fa : modalCopy.title.en }}</h2>
        <p class="modal-intro">{{ isRTL ? modalCopy.body.fa : modalCopy.body.en }}</p>
        <div class="modal-chip">
          {{ isRTL ? modalCopy.accent.fa : modalCopy.accent.en }}
        </div>
        <div class="modal-grid">
          <article
            v-for="(focus, idx) in modalFocus"
            :key="focus.title.en"
            class="modal-focus"
            :class="textClass"
            data-reveal
            :style="{ '--delay': `${idx * 120}ms` }"
          >
            <strong>{{ isRTL ? focus.title.fa : focus.title.en }}</strong>
            <p>{{ isRTL ? focus.copy.fa : focus.copy.en }}</p>
          </article>
        </div>
      </div>
    </div>

    <!-- Immersive stack: larger images, less overlay shadow, smoother animations -->
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
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'
import { useSceneProgress } from '@/composables/useSceneProgress'

import siteMediaDefaults from '@/state/siteMediaDefaults'

const landingRoot = ref(null)
const { scrollY, speedFactor } = useScrollVelocity({
  smoothing: 0.22,
  multiplier: 10,
  max: 1.45,
  min: 0.85,
})
const isRTL = computed(() => lang.value === 'fa')
const dirAttr = computed(() => (isRTL.value ? 'rtl' : 'ltr'))
const pxToRem = (valuePx) => `${parseFloat((valuePx / 16).toFixed(3))}rem`

const landingStyle = computed(() => ({
  '--viz-velocity': speedFactor.value.toFixed(3),
}))

// helper classes (left as minimal additions — they match how Beresht computed them previously)
// If you already define textClass/titleClass globally, these will not conflict.
const textClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-sans text-left'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-cinzel font-light text-left'))

const heroCopy = {
  overline: { fa: 'میان', en: 'Miyan' },
  title: { fa: 'نور معلق، لمسِ لغزان', en: 'Suspended light, gliding tactility' },
  body: {
    fa: 'در لایه‌های صاف نور و مه، هر مهمان با نفس خود جلو می‌رود.',
    en: 'Layers of calm light and mist let every guest navigate at their own pace.',
  },
}

// fixed marquee words (typos corrected, last word filled)
const marqueeWords = [
  { fa: 'آزمون', en: 'Analyze' },
  { fa: 'علم', en: 'Science' },
  { fa: 'تجربه', en: 'Experience' },
  { fa: 'هنر', en: 'Art' },
  { fa: 'تمایز', en: 'Distinction' },
]

// HYBRID MARQUEE: scroll-driven translateX (Beresht style) with medium speed multiplier
const MARQUEE_SPEED = 0.25 // medium as requested

const marqueeStyle = computed(() => {
  // curve smooths the start of motion (same idea as Beresht)
  const curve = Math.pow(Math.min(scrollY.value / 400, 1), 0.7)
  // base offset (px) scaled by viz speed and chosen marquee speed
  // for LTR we translate left (negative), for RTL we reverse
  const direction = isRTL.value ? 1 : -1
  const offsetPx = curve * 80 * speedFactor.value * MARQUEE_SPEED * direction
  return {
    transform: `translateX(${pxToRem(offsetPx)})`,
    transition: `transform calc(900ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1)`,
  }
})

const heroHighlights = [
  { fa: 'سایه‌های بلند', en: 'Drawn shadows' },
  { fa: 'سرو آهسته', en: 'Gentle service' },
  { fa: 'مه سفید', en: 'White mist' },
]

const modalCopy = {
  overline: { fa: 'مدال', en: 'Modal' },
  title: { fa: 'حالت تمام‌صفحه', en: 'Fullscreen state' },
  body: {
    fa: 'با کادر بی‌پایان و پرتو رنگی، طراحی ما به استقبال سکوت می‌آید.',
    en: 'An endless frame and warm halos invite stillness across the space.',
  },
  accent: { fa: 'نور برای نفس کشیدن', en: 'Light for breathing' },
}

const modalFocus = [
  {
    title: { fa: 'نور بندی', en: 'Light bands' },
    copy: {
      fa: 'خط‌های صعودی نور را روی سطوح بتنی می‌نشاند.',
      en: 'Ascending bands of light settle on the concrete planes.',
    },
  },
  {
    title: { fa: 'حالت فیلمی', en: 'Filmic calm' },
    copy: {
      fa: 'حرکت دوربین را با ریتم آهسته نیم‌پرده تقلید می‌کنیم.',
      en: 'A slow, semi-tone rhythm mirrors a drifting camera move.',
    },
  },
  {
    title: { fa: 'بافت آب', en: 'Water texture' },
    copy: {
      fa: 'رویه‌ی شیشه‌ی مات، با قطراتِ کوچک تنفس می‌کند.',
      en: 'Matte glass breathes with tiny beads of vapor.',
    },
  },
]

const heroBackgroundStyle = computed(() => ({
  backgroundImage: `url("${siteMediaDefaults.miyanImg1}")`,
}))

const heroMediaMotion = computed(() => {
  const offset = Math.min(scrollY.value / 600, 1) * 32
  return {
    transform: `translate3d(0, ${pxToRem(-offset)}, 0)`,
  }
})

const heroCopyMotion = computed(() => {
  const offset = Math.min(scrollY.value / 500, 1) * 18
  return {
    transform: `translate3d(0, ${pxToRem(offset)}, 0)`,
  }
})

const photoStories = [
  {
    image: siteMediaDefaults.miyanImg2,
    overline: { fa: 'بافت', en: 'Texture' },
    title: { fa: 'ضربه‌های نقره‌ای', en: 'Silver pulses' },
    copy: {
      fa: 'برگ‌های نقره‌ای روی بتن به آرامی نوسان می‌کنند.',
      en: 'Silver surfaces dance softly across the concrete stage.',
    },
  },
  {
    image: siteMediaDefaults.miyanImg3,
    overline: { fa: 'شب', en: 'Night' },
    title: { fa: 'مه‌تاب', en: 'Moon mist' },
    copy: {
      fa: 'مهرِ رنگی روی قاب‌ها نور را به نرمی نشان می‌دهد.',
      en: 'Colorful halos rest on frames to show light gently.',
    },
  },
  {
    image: siteMediaDefaults.miyanImg1,
    overline: { fa: 'نفس', en: 'Breath' },
    title: { fa: 'پرواز آهسته', en: 'Slow lift' },
    copy: {
      fa: 'نقطه‌هایی از روشنایی روی صحنه شناور می‌شوند.',
      en: 'Specks of brightness glide across the stage.',
    },
  },
]

const storySections = ref([])
const setStoryScene = (el, idx) => {
  storySections.value[idx] = el || null
}
const { sceneProgress } = useSceneProgress(storySections, {
  easePower: 1.3,
  springPoint: 0.58,
  holdFactor: 0.42,
  releaseCurve: 0.8,
})

function sceneStyle(idx) {
  const progress = sceneProgress.value[idx] ?? 0
  const translate = (1 - progress) * 34 // less heavy; smoother
  const scale = 0.94 + progress * 0.06
  return {
    transform: `translate3d(0, ${pxToRem(translate)}, 0) scale(${scale})`,
    opacity: 0.4 + progress * 0.6,
    transition: 'transform 800ms cubic-bezier(.2,.9,.25,1), opacity 700ms ease',
    willChange: 'transform, opacity',
  }
}

function storySurface(image) {
  return { '--story-image': `url("${image}")` }
}

useRevealObserver(landingRoot, { threshold: 0.18 })
</script>

<style scoped>
/* Base shell */
.landing-shell {
  position: relative;
  min-height: 100vh;
  padding: 0;
  background: transparent;
  color: #0f0f0f;
  --viz-velocity: 1;
}

/* HERO PANEL */
.miyan-hero-panel {
  display: grid;
  width: 100%;
  min-height: 100vh;
  gap: clamp(1.5rem, 3vw, 3rem);
  padding: clamp(1.5rem, 3vw, 3rem);
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  align-items: stretch;
}

/* media: larger, cleaner shadow */
.hero-media {
  position: relative;
  min-height: 76vh;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  /* subtle elevated surface rather than heavy shadow */
  box-shadow: 0 8px 24px rgba(10, 7, 5, 0.08);
  transition: transform 1.2s ease, box-shadow 1.2s ease;
  will-change: transform;
}

/* gradient overlay kept but lighter for luxury-minimal */
.hero-media-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(210deg, rgba(255, 255, 255, 0) 40%, rgba(12, 10, 8, 0.55) 100%);
  mix-blend-mode: multiply;
  opacity: 0.9;
  pointer-events: none;
}

/* copy block: refined backdrop, reduced noise */
.hero-copy-block {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.98), rgba(255, 250, 243, 0.95));
  padding: clamp(1.75rem, 4vw, 3.25rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 10px;
  transition: transform 1s ease, box-shadow 1s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  box-shadow: 0 6px 18px rgba(16, 11, 7, 0.06);
}

/* reduce heavy bright halos, keep subtle artistic sheen */
.hero-copy-block::before {
  content: '';
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle at 12% 18%, rgba(255,255,255,0.65), transparent 40%);
  filter: blur(28px);
  opacity: 0.85;
  pointer-events: none;
}

.hero-copy-block h1 {
  font-size: clamp(2.6rem, 5vw, 4rem);
  line-height: 1.18;
  margin: 0;
}

.hero-copy-block p {
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0;
  color: rgba(21, 16, 12, 0.9);
}

/* highlights: refined chips */
.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.hero-highlights span {
  padding: 0.36rem 0.85rem;
  font-size: 0.74rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 2px 8px rgba(12,8,6,0.04);
}

/* overline */
.overline {
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 0.72rem;
  opacity: 0.6;
  margin: 0;
}

/* modal panel */
.miyan-modal-panel {
  min-height: 85vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
}

.modal-body {
  width: min(72rem, 100%);
  padding: clamp(2.25rem, 4vw, 4rem);
  background: linear-gradient(145deg, rgba(255, 248, 232, 0.97), rgba(255, 240, 224, 0.92));
  box-shadow: 0 10px 28px rgba(15, 10, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
}

.modal-body::after {
  content: '';
  position: absolute;
  inset: -6%;
  background: radial-gradient(circle at 60% 0%, rgba(255, 255, 255, 0.45), transparent 45%);
  filter: blur(28px);
  opacity: 0.9;
  pointer-events: none;
  z-index: -1;
}

.modal-overline {
  letter-spacing: 0.45em;
  text-transform: uppercase;
  font-size: 0.7rem;
  opacity: 0.65;
  margin: 0;
}

.modal-intro {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(18, 12, 8, 0.9);
}

.modal-chip {
  align-self: flex-start;
  font-size: 0.78rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.78);
  padding: 0.35rem 1.2rem;
  border-radius: 999px;
}

/* modal grid items */
.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.modal-focus {
  padding: 1rem 1.1rem;
  background: rgba(255, 255, 255, 0.72);
  min-height: 8rem;
  transition: transform 700ms cubic-bezier(.2,.9,.25,1), opacity 700ms ease;
  opacity: 0;
  transform: translateY(0.6rem);
}

.modal-focus.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: var(--delay);
}

.modal-focus strong {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.95rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.modal-focus p {
  font-size: 0.9rem;
  margin: 0;
  color: rgba(24, 16, 9, 0.85);
}

/* IMMERSIVE STACK: images are larger, almost full screen */
.immersive-stack {
  margin-top: 3rem;
  padding: 0 clamp(1.25rem, 3vw, 3rem) clamp(3rem, 5vw, 4rem);
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  scroll-snap-type: y proximity;
}

/* story scene: bigger, less overlay, improved animation */
.story-scene {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: clamp(40rem, 80vh, 92vh); /* much larger for almost fullscreen feel */
  overflow: hidden;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  scroll-snap-align: start;
  background: transparent;
}

/* image surface: cover and sit behind content; bigger scale so edges feel immersive */
.story-scene::before {
  content: '';
  position: absolute;
  inset: -10%;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  filter: saturate(1.08) contrast(1.02) brightness(0.98);
  transform: scale(1.06);
  transition: transform 1000ms cubic-bezier(.2,.9,.25,1), filter 900ms ease;
  will-change: transform, filter;
  z-index: 0;
}

/* remove heavy color overlay; keep a subtle warm tone for consistency */
.story-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(165deg, rgba(255,255,255,0) 28%, rgba(255, 245, 235, 0.18));
  mix-blend-mode: overlay;
  opacity: 0.95;
  z-index: 0;
  pointer-events: none;
}

/* hover/pointer interactions: gentle parallax */
.story-scene:hover::before,
.story-scene.is-active::before {
  transform: scale(1.09) translateY(-1%);
  filter: saturate(1.12) contrast(1.04) brightness(1.01);
}

/* STORY COPY: remove the shadowy 'glow' behind text — keep clarity and contrast */
.story-copy {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  color: rgba(19, 14, 9, 0.94);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  max-width: min(56ch, 58%);
  margin: clamp(2rem, 6vw, 8rem);
  backdrop-filter: none; /* remove blurred/ghostly background */
}

/* Removed the previous story-copy::before blurred overlay to satisfy user's request */

/* story typography */
.story-overline {
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 0.65rem;
  opacity: 0.6;
  margin: 0;
}

.story-copy h3 {
  margin: 0;
  font-size: clamp(1.8rem, 3.7vw, 2.6rem);
  line-height: 1.12;
}

.story-copy p {
  line-height: 1.6;
  margin: 0;
  color: rgba(22, 14, 8, 0.82);
}

/* --------------------------------- */
/* MARQUEE: Beresht-style hybrid     */
/* scroll-driven translateX, subtle */
/* --------------------------------- */
.miyan-marquee {
  display: flex;
  gap: 2rem;
  overflow: hidden;
  font-size: clamp(1rem, 2vw, 1.3rem);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.55;
  color: rgba(80, 80, 80, 0.78);
  margin: 2rem 0;
  transition: transform calc(1100ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1);
  will-change: transform;
}

.marquee-item {
  display: inline-block;
  padding: 0 0.4rem;
  letter-spacing: 0.28em;
  color: rgba(30, 24, 18, 0.9);
  opacity: 0.85;
  font-weight: 500;
}

/* responsive grid tweaks */
@media (min-width: 1024px) {
  .miyan-hero-panel {
    grid-template-columns: 1.05fr 0.95fr;
    padding: clamp(2rem, 4vw, 4rem);
  }
}

/* hero top copy reveal */
.hero-copy {
  flex: 1;
  min-width: 17.5rem;
  transform: translateY(2rem);
  opacity: 0;
  transition: transform calc(1000ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(1000ms / var(--viz-velocity, 1)) ease;
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

/* subtle color accent for overline */
.overline {
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: rgba(84, 62, 49, 0.62);
}

/* small adaptive tweaks for very small screens */
@media (max-width: 640px) {
  .story-copy {
    margin: 1.25rem;
    max-width: 100%;
  }
  .story-scene {
    min-height: 60vh;
  }
  .hero-media {
    min-height: 48vh;
  }
}
</style>
