import { useMiyanApi } from '~/composables/useMiyanApi'

export function useMenuPrefetcher() {
  const api = useMiyanApi()
  const inflight = new Map()
  const completed = new Set()
  const isDev = process.dev

  const PREFETCH_TARGETS = {
    beresht: [
      { key: 'base', fetcher: () => api.getBereshtMenu() },
      { key: 'today', fetcher: () => api.getBereshtTodayMenu() },
    ],
    madi: [
      { key: 'base', fetcher: () => api.getMadiMenu() },
      { key: 'today', fetcher: () => api.getMadiTodayMenu() },
    ],
  }

  function primeTarget(cacheKey, fetcher) {
    if (completed.has(cacheKey) || inflight.has(cacheKey)) return

    const run = Promise.resolve()
      .then(() => fetcher())
      .then(() => {
        completed.add(cacheKey)
      })
      .catch((error) => {
        if (isDev) {
          console.warn(`[menu-prefetch] Failed to prefetch ${cacheKey}`, error)
        }
      })
      .finally(() => {
        inflight.delete(cacheKey)
      })

    inflight.set(cacheKey, run)
  }

  function prefetchMenusForBranch(branch) {
    const targets = PREFETCH_TARGETS[branch]
    if (!targets) return

    targets.forEach(({ key, fetcher }) => {
      const cacheKey = `${branch}:${key}`
      primeTarget(cacheKey, fetcher)
    })
  }

  return {
    prefetchMenusForBranch,
  }
}
