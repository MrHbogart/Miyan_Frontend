<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--beresht brand-surface brand-surface--beresht"
    :dir="dirAttr"
    :style="landingStyle"
  >
    <div class="beresht-hero">
      <div class="hero-emblem" data-reveal>
        <img :src="siteMedia.bereshtLogo" alt="Miyan Beresht" />
      </div>
      <div class="hero-copy" data-reveal>
        <p class="overline" :class="textClass">{{ isRTL ? heroCopy.overline.fa : heroCopy.overline.en }}</p>
        <h1 :class="titleClass">
          {{ isRTL ? heroCopy.title.fa : heroCopy.title.en }}
        </h1>
        <p :class="textClass">
          {{ isRTL ? heroCopy.body.fa : heroCopy.body.en }}
        </p>
      </div>
    </div>

    <div class="beresht-marquee" :style="marqueeStyle">
      <span v-for="(word, index) in marqueeWords" :key="word.en + index">
        {{ isRTL ? word.fa : word.en }}
      </span>
    </div>

    <div class="beresht-panels">
      <article class="panel" data-reveal>
        <h2 :class="titleClass">{{ isRTL ? 'میز آماده' : 'Prep table' }}</h2>
        <p :class="textClass">
          {{ isRTL ? 'سطح سنگی همیشه خنک است تا لایه‌ها جمع نشوند.' : 'Chilled stone keeps layers relaxed.' }}
        </p>
        <p :class="textClass">
          {{ isRTL ? 'تمام ابزار فقط یک ریتم آهسته دارند.' : 'Tools move in one quiet tempo.' }}
        </p>
      </article>
      <article class="panel" data-reveal>
        <h2 :class="titleClass">{{ isRTL ? 'اتاق چای' : 'Tea room' }}</h2>
        <p :class="textClass">
          {{ isRTL ? 'چای سفید با پوست مرکبات تعادل مزه‌ها را نگه می‌دارد.' : 'White tea with citrus peel balances the sweets.' }}
        </p>
        <p :class="textClass">
          {{ isRTL ? 'میزبان فقط با اشاره آرام سرو می‌کند.' : 'Service works with simple hand cues.' }}
        </p>
      </article>
      <article class="panel" data-reveal>
        <h2 :class="titleClass">{{ isRTL ? 'امروز' : 'Today' }}</h2>
        <ul :class="textClass">
          <li v-for="item in todaysDetails" :key="item.en">
            {{ isRTL ? item.fa : item.en }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'

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
const textClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-sans'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-cinzel font-light'))
const pxToRem = (valuePx) => `${parseFloat((valuePx / 16).toFixed(4))}rem`
const landingStyle = computed(() => ({
  '--viz-velocity': speedFactor.value.toFixed(3)
}))

const marqueeWords = [
  { fa: 'استراحت', en: 'Proof' },
  { fa: 'فرم', en: 'Shape' },
  { fa: 'پخت', en: 'Bake' },
  { fa: 'سرو', en: 'Serve' }
]

const todaysDetails = [
  { fa: 'کروسان کره قهوه‌ای', en: 'Brown butter croissant' },
  { fa: 'لیموناد هل و لیمو', en: 'Cardamom lime lemonade' },
  { fa: 'نان ترد گندم سیاه', en: 'Buckwheat crispbread' }
]

const heroCopy = {
  overline: { fa: 'کارگاه نان', en: 'Bake studio' },
  title: { fa: 'خمیر آرام، شعله کم', en: 'Calm dough, low flame' },
  body: {
    fa: 'هر خمیر با دست کشیده و در عطر کره گرم می‌شود.',
    en: 'Each dough is hand-stretched and warmed with quiet butter notes.'
  }
}

const marqueeStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 400, 1), 0.7)
  const offsetPx = curve * -80 * speedFactor.value
  return {
    transform: `translateX(${pxToRem(offsetPx)})`
  }
})

useRevealObserver(landingRoot, { threshold: 0.15 })
</script>

<style scoped>
.landing-shell {
  min-height: 100vh;
  padding: clamp(4rem, 7vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(5rem + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #fff8ef 0%, #fff0e2 55%, #ffe5d0 100%);
  color: #2b1c12;
  --viz-velocity: 1;
}

.landing-shell--beresht {
  background-image:
    radial-gradient(circle at 30% 20%, rgba(255, 229, 208, 0.7), transparent 60%),
    radial-gradient(circle at 70% 10%, rgba(255, 205, 178, 0.55), transparent 55%),
    linear-gradient(180deg, #fff7ec 0%, #ffeeda 60%, #ffe4ca 100%);
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
  padding: 2rem;
  border: 0.0625rem solid rgba(199, 148, 103, 0.35);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1.25rem 2.5rem rgba(205, 145, 92, 0.15);
  transform: translateY(2.5rem);
  opacity: 0;
  transition: transform calc(800ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(800ms / var(--viz-velocity, 1)) ease;
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
  transition: transform calc(800ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(800ms / var(--viz-velocity, 1)) ease;
}

.hero-copy h1 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  line-height: 1.2;
  margin: 1rem 0;
  font-weight: 400;
}

.hero-copy p {
  color: rgba(64, 38, 23, 0.85);
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
  color: rgba(178, 117, 82, 0.9);
  margin-bottom: 3rem;
  transition: transform calc(700ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1);
}

.beresht-panels {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}

.panel {
  background: rgba(255, 255, 255, 0.9);
  border: 0.0625rem solid rgba(212, 169, 135, 0.35);
  padding: clamp(1.5rem, 4vw, 2.4rem);
  min-height: 13.75rem;
  position: relative;
  transform: translateY(2.5rem);
  opacity: 0;
  transition: transform calc(800ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(800ms / var(--viz-velocity, 1)) ease;
  box-shadow: 0 1rem 2.5rem rgba(224, 156, 110, 0.15);
}

.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 202, 162, 0.25), transparent 60%);
  pointer-events: none;
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
  padding-left: 1rem;
  list-style: square;
}

.hero-emblem.is-visible,
.hero-copy.is-visible,
.panel.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 48rem) {
  .beresht-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
