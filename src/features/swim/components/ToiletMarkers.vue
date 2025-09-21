<script setup>
import { onMounted, ref } from 'vue'
import { Marker } from 'vue3-google-map'
import { getToilets } from '@/api/webapi/toilet_api'

const emit = defineEmits(['marker-clicked'])
const toilets = ref([])

onMounted(async () => {
  try {
    const data = await getToilets()
    toilets.value = data.map(t => ({
      ...t,
      icon: new URL('@/assets/icons/toilet1.png', import.meta.url).href
    }))
  } catch (err) {
    console.error('Failed to load toilets:', err)
  }
})

function handleClick(toilet) {
  emit('marker-clicked', {
    ...toilet,
    type: 'toilet',
    name: toilet.place_name || 'Public Toilet',
    description: 'Public toilet facility'
  })
}
</script>

<template>
  <Marker
    v-for="toilet in toilets"
    :key="toilet.id"
    :options="{
      position: { lat: toilet.lat, lng: toilet.lon },
      title: toilet.place_name || 'Toilet',
      icon: {
        url: toilet.icon,
        scaledSize: { width: 30, height: 30 }
      }
    }"
    @click="handleClick(toilet)"
  />
</template>
