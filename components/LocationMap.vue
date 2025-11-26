<template>
  <ClientOnly>
    <component
      v-if="mapReady"
      :is="LMap"
      class="leaflet-map-shell"
      :zoom="zoom"
      :center="mapCenter"
      :use-global-leaflet="false"
      :options="mapOptions"
    >
      <component :is="LTileLayer" :url="tileUrl" :attribution="tileAttribution" />
      <component :is="LMarker" :lat-lng="mapCenter">
        <component :is="LPopup" v-if="markerLabel">{{ markerLabel }}</component>
      </component>
    </component>
    <template #fallback>
      <div class="leaflet-map-shell map-fallback" aria-hidden="true">
        <span>{{ markerLabel || 'Loading map...' }}</span>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { computed, ref } from 'vue'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const props = defineProps({
  center: {
    type: Array,
    required: true,
  },
  zoom: {
    type: Number,
    default: 16,
  },
  markerLabel: {
    type: String,
    default: '',
  },
})

let LMap
let LTileLayer
let LMarker
let LPopup
const mapReady = ref(false)

if (process.client) {
  ;(async () => {
    try {
      const leafletComponents = await import('@vue-leaflet/vue-leaflet')
      LMap = leafletComponents.LMap
      LTileLayer = leafletComponents.LTileLayer
      LMarker = leafletComponents.LMarker
      LPopup = leafletComponents.LPopup

      const { Icon } = await import('leaflet')
      Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      })

      mapReady.value = true
    } catch (err) {
      if (process.dev) {
        console.warn('[LocationMap] failed to load Leaflet', err)
      }
    }
  })()
}

const mapCenter = computed(() => props.center)
const mapOptions = { zoomControl: false, attributionControl: false }
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tileAttribution = '© OpenStreetMap contributors'
const markerLabel = computed(() => props.markerLabel)

</script>

<style scoped>
.leaflet-map-shell {
  width: 100%;
  height: 100%;
  min-height: 15rem;
  border-radius: 0;
  overflow: hidden;
}

.map-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 16, 10, 0.08);
  color: rgba(20, 16, 10, 0.65);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
