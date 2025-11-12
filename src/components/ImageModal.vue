<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show" 
        class="image-modal-overlay" 
        @click="emitClose"
        @touchmove.prevent
      >
        <div class="image-modal-container" @click.stop>
          <img 
            :src="imageSrc" 
            :alt="imageAlt" 
            class="image-modal-img" 
          />
          <button 
            class="image-modal-close"
            @click="emitClose"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
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

import { onMounted, onUnmounted } from 'vue'

function emitClose() {
  emit('close')
}

function onScrollClose() {
  emit('close')
}

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

// Scale English title to feel balanced in modal (roughly akin to image)
const englishTitleStyle = computed(() => ({
  fontWeight: 500,
  letterSpacing: '0.02em',
  // responsive size: around 5-7vh depending on viewport
  fontSize: 'clamp(28px, 6.2vh, 64px)',
  lineHeight: 1.1,
  textShadow: '0 2px 18px rgba(0,0,0,.35)'
}))

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
/* Luxury modal transitions */
.modal-enter-active {
  transition: opacity 500ms cubic-bezier(0.4, 0.0, 0.2, 1),
              backdrop-filter 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.modal-leave-active {
  transition: opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
              backdrop-filter 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  overflow: visible;
}

.image-modal-container {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  padding: 2rem;
  overflow: visible;
}

.image-modal-img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform;
}

.image-modal-img:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 64px rgba(0, 0, 0, 0.5), 0 6px 24px rgba(0, 0, 0, 0.4);
}

.image-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
  z-index: 10;
  overflow: visible;
}

.image-modal-close:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.image-modal-close:active {
  transform: scale(1.05) rotate(90deg);
}
</style>