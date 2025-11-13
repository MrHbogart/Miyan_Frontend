<template>
  <section
    ref="landingRoot"
    class="landing-shell landing-shell--beresht"
    :dir="dirAttr"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import siteMediaDefaults from '@/utils/siteMediaDefaults'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'

const landingRoot = ref(null)
const scrollY = ref(0)
const siteMedia = siteMediaDefaults
const isRTL = computed(() => lang.value === 'fa')
const dirAttr = computed(() => (isRTL.value ? 'rtl' : 'ltr'))
const textClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-sans'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-cinzel font-light'))

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
  return {
    transform: `translateX(${curve * -80}px)`
  }
})

function handleScroll() {
  scrollY.value = window.scrollY || 0
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

useRevealObserver(landingRoot, { threshold: 0.15 })
</script>

<style scoped>
.landing-shell {
  min-height: 100vh;
  padding: clamp(4rem, 7vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(5rem + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #0c0c0c 0%, #151515 35%, #1d1d1d 100%);
  color: #f1f1f1;
}

.landing-shell--beresht {
  background-image:
    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 60%),
    radial-gradient(circle at 70% 10%, rgba(255,255,255,0.05), transparent 55%),
    linear-gradient(180deg, #050505 0%, #181818 60%, #101010 100%);
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
  flex: 0 0 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.02);
  transform: translateY(40px);
  opacity: 0;
  transition: transform 800ms cubic-bezier(.19,.84,.37,1), opacity 800ms ease;
}

.hero-emblem img {
  filter: brightness(10);
  width: 100%;
  height: auto;
}

.hero-copy {
  flex: 1;
  min-width: 280px;
  transform: translateY(40px);
  opacity: 0;
  transition: transform 800ms cubic-bezier(.19,.84,.37,1), opacity 800ms ease;
}

.hero-copy h1 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  line-height: 1.2;
  margin: 1rem 0;
  font-weight: 400;
}

.hero-copy p {
  color: rgba(241, 241, 241, 0.8);
  line-height: 1.7;
}

.overline {
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: rgba(241, 241, 241, 0.6);
}

.beresht-marquee {
  display: flex;
  gap: 2rem;
  overflow: hidden;
  font-size: clamp(1rem, 2vw, 1.3rem);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.3;
  margin-bottom: 3rem;
  transition: transform 700ms cubic-bezier(.2,.8,.2,1);
}

.beresht-panels {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255,255,255,0.08);
  padding: clamp(1.5rem, 4vw, 2.4rem);
  min-height: 220px;
  position: relative;
  transform: translateY(40px);
  opacity: 0;
  transition: transform 800ms cubic-bezier(.19,.84,.37,1), opacity 800ms ease;
}

.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 60%);
  pointer-events: none;
}

.panel h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.panel p,
.panel ul {
  color: rgba(241, 241, 241, 0.78);
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

@media (max-width: 768px) {
  .beresht-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
