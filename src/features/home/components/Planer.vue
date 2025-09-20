<template>
  <CalendarDialog
    v-if="showDialog"
    :selected-date="selectedDate"
    :selected-time="selectedTime"
    :place-type="placeType"
    :places="places"
    :selected-place-id="placeId"
    :show-email-input="!userId"
    :user-email="userEmail"
    @update:date="val => selectedDate = val"
    @update:time="val => selectedTime = val"
    @update:place-type="val => placeType = val"
    @update:place-id="val => placeId = val"
    @update:email="handleEmailInput"
    @submit="submitForm"
    @close="handleClose"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// UI + API
import CalendarDialog from '@/components/ui/CalendarDialog.vue'
import { getAllBeaches } from '@/api/webapi/beach_api'
import { getAllRivers } from '@/api/webapi/river_api'
import { createNotification } from '@/api/webapi/notification_api'
import { searchUserByEmail, createUser } from '@/api/webapi/user_api'

// 🔁 Show/Hide calendar
const showDialog = ref(true)

// ⏰ User selections
const selectedDate = ref('')
const selectedTime = ref('')
const placeType = ref('beach')
const placeId = ref('')
const places = ref([])

// 📧 User identity
const userEmail = ref(localStorage.getItem('user_email') || '')
const userId = ref(localStorage.getItem('user_id') || '')

// ----------------------
// Fetch Beach or River
// ----------------------
async function fetchPlaces() {
  try {
    const data = placeType.value === 'beach' ? await getAllBeaches() : await getAllRivers()
    places.value = data.map(item => ({
      id: item.beach_id || item.river_id,
      name: item.name
    }))
  } catch (err) {
    console.error('❌ Failed to fetch places:', err)
  }
}

// 📌 On component load
onMounted(fetchPlaces)

// 🔁 Watch place type change
watch(placeType, async () => {
  placeId.value = ''
  await fetchPlaces()
})

// 🧠 Handle Email from child
function handleEmailInput(val) {
  userEmail.value = val.trim().toLowerCase()
}

// 🔐 Validate email format
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

// ❌ Close dialog
function handleClose() {
  showDialog.value = false
}

// ✅ Submit logic
async function submitForm() {
  if (!selectedDate.value || !selectedTime.value || !placeId.value) {
    alert('Please complete all fields')
    return
  }

  // 1. If no user yet, validate and find/create
  if (!userId.value) {
    if (!validateEmail(userEmail.value)) {
      alert('Please enter a valid email.')
      return
    }

    try {
      const existingUser = await searchUserByEmail(userEmail.value)

      if (existingUser && existingUser.user_id) {
        userId.value = existingUser.user_id
      } else {
        const newUser = await createUser(userEmail.value)
        userId.value = newUser?.data?.user_id
      }

      // Store user for future reuse
      localStorage.setItem('user_email', userEmail.value)
      localStorage.setItem('user_id', userId.value)
    } catch (err) {
      console.error('❌ User fetch/create failed:', err)
      alert('Error verifying user. Please try again.')
      return
    }
  }

  // 2. Create Notification
  const payload = {
    user_id: parseInt(userId.value),
    booking_datetime: `${selectedDate.value}T${selectedTime.value}`,
    place_type: placeType.value,
    place_id: parseInt(placeId.value),
    is_email_sent: false
  }

  console.log('📦 Notification Payload:', payload)

  try {
    await createNotification(payload)
    alert('Visit planned successfully!')
    handleClose()
  } catch (error) {
    console.error('❌ Submission Error:', error)
    alert('Failed to submit booking.')
  }
}
</script>
