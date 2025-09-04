<script setup>
import { ref } from 'vue'

// Import the SwimMap component 
import SwimMap from './components/SwimMap.vue'

// Import a dialog component 
import InfoDialog from '@/components/ui/InfoDialog.vue'

// Reactive variable to store the location selected by clicking on a map marker
const selectedLocation = ref(null)

/**
 * Callback function triggered when a marker is clicked on the map.
 * It receives the location object and sets it as the selectedLocation.
 */
function handleMarkerClicked(location) {
  selectedLocation.value = location
}

/**
 * Closes the info dialog by clearing the selected location.
 * This is triggered when the user closes the InfoDialog.
 */
function closeDialog() {
  selectedLocation.value = null
}
</script>

<template>
  <!-- Map component: emits "marker-clicked" event when a marker is selected -->
  <SwimMap @marker-clicked="handleMarkerClicked" />

  <!-- InfoDialog: shown only when a location is selected -->
  <InfoDialog
    v-if="selectedLocation"
    :location="selectedLocation"
    @close="closeDialog"
  />
</template>
