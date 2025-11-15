<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--beresht brand-surface brand-surface--beresht content-shell"
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
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'
import { useSceneProgress } from '@/composables/useSceneProgress'
import proofingImage from '@/assets/images/beresht-proofing-table.jpg'
import teaSteamImage from '@/assets/images/beresht-tea-steam.jpg'

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

const photoStories = [
  {
    image: proofingImage,
    overline: { fa: 'کارگاه', en: 'Workshop' },
    title: { fa: 'خمير آرام', en: 'Composed dough' },
    copy: {
      fa: 'آرد روی میز سنگی می‌رقصد و بخار سرد به آرامی از ظرف‌ها بالا می‌رود.',
      en: 'Flour drifts across the stone bench while cool vapor rises from the bowls.'
    }
  },
  {
    image: proofingImage,
    overline: { fa: 'فرم', en: 'Form' },
    title: { fa: 'سطوح روشن', en: 'Silent forms' },
    copy: {
      fa: 'سنگ روشن و ورق فولاد در نور خورشید محو می‌شوند.',
      en: 'Pale stone and steel sheets fade inside the morning light.'
    }
  },
  {
    image: teaSteamImage,
    overline: { fa: 'چایخانه', en: 'Tea room' },
    title: { fa: 'بخار مرکبات', en: 'Citrus steam' },
    copy: {
      fa: 'لیوان‌ها در نور طلایی می‌درخشند و خدمت آرام با اشاره دست هدایت می‌شود.',
      en: 'Glasses glow in amber light while quiet hand cues guide the service.'
    }
  },
  {
    image: teaSteamImage,
    overline: { fa: 'امروز', en: 'Today' },
    title: { fa: 'پخت عصر', en: 'Evening proof' },
    copy: {
      fa: 'هوای گرم با وانیل سفید ترکیب می‌شود و فضا را جمع می‌کند.',
      en: 'Warm air blends with white vanilla to close the room.',
    }
  },
]

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

useRevealObserver(landingRoot, { threshold: 0.15 })
</script>

<style scoped>
.landing-shell {
  position: relative;
  min-height: 100vh;
  padding: clamp(4rem, 7vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(5rem + env(safe-area-inset-bottom));
  background: transparent;
  color: #2b1c12;
  --viz-velocity: 1;
}
.landing-shell::before {
  content: '';
  position: absolute;
  inset: 2.5rem;
  border: 1px solid rgba(187, 150, 110, 0.25);
  border-radius: clamp(1.25rem, 3vw, 2.5rem);
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
  padding: 1.5rem 0;
  border: none;
  background: transparent;
  box-shadow: none;
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
  transition: transform calc(800ms / var(--viz-velocity, 1)) cubic-bezier(.19,.84,.37,1),
    opacity calc(800ms / var(--viz-velocity, 1)) ease;
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
  border-left: 2px solid rgba(178, 117, 82, 0.25);
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
  min-height: clamp(18rem, 70vh, 32rem);
  padding: clamp(1.75rem, 3vw, 2.75rem);
  border-radius: clamp(0.5rem, 1vw, 0.9rem);
  overflow: hidden;
  color: rgba(40, 24, 15, 0.92);
  scroll-snap-align: start;
}

.story-scene::before {
  content: '';
  position: absolute;
  inset: -5%;
  background-image: var(--story-image);
  background-size: cover;
  background-position: center;
  transform: scale(1.03);
  filter: saturate(1.2) contrast(1.05);
  transition: transform 800ms cubic-bezier(.2,.8,.2,1);
}

.story-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 245, 236, 0.9), rgba(255, 225, 203, 0.65));
  mix-blend-mode: lighten;
}

.story-scene:hover::before {
  transform: scale(1.08);
}

.story-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: rgba(78, 43, 24, 0.9);
}

.story-overline {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  color: rgba(178, 117, 82, 0.85);
}

@media (max-width: 48rem) {
  .beresht-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
