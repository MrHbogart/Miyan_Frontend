<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8">
    <StructuredMenu :menu="menu" />
  </div>
</template>

<script setup>
import StructuredMenu from '@/components/StructuredMenu.vue'
import menuData from '@/data/menus/madiTodayMenu.js'

const menu = menuData
</script>

<style scoped>
h1 { direction: rtl; }
</style>
