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
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || ''

// Refs
const center = ref({ lat: -37.8679, lng: 144.9740 }) // Default Melbourne center
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
    "stylers": [{"color": "#444444"}]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{"color": "#f2f2f2"}]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{"saturation": -100}, {"lightness": 45}]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{"visibility": "simplified"}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
  }
];

const mapOptions = ref({
  styles: customMapStyle,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false
})

// Setup directions on map
watch(
  () => mapRef.value?.map,
  (map) => {
    if (map && window.google) {
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
    }
  },
  { immediate: true }
)

// Optional: Pre-fetch user location on load
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

// Load beach & river data
onMounted(async () => {
  try {
    const beaches = await getAllBeaches()
    const rivers = await getAllRivers()

    allBeaches.value = beaches.map(beach => {
      const status = getBeachStatus(beach.avg_enterococci)
      return {
        ...beach,
        type: 'beach',
        status,
        //icon: getStatusColorIcon(status),
        description: beach.description_tips || 'No description available.'
      }
    })

    allRivers.value = rivers.map(river => {
      const predicted = river.predicted || {}
      const status = river?.predicted?.category ?? 'Poor'
      const wqi = river.predicted?.wqi ?? null

      //  console.log('River:', river.name, {
      //   predictedCategory: river?.predicted?.category,
      //   wqi: river?.predicted?.wqi,
      //   rawPredicted: river?.predicted
      // })
      
      return {
        ...river,
        type: 'river',
        status, // "Excellent" | "Good" | "Moderate" | "Poor" | "Very Poor",
        wqi,
        //icon: getStatusColorIcon(status),
        description: river.description || 'No description available.'
      }
    })
  } catch (err) {
   // console.error('Error loading data:', err)
  }
})

// function getIconForCurrentFilter(loc) {
//   const quality = props.filters?.waterQuality

//   if (quality === 'caution') {
//     return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
//   }
//   if (quality === 'unsafe') {
//     return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
//   }

//   // Default icon from status
//   return getStatusColorIcon(loc.status)
// }

function getIconForCurrentFilter(loc) {
  const quality = props.filters?.waterQuality

  if (quality === 'caution') {
    return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
  }

  if (quality === 'unsafe') {
    return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  }

  // Default: derive from actual status
  return getStatusColorIcon(loc.status)
}




// Status logic
function getBeachStatus(enterococci) {
  if (enterococci <= 140) return 'Good'
  if (enterococci <= 280) return 'Very Poor'
  return 'Action'
}

// function getRiverStatus(totalN) {
//   if (totalN <= 0.1) return 'Surveillance'
//   if (totalN <= 0.75) return 'Alert'
//   return 'Action'
// }

function getStatusColorIcon(status) {
  switch (status) {
    // case 'Surveillance': return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    // case 'Alert': return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
    // case 'Action': return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    case 'Excellent': return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    case 'Good': return 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    case 'Moderate': return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    case 'Poor': return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
    case 'Very Poor': return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    default: return ''
  }
}


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


// Filter markers
// const filteredLocations = computed(() => {
//   const show = props.filters?.showOnMap || 'all'
//   const quality = props.filters?.waterQuality
//   const query = props.searchQuery?.toLowerCase().trim() || ''

//   let data = []

//   if (show === 'all' || show === 'beach') data.push(...allBeaches.value)
//   if (show === 'all' || show === 'river') data.push(...allRivers.value)

//   if (quality) {
//     const statusMap = {
//       safe: 'Surveillance',
//       caution: 'Alert',
//       unsafe: 'Action'
//     }
//     data = data.filter(loc => loc.status === statusMap[quality])
//   }

//   if (query) {
//     data = data.filter(loc => loc.name?.toLowerCase().includes(query))
//   }

//   return data
// })

// const filteredLocations = computed(() => {
//   const show = props.filters?.showOnMap || 'all'
//   const quality = props.filters?.waterQuality
//   const query = props.searchQuery?.toLowerCase().trim() || ''
//   const distance = props.filters?.distance ? parseFloat(props.filters.distance) : null

//   let data = []

//   if (show === 'all' || show === 'beach') data.push(...allBeaches.value)
//   if (show === 'all' || show === 'river') data.push(...allRivers.value)

//   //  Quality filter
//   if (quality) {
//     const statusMap = { safe: 'Surveillance', caution: 'Alert', unsafe: 'Action' }
//     data = data.filter(loc => loc.status === statusMap[quality])
//   }

//   //  Search filter
//   if (query) {
//     data = data.filter(loc => loc.name?.toLowerCase().includes(query))
//   }

//   //  Distance filter (only if user location available)
//   if (distance && userLocation.value) {
//     data = data.filter(loc => {
//       const d = getDistanceKm(userLocation.value.lat, userLocation.value.lng, loc.lat, loc.lon)
//       return d <= distance
//     })
//   }

//   return data
// })

const filteredLocations = computed(() => {
  const show = props.filters?.showOnMap || 'all'
  const quality = props.filters?.waterQuality
  const query = props.searchQuery?.toLowerCase().trim() || ''
  const distance = props.filters?.distance ? parseFloat(props.filters.distance) : null

  let data = []

  if (show === 'all' || show === 'beach') data.push(...allBeaches.value)
  if (show === 'all' || show === 'river') data.push(...allRivers.value)

  // Fixed Quality Filter
  if (quality) {
    data = data.filter(loc => {
      if (loc.type === 'beach') {
        const map = { safe: 'Good', caution: 'Very Poor', unsafe: 'Action' }
        return loc.status === map[quality]
      }
      if (loc.type === 'river') {
        const map = {
          safe: ['Excellent', 'Good'],
          caution: ['Moderate', 'Poor'],
          unsafe: ['Very Poor']
        }
        return map[quality]?.includes(loc.status)
      }
      return true
    })
  }

  // Search
  if (query) {
    data = data.filter(loc => loc.name?.toLowerCase().includes(query))
  }

  // Distance (only if user location exists)
  
  if (distance) {
    if (!userLocation.value) return []

    data = data.filter(loc => {
      const d = getDistanceKm(
        userLocation.value.lat,
        userLocation.value.lng,
        loc.lat,
        loc.lon
      )
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

<template>
  <div class="swim-map">
    <GoogleMap
      ref="mapRef"
      :api-key="apiKey"
      :map-id="mapId"
      :center="center"
      :zoom="12"
      :options="mapOptions"
      class="google-map"
    >
      <!-- Beach & River Markers -->
      <Marker
        v-for="(loc, i) in filteredLocations"
        :key="i"
        :options="{
          position: { lat: loc.lat, lng: loc.lon },
          title: `${loc.name} (${loc.status})`,
          //icon: { url: loc.icon }
          icon: { url: getIconForCurrentFilter(loc) }

        }"
        @click="handleMarkerClick(loc)"
      />

      <!--  Toilets -->
      <ToiletMarkers
        v-if="filters?.amenities?.includes('toilets')"
        @marker-clicked="handleMarkerClick"
      />

      <!--  Fountains -->
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
