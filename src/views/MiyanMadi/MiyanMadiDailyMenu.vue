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

const pickTodaysMenuFromResults = (results) => {
  if (!results) return null
  if (!Array.isArray(results)) {
    return results.todays || results
  }

  let todayEntry = results.find(r => r && r.title && (
    (r.title.en && /today/i.test(r.title.en)) ||
    (r.title.fa && /پخت روز|تازه/i.test(r.title.fa))
  ))

  if (todayEntry) return todayEntry.todays || todayEntry
  const first = results[0]
  return (first && first.todays) ? first.todays : first
}

watch(apiData, (v) => {
  menu.value = pickTodaysMenuFromResults(v)
}, { immediate: true })
</script>

<style scoped>
h1 { direction: rtl; }
</style>
