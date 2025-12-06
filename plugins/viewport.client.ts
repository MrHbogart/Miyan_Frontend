import { onNuxtReady } from '#app'

let rafId: number | null = null

function measureViewport() {
  if (typeof window === 'undefined') return { h: 0, w: 0 }
  const vv = window.visualViewport
  const h = (vv?.height || window.innerHeight || document.documentElement.clientHeight || 0)
  const w = (vv?.width || window.innerWidth || document.documentElement.clientWidth || 0)
  return { h, w }
}

function setViewportUnit() {
  if (typeof window === 'undefined') return
  const { h } = measureViewport()
  if (!h) return
  const vh = h * 0.01
  document.documentElement.style.setProperty('--app-vh', `${vh}px`)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function scheduleViewportUpdate() {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(() => {
    setViewportUnit()
    rafId = null
  })
}

export default defineNuxtPlugin(() => {
  if (process.server) return

  const onResize = () => scheduleViewportUpdate()
  const onVVResize = () => scheduleViewportUpdate()

  // Capture baseline once on load
  setViewportUnit()

  window.addEventListener('orientationchange', onResize, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onVVResize, { passive: true })
    window.visualViewport.addEventListener('scroll', onVVResize, { passive: true })
  }

  onNuxtReady(() => {
    setViewportUnit()
  })

  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
      window.removeEventListener('orientationchange', onResize)
      window.removeEventListener('resize', onResize)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onVVResize)
        window.visualViewport.removeEventListener('scroll', onVVResize)
      }
    })
  }
})
