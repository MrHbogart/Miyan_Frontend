import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { headerHeight, navAttached } from '@/state/headerState'

/**
 * Simplified composable for managing navbar attachment/detachment
 * - Fixed positioning when navbar reaches header
 * - Simple opacity and backdrop-filter transitions
 * - No complex overlay animations or state flags
 */
export function useNavbarAttachment(navbarRef, navbarSentinel) {
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
    const shouldAttach = rect.top <= headerH + 1
    
    if (shouldAttach !== attached.value) {
      attached.value = shouldAttach
      navAttached.value = shouldAttach
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
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      checkAttachment()
      rafId = null
    })
  }

  const isNavFixed = computed(() => attached.value)

  /**
   * Opacity changes when navbar becomes fixed
   */
  const navTargetOpacity = computed(() => (isNavFixed.value ? 0.9 : 1))
  const navBgOpacity = ref(navTargetOpacity.value)
  watch(navTargetOpacity, (v) => { 
    navBgOpacity.value = v 
  }, { immediate: true })

  /**
   * Navbar inline styles - simple fixed positioning
   * No complex overlay or state flags
   */
  const navInlineStyle = computed(() => {
    const baseStyle = {
      backgroundColor: `rgba(255, 255, 255, ${navBgOpacity.value})`,
      transition: `background ${TRANSITION_DURATION}ms ${EASING}, backdrop-filter ${TRANSITION_DURATION}ms ${EASING}, box-shadow ${TRANSITION_DURATION}ms ${EASING}`
    }

    if (isNavFixed.value) {
      // Fixed state - attached to header
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

    // Natural flow state
    return {
      ...baseStyle,
      backdropFilter: 'none',
      boxShadow: 'none'
    }
  })

  /**
   * Sentinel style - takes up space when navbar is fixed
   */
  const sentinelStyle = computed(() => {
    if (isNavFixed.value) {
      return { 
        height: `${navHeight.value || 0}px`, 
        transition: `height ${TRANSITION_DURATION}ms ${EASING}`,
        backgroundColor: 'transparent'
      }
    }
    return { 
      height: '0px', 
      transition: `height 0ms`,
      backgroundColor: 'transparent'
    }
  })

  onMounted(() => {
    updateNavHeight()
    checkAttachment()
    
    window.addEventListener('scroll', onScrollTrack, { passive: true })
    window.addEventListener('resize', () => { 
      updateNavHeight()
      checkAttachment()
    })
    window.addEventListener('load', () => { 
      updateNavHeight()
      checkAttachment()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScrollTrack)
    if (rafId) cancelAnimationFrame(rafId)
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

