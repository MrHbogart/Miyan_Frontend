<template>
  <div class="min-h-screen brand-surface brand-surface--madi flex flex-col items-center py-8 w-full">
    <div class="content-shell content-shell--flush w-full">
      <StructuredMenu :menu="menu" />
    </div>
  </div>
</template>

<script setup>
import StructuredMenu from '@/components/StructuredMenu.vue'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'

// API returns already-transformed menu object ready for StructuredMenu
const { data: menu } = useDataFetcher(api.getMadiTodayMenu, {
  autoLoad: true,
  initialValue: null,
  enableRefresh: true
})
</script>
