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

// API returns already-transformed menu object ready for StructuredMenu
const { data: menu } = useDataFetcher(api.getBereshtTodayMenu, {
  autoLoad: true,
  initialValue: null,
  enableRefresh: true
})
</script>
