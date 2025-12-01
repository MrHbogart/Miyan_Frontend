import { isParentRouteChange, resetParentScroll } from '~/utils/router-scroll'
import { abortAllPendingRequests } from '~/utils/abortableRequest'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return

  const router = nuxtApp.$router
  const skipTransition = useState('skipPageTransition', () => false)
  const featureEnabled = () =>
    typeof window === 'undefined' || window.__FIX_SCROLL_BEHAVIOR__ !== false

  router.beforeEach((to, from, next) => {
    abortAllPendingRequests('route-change')

    if (featureEnabled() && isParentRouteChange(from, to)) {
      skipTransition.value = true
      resetParentScroll()
    }

    next()
  })

  router.afterEach(() => {
    if (!skipTransition.value) return
    requestAnimationFrame(() => {
      skipTransition.value = false
    })
  })
})
