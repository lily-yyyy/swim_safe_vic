<template>
  <main class="fullscreen-view bg-light">
    <div ref="mapRef" class="map-container"></div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const mapRef = ref(null)

onMounted(() => {
  // Wait until the Google Maps script is ready
  if (window.google && window.google.maps) {
    initMap()
  } else {
    window.initMap = initMap
  }
})

function initMap() {
  const map = new window.google.maps.Map(mapRef.value, {
    center: { lat: -37.8136, lng: 144.9631 }, // 🟢 Melbourne CBD as example
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
  })

  // Optional: Add a marker
  new window.google.maps.Marker({
    position: { lat: -37.8136, lng: 144.9631 },
    map,
    title: 'Swimming Spot - Melbourne CBD',
  })
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: calc(100vh - 70px); /* Full screen minus navbar */
}
</style>
