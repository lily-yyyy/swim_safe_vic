 <!-- <template>
  <div class="swim-view">
    <input
      ref="searchInput"
      type="text"
      class="form-control search-input"
      placeholder="Search for a location..."
    />

    <GoogleMap
      ref="mapRef"
      :api-key="apiKey"
      :map-id="mapId"
      :libraries="['places']"
      version="weekly"
      :center="center"
      :zoom="14"
      class="google-map"
    />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { GoogleMap } from 'vue3-google-map'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId  = import.meta.env.VITE_GOOGLE_MAP_ID || ''

const center = ref({ lat: -37.8136, lng: 144.9631 }) // Melbourne
const mapRef = ref(null)
const searchInput = ref(null)

let autocomplete = null
let placeChangedListener = null

// Init once when the map becomes ready
const stop = watch(
  () => mapRef.value?.ready,
  (ready) => {
    if (!ready) return
    const api = mapRef.value.api
    if (!api?.places || !searchInput.value) return

    // Create Places Autocomplete
    autocomplete = new api.places.Autocomplete(searchInput.value, {
      fields: ['geometry', 'name'],
    })

    placeChangedListener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      const loc = place?.geometry?.location
      if (!loc) return
      const next = { lat: loc.lat(), lng: loc.lng() }
      center.value = next
      mapRef.value.map?.panTo?.(next)
    })

    // Stop watching after successful init
    stop()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  try { placeChangedListener?.remove?.() } catch {}
  autocomplete = null
})
</script>

<style scoped>
.swim-view {
  margin-top: 70px; /* offset for fixed navbar */
  width: 100vw;
  height: calc(100vh - 70px);
  overflow: hidden;
  position: relative;
}
.google-map { width: 100%; height: 100%; }
.search-input {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  z-index: 10; width: 300px; max-width: 80%;
  padding: 8px 12px; border-radius: 6px; border: 1px solid #ccc; background: #fff;
}
</style>  -->


<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || ''

const center = ref({ lat: -37.8136, lng: 144.9631 }) // Melbourne
const mapRef = ref(null)
const searchInput = ref(null)
const locations = ref([])

let autocomplete = null
let placeChangedListener = null

// Load JSON from public folder
onMounted(async () => {
  const response = await fetch('/data/swim-locations.json')
  locations.value = await response.json()
})

// Setup autocomplete only after Google API is ready
const stop = watch(
  () => mapRef.value?.ready,
  (ready) => {
    if (!ready) return
    const api = mapRef.value.api
    if (!api?.places || !searchInput.value) return

    autocomplete = new api.places.Autocomplete(searchInput.value, {
      fields: ['geometry', 'name'],
    })

    placeChangedListener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      const loc = place?.geometry?.location
      if (!loc) return
      const next = { lat: loc.lat(), lng: loc.lng() }
      center.value = next
      mapRef.value.map?.panTo?.(next)
    })

    stop()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  try { placeChangedListener?.remove?.() } catch {}
  autocomplete = null
})
</script>

<template>
  <div class="swim-view">
    <input
      ref="searchInput"
      type="text"
      class="form-control search-input"
      placeholder="Search for a location..."
    />

    <GoogleMap
      ref="mapRef"
      :api-key="apiKey"
      :map-id="mapId"
      :libraries="['places']"
      version="weekly"
      :center="center"
      :zoom="13"
      class="google-map"
    >
      <!-- Loop through locations and drop pins -->
      <Marker
        v-for="(loc, i) in locations"
        :key="i"
        :options="{
          position: { lat: loc.lat, lng: loc.lng },
          title: loc.name
        }"
      />
    </GoogleMap>
  </div>
</template>

<style scoped>
.swim-view {
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


