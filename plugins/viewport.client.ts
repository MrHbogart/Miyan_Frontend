import { onNuxtReady } from '#app'

let baselineVH = 0

function setViewportUnit() {
  if (typeof window === 'undefined') return
  const inner = window.innerHeight || 0
  const visual = window.visualViewport?.height || 0
  baselineVH = baselineVH || Math.max(inner, visual)
  const stable = Math.max(inner, visual, baselineVH)
  const vh = stable * 0.01
  document.documentElement.style.setProperty('--app-vh', `${vh}px`)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

let rafId: number | null = null

function scheduleViewportUpdate() {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(() => {
    setViewportUnit()
    rafId = null
  })
}

export default defineNuxtPlugin(() => {
  if (process.server) return

  setViewportUnit()
  window.addEventListener('resize', scheduleViewportUpdate)
  window.addEventListener('orientationchange', () => {
    baselineVH = 0
    scheduleViewportUpdate()
  })
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleViewportUpdate)
  }

  onNuxtReady(() => {
    setViewportUnit()
  })

  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
      window.removeEventListener('resize', scheduleViewportUpdate)
      window.removeEventListener('orientationchange', scheduleViewportUpdate)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', scheduleViewportUpdate)
      }
    })
  }
})
