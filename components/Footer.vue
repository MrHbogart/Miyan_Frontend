<template>
  <footer
    class="w-full mt-0 py-10 bg-black/90 border-t border-white/10"
    dir="ltr"
    :style="footerSafeArea"
  >
    <div class="max-w-6xl mx-auto px-6 text-sm text-white flex flex-col gap-8">
      <div class="grid gap-6 md:grid-cols-4">
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.3em] text-white/50">
            {{ isRTL ? 'میان' : 'Miyan' }}
          </p>
          <p :class="textClass" class="text-base leading-relaxed text-white/80">
            {{ isRTL ? footerCopy.about.fa : footerCopy.about.en }}
          </p>
        </div>

        <div v-for="section in footerSections" :key="section.key" class="space-y-2">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ section.title }}</p>
          <ul class="space-y-1.5 text-white/80" :class="textClass">
            <li v-for="link in section.links" :key="link.label.en">
              <NuxtLink
                v-if="link.path"
                :to="buildPath(link.path)"
                class="hover:text-white transition-colors"
              >
                {{ isRTL ? link.label.fa : link.label.en }}
              </NuxtLink>
              <a
                v-else
                :href="link.href"
                class="hover:text-white transition-colors"
              >
                {{ isRTL ? link.label.fa : link.label.en }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col gap-4 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-2">
          <button
            @click.prevent="changeLang('fa')"
            :class="['px-2 py-1 rounded-sm text-xs tracking-wide', lang === 'fa' ? 'bg-white text-black font-semibold' : 'text-white/70']"
          >
            FA
          </button>
          <button
            @click.prevent="changeLang('en')"
            :class="['px-2 py-1 rounded-sm text-xs tracking-wide', lang === 'en' ? 'bg-white text-black font-semibold' : 'text-white/70']"
          >
            EN
          </button>
        </div>

        <div class="flex flex-col items-start md:items-end gap-1 text-white/80">
          <span class="font-cinzel text-sm">© {{ currentYear }} Miyan Group</span>
          <a
            class="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs md:text-sm"
            href="https://www.linkedin.com/in/hosseinsaeidi/"
            target="_blank"
            rel="noopener"
          >
            <span>{{ isRTL ? 'طراحی و توسعه توسط' : 'Designed and Developed by' }}</span>
            <img :src="linkedinLogo" alt="LinkedIn" class="inline-block w-4 h-4 object-contain" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLang, setLang } from '~/composables/useLang'
import linkedinLogo from '@/assets/images/linkedin.png'

const router = useRouter()
const route = useRoute()
const langState = useLang()
const lang = computed(() => langState.value)
const isRTL = computed(() => lang.value === 'fa')
const currentYear = new Date().getFullYear()
const footerSafeArea = {
  paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
  paddingLeft: 'env(safe-area-inset-left)',
  paddingRight: 'env(safe-area-inset-right)',
}
const textClass = computed(() => (isRTL.value ? 'font-b-titr text-right' : 'font-sans text-left'))

const footerCopy = {
  about: {
    fa: 'برنامه روزانه قهوه و بیکری در دو شعبه برشت و مادی',
    en: 'Daily coffee and bakery program across Beresht and Madi',
  },
}

const footerSections = computed(() => [
  {
    key: 'visit',
    title: isRTL.value ? 'بازدید' : 'Visit',
    links: [
      { label: { fa: 'برشت ولنجک', en: 'Beresht' }, path: 'beresht' },
      { label: { fa: 'مادی کریمخان', en: 'Madi' }, path: 'madi' },
    ],
  },
  {
    key: 'menus',
    title: isRTL.value ? 'منوها' : 'Menus',
    links: [
      { label: { fa: 'منوی برشت', en: 'Beresht Menu' }, path: 'beresht/menu' },
      { label: { fa: 'پخت روز برشت', en: "Beresht Today's Special" }, path: 'beresht/daily-menu' },
      { label: { fa: 'منوی مادی', en: 'Madi Menu' }, path: 'madi/menu' },
      { label: { fa: 'پخت روز مادی', en: "Madi Today's Special" }, path: 'madi/daily-menu' },
    ],
  },
  {
    key: 'contact',
    title: isRTL.value ? 'تماس' : 'Contact',
    links: [
      { label: { fa: 'info@miyangroup.com', en: 'info@miyangroup.com' }, href: 'mailto:info@miyangroup.com' },
      { label: { fa: '+98 21 2244 7700', en: '+98 21 2244 7700' }, href: 'tel:+982122447700' },
      { label: { fa: '+98 21 8889 4400', en: '+98 21 8889 4400' }, href: 'tel:+982188894400' },
    ],
  },
])

const buildPath = (slug = '') => {
  const normalized = slug.replace(/^\/+|\/+$/g, '')
  const currentLang = lang.value || 'fa'
  return normalized ? `/${currentLang}/${normalized}` : `/${currentLang}/`
}

function changeLang(l) {
  if (lang.value === l) return
  setLang(l)

  const segments = route.fullPath.split('/').filter(Boolean)
  if (segments[0] === 'en' || segments[0] === 'fa') {
    segments.shift()
  }

  const suffix = segments.length ? `/${segments.join('/')}` : '/'
  const newPath = `/${l}${suffix}`.replace(/\/+$/, '/')
  router.replace(newPath)
}
</script>

<style scoped>
footer {
  background: #000 !important;
  color: #fff;
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Landscape: extend footer to use full device width */
@media (orientation: landscape) {
  footer {
    margin-left: calc(env(safe-area-inset-left, 0px) * -1);
    margin-right: calc(env(safe-area-inset-right, 0px) * -1);
    width: calc(100% + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px));
    max-width: calc(100% + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px));
  }
}
</style>
