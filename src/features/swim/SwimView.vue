<script setup>
import { GoogleMap } from 'vue3-google-map'

const apiKey = 'YOUR_API_KEY_HERE' // Replace with your working API key
const center = { lat: -37.8136, lng: 144.9631 } // Melbourne
</script>

<template>
  <div class="map-wrapper">
    <GoogleMap
      :api-key="apiKey"
      style="width: 100%; height: 100%"
      :center="center"
      :zoom="12"
    />
  </div>
</template>

<style scoped>
.map-wrapper {
  position: absolute;
  top: 70px; /* Leave space for the fixed navbar */
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100vh - 70px); /* Adjust height relative to navbar */
  z-index: 0;
}
</style>
