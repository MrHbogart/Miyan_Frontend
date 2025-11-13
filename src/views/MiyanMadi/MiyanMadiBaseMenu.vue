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

const { data: apiData, loading, error } = useDataFetcher(api.getMadiMenu, {
  autoLoad: true,
  initialValue: null,
  enableRefresh: true,
})

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

watch(apiData, (v) => {
  menu.value = pickMainMenuFromResults(v)
}, { immediate: true })
</script>

<style scoped>
h1 { direction: rtl; }
</style>
