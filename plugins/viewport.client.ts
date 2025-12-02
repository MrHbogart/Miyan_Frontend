import { onNuxtReady } from '#app'

function setViewportUnit() {
  if (typeof window === 'undefined') return
  const height = window.visualViewport?.height || window.innerHeight
  const vh = height * 0.01
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
  window.addEventListener('orientationchange', scheduleViewportUpdate)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleViewportUpdate)
    window.visualViewport.addEventListener('scroll', scheduleViewportUpdate)
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
        window.visualViewport.removeEventListener('scroll', scheduleViewportUpdate)
      }
    })
  }
})
