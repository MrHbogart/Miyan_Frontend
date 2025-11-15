<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--madi brand-surface brand-surface--madi"
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

    <div class="madi-grid">
      <article
        v-for="(ritual, index) in rituals"
        :key="ritual.title.en"
        class="ritual-card"
        data-reveal
        :style="{ '--delay': `${index * 90}ms` }"
      >
        <p class="ritual-title" :class="titleClass">{{ isRTL ? ritual.title.fa : ritual.title.en }}</p>
        <p class="ritual-copy" :class="textClass">{{ isRTL ? ritual.copy.fa : ritual.copy.en }}</p>
      </article>
    </div>

    <div class="madi-atmosphere">
      <div class="mist-line" v-for="n in 3" :key="n" :style="mistStyle(n)"></div>
      <div class="atmo-copy" data-reveal>
        <h2 :class="titleClass">{{ isRTL ? 'اتمسفر شب' : 'Night air' }}</h2>
        <p :class="textClass">
          {{ isRTL ? 'نور خطی مه را روشن می‌کند و لبه فنجان را می‌درخشد.' : 'Linear light lifts the mist and trims each cup.' }}
        </p>
        <p :class="textClass">
          {{ isRTL ? 'گیاه خیس و صدای آب پس‌زمینه را می‌سازد.' : 'Damp foliage and water loops complete the scene.' }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'

const landingRoot = ref(null)
const { scrollY, speedFactor } = useScrollVelocity({
  smoothing: 0.2,
  multiplier: 11,
  max: 1.5,
  min: 0.85,
})
const isRTL = computed(() => lang.value === 'fa')
const dirAttr = computed(() => (isRTL.value ? 'rtl' : 'ltr'))
const textClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-sans'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-cinzel font-light'))
const pxToRem = (valuePx) => `${parseFloat((valuePx / 16).toFixed(4))}rem`
const landingStyle = computed(() => ({
  '--viz-velocity': speedFactor.value.toFixed(3)
}))

const heroCopy = {
  overline: { fa: 'مادی', en: 'Madi' },
  title: { fa: 'بخار سرد، نور ماه', en: 'Cool mist, moon light' },
  body: {
    fa: 'نوشیدنی گیاهی، مه معطر و موسیقی مینیمال کنار هم قرار می‌گیرند.',
    en: 'Botanical pours, scented mist, and minimal beats live together.'
  }
}

const rituals = [
  {
    title: { fa: 'مه دمایی', en: 'Thermal mist' },
    copy: {
      fa: 'چشم را آرام می‌کند و بو را تازه نگه می‌دارد.',
      en: 'It calms the gaze and resets aroma.'
    }
  },
  {
    title: { fa: 'کالکشن شب', en: 'Night collection' },
    copy: {
      fa: 'نوشیدنی گیاهی با یخ دست‌ساز سرو می‌شود.',
      en: 'Botanical drinks meet hand-cut ice.'
    }
  },
  {
    title: { fa: 'ایستگاه صدا', en: 'Sound booth' },
    copy: {
      fa: 'کوک پایین قوس سقف را برجسته می‌کند.',
      en: 'Low notes highlight the ceiling arcs.'
    }
  }
]

const heroOrbitStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 500, 1), 0.75)
  const offsetX = curve * 30 * speedFactor.value
  const offsetY = curve * -40 * speedFactor.value
  return {
    transform: `translate3d(${pxToRem(offsetX)}, ${pxToRem(offsetY)}, 0)`
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

useRevealObserver(landingRoot, { threshold: 0.18 })
</script>

<style scoped>
.landing-shell {
  min-height: 100vh;
  padding: clamp(4rem, 7vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(5rem + env(safe-area-inset-bottom));
  color: #0f2535;
  --viz-velocity: 1;
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
  gap: 1.25rem;
  margin: 3rem 0;
}

.ritual-card {
  background: rgba(255, 255, 255, 0.92);
  border: 0.0625rem solid rgba(113, 164, 214, 0.35);
  padding: 1.75rem;
  min-height: 11.25rem;
  --delay: 0ms;
  transform: translateY(2.1875rem);
  opacity: 0;
  transition: transform calc(700ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1),
    opacity calc(700ms / var(--viz-velocity, 1)) ease;
  transition-delay: calc(var(--delay) / var(--viz-velocity, 1));
  box-shadow: 0 1rem 2.5rem rgba(101, 152, 209, 0.18);
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
  border: 0.0625rem solid rgba(145, 188, 234, 0.35);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  overflow: hidden;
  min-height: 16.25rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 1.25rem 2.5rem rgba(79, 132, 190, 0.15);
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
