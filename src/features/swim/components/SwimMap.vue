<!-- src/features/swim/components/SwimMap.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

// APIs
import { getWeatherByCoords } from '@/api/weather'
import { getAllBeaches } from '@/api/webapi/beach_api'
import { getAllRivers } from '@/api/webapi/river_api'
import { getToiletById } from '@/api/webapi/toilet_api'

// Components
import ToiletMarkers from './ToiletMarkers.vue'
import FountainMarkers from './FountainMarkers.vue'

// Props
const props = defineProps({
  filters: Object,
  searchQuery: String,
  zoomTarget: Object
})

const emit = defineEmits(['marker-clicked'])

// Google Maps config
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
// const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || ''

// Refs
const center = ref({ lat: -37.8679, lng: 144.9740 })
const mapRef = ref(null)

const allBeaches = ref([])
const allRivers = ref([])
const userLocation = ref(null)

const directionsService = ref(null)
let directionsRenderer = null

const customMapStyle = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#686868"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "-22"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": "11"
            },
            {
                "lightness": "-51"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "saturation": "3"
            },
            {
                "lightness": "-56"
            },
            {
                "weight": "2.20"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "-52"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "6.13"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "lightness": "-10"
            },
            {
                "gamma": "0.94"
            },
            {
                "weight": "1.24"
            },
            {
                "saturation": "-100"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": "-16"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": "-41"
            },
            {
                "lightness": "-41"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "5.46"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "0.72"
            },
            {
                "lightness": "-16"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "-37"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#b7e4f4"
            },
            {
                "visibility": "on"
            }
        ]
    }
];

// Setup directions on map
watch(
  () => mapRef.value?.map,
  (map) => {
    if (map && window.google) {
      // ✅ Apply custom styles directly to the map instance
      map.setOptions({
        styles: customMapStyle,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      })
      
      directionsService.value = new window.google.maps.DirectionsService()
      directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        preserveViewport: false,
        polylineOptions: {
          strokeColor: '#006400',
          strokeOpacity: 0.8,
          strokeWeight: 6
        }
      })
      
      console.log('Custom styles applied to map!')
    }
  },
  { immediate: true }
)

// Pre-fetch user location on load
onMounted(() => {
  fetchUserLocation().catch(() => {
    console.warn('User denied geolocation or it failed.')
  })
})

// Fetch user location once & cache
function fetchUserLocation() {
  return new Promise((resolve, reject) => {
    if (userLocation.value) {
      resolve(userLocation.value)
      return
    }

    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        resolve(userLocation.value)
      },
      (err) => reject(err)
    )
  })
}

// Get directions to target
async function getDirectionsToLocation(destination) {
  try {
    const origin = await fetchUserLocation()

    const request = {
      origin,
      destination: { lat: destination.lat, lng: destination.lon },
      travelMode: window.google.maps.TravelMode.DRIVING
    }

    directionsService.value.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
      } else {
        alert('Failed to get directions.')
      }
    })
  } catch (err) {
    alert('Unable to access your location')
    console.error('Directions error:', err)
  }
}

// Zoom to selected location
watch(() => props.zoomTarget, (target) => {
  if (target && mapRef.value?.map) {
    const map = mapRef.value.map
    map.panTo({ lat: target.lat, lng: target.lon })
    map.setZoom(15)
  }
})

// ===== FIXED: Load beach & river data =====
onMounted(async () => {
  try {
    const beaches = await getAllBeaches()
    const rivers = await getAllRivers()

    // ===== BEACHES: Use ML predictions with CORRECT thresholds =====
    allBeaches.value = beaches.map(beach => {
      const prediction = beach.predicted || {}
      const enterococci = prediction.enterococci || beach.avg_enterococci || 0
      const mlCategory = prediction.category // 'green', 'amber', 'red'
      
      // ✅ FIXED: Use unified status system
      let status, statusLabel
      if (mlCategory === 'green' || enterococci <= 40) {
        status = 'Excellent'
        statusLabel = 'Clean for Swimming'
      } else if (mlCategory === 'amber' || enterococci <= 200) {
        status = 'Moderate'
        statusLabel = 'Caution Advised'
      } else {
        status = 'Poor'
        statusLabel = 'Avoid Swimming'
      }
      
      // console.log('Beach:', beach.name, {
      //   enterococci: enterococci,
      //   mlCategory: mlCategory,
      //   status: status,
      //   timestamp: prediction.timestamp
      // })
      
      return {
        ...beach,
        type: 'beach',
        status, // ✅ Now: 'Excellent' | 'Moderate' | 'Poor'
        statusLabel,
        enterococci,
        mlCategory,
        rainfall_mm: prediction.rainfall_mm || 0,
        prediction_timestamp: prediction.timestamp,
        icon: getStatusColorIcon(status),
        description: beach.description_tips || 'No description available.',
        // Extra data for detail view
        extraInfo: {
          rainfallLast3Days: prediction.rainfall_mm || 0,
          lastUpdated: formatTimestamp(prediction.timestamp),
          dataSource: prediction.enterococci ? 'ML Prediction' : 'Historical Average'
        }
      }
    })

    // ===== RIVERS: Keep existing logic =====
    allRivers.value = rivers.map(river => {
      const predicted = river.predicted || {}
      const status = predicted.category || 'Poor'
      const wqi = predicted.wqi ?? null

      // console.log('River:', river.name, {
      //   predictedCategory: predicted.category,
      //   wqi: wqi,
      //   rawPredicted: predicted
      // })
      
      return {
        ...river,
        type: 'river',
        status, // "Excellent" | "Good" | "Moderate" | "Poor" | "Very Poor"
        wqi,
        prediction_timestamp: predicted.timestamp,
        icon: getStatusColorIcon(status),
        description: river.description || 'No description available.'
      }
    })
    
  } catch (err) {
    console.error('Error loading data:', err)
  }
})


