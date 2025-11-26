import axios from 'axios'

const DEFAULT_API_BASE_URL = 'https://miyangroup.com/api'

const CACHE_CONFIG = {
  defaultMaxAge: 3600000,
  backgroundRefreshThreshold: 300000,
  retryAttempts: 2,
  retryDelay: 1000,
}

const CACHE_KEYS = {
  MIYAN_GALLERY: 'miyanGallery',
  MIYAN_PROJECTS: 'miyanProjects',
  SITE_MEDIA: 'siteMedia',
  BERESHT_MENU: 'bereshtMenu',
  BERESHT_TODAY_MENU: 'bereshtTodayMenu',
  MADI_MENU: 'madiMenu',
  MADI_TODAY_MENU: 'madiTodayMenu',
}

const normalizeBaseUrl = (url) => url.replace(/\/+$/, '')

function unwrapResults(payload) {
  if (payload && Object.prototype.hasOwnProperty.call(payload, 'results')) {
    return payload.results
  }
  return payload
}

function createCachedClient({ apiBaseUrl, enableCache }) {
  const storage = enableCache && typeof window !== 'undefined' ? window.localStorage : null

  const axiosInstance = axios.create({
    baseURL: `${normalizeBaseUrl(apiBaseUrl || DEFAULT_API_BASE_URL)}/`,
    withCredentials: true,
    xsrfCookieName: 'miyan_csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    timeout: 10000,
  })

  function getValidCachedData(storageKey, maxAge) {
    if (!storage) return { valid: false, data: null, needsRefresh: false }
    try {
      const cached = storage.getItem(storageKey)
      if (!cached) return { valid: false, data: null, needsRefresh: false }

      const { data, timestamp } = JSON.parse(cached)
      const age = Date.now() - timestamp

      if (age < maxAge) {
        return {
          valid: true,
          data,
          needsRefresh: age > CACHE_CONFIG.backgroundRefreshThreshold,
        }
      }

      return { valid: false, data, needsRefresh: false }
    } catch (error) {
      console.warn(`Error reading cache for ${storageKey}:`, error)
      return { valid: false, data: null, needsRefresh: false }
    }
  }

  function setCachedData(storageKey, data) {
    if (!storage) return
    try {
      storage.setItem(storageKey, JSON.stringify({ data, timestamp: Date.now(), version: '1.0' }))
    } catch (error) {
      console.warn(`Error setting cache for ${storageKey}:`, error)
    }
  }

  async function fetchWithRetry(endpoint, retryAttempts) {
    let lastError
    const requestTarget = endpoint.startsWith('http') ? endpoint : endpoint.replace(/^\/+/, '')

    for (let attempt = 0; attempt <= retryAttempts; attempt += 1) {
      try {
        const response = await axiosInstance.get(requestTarget)
        return response.data
      } catch (error) {
        lastError = error
        if (attempt < retryAttempts) {
          await new Promise((resolve) => setTimeout(resolve, CACHE_CONFIG.retryDelay * (attempt + 1)))
        }
      }
    }

    throw lastError
  }

  async function refreshInBackground(key, endpoint, storageKey, retryAttempts) {
    if (!storage) return
    try {
      const data = await fetchWithRetry(endpoint, retryAttempts)
      setCachedData(storageKey, unwrapResults(data))
    } catch (error) {
      console.warn(`Background refresh failed for ${key}:`, error)
    }
  }

  async function fetchWithCache(key, endpoint, options = {}) {
    const {
      maxAge = CACHE_CONFIG.defaultMaxAge,
      backgroundRefresh = true,
      retryAttempts = CACHE_CONFIG.retryAttempts,
    } = options

    const storageKey = `cache:${key}`

    const cachedData = getValidCachedData(storageKey, maxAge)
    if (cachedData.valid) {
      if (backgroundRefresh && cachedData.needsRefresh) {
        refreshInBackground(key, endpoint, storageKey, retryAttempts)
      }
      return cachedData.data
    }

    try {
      const data = await fetchWithRetry(endpoint, retryAttempts)
      const dataToCache = unwrapResults(data)
      setCachedData(storageKey, dataToCache)
      return dataToCache
    } catch (error) {
      if (cachedData.data) {
        console.warn(`Using stale cache for ${key} due to API error:`, error.message)
        return cachedData.data
      }
      throw new Error(`Failed to fetch ${key}: ${error.message}`)
    }
  }

  return {
    getMiyanGallery: () => fetchWithCache(CACHE_KEYS.MIYAN_GALLERY, '/group/miyan_gallery/', { maxAge: 24 * 3600000 }),
    getMiyanProjects: () => fetchWithCache(CACHE_KEYS.MIYAN_PROJECTS, '/group/miyan_gallery/', { maxAge: 24 * 3600000 }),
    getSiteMedia: () => fetchWithCache(CACHE_KEYS.SITE_MEDIA, '/siteMedia', { maxAge: 24 * 3600000 }),
    getBereshtTodayMenu: async () => {
      const results = await fetchWithCache(CACHE_KEYS.BERESHT_TODAY_MENU, '/beresht/beresht_menu', { maxAge: 300000 })
      const list = Array.isArray(results) ? results : []
      return list[0]?.todays || list[0] || null
    },
    getBereshtMenu: async () => {
      const results = await fetchWithCache(CACHE_KEYS.BERESHT_MENU, '/beresht/beresht_menu', { maxAge: 3600000 })
      const list = Array.isArray(results) ? results : []
      return list[1] || list[0] || null
    },
    getMadiTodayMenu: async () => {
      const results = await fetchWithCache(CACHE_KEYS.MADI_TODAY_MENU, '/madi/madi_menu', { maxAge: 300000 })
      const list = Array.isArray(results) ? results : []
      return list[0]?.todays || list[0] || null
    },
    getMadiMenu: async () => {
      const results = await fetchWithCache(CACHE_KEYS.MADI_MENU, '/madi/madi_menu', { maxAge: 3600000 })
      const list = Array.isArray(results) ? results : []
      return list[1] || list[0] || null
    },
  }
}

let browserClient

export function useMiyanApi() {
  const runtimeConfig = useRuntimeConfig()
  const apiBaseUrl = runtimeConfig.public.apiBaseUrl || DEFAULT_API_BASE_URL

  if (process.client) {
    if (!browserClient) {
      browserClient = createCachedClient({ apiBaseUrl, enableCache: true })
    }
    return browserClient
  }

  return createCachedClient({ apiBaseUrl, enableCache: false })
}
