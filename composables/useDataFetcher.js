// shared composable for fetching API resources with cache + retry logic
import { ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * Enhanced data fetcher composable with cache awareness and advanced features
 * @param {Function} fetchFn - Async function that returns data
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoLoad - Whether to load data automatically on mount
 * @param {any} options.initialValue - Initial value for data ref
 * @param {boolean} options.enableRefresh - Enable manual refresh capability
 * @param {number} options.refreshInterval - Auto-refresh interval in milliseconds
 * @param {Array} options.watchDependencies - Reactive dependencies to watch for reloading
 * @returns {Object} - Reactive data state and control methods
 */
export function useDataFetcher(fetchFn, options = {}) {
  const {
    autoLoad = true,
    initialValue = null,
    enableRefresh = true,
    refreshInterval = null,
    watchDependencies = []
  } = options

  // Reactive state
  const data = ref(initialValue)
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)
  const refreshCount = ref(0)

  let refreshIntervalId = null

  /**
   * Main data loading function
   */
  const load = async () => {
    // Don't start new load if already loading
    if (loading.value) return
    
    loading.value = true
    error.value = null

    try {
      const result = await fetchFn()
      data.value = result
      lastUpdated.value = new Date()
      refreshCount.value += 1
      return result
    } catch (err) {
      console.error('Data fetch error:', err)
      error.value = {
        message: err.message,
        timestamp: new Date(),
        code: err.code || 'UNKNOWN_ERROR'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Force refresh data (bypasses cache if implemented in fetchFn)
   */
  const refresh = async () => {
    if (!enableRefresh) {
      console.warn('Refresh is disabled for this data fetcher')
      return
    }
    return await load()
  }

  /**
   * Clear current data and error state
   */
  const clear = () => {
    data.value = initialValue
    error.value = null
    lastUpdated.value = null
  }

  /**
   * Reset everything including refresh count
   */
  const reset = () => {
    clear()
    refreshCount.value = 0
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId)
      refreshIntervalId = null
    }
  }

  // Set up auto-refresh if interval is provided
  if (refreshInterval && refreshInterval > 0) {
    onMounted(() => {
      refreshIntervalId = setInterval(() => {
        if (!loading.value) {
          load()
        }
      }, refreshInterval)
    })
  }

  // Set up dependency watching for automatic reloads
  if (watchDependencies.length > 0) {
    watch(watchDependencies, () => {
      if (autoLoad) {
        load()
      }
    }, { deep: true })
  }

  // Auto-load on mount if enabled
  if (autoLoad) {
    onMounted(load)
  }

  // Cleanup interval on unmount
  onUnmounted(() => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId)
      refreshIntervalId = null
    }
  })

  return {
    // State
    data,
    loading,
    error,
    lastUpdated,
    refreshCount,
    
    // Methods
    load,
    refresh: enableRefresh ? refresh : null,
    clear,
    reset,
    
    // Computed-like properties (for convenience)
    hasData: () => data.value !== null && data.value !== undefined,
    hasError: () => error.value !== null,
    isLoading: () => loading.value === true,
    
    // Timestamp helpers
    getLastUpdated: () => lastUpdated.value,
    getTimeSinceUpdate: () => lastUpdated.value ? Date.now() - lastUpdated.value.getTime() : null
  }
}

/**
 * Pre-configured data fetcher for common API endpoints
 */
export function useApiData(apiEndpoint, options = {}) {
  const { cacheKey, ...fetcherOptions } = options
  
  const fetchFunction = async () => {
    if (typeof apiEndpoint === 'function') {
      return await apiEndpoint()
    }
    throw new Error('Invalid API endpoint provided')
  }

  return useDataFetcher(fetchFunction, fetcherOptions)
}
