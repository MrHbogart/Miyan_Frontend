import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { lang } from '@/state/lang'

const SUPPORTED_LANGS = new Set(['fa', 'en'])

export function useLocalizedChildRoutes(navItems = []) {
  const route = useRoute()
  const router = useRouter()

  const orderedNames = navItems.map(item => item.name)
  const childTransition = ref('swipe-left')
  let previousName = route.name ?? orderedNames[0] ?? null

  const resolveLang = () => {
    const routeLang = route.params.lang
    if (typeof routeLang === 'string' && SUPPORTED_LANGS.has(routeLang)) {
      return routeLang
    }

    const segments = route.path.split('/').filter(Boolean)
    const first = segments[0]
    if (SUPPORTED_LANGS.has(first)) return first

    return lang.value
  }

  const getLocalizedPath = (rawPath = '') => {
    const normalized = rawPath.replace(/^\/+/, '').replace(/\/+$/, '')
    const currentLang = resolveLang()
    if (!normalized) return `/${currentLang}/`
    return `/${currentLang}/${normalized}`
  }

  const shiftChild = (step) => {
    if (!orderedNames.length) return
    const currentName = route.name
    const currentIndex = orderedNames.indexOf(currentName)
    if (currentIndex === -1) return

    const nextIndex = currentIndex + step
    if (nextIndex < 0 || nextIndex >= orderedNames.length) return

    router.push({ name: orderedNames[nextIndex], params: { lang: resolveLang() } })
  }

  watch(() => route.name, (nextName) => {
    if (!nextName) {
      previousName = null
      return
    }

    const fromIndex = orderedNames.indexOf(previousName)
    const toIndex = orderedNames.indexOf(nextName)
    if (fromIndex !== -1 && toIndex !== -1) {
      childTransition.value = toIndex > fromIndex ? 'swipe-left' : 'swipe-right'
    }
    previousName = nextName
  }, { immediate: true })

  return {
    childTransition,
    getLocalizedPath,
    resolveLang,
    shiftChild,
  }
}
