<template>
  <section ref="landingRoot" class="landing-shell" :dir="dirAttr">
    <div class="landing-hero" :style="heroAccentStyle">
      <p class="overline" data-reveal :class="textClass">{{ isRTL ? heroCopy.overline.fa : heroCopy.overline.en }}</p>
      <h1 class="headline" data-reveal :class="titleClass">
        <span>{{ isRTL ? heroCopy.title.fa : heroCopy.title.en }}</span>
        <span class="accent">{{ isRTL ? heroCopy.accent.fa : heroCopy.accent.en }}</span>
      </h1>
      <p class="lede" data-reveal :class="textClass">
        {{ isRTL ? heroCopy.lede.fa : heroCopy.lede.en }}
      </p>
      <div class="hero-pillars">
        <article
          v-for="(pillar, idx) in pillars"
          :key="pillar.title.en"
          class="pillar"
          :style="{ '--delay': `${idx * 120}ms` }"
          data-reveal
        >
          <span class="pillar-index">{{ idx + 1 }}</span>
          <div>
            <p class="pillar-title" :class="titleClass">{{ isRTL ? pillar.title.fa : pillar.title.en }}</p>
            <p class="pillar-copy" :class="textClass">{{ isRTL ? pillar.copy.fa : pillar.copy.en }}</p>
          </div>
        </article>
      </div>
    </div>

    <div class="landing-panels">
      <div class="panel intro-panel" data-reveal :style="panelGlowStyle">
        <h2 :class="titleClass">{{ isRTL ? 'ورود آرام' : 'Slow arrival' }}</h2>
        <p :class="textClass">
          {{ isRTL ? 'سطوح روشن و صداهای کم جان کمک می‌کنند ذهن آرام شود.' : 'Quiet light and soft audio help guests settle.' }}
        </p>
        <p :class="textClass">
          {{ isRTL ? 'هر مسیر کوتاه و بدون شتاب طراحی شده است.' : 'Paths stay short and unhurried.' }}
        </p>
      </div>

      <div class="panel gallery-panel" data-reveal>
        <div class="panel-grid">
          <div
            v-for="(moment, idx) in galleryMoments"
            :key="moment.title.en"
            class="moment-card"
            :style="{ transform: `translateY(${momentParallax(idx)}px)` }"
          >
            <p class="moment-title" :class="titleClass">{{ isRTL ? moment.title.fa : moment.title.en }}</p>
            <p class="moment-copy" :class="textClass">{{ isRTL ? moment.copy.fa : moment.copy.en }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'

const landingRoot = ref(null)
const scrollY = ref(0)
const isRTL = computed(() => lang.value === 'fa')
const dirAttr = computed(() => (isRTL.value ? 'rtl' : 'ltr'))

const textClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-sans'))
const titleClass = computed(() => (isRTL.value ? 'font-b-titr' : 'font-cinzel font-light'))

const heroCopy = {
  overline: { fa: 'میان', en: 'Miyan' },
  title: { fa: 'خطوط ساده، لمس صمیمی', en: 'Simple lines, gentle tactility' },
  accent: { fa: 'همه چیز آهسته پیش می‌رود', en: 'Everything moves slowly' },
  lede: {
    fa: 'مواد خام و نور کم‌رنگ را کنار هم می‌گذاریم تا مهمان بدون عجله نفس بکشد.',
    en: 'We pair raw materials with dim light so every guest breathes without rush.'
  }
}

const pillars = [
  {
    title: { fa: 'نور نرم', en: 'Soft light' },
    copy: {
      fa: 'شدت نور فقط به اندازه خواندن منو است.',
      en: 'Levels stay just bright enough to read.'
    }
  },
  {
    title: { fa: 'مواد طبیعی', en: 'Honest materials' },
    copy: {
      fa: 'چوب، بتن و فلز بدون تزئین اضافی استفاده می‌شوند.',
      en: 'Wood, concrete, and metal stay honest.'
    }
  },
  {
    title: { fa: 'ریتم سرو', en: 'Service rhythm' },
    copy: {
      fa: 'حرکت میزبان کوتاه و دقیق است.',
      en: 'Hosts move in short, precise steps.'
    }
  }
]

const galleryMoments = [
  {
    title: { fa: 'سکوت صبح', en: 'Morning quiet' },
    copy: {
      fa: 'صدای قهوه و آب تنها لایه صوتی فضا است.',
      en: 'Coffee and water are the only sounds.'
    }
  },
  {
    title: { fa: 'گالری', en: 'Gallery line' },
    copy: {
      fa: 'عکس‌ها بدون قاب و با نور نقطه‌ای نمایش داده می‌شوند.',
      en: 'Prints hang frameless with narrow light.'
    }
  },
  {
    title: { fa: 'نفس عمیق', en: 'Deep breath' },
    copy: {
      fa: 'رایحه مرکبات و هل برای تمام فضا مشترک است.',
      en: 'A light citrus-cardamom scent ties rooms together.'
    }
  }
]

const heroAccentStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 600, 1), 0.8)
  return {
    transform: `translate3d(0, ${curve * -65}px, 0)`
  }
})

const panelGlowStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 800, 1), 0.6)
  return {
    boxShadow: `0 20px 60px rgba(0,0,0,${0.15 + curve * 0.25})`
  }
})

function momentParallax(idx) {
  const base = scrollY.value * (0.04 + idx * 0.01)
  return Math.min(base, 60)
}

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

useRevealObserver(landingRoot, { threshold: 0.2 })
</script>

<style scoped>
.landing-shell {
  min-height: 100vh;
  padding: clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(6rem + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #f7f7f7 0%, #fdfdfd 45%, #f5f1ee 100%);
  color: #0b0b0b;
}

.landing-hero {
  max-width: 960px;
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
  max-width: 620px;
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.8;
}

.hero-pillars {
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.pillar {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(11, 11, 11, 0.06);
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  backdrop-filter: blur(6px);
  transform: translateY(24px);
  opacity: 0;
  transition: transform 700ms cubic-bezier(.2,.8,.2,1), opacity 700ms ease;
  transition-delay: var(--delay);
}

.pillar.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.pillar-index {
  font-size: 0.9rem;
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
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.panel {
  border: 1px solid rgba(11, 11, 11, 0.08);
  border-radius: 0;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: #ffffff;
  position: relative;
  overflow: hidden;
  transform: translateY(30px);
  opacity: 0;
  transition: transform 750ms cubic-bezier(.2,.8,.2,1), opacity 750ms ease, box-shadow 400ms ease;
}

.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.6), transparent 60%);
  pointer-events: none;
}

.panel.is-visible {
  transform: translateY(0);
  opacity: 1;
}

.panel h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.panel p {
  line-height: 1.7;
  opacity: 0.78;
}

.panel-grid {
  display: grid;
  gap: 1.25rem;
}

.moment-card {
  border: 1px solid rgba(11, 11, 11, 0.08);
  padding: 1.4rem;
  background: linear-gradient(135deg, #fdfdfd, #f7f1ee);
  transition: transform 400ms cubic-bezier(.2,.8,.2,1);
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

@media (max-width: 768px) {
  .landing-shell {
    padding-top: 4rem;
  }

  .hero-pillars {
    grid-template-columns: 1fr;
  }
}
</style>
