<script setup>
import { ref, computed } from 'vue'

// Components
import SwimMap from './components/SwimMap.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import InfoDialog from '@/components/ui/InfoDialog.vue'
import ToiletInfo from '@/components/ui/ToiletInfo.vue'
import Planner from '@/features/home/components/Planer.vue'

// Data APIs
import { getAllBeaches } from '@/api/webapi/beach_api'
import { getAllRivers } from '@/api/webapi/river_api'
import {
  submitToiletRating,
  getToiletById,
  getToiletAverageRating,
  getLatestToiletComments
} from '@/api/webapi/toilet_api'

// ----------------------
// State
// ----------------------
const selectedLocation = ref(null)
const selectedToilet = ref(null)

const selectedFilters = ref({})
const searchQuery = ref('')
const allLocations = ref([])

const showPlanner = ref(false)
const plannerPlaceType = ref('')
const plannerPlaceId = ref('')

// Helper to safely get id from any location object
function getPlaceIdFromLocation(loc) {
  if (!loc) return ''
  return (
    loc.id ??
    loc.beach_id ??
    loc.river_id ??
    ''
  )
}

// ----------------------
// Open Planner (always works, with prefill)
// ----------------------
function openPlanner(locationRefOrObj) {
  // location may be a ref (selectedLocation) or a plain object
  const loc = locationRefOrObj && 'value' in locationRefOrObj ? locationRefOrObj.value : locationRefOrObj

  // Prefill planner data from the current location (beach/river)
  plannerPlaceType.value = loc?.type || ''
  plannerPlaceId.value = getPlaceIdFromLocation(loc)

  // Close any open dialogs then force-remount Planner
  closeDialog()
  showPlanner.value = false
  // next microtask to remount Planner fresh
  setTimeout(() => {
    showPlanner.value = true
  }, 0)
}

// ----------------------
// Submit Toilet Feedback
// ----------------------
async function handleToiletFeedback(data) {
  try {
    const payload = {
      user_id: 2,
      toilet_id: data.toiletId,
      rating: data.rating,
      comment: data.comment
    }

    await submitToiletRating(payload)

    // refresh average & comments
    const avg = await getToiletAverageRating(data.toiletId)
    const allComments = await getLatestToiletComments()
    selectedToilet.value = {
      ...selectedToilet.value,
      averageRating: avg?.average_rating ?? null,
      comments: allComments.filter(c => c.toilet_id === data.toiletId)
    }

    closeDialog()
  } catch (err) {
    console.error(' Failed to save toilet feedback:', err)
    alert('Could not save feedback')
  }
}

// ----------------------
// Load beaches & rivers
// ----------------------
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
        lon: b.lon
      })),
      ...rivers.map(r => ({
        ...r,
        type: 'river',
        name: r.name,
        description: r.description || 'No description.',
        status: r.status || 'Unknown',
        lat: r.lat,
        lon: r.lon
      }))
    ]
  } catch (e) {
    console.error(' Error loading locations:', e)
  }
}
loadLocations()

// ----------------------
// Computed Search Results
// ----------------------
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  return allLocations.value.filter(loc =>
    loc.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// ----------------------
// Handle Marker Click
// ----------------------
async function handleMarkerClicked(location) {
  if (location.type === 'toilet') {
    try {
      const data = await getToiletById(location.id)
      const avg = await getToiletAverageRating(location.id)
      const allComments = await getLatestToiletComments()
      const toiletComments = allComments.filter(c => c.toilet_id === location.id)

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
        getDirections: location.getDirections,
        averageRating: avg?.average_rating ?? null,
        comments: toiletComments
      }

      selectedToilet.value = enrichedToilet
      selectedLocation.value = null
    } catch (e) {
      console.error(' Failed to load toilet data:', e)
    }
  } else {
    selectedLocation.value = {
      ...location,
      getDirections: location.getDirections
    }
    selectedToilet.value = null
    searchQuery.value = ''
  }
}

// ----------------------
// Close Dialogs
// ----------------------
function closeDialog() {
  selectedLocation.value = null
  selectedToilet.value = null
}

// ----------------------
// Filters updated
// ----------------------
function handleFilterChange(filters) {
  selectedFilters.value = filters
}

// ----------------------
// Search input updated
// ----------------------
function handleSearchUpdate(query) {
  searchQuery.value = query
}

// ----------------------
// Search suggestion clicked
// ----------------------
function handleSearchSelected(location) {
  selectedLocation.value = {
    ...location,
    zoomTo: true
  }
}
</script>

<template>
  <div class="swim-page">
    <div class="map-container">
      <!--  MAP -->
      <SwimMap
        :filters="selectedFilters"
        :searchQuery="searchQuery"
        :zoomTarget="selectedLocation?.zoomTo ? selectedLocation : null"
        @marker-clicked="handleMarkerClicked"
      />

      <!-- 🎛 Sidebar -->
      <div class="floating-sidebar">
        <FilterSidebar
          :results="searchResults"
          @update:filters="handleFilterChange"
          @update:search="handleSearchUpdate"
          @search-selected="handleSearchSelected"
        />
      </div>

      <!--  Beach/River Info -->
      
      <InfoDialog
  v-if="selectedLocation && selectedLocation.type !== 'toilet' && !selectedLocation.zoomTo"
  :location="selectedLocation"
  @close="closeDialog"
  @open-planner="() => openPlanner(selectedLocation)"
/>


      <!--  Planner Dialog (prefilled) -->
      <Planner
        v-if="showPlanner"
        :initialPlaceType="plannerPlaceType"
        :initialPlaceId="plannerPlaceId"
        @close="showPlanner = false"
      />

      <!--  Toilet Info -->
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
  top: 0; 
  left: 0;
  width: 400px;
  height: 100vh; 
  background: rgb(255, 255, 255);
  padding: 16px;
  padding-top: 96px; 
  border-radius: 0 8px 8px 0;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

/* Scrollbar */
.floating-sidebar::-webkit-scrollbar {
  width: 6px;
}

.floating-sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.floating-sidebar::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}

.floating-sidebar::-webkit-scrollbar-thumb:hover {
  background: #888;
}

@media (max-width: 768px) {
  .floating-sidebar {
    position: fixed;
    top: 0;
    height: 100vh;
    padding-top: 86px;
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
