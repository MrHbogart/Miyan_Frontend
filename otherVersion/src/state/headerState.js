import { ref } from 'vue'

// Shares the measured header height with other components (e.g. sticky navbar)
export const headerHeight = ref(0)

export default {
	headerHeight,
}