// ===== FIXED: Icon mapping (unified for both beaches and rivers) =====
function getStatusColorIcon(status) {
  const icons = {
    'Excellent': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    'Good': 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',
    'Moderate': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    'Poor': 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    'Very Poor': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  }
  return icons[status] || 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
}


// ===== NEW: Time formatting helper =====
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  const days = Math.floor(diffHours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}


// ===== Helper: Calculate distance =====
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}


// ===== FIXED: Filter markers with correct status mapping =====
const filteredLocations = computed(() => {
  const show = props.filters?.showOnMap || 'all'
  const quality = props.filters?.waterQuality
  const query = props.searchQuery?.toLowerCase().trim() || ''
  const distance = props.filters?.distance ? parseFloat(props.filters.distance) : null

  let data = []

  if (show === 'all' || show === 'beach') data.push(...allBeaches.value)
  if (show === 'all' || show === 'river') data.push(...allRivers.value)

  // ✅ FIXED: Quality filter with unified status names
  if (quality) {
    const statusMap = {
      clean: ['Excellent', 'Good'],     // ✅ Green pins
      moderate: ['Moderate'],           // ✅ Yellow/Orange pins
      unclean: ['Poor', 'Very Poor']    // ✅ Red pins
    }
    const targetStatuses = statusMap[quality] || []
    data = data.filter(loc => targetStatuses.includes(loc.status))
  }

  // Search filter
  if (query) {
    data = data.filter(loc => loc.name?.toLowerCase().includes(query))
  }

  // Distance filter (only if user location available)
  if (distance && userLocation.value) {
    data = data.filter(loc => {
      const d = getDistanceKm(userLocation.value.lat, userLocation.value.lng, loc.lat, loc.lon)
      return d <= distance
    })
  }

  return data
})


// Handle marker click
async function handleMarkerClick(location) {
  try {
    if (location.type === 'toilet') {
      const data = await getToiletById(location.id)

      emit('marker-clicked', {
        ...location,
        ...data,
        type: 'toilet',
        getDirections: () => getDirectionsToLocation(location)
      })
    } else {
      const weather = await getWeatherByCoords(location.lat, location.lon)
      location.temperature = weather?.main?.temp ?? 'N/A'

      emit('marker-clicked', {
        ...location,
        type: location.type,
        getDirections: () => getDirectionsToLocation(location)
      })
    }

    center.value = { lat: location.lat, lng: location.lon }
    mapRef.value?.map?.panTo(center.value)
  } catch (err) {
    console.error('Error fetching location details:', err)
  }
}
</script>
<!-- :map-id="mapId" -->
<template>
  <div class="swim-map">
    <GoogleMap
      ref="mapRef"
      :api-key="apiKey"
      :center="center"
      :zoom="12"
      class="google-map"
    >
      <!-- Beach & River Markers -->
      <Marker
        v-for="(loc, i) in filteredLocations"
        :key="`${loc.type}-${loc.beach_id || loc.river_id || i}`"
        :options="{
          position: { lat: loc.lat, lng: loc.lon },
          title: `${loc.name} (${loc.status})`,
          icon: { url: loc.icon }
        }"
        @click="handleMarkerClick(loc)"
      />

      <!-- Toilets -->
      <ToiletMarkers
        v-if="filters?.amenities?.includes('toilets')"
        @marker-clicked="handleMarkerClick"
      />

      <!-- Fountains -->
      <FountainMarkers
        v-if="filters?.amenities?.includes('fountains')"
        @marker-clicked="handleMarkerClick"
      />
    </GoogleMap>
  </div>
</template>

<style scoped>
.swim-map {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.google-map {
  width: 100%;
  height: 100%;
}
</style>