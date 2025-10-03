<template>
  <div class="info-dialog shadow rounded p-4 bg-white">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <!-- Name + Status badge -->
        <h5 class="title mb-1">
          {{ location.name }}
          <span class="badge ms-2" :class="statusBadgeClass">
            {{ location.status }}
          </span>
        </h5>

        <!-- Today -->
        <p class="text-muted small mb-1">{{ today }}</p>

        <!-- Swim Advisory -->
        <p class="swim-advice fw-semibold" :class="canSwimClass">
          {{ swimAdvice }}
        </p>

        <!-- Last Tested (optional) -->
        <p v-if="location.lastTested" class="text-muted small mb-2">
          Last Tested: {{ location.lastTested }}
        </p>
      </div>

      <!-- Close -->
      <button class="btn-close" @click="$emit('close')" aria-label="Close"></button>
    </div>

    <!-- Temperature (optional) -->
    <div v-if="location.temperature !== undefined" class="mb-3 text-primary fw-bold">
      {{ location.temperature }}°C
    </div>

    <hr />

    <!-- Description -->
    <p v-if="location.description" class="tip-detail small text-muted">
      {{ location.description }}
    </p>

    <!-- Optional metadata -->
    <div
      v-if="location.distance || location.time"
      class="d-flex justify-content-between mt-3 mb-2 text-muted small"
    >
      <span v-if="location.distance">{{ location.distance }}</span>
      <span v-if="location.time">{{ location.time }}</span>
    </div>

    <!-- Actions -->
    <div class="mt-3">
      <!-- Directions -->
      <button
        class="btn btn-teal w-100 mb-2"
        @click="handleDirections"
      >
        <span class="me-1">📍</span> Directions
      </button>

      <!-- Planner -->
      <button
        class="btn btn-teal w-100"
        @click="$emit('open-planner')"
      >
        <span class="me-1">🗓️</span> Planner
      </button>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useToday } from '@/utils/useToday'

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'open-planner'])

// Today’s formatted date via composable
const today = useToday()

// Badge color by status
const statusBadgeClass = computed(() => {
  const s = props.location.status?.toLowerCase()
  if (s === 'surveillance') return 'bg-success text-white'
  if (s === 'alert') return 'bg-warning text-dark'
  if (s === 'action') return 'bg-danger text-white'
  return 'bg-secondary text-white'
})

// Swim message by status
const swimAdvice = computed(() => {
  const s = props.location.status?.toLowerCase()
  if (s === 'surveillance') return 'You can swim today'
  if (s === 'alert') return 'Swim with caution'
  if (s === 'action') return 'Do not swim today'
  return ''
})

// Swim message color by status
const canSwimClass = computed(() => {
  const s = props.location.status?.toLowerCase()
  if (s === 'surveillance') return 'text-success'
  if (s === 'alert') return 'text-warning'
  if (s === 'action') return 'text-danger'
  return 'text-muted'
})

// Directions with Google Maps

//old method for in map direction
// function handleDirections() { props.location.getDirections?.() }

//Redirection google map direction
function handleDirections() {
  if (props.location.lat && props.location.lon) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${props.location.lat},${props.location.lon}&destination_place_id=${props.location.id || ''}`
    window.open(url, '_blank')  // open in new tab
  } else {
    alert('No coordinates available for this location.')
  }
}

function openPlanner() {
  // Let parent open Planner dialog with this location
  emit('open-planner', props.location)
}
</script>


<style scoped>
.info-dialog {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 320px;
  max-width: 90%;
  z-index: 1000;
  border: 1px solid #ddd;
  background-color: #fff;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
}

.swim-advice {
  font-size: 0.95rem;
  margin-bottom: 6px;
}

.tip-detail {
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Teal action buttons to match your Directions style */
.btn-teal {
  background: #007b7f;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-teal:hover {
  background: #006c70;
  color: #fff;
}
</style>
