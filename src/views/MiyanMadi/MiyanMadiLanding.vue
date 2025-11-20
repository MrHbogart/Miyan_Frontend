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

    <article
      v-if="photoStories[0]"
      class="madi-story-feature"
      :style="storySurface(photoStories[0].image)"
    >
      <div class="madi-story-copy">
        <p class="story-overline" :class="textClass">{{ isRTL ? photoStories[0].overline.fa : photoStories[0].overline.en }}</p>
        <h3 :class="titleClass">{{ isRTL ? photoStories[0].title.fa : photoStories[0].title.en }}</h3>
        <p :class="textClass">{{ isRTL ? photoStories[0].copy.fa : photoStories[0].copy.en }}</p>
      </div>
    </article>

    <div class="madi-atmosphere">
      <div class="mist-line" v-for="n in 3" :key="`primary-${n}`" :style="mistStyle(n)"></div>
      <div class="atmo-copy" data-reveal>
        <h2 :class="titleClass">{{ isRTL ? 'میان کوچه‌ها و میدان‌ها' : 'Between alleys and squares' }}</h2>
        <p :class="textClass">
          {{ isRTL ? 'صدای شهر را نرم می‌کنیم تا مکالمه‌ها طولانی‌تر شوند.' : 'We soften the city’s voice so conversations can stretch longer.' }}
        </p>
        <p :class="textClass">
          {{ isRTL ? 'هر صندلی با هاله‌ای از نور خنک تعریف می‌شود.' : 'Each seat is framed by its own pool of cool light.' }}
        </p>
      </div>
    </div>

    <article
      v-if="photoStories[1]"
      class="madi-story-feature"
      :style="storySurface(photoStories[1].image)"
    >
      <div class="madi-story-copy">
        <p class="story-overline" :class="textClass">{{ isRTL ? photoStories[1].overline.fa : photoStories[1].overline.en }}</p>
        <h3 :class="titleClass">{{ isRTL ? photoStories[1].title.fa : photoStories[1].title.en }}</h3>
        <p :class="textClass">{{ isRTL ? photoStories[1].copy.fa : photoStories[1].copy.en }}</p>
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'
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
  overline: { fa: 'مادی نو', en: 'Madi Nouveau' },
  title: { fa: 'گفت‌وگوی شهر و حرکت', en: 'Dialogue between city and motion' },
  body: {
    fa: 'هر توقف، مکثی کوتاه میان شتاب خیابان و آرامش فنجان است.',
    en: 'Every pause is a brief negotiation between the rush outside and the calm inside the cup.',
  },
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
    overline: { fa: 'نغمه', en: 'Melody' },
    title: { fa: 'تنفس میدان', en: 'Square breathing' },
    copy: {
      fa: 'در کنار میدان، صدای گام‌ها و ترمز اتوبوس‌ها را به موجی نرم از موسیقی آرام تبدیل می‌کنیم.',
      en: 'Beside the square we translate footsteps and bus brakes into a soft wave of ambience.',
    },
  },
  {
    image: siteMedia.madiImg2,
    overline: { fa: 'نور', en: 'Light' },
    title: { fa: 'موج آبی', en: 'Azure wave' },
    copy: {
      fa: 'مه‌ی سرد به نور مصنوعی ماه می‌خورد و سطح فنجان را مانند آبراهی آرام می‌درخشد.',
      en: 'Cool haze meets the artificial moonlight and lets the cup shimmer like a calm canal.',
    },
  },
]

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

.madi-story-feature {
  position: relative;
  width: 100%;
  min-height: min(100vh, 60rem);
  margin: clamp(2rem, 5vw, 3.5rem) 0;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.madi-story-copy {
  margin: clamp(1.5rem, 4vw, 3rem);
  max-width: min(38rem, 80%);
  color: #fff;
  text-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.55);
}

.madi-story-copy h3 {
  margin: 0.25rem 0 0.75rem;
}

.madi-story-copy p {
  margin: 0;
  line-height: 1.7;
}

.story-overline {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  color: rgba(183, 214, 255, 0.85);
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
