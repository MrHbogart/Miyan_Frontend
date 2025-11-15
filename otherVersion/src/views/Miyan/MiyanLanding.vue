<template>
<section
  ref="landingRoot"
  class="landing-shell brand-surface brand-surface--miyan"
  :dir="dirAttr"
  :style="landingStyle"
>
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
            :style="{ transform: `translateY(${momentParallax(idx)})` }"
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
import { ref, computed } from 'vue'
import { lang } from '@/state/lang'
import { useRevealObserver } from '@/composables/useRevealObserver'
import { useScrollVelocity } from '@/composables/useScrollVelocity'

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
  const offsetPx = curve * -65 * speedFactor.value
  return {
    transform: `translate3d(0, ${pxToRem(offsetPx)}, 0)`
  }
})

const panelGlowStyle = computed(() => {
  const curve = Math.pow(Math.min(scrollY.value / 800, 1), 0.6)
  const glow = Math.min(0.45, (0.15 + curve * 0.25) * speedFactor.value)
  return {
    boxShadow: `0 ${pxToRem(20 * speedFactor.value)} ${pxToRem(60)} rgba(0,0,0,${glow})`
  }
})

function momentParallax(idx) {
  const base = scrollY.value * (0.04 + idx * 0.01) * speedFactor.value
  return pxToRem(Math.min(base, 60))
}

useRevealObserver(landingRoot, { threshold: 0.2 })
</script>

<style scoped>
.landing-shell {
  min-height: 100vh;
  padding: clamp(4rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem) calc(6rem + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #f7f7f7 0%, #fdfdfd 45%, #f5f1ee 100%);
  color: #0b0b0b;
  --viz-velocity: 1;
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
  background: rgba(255, 255, 255, 0.8);
  border: 0.0625rem solid rgba(11, 11, 11, 0.06);
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  backdrop-filter: blur(0.375rem);
  transform: translateY(1.5rem);
  opacity: 0;
  transition: transform 700ms cubic-bezier(.2,.8,.2,1), opacity 700ms ease;
  transition-delay: calc(var(--delay) / var(--viz-velocity, 1));
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
  grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
}

.panel {
  border: 0.0625rem solid rgba(11, 11, 11, 0.08);
  border-radius: 0;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: #ffffff;
  position: relative;
  overflow: hidden;
  transform: translateY(1.875rem);
  opacity: 0;
  transition: transform calc(750ms / var(--viz-velocity, 1)) cubic-bezier(.2,.8,.2,1),
    opacity calc(750ms / var(--viz-velocity, 1)) ease,
    box-shadow 400ms ease;
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
  border: 0.0625rem solid rgba(11, 11, 11, 0.08);
  padding: 1.4rem;
  background: linear-gradient(135deg, #fdfdfd, #f7f1ee);
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

@media (max-width: 48rem) {
  .landing-shell {
    padding-top: 4rem;
  }

  .hero-pillars {
    grid-template-columns: 1fr;
  }
}
</style>
