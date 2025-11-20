import { ref, watch, computed, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { lang } from '@/state/lang'

const SUPPORTED_LANGS = new Set(['fa', 'en'])

function resolveItems(source) {
  const resolved = unref(source)
  if (Array.isArray(resolved)) return resolved
  return []
}

export function useLocalizedChildRoutes(navItems = []) {
  const route = useRoute()
  const router = useRouter()

  const items = computed(() => resolveItems(navItems))
  const orderedNames = computed(() => items.value.map(item => item.name))
  const childTransition = ref('swipe-left')
  let previousName = route.name ?? orderedNames.value[0] ?? null

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
    const names = orderedNames.value
    if (!names.length) return
    const currentName = route.name
    const currentIndex = names.indexOf(currentName)
    if (currentIndex === -1) return

    const nextIndex = currentIndex + step
    if (nextIndex < 0 || nextIndex >= names.length) return

    router.push({ name: names[nextIndex], params: { lang: resolveLang() } })
  }

  watch(() => route.name, (nextName) => {
    if (!nextName) {
      previousName = null
      return
    }

    const names = orderedNames.value
    const fromIndex = names.indexOf(previousName)
    const toIndex = names.indexOf(nextName)
    if (fromIndex !== -1 && toIndex !== -1) {
      childTransition.value = toIndex > fromIndex ? 'swipe-left' : 'swipe-right'
    }
    previousName = nextName
  }, { immediate: true })

  watch(items, () => {
    previousName = route.name ?? orderedNames.value[0] ?? null
  })

  return {
    childTransition,
    getLocalizedPath,
    resolveLang,
    shiftChild,
    orderedNavItems: items,
  }
}
