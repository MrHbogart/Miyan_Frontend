<script setup>
import { onMounted, onUnmounted, computed, watch } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useRouter } from 'vue-router'
import { lang } from '@/state/lang'
import { scrollY } from '@/state/scrollState'

const router = useRouter()
const currentDir = computed(() => (lang.value === 'fa' ? 'rtl' : 'ltr'))

function readScrollPosition() {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		scrollY.value = 0
		return
	}
	const doc = document.documentElement
	const body = document.body
	const scroller = document.scrollingElement
	const y = window.scrollY
		?? window.pageYOffset
		?? scroller?.scrollTop
		?? doc?.scrollTop
		?? body?.scrollTop
		?? 0
	const next = Number.isFinite(y) ? y : 0
	scrollY.value = next
	if (import.meta.env.DEV) {
		console.debug('[scrollY]', next)
	}
}

let scrollRaf = null
const scrollTargets = []

function addScrollTarget(target) {
	if (!target || scrollTargets.includes(target)) return
	target.addEventListener('scroll', handleScroll, { passive: true })
	scrollTargets.push(target)
}

function removeScrollTargets() {
	scrollTargets.forEach((target) => {
		target.removeEventListener('scroll', handleScroll)
	})
	scrollTargets.length = 0
}

function handleScroll() {
	if (typeof window === 'undefined') return
	if (scrollRaf !== null) return
	scrollRaf = window.requestAnimationFrame(() => {
		scrollRaf = null
		readScrollPosition()
	})
}

watch(currentDir, (dir) => {
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('dir', dir)
		document.documentElement.setAttribute('lang', lang.value)
	}
}, { immediate: true })

onMounted(() => {
	if (typeof window !== 'undefined') {
		addScrollTarget(window)
	}
	if (typeof document !== 'undefined') {
		addScrollTarget(document)
		addScrollTarget(document.body)
		addScrollTarget(document.scrollingElement)
		const appRoot = document.getElementById('app')
		addScrollTarget(appRoot)
	}
	readScrollPosition()

	router.afterEach(() => {
		requestAnimationFrame(() => {
			readScrollPosition()
		})
	})
})

onUnmounted(() => {
	removeScrollTargets()
	if (scrollRaf !== null) {
		cancelAnimationFrame(scrollRaf)
		scrollRaf = null
	}
})
</script>
<template>
	<div
		id="app"
		class="min-h-screen bg-white text-gray-900"
		:dir="currentDir"
	>
			<Header />
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
