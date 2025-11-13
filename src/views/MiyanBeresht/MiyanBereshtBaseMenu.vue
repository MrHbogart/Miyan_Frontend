<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8">
    <StructuredMenu :menu="menu" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import StructuredMenu from '@/components/StructuredMenu.vue'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'

// Use the data fetcher composable to get menu data from API
const { data: apiData, loading, error } = useDataFetcher(api.getBereshtMenu, {
  autoLoad: true,
  initialValue: null,
  enableRefresh: true,
})

// menu to pass to StructuredMenu
const menu = ref(null)

const pickMainMenuFromResults = (results) => {
  if (!results) return null
  if (!Array.isArray(results)) {
    // Single menu object: pass as-is (it has sections)
    return results
  }

  // results is an array: find the entry with "main" or "اصلی" in title
  const mainEntry = results.find(r => r && r.title && (
    (r.title.en && /main/i.test(r.title.en)) ||
    (r.title.fa && /منوی اصلی/.test(r.title.fa))
  ))

  if (mainEntry) {
    return mainEntry
  }

  // Fallback: use second entry (usually main) or first
  return results[1] || results[0] || null
}

const transformApiData = (apiDataVal) => {
  if (!apiDataVal) return null
  const main = pickMainMenuFromResults(apiDataVal)
  return main || null
}

// Update menu whenever apiData changes
watch(apiData, (v) => {
  menu.value = transformApiData(v)
}, { immediate: true })
</script>

<style scoped>
h1 { direction: rtl; }
</style>