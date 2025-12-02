<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="shouldRender"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click="emitClose"
      >
        <div class="modal-frame" @click.stop>
          <div class="media-shell">
            <img
              v-if="hasImage"
              :src="effectiveImageSrc"
              :alt="imageAlt"
              class="media-item"
              :class="{ 'media-item--hidden': shouldShowVideo }"
              loading="lazy"
              decoding="async"
            />

            <video
              v-if="hasVideoAsset"
              ref="videoRef"
              :src="effectiveVideoSrc"
              class="media-item"
              :class="{ 'media-item--hidden': !shouldShowVideo }"
              playsinline
              preload="auto"
              muted
              @ended="handleVideoEnded"
              @loadeddata="handleVideoLoaded"
            ></video>

            <div v-if="videoLoading" class="media-overlay">
              <span class="media-spinner" aria-hidden="true"></span>
              <p class="text-xs tracking-wide uppercase">Loading video…</p>
            </div>

            <button
              v-if="canManuallyTriggerVideo"
              type="button"
              class="play-overlay"
              @click="attemptVideoPlayback(true)"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  imageSrc: {
    type: String,
    default: '',
  },
  imageAlt: {
    type: String,
    default: '',
  },
  videoSrc: {
    type: String,
    default: '',
  },
  autoplayDelay: {
    type: Number,
    default: 2000,
  },
  videoTimeout: {
    type: Number,
    default: 10000,
  },
})

const emit = defineEmits(['close'])
const videoRef = ref(null)
const showVideo = ref(false)
const videoLoading = ref(false)
const canManuallyTriggerVideo = ref(false)
let autoplayTimer = null
let timeoutTimer = null

const gifAsImageSrc = computed(() => {
  const src = (props.videoSrc || '').trim().toLowerCase()
  return src.endsWith('.gif') ? props.videoSrc : ''
})

const effectiveImageSrc = computed(() => gifAsImageSrc.value || props.imageSrc)
const effectiveVideoSrc = computed(() => (gifAsImageSrc.value ? '' : props.videoSrc))

const hasImage = computed(() => !!effectiveImageSrc.value)
const hasVideoAsset = computed(() => !!effectiveVideoSrc.value)
const shouldRender = computed(() => props.show && (hasImage.value || hasVideoAsset.value))
const shouldShowVideo = computed(() => showVideo.value && hasVideoAsset.value)
let previousOverflow = ''
let previousBodyOverflow = ''

function emitClose() {
  emit('close')
}

function stopTimers() {
  if (autoplayTimer) {
    clearTimeout(autoplayTimer)
    autoplayTimer = null
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
}

function resetVideoState() {
  showVideo.value = false
  videoLoading.value = false
  canManuallyTriggerVideo.value = false
  const el = videoRef.value
  if (el) {
    try {
      el.pause()
      el.currentTime = 0
    } catch (error) {
      // ignore seek errors
    }
  }
}

function onScrollClose() {
  emit('close')
}

function onKey(event) {
  if (event.key === 'Escape') emit('close')
}

async function attemptVideoPlayback(manual = false) {
  if (!effectiveVideoSrc.value || !videoRef.value) return

  stopTimers()
  videoLoading.value = true
  showVideo.value = true
  canManuallyTriggerVideo.value = false

  try {
    videoRef.value.currentTime = 0
  } catch (error) {
    // ignore
  }

  try {
    await videoRef.value.play()
    videoLoading.value = false
    timeoutTimer = setTimeout(() => {
      handleVideoEnded()
    }, props.videoTimeout)
  } catch (error) {
    videoLoading.value = false
    showVideo.value = false
    if (!manual) {
      canManuallyTriggerVideo.value = true
    } else {
      console.warn('Video playback failed', error)
    }
  }
}

function prepareVideo() {
  if (!effectiveVideoSrc.value || !videoRef.value) return
  try {
    videoRef.value.load()
  } catch (error) {
    // ignore load errors
  }
}

function handleVideoLoaded() {
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
}

function handleVideoEnded() {
  resetVideoState()
}

function scheduleAutoplay() {
  if (!effectiveVideoSrc.value) return
  stopTimers()
  autoplayTimer = setTimeout(() => {
    attemptVideoPlayback(false)
  }, props.autoplayDelay)
}

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      if (typeof document !== 'undefined') {
        previousOverflow = document.documentElement.style.overflow
        previousBodyOverflow = document.body?.style?.overflow || ''
        document.documentElement.style.overflow = 'hidden'
        if (document.body) document.body.style.overflow = 'hidden'
      }
      resetVideoState()
      if (effectiveVideoSrc.value) {
        prepareVideo()
        scheduleAutoplay()
      }
    } else {
      stopTimers()
      resetVideoState()
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = previousOverflow || ''
        if (document.body) document.body.style.overflow = previousBodyOverflow || ''
      }
    }
  },
  { immediate: true }
)

watch(
  () => effectiveVideoSrc.value,
  () => {
    if (props.show) {
      resetVideoState()
      if (effectiveVideoSrc.value) {
        prepareVideo()
        scheduleAutoplay()
      }
    }
  }
)

onMounted(() => {
  window.addEventListener('scroll', onScrollClose, { passive: true })
  window.addEventListener('touchmove', onScrollClose, { passive: true })
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  stopTimers()
  resetVideoState()
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = previousOverflow || ''
    if (document.body) document.body.style.overflow = previousBodyOverflow || ''
  }
  window.removeEventListener('scroll', onScrollClose)
  window.removeEventListener('touchmove', onScrollClose)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.modal-frame {
  max-width: 100vw;
  max-height: 100vh;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-shell {
  position: relative;
  display: grid;
  place-items: center;
  width: min(92vw, 64rem);
  max-width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 82vh;
  padding: 0;
  border-radius: 0;
  overflow: hidden;
  background: transparent;
  box-shadow: none;
}

.media-item {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  transition: opacity 0.3s ease;
  display: block;
}

.media-item--hidden {
  opacity: 0;
  pointer-events: none;
}

.media-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.media-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0;
  border: 0.25rem solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  text-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.5);
  transition: background 0.2s ease;
}

.play-overlay:hover {
  background: rgba(0, 0, 0, 0.55);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .media-shell {
    width: 94vw;
    max-height: 72vh;
    padding: 0;
  }

  .media-item {
    max-height: 100%;
  }
}
</style>
