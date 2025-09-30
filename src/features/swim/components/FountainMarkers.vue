<script setup>
import { onMounted, ref } from 'vue'
import { Marker } from 'vue3-google-map'
import { getFountains } from '@/api/webapi/fountain_api'

const emit = defineEmits(['marker-clicked'])
const fountains = ref([])

onMounted(async () => {
  
  try {
    const data = await getFountains()
    

    let iconPath
    try {
      iconPath = new URL('@/assets/icons/fountains.svg', import.meta.url).href
      console.log('🖼️ Fountain icon path resolved:', iconPath)
    } catch (e) {
      
      iconPath = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    }

    //  Validate and map
    fountains.value = data
      .filter(f => f.lat && f.lon) // Filter out invalid entries
      .map(f => {
        const lat = parseFloat(f.lat)
        const lon = parseFloat(f.lon)

        if (isNaN(lat) || isNaN(lon)) {
         
          return null
        }

        return {
          ...f,
          lat,
          lon,
          icon: iconPath
        }
      })
      .filter(f => f !== null) // Remove skipped

    
  } catch (err) {
    console.error(' Failed to load fountains:', err)
  }
})

function handleClick(fountain) {
  emit('marker-clicked', {
    ...fountain,
    type: 'fountain',
    description: fountain.place_name || 'Water fountain available.'
  })
}
</script>

<template>
  <Marker
    v-for="fountain in fountains"
    :key="fountain.id"
    :options="{
      position: { lat: fountain.lat, lng: fountain.lon },
      title: fountain.place_name || 'Water Fountain',
      icon: {
        url: fountain.icon,
        scaledSize: { width: 28, height: 28 }
      }
    }"
    @click="handleClick(fountain)"
  />
</template>
