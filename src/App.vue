<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useRouter } from 'vue-router'

const scrolled = ref(false)
const overlayAlpha = ref(0.45)
const router = useRouter()

// Luxury scroll handling with smooth transitions
function handleScroll() {
	const y = window.scrollY || window.pageYOffset
	scrolled.value = y > 40
	const t = Math.min(1, y / 300)
	overlayAlpha.value = Math.max(0.05, 0.45 - t * 0.45)
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true })
	handleScroll()
})
onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
	<div id="app" class="min-h-screen bg-white text-gray-900 overflow-visible">
		<Header :scrolled="scrolled" />
		<main class="pt-0 overflow-visible">
			<router-view v-slot="{ Component, route }">
				<Transition name="page" mode="out-in">
					<component :is="Component" :key="route.path" />
				</Transition>
			</router-view>
		</main>
		<Footer />
	</div>
</template>
<style>
/* Enhanced page transitions with luxury animations */
.page-enter-active {
  transition: opacity 600ms cubic-bezier(0.4, 0.0, 0.2, 1),
              transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.page-leave-active {
  transition: opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
              transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

/* Legacy fade-load transitions (enhanced) */
.fade-load-enter-active, .fade-load-leave-active {
  transition: opacity 700ms cubic-bezier(0.4, 0.0, 0.2, 1);
  pointer-events: none;
}
.fade-load-enter-from, .fade-load-leave-to {
  opacity: 1;
}
.fade-load-enter-to, .fade-load-leave-from {
  opacity: 0;
}
</style>