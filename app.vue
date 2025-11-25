<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
const lang = useLang()
const route = useRoute()
const navAttached = useNavAttached()
const scrolled = ref(false)

const currentDir = computed(() => (lang.value === 'fa' ? 'rtl' : 'ltr'))

const gradientThemes = {
  Miyan: {
    colors: ['#fffefc', '#fff9ef', '#fff4d2'],
    baseAngle: '146deg',
    angles: {
      MiyanLanding: '150deg',
      MiyanGallery: '136deg',
      MiyanProjects: '160deg',
    },
    duration: 22,
  },
  MiyanBeresht: {
    colors: ['#fffdfb', '#fffaf8', '#fff7f0'],
    baseAngle: '132deg',
    angles: {
      MiyanBereshtLanding: '134deg',
      MiyanBereshtBaseMenu: '118deg',
      MiyanBereshtDailyMenu: '148deg',
    },
    duration: 20,
  },
  MiyanMadi: {
    colors: ['#fbf8ff', '#e8f1ff', '#dbe4ff'],
    baseAngle: '118deg',
    angles: {
      MiyanMadiLanding: '110deg',
      MiyanMadiBaseMenu: '124deg',
      MiyanMadiDailyMenu: '142deg',
    },
    duration: 18,
  },
}

const defaultTheme = gradientThemes.Miyan
const pageThemeMeta = computed(() => route.meta?.pageTheme || {})
const currentTheme = computed(() => {
  return gradientThemes[pageThemeMeta.value.group] ?? defaultTheme
})

const pageGradientStyle = computed(() => {
  const theme = currentTheme.value
  const variantKey = pageThemeMeta.value.view
  const angle = (theme.angles && theme.angles[variantKey]) || theme.baseAngle
  const [first, middle, last] = theme.colors
  const stops = `${first} 0%, ${middle} 52%, ${last} 100%`

  return {
    backgroundImage: `linear-gradient(${angle}, ${stops})`,
    backgroundSize: '160% 160%',
    backgroundPosition: 'center',
    animationDuration: `${theme.duration}s`,
  }
})

function handleScroll() {
  if (typeof window === 'undefined') return
  scrolled.value = (window.scrollY || window.pageYOffset || 0) > 40
}

watch(currentDir, (dir) => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lang.value)
}, { immediate: true })

watch(() => route.fullPath, () => {
  navAttached.value = false
  handleScroll()
})

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col text-gray-900" :dir="currentDir">
    <Header :scrolled="scrolled" />
    <main class="flex-1" :style="pageGradientStyle">
      <NuxtPage :transition="{ name: 'fade-load', mode: 'out-in' }" />
    </main>
    <Footer />
  </div>
</template>

<style>
.fade-load-enter-active,
.fade-load-leave-active {
  transition: opacity 320ms ease;
  pointer-events: none;
}

.fade-load-enter-from,
.fade-load-leave-to {
  opacity: 0;
}

.fade-load-enter-to,
.fade-load-leave-from {
  opacity: 1;
}

@keyframes gradientDrift {
  0% {
    background-position: 35% 25%;
  }
  50% {
    background-position: 65% 75%;
  }
  100% {
    background-position: 35% 25%;
  }
}

main {
  animation-name: gradientDrift;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@media (prefers-reduced-motion: reduce) {
  main {
    animation: none !important;
  }
}
</style>
