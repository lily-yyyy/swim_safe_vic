<script setup>
import { ref, onMounted } from "vue"
import { GoogleMap } from "vue3-google-map"


const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID

const center = ref({ lat: -38.0, lng: 145.0 })
let autocomplete

const searchInput = ref(null)

onMounted(() => {
  if (window.google && searchInput.value) {
    autocomplete = new window.google.maps.places.Autocomplete(searchInput.value, {
      fields: ["geometry", "name"],
    })
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        center.value = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
      }
    })
  }
})
</script>

<template>
  <section style="margin-top:16px">

    <!-- Search Bar -->
    <div>
      <input
        ref="searchInput"
        type="text"
        class="form-control"
        placeholder="Search for a location..."
      />
    </div>

    <!-- Google Map -->
    <GoogleMap
      :api-key="apiKey"
      :map-id="mapId"
      :libraries="['places']"
      version="weekly"
      style="width: 100%; height: 700px"
      :center="center"
      :zoom="15"
    />
  </section>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>