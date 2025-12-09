<template>
  <footer
    class="w-full mt-0 py-8 bg-black/90 border-t border-white/10"
    dir="ltr"
    :style="footerSafeArea"
  >
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
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLang, setLang } from '~/composables/useLang'

const router = useRouter()
const route = useRoute()
const langState = useLang()
const lang = computed(() => langState.value)
const currentYear = new Date().getFullYear()
const footerSafeArea = {
  paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
  paddingLeft: 'env(safe-area-inset-left)',
  paddingRight: 'env(safe-area-inset-right)',
}

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
footer {
  background: #000 !important;
  color: #fff;
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Landscape: extend footer to use full device width */
@media (orientation: landscape) {
  footer {
    margin-left: calc(env(safe-area-inset-left, 0px) * -1);
    margin-right: calc(env(safe-area-inset-right, 0px) * -1);
    width: calc(100% + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px));
    max-width: calc(100% + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px));
  }
}
</style>
