<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--miyan brand-surface brand-surface--miyan"
    :dir="dirAttr"
    :style="landingStyle"
  >
    <div class="miyan-hero-panel" data-reveal>
      <div class="hero-media" :style="[heroBackgroundStyle, heroMediaMotion]">
        <div class="hero-media-gradient"></div>
      </div>
      <div class="hero-copy-block" :class="textClass" :style="heroCopyMotion">
        <p class="overline">{{ isRTL ? heroCopy.overline.fa : heroCopy.overline.en }}</p>
        <h1 :class="titleClass">{{ isRTL ? heroCopy.title.fa : heroCopy.title.en }}</h1>
        <p>{{ isRTL ? heroCopy.body.fa : heroCopy.body.en }}</p>
        <div class="hero-highlights">
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

const heroCopy = {
  overline: { fa: 'میان', en: 'Miyan' },
  title: { fa: 'نور معلق، لمسِ لغزان', en: 'Suspended light, gliding tactility' },
  body: {
    fa: 'در لایه‌های صاف نور و مه، هر مهمان با نفس خود جلو می‌رود.',
    en: 'Layers of calm light and mist let every guest navigate at their own pace.',
  },
}

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
  const translate = (1 - progress) * 52
  const scale = 0.9 + progress * 0.1
  return {
    transform: `translate3d(0, ${pxToRem(translate)}, 0) scale(${scale})`,
    opacity: 0.35 + progress * 0.6,
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
  padding: 0;
  background: transparent;
  color: #0f0f0f;
  --viz-velocity: 1;
}

.miyan-hero-panel {
  display: grid;
  width: 100%;
  min-height: 100vh;
  gap: clamp(1.5rem, 3vw, 3rem);
  padding: clamp(1.5rem, 3vw, 3rem);
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  align-items: stretch;
}

.hero-media {
  position: relative;
  min-height: 70vh;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  box-shadow: 0 14px 35px rgba(10, 5, 0, 0.2);
  transition: transform 1.6s ease, box-shadow 1.6s ease;
}

.hero-media-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(210deg, rgba(255, 255, 255, 0) 35%, rgba(11, 8, 4, 0.9) 100%);
  mix-blend-mode: multiply;
  opacity: 0.95;
}

.hero-copy-block {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.97), rgba(255, 245, 230, 0.9));
  padding: clamp(1.75rem, 4vw, 3.25rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 14px 30px rgba(20, 12, 0, 0.1);
  transition: transform 1.2s ease, box-shadow 1.2s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(22px);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
}

.hero-copy-block::before {
  content: '';
  position: absolute;
  inset: -30%;
  background: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.75), transparent 45%);
  filter: blur(40px);
  opacity: 0.9;
  pointer-events: none;
}

.hero-copy-block::after {
  content: '';
  position: absolute;
  inset: 20%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent);
  filter: blur(30px);
  opacity: 0.7;
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

.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.hero-highlights span {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  border: none;
  background: rgba(255, 255, 255, 0.85);
}

.overline {
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 0.72rem;
  opacity: 0.6;
  margin: 0;
}

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
  background: linear-gradient(145deg, rgba(255, 248, 232, 0.95), rgba(255, 232, 204, 0.85));
  box-shadow: 0 12px 30px rgba(15, 10, 0, 0.16);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(18px);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
}

.modal-body::after {
  content: '';
  position: absolute;
  inset: -10%;
  background: radial-gradient(circle at 60% 0%, rgba(255, 255, 255, 0.6), transparent 50%);
  filter: blur(30px);
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
  background: rgba(255, 255, 255, 0.7);
  padding: 0.35rem 1.2rem;
  border-radius: 999px;
  border: none;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.modal-focus {
  padding: 1rem 1.1rem;
  background: rgba(255, 255, 255, 0.6);
  min-height: 8rem;
  transition: transform 1100ms ease, opacity 1100ms ease;
  opacity: 0;
  transform: translateY(0.8rem);
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

.immersive-stack {
  margin-top: 3rem;
  padding: 0 clamp(1.25rem, 3vw, 3rem) clamp(3rem, 5vw, 4rem);
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  scroll-snap-type: y proximity;
}

.story-scene {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: clamp(18rem, 55vh, 32rem);
  overflow: hidden;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  box-shadow: 0 12px 35px rgba(12, 7, 4, 0.14);
  scroll-snap-align: start;
}

.story-scene::before {
  content: '';
  position: absolute;
  inset: -6%;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  filter: saturate(1.25) contrast(1.05);
  transform: scale(1.03);
  transition: transform 1200ms ease, filter 1200ms ease;
}

.story-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(165deg, rgba(255, 255, 255, 0) 30%, rgba(255, 183, 122, 0.75));
  mix-blend-mode: multiply;
}

.story-scene:hover::before {
  transform: scale(1.04);
}

.story-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  color: rgba(19, 14, 9, 0.92);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

.story-copy::before {
  content: '';
  position: absolute;
  inset: -15%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));
  filter: blur(45px);
  opacity: 0.6;
  pointer-events: none;
  z-index: -1;
}

.story-overline {
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 0.65rem;
  opacity: 0.6;
  margin: 0;
}

.story-copy h3 {
  margin: 0;
  font-size: clamp(1.45rem, 3vw, 2.3rem);
  line-height: 1.2;
}

.story-copy p {
  line-height: 1.6;
  margin: 0;
  color: rgba(22, 14, 8, 0.78);
}

@media (min-width: 1024px) {
  .miyan-hero-panel {
    grid-template-columns: 1.05fr 0.95fr;
    padding: clamp(2rem, 4vw, 4rem);
  }
}
</style>
