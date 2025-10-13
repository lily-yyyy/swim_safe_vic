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
    @update:date="val => { selectedDate = val; enforceFutureTime(); }"
    @update:time="val => { selectedTime = val; enforceFutureTime(); }"
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

//  Props to receive preselected values from InfoDialog/SwimView
const props = defineProps({
  initialPlaceType: { type: String, default: 'beach' }, // "beach" | "river"
  initialPlaceId: { type: [String, Number], default: '' }
})

//  Tell parent when to unmount
const emit = defineEmits(['close'])

const showDialog = ref(true)

// User selections
const selectedDate = ref('')
const selectedTime = ref('')
const placeType = ref(props.initialPlaceType)   // prefill
const placeId = ref(props.initialPlaceId)       // prefill
const places = ref([])

// User identity
const userEmail = ref(localStorage.getItem('user_email') || '')
const userId = ref(localStorage.getItem('user_id') || '')

/* ---------------------------
   Helpers: robust parsing
----------------------------*/
// Parse date that might be "YYYY-MM-DD" or "dd/MM/yyyy"
function parseDateString(dateStr) {
  if (!dateStr) return null
  // Native <input type="date"> returns "YYYY-MM-DD"
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-').map(Number)
    if (!y || !m || !d) return null
    return { y, m, d }
  }
  // Some UIs show dd/MM/yyyy; if value comes through like that, handle it
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/').map(Number)
    if (!y || !m || !d) return null
    return { y, m, d }
  }
  return null
}

// Parse time that might be "HH:mm" or "hh:mm AM"
function parseTimeString(timeStr) {
  if (!timeStr) return null
  const ampmMatch = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i)
  if (ampmMatch) {
    let hh = Number(ampmMatch[1])
    const mm = Number(ampmMatch[2])
    const ampm = ampmMatch[3].toUpperCase()
    if (ampm === 'PM' && hh < 12) hh += 12
    if (ampm === 'AM' && hh === 12) hh = 0
    return { hh, mm }
  }
  const hm = timeStr.split(':').map(Number)
  if (hm.length >= 2) {
    const [hh, mm] = hm
    if (Number.isFinite(hh) && Number.isFinite(mm)) return { hh, mm }
  }
  return null
}

function buildLocalDate(dateStr, timeStr) {
  const dp = parseDateString(dateStr)
  const tp = parseTimeString(timeStr)
  if (!dp || !tp) return null
  // Local time (y, m-1, d, hh, mm)
  return new Date(dp.y, dp.m - 1, dp.d, tp.hh, tp.mm, 0, 0)
}

function isSameYMD(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

function formatTimeHHMM(date) {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function roundUpToNext5Min(date) {
  const d = new Date(date)
  const ms = 5 * 60 * 1000
  return new Date(Math.ceil(d.getTime() / ms) * ms)
}

/* --------------------------------
   Enforce: no past time for today
---------------------------------*/
function enforceFutureTime() {
  if (!selectedDate.value || !selectedTime.value) return
  const now = new Date()
  const chosen = buildLocalDate(selectedDate.value, selectedTime.value)
  if (!chosen) return

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const chosenDay = new Date(chosen.getFullYear(), chosen.getMonth(), chosen.getDate())

  // If date is before today, bump to today and time to next 5 minutes
  if (chosenDay < today) {
    alert('You cannot choose a past date. Moving to today.')
    const next = roundUpToNext5Min(now)
    selectedDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    selectedTime.value = formatTimeHHMM(next)
    return
  }

  // If date is today and time is in the past, bump time forward
  if (isSameYMD(chosen, now) && chosen < now) {
    const next = roundUpToNext5Min(now)
    alert('Selected time is in the past. Adjusted to the next available time.')
    selectedTime.value = formatTimeHHMM(next)
  }
}

// Auto-enforce when date/time changes (covers user interactions)
watch(selectedDate, enforceFutureTime)
watch(selectedTime, enforceFutureTime)

/* ----------------------
   Fetch Beach or River
-----------------------*/
async function fetchPlaces() {
  try {
    const data = placeType.value === 'beach' ? await getAllBeaches() : await getAllRivers()
    places.value = data.map(item => ({
      id: item.id ?? item.beach_id ?? item.river_id,
      name: item.name
    }))
    // Keep initial selection if provided
    if (props.initialPlaceId && !placeId.value) {
      placeId.value = props.initialPlaceId
    }
  } catch (err) {
    console.error(' Failed to fetch places:', err)
  }
}

onMounted(fetchPlaces)

watch(placeType, async () => {
  // If user changes type manually → reset selection and reload options
  placeId.value = ''
  await fetchPlaces()
})

function handleEmailInput(val) {
  userEmail.value = val.trim().toLowerCase()
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

function handleClose() {
  showDialog.value = false
  emit('close')
}

/* ---------------
   Submit logic
----------------*/
function isDateTimeValidForSubmit() {
  if (!selectedDate.value || !selectedTime.value) return false
  const chosen = buildLocalDate(selectedDate.value, selectedTime.value)
  if (!chosen) return false
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const chosenDay = new Date(chosen.getFullYear(), chosen.getMonth(), chosen.getDate())

  if (chosenDay < today) return false
  if (isSameYMD(chosen, now) && chosen < now) return false
  return true
}

async function submitForm() {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Please complete all fields')
    return
  }

  // Final guard
  if (!isDateTimeValidForSubmit()) {
    enforceFutureTime()
    alert('Please choose a date/time in the future.')
    return
  }

  // If user never touched dropdowns → fallback to initial values
  const finalPlaceType = placeType.value || props.initialPlaceType
  const finalPlaceId = placeId.value || props.initialPlaceId

  if (!finalPlaceId) {
    alert('No location selected')
    return
  }

  // Create user if needed
  if (!userId.value) {
    if (!validateEmail(userEmail.value)) {
      alert('Please enter a valid email.')
      return
    }
    
    try {

      // Search for existing user
      const existingUser = await searchUserByEmail(userEmail.value)
      
      if (existingUser && existingUser.user_id) {
        // User exists
        userId.value = existingUser.user_id
      } else {
        // User doesn't exist, create new one
        const newUserResponse = await createUser(userEmail.value)
        
        // Extract user data from the response structure
        const newUser = newUserResponse?.data
        
        if (!newUser || !newUser.user_id) {
          alert('Failed to create user account. Please try again.')
          return
        }
        userId.value = newUser.user_id
      }
      
      // Save to localStorage
      localStorage.setItem('user_email', userEmail.value)
      localStorage.setItem('user_id', userId.value)
      
    } catch (err) {
      alert('Error processing user information. Please try again.')
      return
    }
  } else {
    console.log('ℹ️ Using existing userId from state:', userId.value)
  }

  // Build payload
  const payload = {
    user_id: parseInt(userId.value),
    booking_datetime: `${selectedDate.value}T${selectedTime.value}:00`,
    place_type: finalPlaceType,
    place_id: parseInt(finalPlaceId),
    is_email_sent: false
  }

  try {
    await createNotification(payload)
    alert('Visit planned successfully!')
    handleClose()
  } catch (error) {
    alert('Failed to submit booking.')
  }
}
</script>
