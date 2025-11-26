<template>
  <l-map
    class="leaflet-map-shell"
    :zoom="zoom"
    :center="mapCenter"
    :use-global-leaflet="false"
    :options="mapOptions"
  >
    <l-tile-layer :url="tileUrl" :attribution="tileAttribution" />
    <l-marker :lat-lng="mapCenter">
      <l-popup v-if="markerLabel">{{ markerLabel }}</l-popup>
    </l-marker>
  </l-map>
</template>

<script setup>
import { computed } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { Icon } from 'leaflet'
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

Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

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
</style>
