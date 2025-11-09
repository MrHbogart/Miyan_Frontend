<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-8">
    <StructuredMenu :menu="menu" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StructuredMenu from '@/components/StructuredMenu.vue'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { api } from '@/api/dataService'

// Use the data fetcher composable to get menu data from API
const { data: apiData, loading, error } = useDataFetcher(api.getBereshtMenu, {
  autoLoad: true,
  initialValue: null,
  enableRefresh: true,
})

// Transform API data to match the exact structure of your .js file
const menu = ref(null)

// Watch for API data changes and transform it
const transformApiData = (apiData) => {
  if (!apiData) return null
  
  // If your API returns data in the exact same format as your .js file, return as-is
  if (apiData.title && apiData.sections) {
    return apiData
  }
  
  // If your API returns a different structure, transform it here
  // This example assumes your API returns an array of menu items
  // Adjust this based on your actual API response
  if (Array.isArray(apiData)) {
    return {
      title: { fa: 'منوی برشت', en: 'Beresht Menu' },
      subtitle: null,
      sections: [
        {
          title: { fa: 'منوی اصلی', en: 'Main Menu' },
          items: apiData.map(item => ({
            name: { 
              fa: item.name_fa || item.name, 
              en: item.name_en || item.name 
            },
            description: { 
              fa: item.description_fa || item.description || '', 
              en: item.description_en || item.description || '' 
            },
            price: { 
              fa: item.price_fa || item.price.toString(), 
              en: item.price_en || item.price.toString() 
            },
            image: item.image || '/images/medium/default-menu.jpg'
          }))
        }
      ],
      todays: {
        title: { fa: 'آیتم‌های تازه امروز', en: "Today's Fresh" },
        sections: [
          {
            title: { fa: 'پیشنهاد امروز', en: "Today's Special" },
            items: apiData
              .filter(item => item.is_todays_special)
              .map(item => ({
                name: { 
                  fa: item.name_fa || item.name, 
                  en: item.name_en || item.name 
                },
                description: { 
                  fa: item.description_fa || item.description || '', 
                  en: item.description_en || item.description || '' 
                },
                price: { 
                  fa: item.price_fa || item.price.toString(), 
                  en: item.price_en || item.price.toString() 
                },
                image: item.image || '/images/medium/default-menu.jpg'
              }))
          }
        ]
      }
    }
  }
  
  // Fallback structure if API returns unexpected format
  return {
    title: { fa: 'منوی برشت', en: 'Beresht Menu' },
    subtitle: null,
    sections: [],
    todays: {
      title: { fa: 'آیتم‌های تازه امروز', en: "Today's Fresh" },
      sections: []
    }
  }
}

// Update menu when API data changes
onMounted(() => {
  if (apiData.value) {
    menu.value = transformApiData(apiData.value)
  }
})
</script>

<style scoped>
h1 { direction: rtl; }
</style>