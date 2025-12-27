import { useMenuPrefetch } from '~/composables/useMenuData'

export default defineNuxtPlugin(() => {
  const hasPrefetched = useState('menu-prefetch:all', () => false)
  if (hasPrefetched.value) return

  const prefetchBranch = (branch) => useMenuPrefetch(branch)
  const startPrefetch = () => {
    prefetchBranch('beresht')
    prefetchBranch('madi')
    hasPrefetched.value = true
  }

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(startPrefetch, { timeout: 2000 })
  } else {
    window.setTimeout(startPrefetch, 500)
  }
})
