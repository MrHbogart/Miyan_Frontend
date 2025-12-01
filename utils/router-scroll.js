const ROOT_SEGMENT_INDEX = 0

function normalizePath(path) {
  if (!path) return ''
  if (typeof path !== 'string') return ''
  return path.replace(/\/+/g, '/')
}

function getTopLevelSegment(route) {
  const normalized = normalizePath(route?.path || '')
  if (!normalized) return ''
  const segments = normalized.split('/').filter(Boolean)
  return segments[ROOT_SEGMENT_INDEX] || ''
}

export function isParentRouteChange(from, to) {
  return getTopLevelSegment(from) !== getTopLevelSegment(to)
}

export function resetParentScroll() {
  if (typeof window === 'undefined') return
  if (window.__DISABLE_SCROLL_RESET__) return
  const scroller = document.scrollingElement || document.documentElement || document.body
  if (!scroller) return

  const previousBehavior = scroller.style.scrollBehavior
  if (previousBehavior !== 'auto') {
    scroller.style.scrollBehavior = 'auto'
  }

  window.scrollTo(0, 0)

  if (previousBehavior && previousBehavior !== 'auto') {
    requestAnimationFrame(() => {
      scroller.style.scrollBehavior = previousBehavior
    })
  }
}
