import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { headerHeight, headerInitialHeight, navAttached } from '@/state/headerState'

/**
 * Composable for managing navbar attachment/detachment animations
 * Provides elegant luxury animations with smooth transitions
 */
export function useNavbarAttachment(navbarRef, navbarSentinel, overlayRef, routes) {
  const attached = ref(false)
  const navHeight = ref(0)
  const detachTop = ref(null)
  const overlayVisible = ref(false)
  const scrollY = ref(window.scrollY || 0)
  const navbarTopY = ref(-1)
  const isReturningToFlow = ref(false)
  const isAttaching = ref(false)
  const isDetaching = ref(false)
  
  let rafId = null

  // Luxury animation timings
  const HEADER_BG_DURATION = 600
  const NAV_TOP_DURATION = 320
  const NAV_RETURN_DURATION = 400
  const EASING_LUXURY = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  const EASING_SMOOTH = 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  const EASING_BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

  function updateNavTop() {
    const el = navbarSentinel.value || navbarRef.value
    if (el) {
      const r = el.getBoundingClientRect()
      navbarTopY.value = Math.ceil(r.top + window.scrollY)
    } else {
      navbarTopY.value = -1
    }
  }

  function checkAttachment() {
    const sent = navbarSentinel.value
    if (!sent) return
    const rect = sent.getBoundingClientRect()
    const headerH = headerHeight.value || 0
    const shouldAttach = rect.top <= headerH + 1
    if (shouldAttach !== attached.value) {
      attached.value = shouldAttach
    }
  }

  function updateDetachTop() {
    if (navbarRef.value) {
      const r = navbarRef.value.getBoundingClientRect()
      detachTop.value = Math.round(r.top)
    }
  }

  function updateNavHeight() {
    if (navbarRef.value) {
      navHeight.value = navbarRef.value.offsetHeight || 0
    }
  }

  function onScrollTrack() {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      scrollY.value = window.scrollY || window.pageYOffset
      updateNavTop()
      rafId = null
    })
  }

  const isNavFixed = computed(() => attached.value)

  const navTargetOpacity = computed(() => (isNavFixed.value ? 0.92 : 1))
  const navBgOpacity = ref(navTargetOpacity.value)
  watch(navTargetOpacity, (v) => { 
    navBgOpacity.value = v 
  }, { immediate: true })

  watch(attached, (newVal) => { 
    navAttached.value = !!newVal 
  }, { immediate: true })

  // Elegant attach sequence with smooth animations
  async function runAttachSequence() {
    if (!navbarRef.value || !overlayRef.value) return
    isAttaching.value = true
    
    overlayRef.value.innerHTML = navbarRef.value.innerHTML
    overlayRef.value.style.top = `${headerHeight.value || 0}px`
    overlayRef.value.style.transition = 'none'
    overlayRef.value.style.transform = 'translateY(0)'
    overlayRef.value.style.opacity = '1'
    overlayVisible.value = true
    
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    
    overlayRef.value.style.transition = `transform ${NAV_RETURN_DURATION}ms ${EASING_LUXURY}, opacity ${NAV_RETURN_DURATION}ms ${EASING_SMOOTH}, background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`
    overlayRef.value.style.transform = 'translateY(-2px)'
    overlayRef.value.style.opacity = '0.98'
    isReturningToFlow.value = true
    
    await new Promise(r => setTimeout(r, NAV_RETURN_DURATION))
    
    if (navbarRef.value) navbarRef.value.style.visibility = 'hidden'
    navAttached.value = true
    isReturningToFlow.value = false
    isAttaching.value = false
  }

  // Smooth detach sequence
  async function runDetachSequence() {
    if (!navbarRef.value || !overlayRef.value) return
    isDetaching.value = true
    
    const r = navbarRef.value.getBoundingClientRect()
    overlayRef.value.innerHTML = navbarRef.value.innerHTML
    overlayRef.value.style.top = `${Math.round(r.top)}px`
    overlayRef.value.style.transition = 'none'
    overlayRef.value.style.transform = 'translateY(-2px)'
    overlayRef.value.style.opacity = '0.98'
    overlayVisible.value = true
    navAttached.value = false
    
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    
    overlayRef.value.style.transition = `transform ${NAV_RETURN_DURATION}ms ${EASING_LUXURY}, opacity ${NAV_RETURN_DURATION}ms ${EASING_SMOOTH}, background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`
    overlayRef.value.style.transform = 'translateY(0)'
    overlayRef.value.style.opacity = '1'
    
    await new Promise(r => setTimeout(r, NAV_RETURN_DURATION))
    
    if (navbarRef.value) navbarRef.value.style.visibility = ''
    overlayVisible.value = false
    detachTop.value = null
    isDetaching.value = false
  }

  watch(attached, (newVal, oldVal) => {
    if (oldVal === false && newVal === true) runAttachSequence()
    if (oldVal === true && newVal === false) runDetachSequence()
  }, { immediate: false })

  const navInlineStyle = computed(() => {
    const baseStyle = {
      backgroundColor: `rgba(255, 255, 255, ${navBgOpacity.value})`,
      backdropFilter: isNavFixed.value ? 'saturate(180%) blur(12px)' : 'none',
      transition: `background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, box-shadow ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`,
      boxShadow: isNavFixed.value 
        ? '0 2px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.12)' 
        : 'none'
    }
    
    if (!isNavFixed.value) {
      if (isDetaching.value) {
        const topPx = (detachTop.value != null) ? `${detachTop.value}px` : 'var(--header-height)'
        return {
          ...baseStyle,
          position: 'fixed',
          top: topPx,
          left: '0',
          width: '100vw',
          zIndex: '60',
          transform: 'translateY(0)',
          transition: `background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, transform ${NAV_RETURN_DURATION}ms ${EASING_LUXURY}`
        }
      }

      if (isReturningToFlow.value || isAttaching.value) {
        return {
          ...baseStyle,
          position: 'fixed',
          top: 'var(--header-height)',
          left: '0',
          width: '100vw',
          zIndex: '60',
          transform: 'translateY(-2px)',
          transition: `transform ${NAV_RETURN_DURATION}ms ${EASING_LUXURY}, background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`
        }
      }

      return {
        ...baseStyle,
        transform: 'translateY(0)',
        transition: `transform ${NAV_RETURN_DURATION}ms ${EASING_LUXURY}, background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`
      }
    }

    // Fixed state (attached to header)
    return {
      ...baseStyle,
      position: 'fixed',
      top: 'var(--header-height)',
      left: '0',
      width: '100vw',
      zIndex: '30',
      transform: 'translateY(0)',
      transition: `top ${NAV_TOP_DURATION}ms ${EASING_LUXURY}, background ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, backdrop-filter ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}, box-shadow ${HEADER_BG_DURATION}ms ${EASING_SMOOTH}`
    }
  })

  const sentinelStyle = computed(() => {
    const delta = (headerInitialHeight.value && headerHeight.value) 
      ? Math.max(0, headerInitialHeight.value - headerHeight.value) 
      : 0
    const h = Math.max(0, (navHeight.value || 0) - delta)
    
    if (isNavFixed.value || isReturningToFlow.value || isAttaching.value || isDetaching.value) {
      const t = (isReturningToFlow.value || isAttaching.value) 
        ? `height ${NAV_RETURN_DURATION}ms ${EASING_LUXURY}` 
        : 'height 0ms'
      return { 
        height: `${navHeight.value || h}px`, 
        transition: t, 
        backgroundColor: 'var(--surface, #fff)' 
      }
    }
    return { 
      height: '0px', 
      transition: `height 0ms`, 
      backgroundColor: 'var(--surface, #fff)' 
    }
  })

  onMounted(() => {
    updateNavTop()
    updateNavHeight()
    onScrollTrack()
    checkAttachment()
    
    window.addEventListener('scroll', onScrollTrack, { passive: true })
    window.addEventListener('scroll', checkAttachment, { passive: true })
    window.addEventListener('resize', () => { 
      updateNavTop()
      updateNavHeight()
      onScrollTrack()
      checkAttachment()
    })
    window.addEventListener('load', () => { 
      updateNavTop()
      updateNavHeight()
      onScrollTrack()
      checkAttachment()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScrollTrack)
    window.removeEventListener('scroll', checkAttachment)
    window.removeEventListener('resize', () => { 
      updateNavTop()
      updateNavHeight()
      onScrollTrack()
    })
    window.removeEventListener('load', () => { 
      updateNavTop()
      updateNavHeight()
      onScrollTrack()
    })
    if (rafId) cancelAnimationFrame(rafId)
  })

  return {
    attached,
    isNavFixed,
    navInlineStyle,
    sentinelStyle,
    overlayVisible,
    overlayRef,
    navbarRef,
    navbarSentinel
  }
}

