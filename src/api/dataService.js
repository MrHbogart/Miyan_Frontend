// src/api/dataService.js
import axios from 'axios';

// Axios configuration
const BASE_URL = 'https://miyan.smartcareer.ir/api';

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
    setCachedData(storageKey, data);
    return data;
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
    setCachedData(storageKey, data);
    console.log(`Background refresh completed for ${key}`);
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

// API Endpoints with specific configurations
export const api = {
  // Long-term cache (1 day) for relatively static data
  getMiyanGallery: () => fetchWithCache(CACHE_KEYS.MIYAN_GALLERY, '/miyanGallery', {
    maxAge: 24 * 3600000, // 24 hours
  }),
  
  getMiyanProjects: () => fetchWithCache(CACHE_KEYS.MIYAN_PROJECTS, '/miyanProjects', {
    maxAge: 24 * 3600000, // 24 hours
  }),
  
  getSiteMedia: () => fetchWithCache(CACHE_KEYS.SITE_MEDIA, '/siteMedia', {
    maxAge: 24 * 3600000, // 24 hours
  }),
  
  // Shorter cache for menu data (1 hour)
  getBereshtMenu: () => fetchWithCache(CACHE_KEYS.BERESHT_MENU, '/bereshtMenu'),
  
  // Very short cache for today's menu (5 minutes)
  getBereshtTodayMenu: () => fetchWithCache(CACHE_KEYS.BERESHT_TODAY_MENU, '/bereshtTodayMenu', {
    maxAge: 300000, // 5 minutes
  }),
  
  getMadiMenu: () => fetchWithCache(CACHE_KEYS.MADI_MENU, '/madiMenu'),
  
  getMadiTodayMenu: () => fetchWithCache(CACHE_KEYS.MADI_TODAY_MENU, '/madiTodayMenu', {
    maxAge: 300000, // 5 minutes
  }),
};

export default api;