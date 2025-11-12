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
	<div id="app" class="min-h-screen bg-white text-gray-900">
		<Header :scrolled="scrolled" />
		<main class="pt-0">
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
</style>