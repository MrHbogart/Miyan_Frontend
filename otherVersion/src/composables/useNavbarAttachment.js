import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { headerHeight } from '@/state/headerState'
import { scrollY } from '@/state/scrollState'

/**
 * Handles sticky navbar attachment + hide/reveal animations driven by scrollY
 */
export function useNavbarAttachment(navbarRef, navbarSentinel) {
	const attached = ref(false)
	const navHeight = ref(0)
	const lastScrollY = ref(0)
	const scrollDirection = ref('up')
	let resizeObserver = null

	function updateScrollDirection(value) {
		const delta = value - lastScrollY.value
		if (Math.abs(delta) > 2) {
			scrollDirection.value = delta > 0 ? 'down' : 'up'
		}
		lastScrollY.value = value
	}

	function updateNavHeight() {
		navHeight.value = navbarRef.value?.offsetHeight || 0
	}

	function evaluateAttachment() {
		const sentinel = navbarSentinel.value
		if (!sentinel) {
			attached.value = false
			return
		}
		const rect = sentinel.getBoundingClientRect()
		const headerOffset = headerHeight.value || 0
		attached.value = rect.top <= headerOffset + 1
	}

	function handleResize() {
		updateNavHeight()
		evaluateAttachment()
	}

	const NAV_HIDE_THRESHOLD = 160
	const navShouldHide = computed(() => attached.value && scrollY.value > NAV_HIDE_THRESHOLD && scrollDirection.value === 'down')

	const navInlineStyle = computed(() => {
		const translateY = navShouldHide.value ? '-115%' : '0%'
		const baseStyle = {
			transform: `translate3d(0, ${translateY}, 0)`,
			transition:
				'transform 260ms var(--easing-smooth), background-color 260ms var(--easing-smooth), box-shadow 260ms var(--easing-smooth), backdrop-filter 260ms var(--easing-smooth)'
		}

		if (attached.value) {
			return {
				...baseStyle,
				position: 'fixed',
				top: 'var(--header-height, 0px)',
				left: '0',
				width: '100%',
				zIndex: '40',
				backgroundColor: 'rgba(255, 255, 255, 0.97)',
				backdropFilter: 'saturate(125%) blur(0.75rem)',
				boxShadow: '0 0.75rem 1.8rem rgba(0, 0, 0, 0.12)'
			}
		}

		return {
			...baseStyle,
			position: 'relative',
			backgroundColor: 'transparent',
			boxShadow: 'none'
		}
	})

	const sentinelStyle = computed(() => {
		if (attached.value) {
			return {
				height: `${navHeight.value || 0}px`,
				transition: 'height 200ms var(--easing-smooth)'
			}
		}
		return {
			height: '0px',
			transition: 'height 200ms var(--easing-smooth)'
		}
	})

	watch(scrollY, (value) => {
		updateScrollDirection(value)
		evaluateAttachment()
	}, { immediate: true })

	watch(() => headerHeight.value, () => {
		updateNavHeight()
		evaluateAttachment()
	}, { immediate: true })

	onMounted(() => {
		updateNavHeight()
		evaluateAttachment()

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize)
		}

		try {
			resizeObserver = new ResizeObserver(() => updateNavHeight())
			if (navbarRef.value) resizeObserver.observe(navbarRef.value)
		} catch (err) {
			resizeObserver = null
		}
	})

	onUnmounted(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize)
		}
		if (resizeObserver) resizeObserver.disconnect()
	})

	return {
		attached,
		navInlineStyle,
		sentinelStyle,
		navbarRef,
		navbarSentinel
	}
}
