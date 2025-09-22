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
    <div class="d-flex justify-content-between mt-3">
      <!-- <button class="btn btn-outline-secondary btn-sm px-3">
        Save
      </button> -->
      <button
        class="btn btn-primary btn-sm px-3"
        @click="location.getDirections?.()"
      >
        Directions
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
</style>
