// src/api/dataService.js
import axios from 'axios'

const BASE_URL = 'http://backend/api'

/**
 * Utility to fetch and cache data.
 * @param {string} key - unique name for storage (e.g. "miyanGallery")
 * @param {string} endpoint - backend API endpoint (e.g. "/miyanGallery")
 * @param {number} maxAge - max age of cached data in milliseconds (default: 1 hour)
 */
export async function fetchWithCache(key, endpoint, maxAge = 3600000) {
  const storageKey = `cache:${key}`
  const cache = localStorage.getItem(storageKey)

  if (cache) {
    try {
      const { data, timestamp } = JSON.parse(cache)
      const age = Date.now() - timestamp
      if (age < maxAge) {
        // Cached data is fresh enough
        refreshInBackground(key, endpoint, storageKey)
        return data
      }
    } catch (e) {
      console.warn(`Invalid cache for ${key}`, e)
    }
  }

  // Otherwise fetch from API
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`)
    const data = response.data
    localStorage.setItem(storageKey, JSON.stringify({ data, timestamp: Date.now() }))
    return data
  } catch (error) {
    console.error(`Failed to fetch ${key} from API`, error)
    // Return cached data if exists, even if stale
    if (cache) {
      return JSON.parse(cache).data
    }
    throw error
  }
}

// Background refresh to keep cache updated
async function refreshInBackground(key, endpoint, storageKey) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`)
    const data = response.data
    localStorage.setItem(storageKey, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // Silent fail on background update
  }
}

// API Endpoints
export const api = {
  getMiyanGallery: () => fetchWithCache('miyanGallery', '/miyanGallery'),
  getMiyanProjects: () => fetchWithCache('miyanProjects', '/miyanProjects'),
  getSiteMedia: () => fetchWithCache('siteMedia', '/siteMedia'),
  getBereshtMenu: () => fetchWithCache('bereshtMenu', '/bereshtMenu'),
  getBereshtTodayMenu: () => fetchWithCache('bereshtTodayMenu', '/bereshtTodayMenu'),
  getMadiMenu: () => fetchWithCache('madiMenu', '/madiMenu'),
  getMadiTodayMenu: () => fetchWithCache('madiTodayMenu', '/madiTodayMenu')
}
