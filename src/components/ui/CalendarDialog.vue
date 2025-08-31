<template>
  <div class="calendar-dialog-backdrop">
    <div class="calendar-dialog shadow p-4 bg-white rounded">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="mb-1">Plan Your Beach Visit</h5>
          <p class="text-muted small mb-2">
            Please select a date or multiple dates you'd like to visit a beach.
            You’ll receive alerts about water quality the day before.
          </p>
        </div>
        <button class="btn-close" @click="$emit('close')" title="Close"></button>
      </div>

      <!-- Date Picker Input -->
      <input
        type="date"
        class="form-control"
        v-model="selectedDate"
        @change="addDate"
      />

      <!-- Selected Dates List -->
      <div v-if="dates.length" class="mt-4">
        <h6>Selected Dates</h6>
        <ul class="list-group small">
          <li
            v-for="(date, index) in dates"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            {{ formatDate(date) }}
            <button
              class="btn btn-sm btn-outline-danger"
              @click="removeDate(index)"
            >
              Remove
            </button>
          </li>
        </ul>
      </div>

      <div v-else class="mt-4 text-muted small">
        No dates selected yet.
      </div>

      <!-- Submit Button -->
      <div class="d-flex justify-content-end mt-4">
        <button class="btn btn-primary px-4" @click="submitDates" :disabled="!dates.length">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedDate = ref('')
const dates = ref([])

function addDate() {
  const value = selectedDate.value
  if (value && !dates.value.includes(value)) {
    dates.value.push(value)
  }
  selectedDate.value = ''
}

function removeDate(index) {
  dates.value.splice(index, 1)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function submitDates() {
  console.log('Submitted Dates:', dates.value)
  alert('Dates submitted successfully!')
}
</script>

<style scoped>
.calendar-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.calendar-dialog {
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #ccc;
}
</style>
