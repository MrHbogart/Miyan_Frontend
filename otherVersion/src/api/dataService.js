// src/api/dataService.js
import axios from 'axios';

const BASE_URL = 'https://miyan.smartcareer.ir/api';
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  timeout: 10000, // 10 seconds timeout
});

// Cache configuration
const CACHE_CONFIG = {
  defaultMaxAge: 3600000, // 1 hour in milliseconds
  backgroundRefreshThreshold: 300000, // 5 minutes - refresh if cache is older than this
  retryAttempts: 2,
  retryDelay: 1000,
};

// Cache keys
const CACHE_KEYS = {
  MIYAN_GALLERY: 'miyanGallery',
  MIYAN_PROJECTS: 'miyanProjects',
  SITE_MEDIA: 'siteMedia',
  BERESHT_MENU: 'bereshtMenu',
  BERESHT_TODAY_MENU: 'bereshtTodayMenu',
  MADI_MENU: 'madiMenu',
  MADI_TODAY_MENU: 'madiTodayMenu',
};

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
  } = options;

  const storageKey = `cache:${key}`;
  
  // Try to get valid cached data first
  const cachedData = getValidCachedData(storageKey, maxAge);
  if (cachedData.valid) {
    if (backgroundRefresh && cachedData.needsRefresh) {
      refreshInBackground(key, endpoint, storageKey, retryAttempts);
    }
    return cachedData.data;
  }

  // Fetch fresh data with retry mechanism
  try {
    const data = await fetchWithRetry(endpoint, retryAttempts);
    // If backend returned a paginated response with `results`, prefer caching/returning the results array
    const dataToCache = (data && Object.prototype.hasOwnProperty.call(data, 'results')) ? data.results : data;
    setCachedData(storageKey, dataToCache);
    return dataToCache;
  } catch (error) {
    // If fetch fails, return stale cache as fallback
    if (cachedData.data) {
      console.warn(`Using stale cache for ${key} due to API error:`, error.message);
      return cachedData.data;
    }
    throw new Error(`Failed to fetch ${key}: ${error.message}`);
  }
}

/**
 * Get valid cached data from localStorage
 * @param {string} storageKey 
 * @param {number} maxAge 
 * @returns {object}
 */
function getValidCachedData(storageKey, maxAge) {
  try {
    const cached = localStorage.getItem(storageKey);
    if (!cached) return { valid: false, data: null, needsRefresh: false };

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age < maxAge) {
      return {
        valid: true,
        data,
        needsRefresh: age > CACHE_CONFIG.backgroundRefreshThreshold,
      };
    }
    
    return { valid: false, data, needsRefresh: false };
  } catch (error) {
    console.warn(`Error reading cache for ${storageKey}:`, error);
    return { valid: false, data: null, needsRefresh: false };
  }
}

/**
 * Set data in cache with timestamp
 * @param {string} storageKey 
 * @param {any} data 
 */
function setCachedData(storageKey, data) {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      version: '1.0', // Useful for cache invalidation in future updates
    };
    localStorage.setItem(storageKey, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn(`Error setting cache for ${storageKey}:`, error);
    // localStorage might be full - we can implement cleanup here if needed
  }
}

/**
 * Fetch data with retry mechanism
 * @param {string} endpoint 
 * @param {number} retryAttempts 
 * @returns {Promise<any>}
 */
async function fetchWithRetry(endpoint, retryAttempts) {
  let lastError;
  
  for (let attempt = 0; attempt <= retryAttempts; attempt++) {
    try {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      lastError = error;
      
      if (attempt < retryAttempts) {
        console.warn(`Attempt ${attempt + 1} failed for ${endpoint}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, CACHE_CONFIG.retryDelay * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
}

/**
 * Background refresh for cache
 * @param {string} key 
 * @param {string} endpoint 
 * @param {string} storageKey 
 * @param {number} retryAttempts 
 */
async function refreshInBackground(key, endpoint, storageKey, retryAttempts) {
  try {
    const data = await fetchWithRetry(endpoint, retryAttempts);
    const dataToCache = (data && Object.prototype.hasOwnProperty.call(data, 'results')) ? data.results : data;
    setCachedData(storageKey, dataToCache);
    if (isDev) {
      console.info(`Background refresh completed for ${key}`);
    }
  } catch (error) {
    console.warn(`Background refresh failed for ${key}:`, error.message);
  }
}

/**
 * Clear specific cache item
 * @param {string} key 
 */
export function clearCache(key) {
  const storageKey = `cache:${key}`;
  localStorage.removeItem(storageKey);
}

/**
 * Clear all app cache
 */
export function clearAllCache() {
  Object.values(CACHE_KEYS).forEach(key => {
    clearCache(key);
  });
}

/**
 * Get cache information (useful for debugging)
 * @param {string} key 
 * @returns {object|null}
 */
export function getCacheInfo(key) {
  const storageKey = `cache:${key}`;
  try {
    const cached = localStorage.getItem(storageKey);
    if (!cached) return null;
    
    const { timestamp, version } = JSON.parse(cached);
    return {
      key,
      age: Date.now() - timestamp,
      timestamp: new Date(timestamp).toISOString(),
      version,
    };
  } catch (error) {
    return null;
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
};

export default api;
