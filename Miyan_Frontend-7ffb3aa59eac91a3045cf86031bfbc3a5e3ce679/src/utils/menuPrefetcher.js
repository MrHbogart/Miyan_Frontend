// src/utils/menuPrefetcher.js
import { api } from '@/api/dataService'

const PREFETCH_TARGETS = {
  beresht: [
    { key: 'base', fetcher: api.getBereshtMenu },
    { key: 'today', fetcher: api.getBereshtTodayMenu },
  ],
  madi: [
    { key: 'base', fetcher: api.getMadiMenu },
    { key: 'today', fetcher: api.getMadiTodayMenu },
  ],
}

const inflight = new Map()
const completed = new Set()
const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV

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

export function prefetchMenusForBranch(branch) {
  const targets = PREFETCH_TARGETS[branch]
  if (!targets) return

  targets.forEach(({ key, fetcher }) => {
    const cacheKey = `${branch}:${key}`
    primeTarget(cacheKey, fetcher)
  })
}

export function prefetchAllMenus() {
  Object.keys(PREFETCH_TARGETS).forEach((branch) => prefetchMenusForBranch(branch))
}
