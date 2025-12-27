import { useMenuPrefetcher } from '~/utils/menuPrefetcher'

export default defineNuxtPlugin(() => {
  const hasPrefetched = useState('menu-prefetch:all', () => false)
  if (hasPrefetched.value) return

  const { prefetchMenusForBranch } = useMenuPrefetcher()
  const startPrefetch = () => {
    prefetchMenusForBranch('beresht')
    prefetchMenusForBranch('madi')
    hasPrefetched.value = true
  }

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(startPrefetch, { timeout: 2000 })
  } else {
    window.setTimeout(startPrefetch, 500)
  }
})
