<template>
  <div class="min-h-screen brand-surface brand-surface--madi flex flex-col items-center py-8 w-full">
    <div v-if="stateReady" class="content-shell content-shell--flush w-full">
      <StructuredMenu :menu="menu" />
    </div>
    <div v-else class="w-full flex-1 flex items-center justify-center px-6">
      <div class="text-center space-y-4">
        <p class="text-base md:text-lg font-medium text-slate-900">
          <span v-if="pending">{{ translateState('loading') }}</span>
          <span v-else-if="error">{{ translateState('error') }}</span>
          <span v-else>{{ translateState('empty') }}</span>
        </p>
        <button
          v-if="error"
          type="button"
          class="px-4 py-2 bg-slate-900 text-white text-sm uppercase tracking-wide"
          @click="refresh"
        >
          {{ translateState('retry') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StructuredMenu from '@/components/StructuredMenu.vue'
import { useMiyanApi } from '~/composables/useMiyanApi'
import { useLang } from '~/composables/useLang'
import { menuStateCopy } from '~/state/menuStateCopy'

const api = useMiyanApi()
const { data: menu, pending, error, refresh } = await useAsyncData(
  'madi-daily-menu',
  () => api.getMadiTodayMenu(),
  {
    default: () => null,
    server: true,
    lazy: false,
  }
)

const hasSections = computed(() => {
  const sections = menu.value?.sections
  return Array.isArray(sections) && sections.length > 0
})

const stateReady = computed(() => hasSections.value && !pending.value && !error.value)

const langState = useLang()
const translateState = (key) => menuStateCopy[key]?.[langState.value] ?? menuStateCopy[key]?.en ?? ''
</script>
