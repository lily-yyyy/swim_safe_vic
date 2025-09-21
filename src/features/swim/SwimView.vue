<script setup>
import { ref, computed } from 'vue'

// Components
import SwimMap from './components/SwimMap.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import InfoDialog from '@/components/ui/InfoDialog.vue'
import ToiletInfo from '@/components/ui/ToiletInfo.vue'

// Data APIs
import { getAllBeaches } from '@/api/webapi/beach_api'
import { getAllRivers } from '@/api/webapi/river_api'
import { getToiletById } from '@/api/webapi/toilet_api' // ✅ Add this

// State
const selectedLocation = ref(null)
const selectedToilet = ref(null)

const selectedFilters = ref({})
const searchQuery = ref('')
const allLocations = ref([])

// Load beaches and rivers
async function loadLocations() {
  try {
    const beaches = await getAllBeaches()
    const rivers = await getAllRivers()

    allLocations.value = [
      ...beaches.map(b => ({
        ...b,
        type: 'beach',
        name: b.name,
        description: b.description_tips || 'No description.',
        status: b.status || 'Unknown',
        lat: b.lat,
        lon: b.lon,
      })),
      ...rivers.map(r => ({
        ...r,
        type: 'river',
        name: r.name,
        description: r.description || 'No description.',
        status: r.status || 'Unknown',
        lat: r.lat,
        lon: r.lon,
      }))
    ]
  } catch (e) {
    console.error('Error loading locations:', e)
  }
}
loadLocations()

// Computed: Filtered search results
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  return allLocations.value.filter(loc =>
    loc.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

async function handleMarkerClicked(location) {
  console.log('📌 Toilet clicked:', location)

  if (location.type === 'toilet') {
    try {
      const data = await getToiletById(location.id)

      const enrichedToilet = {
        ...data,
        id: data.id,
        type: 'toilet',
        name: data.toilet_name,
        openingHours: data.opening_hours,
        babyChange: data.baby_change,
        male: data.male,
        female: data.female,
        unisex: data.unisex,
        accessible: data.accessible,
        allGender: data.all_gender,
        lat: data.lat,
        lon: data.lon,
        getDirections: () => getDirectionsToLocation(data)
      }

      selectedToilet.value = enrichedToilet
      selectedLocation.value = null // close any previous beach/river dialogs
    } catch (e) {
      console.error('❌ Failed to load toilet data:', e)
    }
  } else {
    selectedLocation.value = {
      ...location,
      getDirections: () => getDirectionsToLocation(location)
    }
    selectedToilet.value = null // close toilet dialog
    searchQuery.value = ''
  }
}


// // ✅ Map marker clicked
// async function handleMarkerClicked(location) {
//   console.log('kk Toilet clicked:', location)
//   if (location.type === 'toilet') {
//     try {
//       const fullData = await getToiletById(location.id)
//       selectedToilet.value = {
//         ...fullData,
//         getDirections: location.getDirections
//       }
//       selectedToilet.value = {
//         ...data,
//         id: data.id,
//         type: 'toilet',
//         name: data.toilet_name,
//         openingHours: data.opening_hours,
//         babyChange: data.baby_change,
//         male: data.male,
//         female: data.female,
//         unisex: data.unisex,
//         accessible: data.accessible,
//         allGender: data.all_gender,
//         getDirections: location.getDirections // preserve directions
//       }
//     } catch (e) {
//       console.error('❌ Failed to load toilet:', e)
//     }
//   } else {
//     selectedLocation.value = location
//     searchQuery.value = ''
//   }
// }

// ❌ Close dialogs
function closeDialog() {
  selectedLocation.value = null
  selectedToilet.value = null
}

// 🧭 Filters updated
function handleFilterChange(filters) {
  selectedFilters.value = filters
}

// 🔍 Search input
function handleSearchUpdate(query) {
  searchQuery.value = query
}

// ✅ Search suggestion selected
function handleSearchSelected(location) {
  selectedLocation.value = {
    ...location,
    zoomTo: true
  }
}

// 💬 Toilet feedback submission
function handleToiletFeedback(data) {
  console.log('🚻 Feedback submitted:', data)
  // You can also send this to your backend here
}
</script>

<template>
  <div class="swim-page">
    <div class="map-container">
      <!-- 🗺️ MAP -->
      <SwimMap
        :filters="selectedFilters"
        :searchQuery="searchQuery"
        :zoomTarget="selectedLocation?.zoomTo ? selectedLocation : null"
        @marker-clicked="handleMarkerClicked"
      />

      <!-- 🧭 SIDEBAR -->
      <div class="floating-sidebar">
        <FilterSidebar
          :results="searchResults"
          @update:filters="handleFilterChange"
          @update:search="handleSearchUpdate"
          @search-selected="handleSearchSelected"
        />
      </div>

      <!-- ℹ️ Beach/River Info -->
      <InfoDialog
        v-if="selectedLocation && selectedLocation.type !== 'toilet' && !selectedLocation.zoomTo"
        :location="selectedLocation"
        @close="closeDialog"
      />

      <!-- 🚻 Toilet Info -->
      <ToiletInfo
        v-if="selectedToilet"
        :toilet="selectedToilet"
        @close="closeDialog"
        @submit="handleToiletFeedback"
      />
    </div>
  </div>
</template>

<style scoped>
.swim-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-sidebar {
  position: absolute;
  top: 80px;
  left: 0;
  width: 320px;
  background: white;
  padding: 16px;
  border-radius: 0 8px 8px 0;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .floating-sidebar {
    position: fixed;
    top: 70px;
    height: calc(100vh - 70px);
    transform: translateX(-100%);
    border-radius: 0;
    width: 80%;
    max-width: 300px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  }

  .floating-sidebar.open {
    transform: translateX(0);
  }
}
</style>
