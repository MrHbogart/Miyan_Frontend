// src/api/dataService.js
import axios from 'axios'

const DEFAULT_API_BASE_URL = 'https://miyangroup.com/api'
const resolveEnv = () => (typeof import.meta !== 'undefined' && import.meta.env) || {}
const normalizeBaseUrl = (url) => url.replace(/\/+$/, '')
const isDev = resolveEnv().DEV
const rawEnvBaseUrl = resolveEnv().VITE_API_BASE_URL

const getRuntimeBaseUrl = () => {
  if (rawEnvBaseUrl) {
    return normalizeBaseUrl(rawEnvBaseUrl)
  }

  if (typeof window !== 'undefined') {
    const runtimeConfig = window.__MIYAN_CONFIG__ || {}
    if (runtimeConfig.apiBaseUrl) {
      return normalizeBaseUrl(runtimeConfig.apiBaseUrl)
    }
    if (window.location?.origin) {
      return normalizeBaseUrl(`${window.location.origin}/api`)
    }
  }

  return normalizeBaseUrl(DEFAULT_API_BASE_URL)
}

const API_BASE_URL = getRuntimeBaseUrl()
const storage = typeof window !== 'undefined' ? window.localStorage : null

const normalizeEndpoint = (endpoint) => {
  if (!endpoint) return ''
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }
  return endpoint.replace(/^\/+/, '')
}

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/`,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  timeout: 10000,
})

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

const unwrapResults = (payload) => {
  if (payload && Object.prototype.hasOwnProperty.call(payload, 'results')) {
    return payload.results
  }
  return payload
}

/**
 * Enhanced caching utility with error handling and retry mechanism
 * @param {string} key - Unique cache key
 * @param {string} endpoint - API endpoint
 * @param {object} options - Configuration options
 * @param {number} options.maxAge - Maximum cache age in milliseconds
 * @param {boolean} options.backgroundRefresh - Enable background refresh
 * @param {number} options.retryAttempts - Number of retry attempts
 * @returns {Promise<any>} - Resolves with the data
 */
export async function fetchWithCache(key, endpoint, options = {}) {
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
    const cacheItem = {
      data,
      timestamp: Date.now(),
      version: '1.0',
    }
    storage.setItem(storageKey, JSON.stringify(cacheItem))
  } catch (error) {
    console.warn(`Error setting cache for ${storageKey}:`, error)
  }
}

async function fetchWithRetry(endpoint, retryAttempts) {
  let lastError

  const requestTarget = normalizeEndpoint(endpoint)
  for (let attempt = 0; attempt <= retryAttempts; attempt++) {
    try {
      const response = await axiosInstance.get(requestTarget)
      return response.data
    } catch (error) {
      lastError = error

      if (attempt < retryAttempts) {
        console.warn(`Attempt ${attempt + 1} failed for ${endpoint}, retrying...`)
        await new Promise(resolve => setTimeout(resolve, CACHE_CONFIG.retryDelay * (attempt + 1)))
      }
    }
  }

  throw lastError
}

async function refreshInBackground(key, endpoint, storageKey, retryAttempts) {
  try {
    const data = await fetchWithRetry(endpoint, retryAttempts)
    const dataToCache = unwrapResults(data)
    setCachedData(storageKey, dataToCache)
    if (isDev) {
      console.info(`Background refresh completed for ${key}`)
    }
  } catch (error) {
    console.warn(`Background refresh failed for ${key}:`, error.message)
  }
}

// API Endpoints with specific configurations - UPDATED TO MATCH YOUR ACTUAL ENDPOINTS
export const api = {
  // Long-term cache (1 day) for relatively static data
  getMiyanGallery: () => {
    return fetchWithCache(CACHE_KEYS.MIYAN_GALLERY, '/group/miyan_gallery/', {
      maxAge: 24 * 3600000, // 24 hours
    })
  },
  
  getMiyanProjects: () => {
    return fetchWithCache(CACHE_KEYS.MIYAN_PROJECTS, '/group/miyan_gallery/', {
      maxAge: 24 * 3600000, // 24 hours
    })
  },
  
  getSiteMedia: () => {
    return fetchWithCache(CACHE_KEYS.SITE_MEDIA, '/siteMedia', {
      maxAge: 24 * 3600000, // 24 hours
    })
  },
  
  // Beresht Today Menu - returns ready-to-render menu object
  getBereshtTodayMenu: async () => {
    const results = await fetchWithCache(CACHE_KEYS.BERESHT_TODAY_MENU, '/beresht/beresht_menu', {
      maxAge: 300000, // 5 minutes
    })
    
    // API returns array of menu objects. Index 0 is today's menu (with .todays field)
    const list = Array.isArray(results) ? results : []
    const menu = list[0]?.todays || list[0] || null
    return menu
  },

  // Beresht Base/Main Menu - returns ready-to-render menu object
  getBereshtMenu: async () => {
    const results = await fetchWithCache(CACHE_KEYS.BERESHT_MENU, '/beresht/beresht_menu', {
      maxAge: 3600000, // 1 hour
    })
    
    // API returns array of menu objects. Index 1 is main menu, fallback to index 0
    const list = Array.isArray(results) ? results : []
    const menu = list[1] || list[0] || null
    return menu
  },

  // Madi Today Menu - returns ready-to-render menu object
  getMadiTodayMenu: async () => {
    const results = await fetchWithCache(CACHE_KEYS.MADI_TODAY_MENU, '/madi/madi_menu', {
      maxAge: 300000, // 5 minutes
    })
    
    // API returns array of menu objects. Index 0 is today's menu (with .todays field)
    const list = Array.isArray(results) ? results : []
    const menu = list[0]?.todays || list[0] || null
    return menu
  },

  // Madi Base/Main Menu - returns ready-to-render menu object
  getMadiMenu: async () => {
    const results = await fetchWithCache(CACHE_KEYS.MADI_MENU, '/madi/madi_menu', {
      maxAge: 3600000, // 1 hour
    })
    
    // API returns array of menu objects. Index 1 is main menu, fallback to index 0
    const list = Array.isArray(results) ? results : []
    const menu = list[1] || list[0] || null
    return menu
  },
}

export default api
