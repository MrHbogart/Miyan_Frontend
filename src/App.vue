<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import { lang } from '@/state/lang'
import { navAttached } from '@/state/headerState'

const scrolled = ref(false)
const overlayAlpha = ref(0.45)
const router = useRouter()
const route = useRoute()
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
    duration: '32s',
  },
  MiyanBeresht: {
    colors: ['#fffdfb', '#fffaf8', '#fff7f0'],
    baseAngle: '132deg',
    angles: {
      MiyanBereshtLanding: '134deg',
      MiyanBereshtBaseMenu: '118deg',
      MiyanBereshtDailyMenu: '148deg',
    },
    duration: '30s',
  },
  MiyanMadi: {
    colors: ['#fbf8ff', '#e8f1ff', '#dbe4ff'],
    baseAngle: '118deg',
    angles: {
      MiyanMadiLanding: '110deg',
      MiyanMadiBaseMenu: '124deg',
      MiyanMadiDailyMenu: '142deg',
    },
    duration: '28s',
  },
}

const defaultTheme = gradientThemes.Miyan
const currentTheme = computed(() => {
  const parentName = route.matched?.[0]?.name
  return gradientThemes[parentName] ?? defaultTheme
})

const pageGradientStyle = computed(() => {
  const theme = currentTheme.value
  const angle = theme.angles?.[route.name] ?? theme.baseAngle
  const [first, middle, last] = theme.colors
  const stops = `${first} 0%, ${middle} 52%, ${last} 100%`
  return {
    backgroundImage: `linear-gradient(${angle}, ${stops})`,
    backgroundSize: '220% 220%',
    backgroundPosition: 'center',
    animation: `gradientDrift ${theme.duration} ease-in-out infinite`,
    transition: 'background-image 1.2s ease, background-position 1.2s ease',
  }
})

function handleScroll() {
	const y = window.scrollY || window.pageYOffset
	scrolled.value = y > 40
	const t = Math.min(1, y / 300)
	overlayAlpha.value = Math.max(0.05, 0.45 - t * 0.45)
}

watch(currentDir, (dir) => {
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('dir', dir)
		document.documentElement.setAttribute('lang', lang.value)
	}
}, { immediate: true })

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true })
	handleScroll()

	router.afterEach(() => {
		requestAnimationFrame(() => {
			handleScroll()
			navAttached.value = false
		})
	})
})
onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
	<div id="app" class="min-h-screen flex flex-col text-gray-900" :dir="currentDir">
		<Header :scrolled="scrolled" />
		<main class="flex-1" :style="pageGradientStyle">
			<router-view />
		</main>
		<Footer />
	</div>
</template>
<style>
.fade-load-enter-active, .fade-load-leave-active {
  transition: opacity 700ms cubic-bezier(.47,.09,.19,1.08);
  pointer-events: none;
}
.fade-load-enter-from, .fade-load-leave-to {
  opacity: 1;
}
.fade-load-enter-to, .fade-load-leave-from {
  opacity: 0;
}

@keyframes gradientDrift {
  0% {
    background-position: 28% 14%;
  }
  50% {
    background-position: 72% 86%;
  }
  100% {
    background-position: 28% 14%;
  }
}
</style>
