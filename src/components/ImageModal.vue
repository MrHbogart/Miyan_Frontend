<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show" 
        class="image-modal-overlay" 
        @click="emitClose"
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
import { computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
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

import { watch } from 'vue'

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  }
}, { immediate: true })

onMounted(() => {
  if (props.show) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.image-modal-container {
  position: relative;
  max-width: 95vw;
  max-height: none;
  padding: 2rem;
  margin: auto;
}

.image-modal-img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  transition: transform 300ms ease;
}

.image-modal-img:hover {
  transform: scale(1.01);
}

.image-modal-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 300ms ease;
  z-index: 51;
}

.image-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.image-modal-close:active {
  transform: scale(1.05);
}
</style>