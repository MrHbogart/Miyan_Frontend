<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" @click="emitClose">
        <div class="max-w-4xl max-h-[90vh] p-4">
            <img :src="imageSrc" :alt="imageAlt" class="max-w-full max-h-[85vh] object-contain transform transition-all duration-300 scale-100 hover:scale-105" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  imageSrc: {
    type: String,
    default: ''
  },
  imageAlt: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

function emitClose() {
  emit('close')
}

function onScrollClose() {
  emit('close')
}

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('scroll', onScrollClose, { passive: true })
  window.addEventListener('touchmove', onScrollClose, { passive: true })
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScrollClose)
  window.removeEventListener('touchmove', onScrollClose)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
