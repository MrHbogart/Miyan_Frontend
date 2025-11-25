import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useHeaderHeight, useNavAttached } from '~/composables/useHeaderState'

/**
 * Simplified composable for managing navbar attachment/detachment
 * - Fixed positioning when navbar reaches header
 * - Simple opacity and backdrop-filter transitions
 * - No complex overlay animations or state flags
 */
export function useNavbarAttachment(navbarRef, navbarSentinel) {
  const headerHeight = useHeaderHeight()
  const globalNavAttached = useNavAttached()
  const attached = ref(false)
  const navHeight = ref(0)
  let rafId = null

  // Simple animation timings
  const TRANSITION_DURATION = 350
  const EASING = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

  /**
   * Check if navbar sentinel has reached header
   * Sentinel position relative to header determines attachment state
   */
  function checkAttachment() {
    const sent = navbarSentinel.value
    if (!sent) return
    
    const rect = sent.getBoundingClientRect()
    const headerH = headerHeight.value || 0
    const shouldAttach = rect.top <= headerH

    if (shouldAttach !== attached.value) {
      attached.value = shouldAttach
      globalNavAttached.value = shouldAttach
    }
  }

  /**
   * Update navbar height for sentinel placeholder
   */
  function updateNavHeight() {
    if (navbarRef.value) {
      navHeight.value = navbarRef.value.offsetHeight || 0
    }
  }

  /**
   * RAF-throttled scroll tracking
   */
  function onScrollTrack() {
    if (rafId || typeof window === 'undefined') return
    rafId = window.requestAnimationFrame(() => {
      checkAttachment()
      rafId = null
    })
  }

  /**
   * Resize and load handlers
   */
  function onResize() {
    updateNavHeight()
    checkAttachment()
  }

  function onLoad() {
    updateNavHeight()
    checkAttachment()
  }

  const isNavFixed = computed(() => attached.value)

  /**
   * Opacity changes when navbar becomes fixed
   * When floating: navbar is fully opaque (1)
   * When attached: navbar becomes slightly transparent (0.85)
   */
  const navTargetOpacity = computed(() => (isNavFixed.value ? 0.85 : 1))
  const navBgOpacity = ref(navTargetOpacity.value)
  watch(navTargetOpacity, (v) => { 
    navBgOpacity.value = v 
  }, { immediate: true })

  /**
   * Navbar inline styles - simple fixed positioning
   * Transparency fades from header to navbar during attachment
   */
  const navInlineStyle = computed(() => {
    const baseStyle = {
      backgroundColor: `rgba(255, 255, 255, ${navBgOpacity.value})`,
      transition: `background ${TRANSITION_DURATION}ms ${EASING}, backdrop-filter ${TRANSITION_DURATION}ms ${EASING}, box-shadow ${TRANSITION_DURATION}ms ${EASING}`
    }

    if (isNavFixed.value) {
      // Fixed state - attached to header with backdrop and shadow
      return {
        ...baseStyle,
        position: 'fixed',
        top: 'var(--header-height)',
        left: '0',
        width: '100vw',
        zIndex: '30',
        backdropFilter: 'saturate(120%) blur(6px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }
    }

    // Natural flow state - no backdrop or shadow
    return {
      ...baseStyle,
      backdropFilter: 'none',
      boxShadow: 'none'
    }
  })

  /**
   * Sentinel style - takes up space when navbar is fixed
   * No animation - instantly adjusts to prevent layout jumps
   */
  const sentinelStyle = computed(() => {
    if (isNavFixed.value) {
      return { 
        height: `${navHeight.value || 0}px`, 
        transition: 'none',
        backgroundColor: 'transparent'
      }
    }
    return { 
      height: '0px', 
      transition: 'none',
      backgroundColor: 'transparent'
    }
  })

  onMounted(() => {
    if (typeof window === 'undefined') return
    updateNavHeight()
    checkAttachment()

    window.addEventListener('scroll', onScrollTrack, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onLoad)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', onScrollTrack)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('load', onLoad)
    if (rafId) window.cancelAnimationFrame(rafId)
  })

  return {
    attached,
    isNavFixed,
    navInlineStyle,
    sentinelStyle,
    navbarRef,
    navbarSentinel
  }
}
