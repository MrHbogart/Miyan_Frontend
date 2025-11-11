import { ref } from 'vue'

// Shared header state between Header component and views
export const headerHeight = ref(0)
export const headerInitialHeight = ref(0)
export const navAttached = ref(false)

export default {
  headerHeight,
  headerInitialHeight,
  navAttached,
}
