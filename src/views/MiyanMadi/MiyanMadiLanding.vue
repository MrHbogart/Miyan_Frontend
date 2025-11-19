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
      <div class="mist-line" v-for="n in 3" :key="n" :style="mistStyle(n)"></div>
      <div class="atmo-copy" data-reveal>
        <h2 :class="titleClass">{{ isRTL ? 'میان کوچه ها و خیابان های شهر' : 'Among the Alleys and Streets of the City' }}</h2>
        <p :class="textClass">
          {{ isRTL ? 'میان صمیمیت و احترام' : 'Where Intimacy Meets Respect' }}
        </p>
        <p :class="textClass">
          {{ isRTL ? 'میان سکوت و موسیقی' : 'Where Silence Meets Music' }}
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
        <div class="story-copy">
          <p class="story-overline" :class="textClass">{{ isRTL ? story.overline.fa : story.overline.en }}</p>
          <h3 :class="titleClass">{{ isRTL ? story.title.fa : story.title.en }}</h3>
          <p :class="textClass">{{ isRTL ? story.copy.fa : story.copy.en }}</p>
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

const heroCopy = {
  overline: { fa: 'مادی', en: 'Madi' },
  title: { fa: 'میان شهر و شهروند', en: 'Between the City and the Citizen' },
  body: {
    fa: 'توقف میان لحظه ها', 
    en: 'A Pause Between Moments'
  }
}

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

const photoStories = [
  {
    image: siteMedia.madiImg1,
    overline: { fa: 'صدا', en: 'Sound' },
    title: { fa: 'کمان موسیقی', en: 'Arc of sound' },
    copy: {
      fa: 'فرکانس پایین روی دیوار می‌لغزد و ریتم را در فضای مه‌آلود نگه می‌دارد.',
      en: 'Low frequency grazes the wall and keeps rhythm suspended in the mist.'
    }
  },
  {
    image: siteMedia.madiImg2,
    overline: { fa: 'نور', en: 'Light' },
    title: { fa: 'موج آبی', en: 'Azure wave' },
    copy: {
      fa: 'مه سرد نور ماه مصنوعی را می‌شکند و فنجان را درخشان می‌کند.',
      en: 'Cool haze refracts the fabricated moonlight and tips the cup in glow.'
    }
  }
]

const storySections = ref([])
const setStoryScene = (el, idx) => {
  storySections.value[idx] = el || null
}
const { sceneProgress } = useSceneProgress(storySections, {
  easePower: 1.35,
  springPoint: 0.6,
  holdFactor: 0.38,
  releaseCurve: 0.85,
})
function sceneStyle(idx) {
  const p = sceneProgress.value[idx] ?? 0
  const translate = (1 - p) * 60
  const scale = 0.88 + p * 0.12
  return {
    transform: `translate3d(0, ${pxToRem(translate)}, 0) scale(${scale})`,
    opacity: 0.35 + p * 0.65
  }
}

function storySurface(image) {
  return { '--story-image': `url("${image}")` }
}

useRevealObserver(landingRoot, { threshold: 0.18 })
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
  border: 1px solid rgba(74, 115, 164, 0.25);
  border-radius: clamp(1.25rem, 3vw, 2.5rem);
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

.madi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13.75rem, 1fr));
  gap: 0.75rem;
  margin: 2rem 0;
}

.ritual-card {
  background: transparent;
  border: none;
  padding: clamp(1rem, 2vw, 1.5rem) 0;
  min-height: auto;
  --delay: 0ms;
  transform: translateY(2.1875rem);
  opacity: 0;
  transition: transform calc(700ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1),
    opacity calc(700ms / var(--viz-velocity, 1)) ease;
  transition-delay: calc(var(--delay) / var(--viz-velocity, 1));
  box-shadow: none;
}

.ritual-card.is-visible {
  transform: translateY(0);
  opacity: 1;
}

.ritual-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.ritual-copy {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(25, 60, 88, 0.78);
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
  margin-top: clamp(3rem, 6vw, 5rem);
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  position: relative;
  overflow: visible;
  scroll-snap-type: y proximity;
  padding-bottom: clamp(3rem, 5vw, 4rem);
}

.story-scene {
  position: sticky;
  top: clamp(3rem, 18vh, 8rem);
  isolation: isolate;
  display: flex;
  padding: clamp(1.75rem, 3vw, 2.75rem);
  border-radius: 0.6rem;
  background: transparent;
  border: none;
  box-shadow: none;
  width: 100%;
  max-width: 100%;
  scroll-snap-align: start;
}

.story-scene::before {
  position: absolute;
  content: '';
  inset: -6%;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  filter: saturate(1.15) contrast(1.1);
  transform: scale(1.05);
  transition: transform 900ms cubic-bezier(.22,.74,.28,.96);
}

.story-scene::after {
  position: absolute;
  content: '';
  inset: 0;
  background: linear-gradient(150deg, rgba(17,38,64,0.65), rgba(110,148,199,0.35));
  mix-blend-mode: screen;
}

.story-scene:hover::before {
  transform: scale(1.12);
}

.story-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: rgba(240, 248, 255, 0.9);
}

.story-overline {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  color: rgba(183, 214, 255, 0.8);
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
