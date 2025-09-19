<!-- src/features/home/components/Planner.vue -->
<template>
  <CalendarDialog
    v-if="showDialog"
    :selected-date="selectedDate"
    :selected-time="selectedTime"
    :place-type="placeType"
    :places="places"
    :selected-place-id="placeId"
    @update:date="val => selectedDate = val"
    @update:time="val => selectedTime = val"
    @update:place-type="val => placeType = val"
    @update:place-id="val => placeId = val"
    @submit="submitForm"
    @close="emit('close')"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import CalendarDialog from '@/components/ui/CalendarDialog.vue'
import { getAllBeaches } from '@/api/webapi/beach_api'
import { getAllRivers } from '@/api/webapi/river_api'
import { createNotification } from '@/api/webapi/notification_api'

// Emit close event to parent (App.vue)
const emit = defineEmits(['close'])

// State variables
const showDialog = ref(true)
const selectedDate = ref('')
const selectedTime = ref('')
const placeType = ref('beach')
const placeId = ref('')
const places = ref([])

// On mount, fetch places
onMounted(() => {
  fetchPlaces()
})

// Refetch if type changes
watch(placeType, async () => {
  placeId.value = ''
  await fetchPlaces()
})

// Load beaches or rivers
async function fetchPlaces() {
  try {
    const data =
      placeType.value === 'beach'
        ? await getAllBeaches()
        : await getAllRivers()

    // Normalize IDs
    places.value = data.map(item => ({
      id: item.beach_id || item.river_id,
      name: item.name
    }))
  } catch (err) {
    console.error(' Failed to fetch places:', err)
  }
}

// Submit form
async function submitForm() {
  if (!selectedDate.value || !selectedTime.value || !placeId.value) {
    alert('Please complete all fields')
    return
  }

  const payload = {
    user_id: 2,
    booking_datetime: `${selectedDate.value}T${selectedTime.value}`,
    place_type: placeType.value,
    place_id: parseInt(placeId.value),
    is_email_sent: false
  }

  console.log(' Notification payload:', payload)

  try {
    await createNotification(payload)
    alert(' Visit planned successfully!')
    emit('close') //  Notify App.vue to close dialog
  } catch (err) {
    console.error(' Error submitting:', err)
    alert('Something went wrong.')
  }
}
</script>
