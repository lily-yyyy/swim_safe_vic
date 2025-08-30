<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

const emit = defineEmits(['marker-clicked'])

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || ''

const center = ref({ lat: -37.8136, lng: 144.9631 }) // Melbourne
const mapRef = ref(null)
const searchInput = ref(null)

const allLocations = ref([])

let autocomplete = null
let placeChangedListener = null

// Fetch location data from public directory
onMounted(async () => {
  try {
    const res = await fetch('/data/locations.json')
    if (!res.ok) throw new Error('Failed to fetch location data')
    allLocations.value = await res.json()
  } catch (err) {
    console.error('Error loading location data:', err)
  }

  // Initialize autocomplete
  if (window.google && searchInput.value) {
    autocomplete = new window.google.maps.places.Autocomplete(searchInput.value, {
      fields: ['geometry', 'name'],
    })

    placeChangedListener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      const loc = place?.geometry?.location
      if (!loc) return
      const newCenter = { lat: loc.lat(), lng: loc.lng() }
      center.value = newCenter
      mapRef.value?.map?.panTo?.(newCenter)
    })
  }
})

onBeforeUnmount(() => {
  try {
    placeChangedListener?.remove?.()
  } catch {}
  autocomplete = null
})

// Emit when a marker is clicked
function handleMarkerClick(location) {
  emit('marker-clicked', location)
}
</script>

<template>
  <div class="swim-map">
    <!-- Search Input -->
    <input
      ref="searchInput"
      type="text"
      class="form-control search-input"
      placeholder="Search for a location..."
    />

    <!-- Google Map -->
    <GoogleMap
      ref="mapRef"
      :api-key="apiKey"
      :map-id="mapId"
      :libraries="['places']"
      version="weekly"
      :center="center"
      :zoom="14"
      class="google-map"
    >
      <!-- Render all markers -->
      <Marker
        v-for="(loc, i) in allLocations"
        :key="i"
        :options="{
          position: { lat: loc.lat, lng: loc.lng },
          title: loc.name
        }"
        @click="handleMarkerClick(loc)"
      />
    </GoogleMap>
  </div>
</template>

<style scoped>
.swim-map {
  margin-top: 70px;
  width: 100vw;
  height: calc(100vh - 70px);
  overflow: hidden;
  position: relative;
}
.google-map {
  width: 100%;
  height: 100%;
}
.search-input {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 300px;
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
}
</style>
