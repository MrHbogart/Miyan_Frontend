<template>
  <footer class="w-full mt-0 py-8 bg-black/90 border-t border-white/10" dir="ltr">
    <div class="max-w-6xl mx-auto px-6 text-sm opacity-100 flex justify-between items-center text-white">
      <div class="font-cinzel">© {{ currentYear }} Miyan Group</div>

      <div class="flex items-center gap-1">
        <!-- language toggle: will update route to include lang prefix and update global state -->
        <button
          @click.prevent="changeLang('fa')"
          :class="['px-1 py-1', lang === 'fa' ? 'text-white font-semibold' : 'text-white/70']"
        >
          FA
        </button>
        <button
          @click.prevent="changeLang('en')"
          :class="['px-1 py-1', lang === 'en' ? 'text-white font-semibold' : 'text-white/70']"
        >
          EN
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { lang, setLang } from '@/state/lang'

const router = useRouter()
const route = useRoute()
const currentYear = new Date().getFullYear()

function changeLang(l) {
  if (lang.value === l) return
  setLang(l)

  const segments = route.fullPath.split('/').filter(Boolean)
  if (segments[0] === 'en' || segments[0] === 'fa') {
    segments.shift()
  }

  const suffix = segments.length ? `/${segments.join('/')}` : '/'
  const newPath = `/${l}${suffix}`.replace(/\/+$/, '/')
  router.replace(newPath)
}
</script>

<style scoped>
footer { background: #000 }
</style>
