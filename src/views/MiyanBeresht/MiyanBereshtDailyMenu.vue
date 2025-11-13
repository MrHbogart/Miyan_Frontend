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

const { data: apiData, loading, error } = useDataFetcher(api.getBereshtMenu, {
  autoLoad: true,
  initialValue: null,
  enableRefresh: true
})

const menu = ref(null)

const pickTodaysMenuFromResults = (results) => {
  if (!results) return null
  if (!Array.isArray(results)) {
    // Single menu object: prefer its `todays` field with full structure
    return results.todays || results
  }

  // results is an array: find the entry with "today" in title
  const todayEntry = results.find(r => r && r.title && (
    (r.title.en && /today/i.test(r.title.en)) ||
    (r.title.fa && /پخت روز|تازه/i.test(r.title.fa))
  ))

  if (todayEntry) {
    // Return todays if available, otherwise the entry itself (it has sections)
    return todayEntry.todays || todayEntry
  }

  // Fallback: use first entry's todays, or the first entry
  const first = results[0]
  if (first) {
    return first.todays || first
  }
  return null
}

watch(apiData, (v) => {
  menu.value = pickTodaysMenuFromResults(v)
}, { immediate: true })
</script>

<style scoped>
h1 { direction: rtl; }
</style>
