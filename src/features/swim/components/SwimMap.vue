<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

import { getWeatherByCoords } from '@/api/weather'
import { getAllBeaches } from '@/api/webapi/beach_api'
import { getAllRivers } from '@/api/webapi/river_api'

// Emits marker-clicked to parent (to show InfoDialog)
const emit = defineEmits(['marker-clicked'])

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || ''

const center = ref({ lat: -37.8679, lng: 144.9740 }) // Default: Melbourne
const mapRef = ref(null)

const allLocations = ref([]) // Beaches
const allRivers = ref([])    // Rivers

const searchQuery = ref('')
const searchInput = ref(null)

// Directions-related refs (native Google Maps API)
const directionsService = ref(null) // instance of google.maps.DirectionsService
let directionsRenderer = null       // instance of google.maps.DirectionsRenderer

const allSearchable = computed(() => [...allLocations.value, ...allRivers.value])

const filteredResults = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return []
  return allSearchable.value.filter(loc => loc.name.toLowerCase().includes(query))
})

// Beach status by avg_enterococci
function getBeachStatus(enterococci) {
  if (enterococci <= 140) return 'Surveillance'
  if (enterococci <= 280) return 'Alert'
  return 'Action'
}

function getStatusColorIcon(status) {
  switch (status) {
    case 'Surveillance':
      return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    case 'Alert':
      return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
    case 'Action':
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    default:
      return ''
  }
}

// Initialize native Directions API once the map instance exists
watch(
  () => mapRef.value?.map,
  (map) => {
    if (map && window.google) {
      if (!directionsService.value) {
        directionsService.value = new window.google.maps.DirectionsService()
      }
      if (!directionsRenderer) {
        directionsRenderer = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          preserveViewport: false,
          polylineOptions: {
            strokeColor: '#006400', // dark green
            strokeOpacity: 0.8,
            strokeWeight: 6
          }
        })
      }
    }
  },
  { immediate: true }
)

// Fetch beach and river data on mount
onMounted(async () => {
  try {
    const beaches = await getAllBeaches()
    const rivers = await getAllRivers()

    allLocations.value = beaches.map(beach => {
      const status = getBeachStatus(beach.avg_enterococci)
      return {
        ...beach,
        status,
        icon: getStatusColorIcon(status),
        description: beach.description_tips || 'No description available.'
      }
    })

    allRivers.value = rivers
  } catch (err) {
    console.error('Error loading map data:', err)
  }
})

async function focusOnLocation(loc) {
  const position = { lat: loc.lat, lng: loc.lon }

  center.value = position
  mapRef.value?.map?.panTo(position)
  mapRef.value?.map?.setZoom(17)

  await handleMarkerClick(loc)
}

// Fetch weather & emit to parent
async function handleMarkerClick(location) {
  try {
    const weather = await getWeatherByCoords(location.lat, location.lon)
    location.temperature = weather?.main?.temp ?? 'N/A'

    // Provide a callback the dialog can use to request directions
    emit('marker-clicked', {
      ...location,
      getDirections: () => getDirectionsToLocation(location)
    })
  } catch (err) {
    console.error('Error fetching weather:', err)
  }
}

// Generate directions from current location to clicked location
function getDirectionsToLocation(destination) {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported.')
    return
  }
  if (!window.google || !directionsService.value || !directionsRenderer) {
    alert('Map is not ready yet.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const origin = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      const request = {
        origin,
        destination: { lat: destination.lat, lng: destination.lon },
        travelMode: window.google.maps.TravelMode.DRIVING, // change to WALKING/BICYCLING/TRANSIT if needed
        provideRouteAlternatives: true
      }

      directionsService.value.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result)
        } else {
          console.warn('Directions request failed:', status)
          alert('Could not get directions for this route.')
        }
      })
    },
    (err) => {
      console.error(err)
      alert('Unable to access your location.')
    }
  )
}
</script>

<template>
  <div class="swim-map">
    <!-- Search Input -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        ref="searchInput"
        type="text"
        class="form-control search-input"
        placeholder="Search beaches or rivers..."
      />
      <ul v-if="filteredResults.length" class="search-results">
        <li
          v-for="(result, index) in filteredResults"
          :key="index"
          @click="focusOnLocation(result)"
        >
          {{ result.name }}
        </li>
      </ul>
    </div>

    <!-- Google Map -->
    <GoogleMap
      ref="mapRef"
      :api-key="apiKey"
      :map-id="mapId"
      :libraries="['places']"
      version="weekly"
      :center="center"
      :zoom="12"
      class="google-map"
    >
      <!-- Beach markers -->
      <Marker
        v-for="(loc, i) in allLocations"
        :key="'beach-' + i"
        :options="{
          position: { lat: loc.lat, lng: loc.lon },
          title: loc.name,
          icon: { url: loc.icon }
        }"
        @click="handleMarkerClick(loc)"
      />

      <!-- River markers -->
      <Marker
        v-for="(river, i) in allRivers"
        :key="'river-' + i"
        :options="{
          position: { lat: river.lat, lng: river.lon },
          title: river.name,
          icon: { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }
        }"
        @click="handleMarkerClick(river)"
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

.search-container {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 400px;
  max-width: 90%;
}

.search-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
}

.search-results {
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.search-results li {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
}

.search-results li:hover {
  background: #f0f0f0;
}
</style>
