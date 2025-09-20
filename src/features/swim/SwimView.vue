<script setup>
import { ref } from 'vue'

// Components
import SwimMap from './components/SwimMap.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import InfoDialog from '@/components/ui/InfoDialog.vue'

const selectedLocation = ref(null)
const selectedFilters = ref({})

function handleMarkerClicked(location) {
  selectedLocation.value = location
}

function closeDialog() {
  selectedLocation.value = null
}

function handleFilterChange(filters) {
  selectedFilters.value = filters
}
</script>

<template>
  <div class="swim-page">
    <div class="map-container">
      <!-- 🗺️ Map -->
      <SwimMap
        :filters="selectedFilters"
        @marker-clicked="handleMarkerClicked"
      />

      <!-- 🧭 Floating filter sidebar -->
      <div class="floating-sidebar">
        <FilterSidebar @update:filters="handleFilterChange" />
      </div>

      <!-- 📍 Info dialog for selected marker -->
      <InfoDialog
        v-if="selectedLocation"
        :location="selectedLocation"
        @close="closeDialog"
      />
    </div>
  </div>
</template>

<style scoped>
/* Make map container full height minus navbar */
.swim-page {
  position: fixed;
  top: 0; /* Navbar height */
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

/* Fullscreen map behind floating panels */
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Floating sidebar overlay */
.floating-sidebar {
  position: absolute;
  top: 80px;
  left: 0; /* ❗ Flush with left */
  width: 320px;
  background: white;
  padding: 16px;
  border-radius: 0 8px 8px 0; /* round right corners only */
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* === Mobile Styles === */
@media (max-width: 768px) {
  .floating-sidebar {
    position: fixed;
    top: 70px;
    left: 0;
    height: calc(100vh - 70px);
    transform: translateX(-100%); /* hidden by default */
    border-radius: 0;
    width: 80%;
    max-width: 300px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  }

  .floating-sidebar.open {
    transform: translateX(0); /* slide in */
  }

  .sidebar-toggle {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1100;
    background-color: #5fd5c1;
    color: white;
    padding: 10px 14px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
