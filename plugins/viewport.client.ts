import { onNuxtReady } from '#app'

let baselineVH = 0
let baselineVW = 0
let rafId: number | null = null

function computeBaseline(force = false) {
  if (typeof window === 'undefined') return
  if (baselineVH && baselineVW && !force) return
  const inner = window.innerHeight || 0
  const innerW = window.innerWidth || 0
  const visual = window.visualViewport?.height || 0
  baselineVH = Math.max(inner, visual)
  baselineVW = innerW
}

function setViewportUnit(force = false) {
  if (typeof window === 'undefined') return
  computeBaseline(force)
  if (!baselineVH) return
  const vh = baselineVH * 0.01
  document.documentElement.style.setProperty('--app-vh', `${vh}px`)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function scheduleViewportUpdate(force = false) {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(() => {
    setViewportUnit(force)
    rafId = null
  })
}

export default defineNuxtPlugin(() => {
  if (process.server) return

  // Capture baseline once on load
  setViewportUnit()

  // Only react to orientation changes; ignore chrome height shrink/expand
  window.addEventListener('orientationchange', () => {
    baselineVH = 0
    baselineVW = 0
    scheduleViewportUpdate(true)
  })

  // If viewport width changes significantly (e.g., desktop resize/split view), recompute
  window.addEventListener('resize', () => {
    const width = window.innerWidth || 0
    if (Math.abs(width - baselineVW) > 80) {
      baselineVH = 0
      baselineVW = 0
      scheduleViewportUpdate(true)
    }
  })

  onNuxtReady(() => {
    setViewportUnit()
  })

  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
      window.removeEventListener('resize', () => scheduleViewportUpdate(true))
      window.removeEventListener('orientationchange', () => scheduleViewportUpdate(true))
    })
  }
})
