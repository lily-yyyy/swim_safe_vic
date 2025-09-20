<!-- src/features/swim/SwimView.vue -->
<script setup>
import { ref, computed } from 'vue'

// Components
import SwimMap from './components/SwimMap.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import InfoDialog from '@/components/ui/InfoDialog.vue'

// Data
import { getAllBeaches } from '@/api/webapi/beach_api'
import { getAllRivers } from '@/api/webapi/river_api'

// State
const selectedLocation = ref(null)
const selectedFilters = ref({})
const searchQuery = ref('')
const allLocations = ref([]) // beaches + rivers

// Load data
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

// 🔍 Live filtered search results for suggestions
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  return allLocations.value.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 🧭 Marker clicked on map
function handleMarkerClicked(location) {
  selectedLocation.value = location
  searchQuery.value = '' // optional: clear after selection
}

// ❌ Info dialog close
function closeDialog() {
  selectedLocation.value = null
}

// 🎯 Filters updated
function handleFilterChange(filters) {
  selectedFilters.value = filters
}

// 🔍 Search input updated
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
</script>

<template>
  <div class="swim-page">
    <div class="map-container">
      <!-- 🗺️ Map -->
      <SwimMap
        :filters="selectedFilters"
        :searchQuery="searchQuery"
        :zoomTarget="selectedLocation?.zoomTo ? selectedLocation : null"
        @marker-clicked="handleMarkerClicked"
      />

      <!-- 🧭 Sidebar -->
      <div class="floating-sidebar">
        <FilterSidebar
          :results="searchResults"
          @update:filters="handleFilterChange"
          @update:search="handleSearchUpdate"
          @search-selected="handleSearchSelected"
        />
      </div>

      <!-- ℹ️ Info popup -->
      <InfoDialog
        v-if="selectedLocation && !selectedLocation.zoomTo"
        :location="selectedLocation"
        @close="closeDialog"
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
