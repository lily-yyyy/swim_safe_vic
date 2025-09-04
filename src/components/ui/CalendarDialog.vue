<template>
  <!-- Fullscreen Backdrop -->
  <div class="calendar-dialog-backdrop" @click="handleBackdropClick">
    
    <!-- Modal Dialog -->
    <div class="calendar-dialog shadow bg-white rounded" @click.stop>
      
      <!-- Header -->
      <div class="dialog-header d-flex justify-content-between align-items-start">
        <div class="dialog-title">
          <h5>Plan Your Next Visit to a Beach/River</h5>
          <p class="text-muted small">
            Please select one or more dates you'd like to visit. You’ll receive alerts about water quality the day before.
          </p>
        </div>
        <button class="btn-close" @click="$emit('close')" title="Close"></button>
      </div>

      <!-- Body -->
      <div class="dialog-body">
        <!-- Date Picker -->
        <label for="date-picker" class="form-label fw-semibold">Select a date</label>
        <input
          id="date-picker"
          type="date"
          class="form-control"
          v-model="selectedDate"
          :min="minDate"
          @change="addDate"
        />

        <!-- Selected Dates List -->
        <div v-if="dates.length" class="selected-dates mt-4">
          <h6 class="fw-semibold">Selected Dates</h6>
          <ul class="list-group mt-2">
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

        <!-- Empty State -->
        <div v-else class="mt-4 text-muted small">
          No dates selected yet.
        </div>
      </div>

      <!-- Footer -->
      <div class="dialog-footer d-flex justify-content-end mt-4">
        <button
          class="btn btn-primary px-4"
          @click="submitDates"
          :disabled="!dates.length"
        >
          Submit
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Emits the 'close' event to parent
const emit = defineEmits(['close'])

const selectedDate = ref('')
const dates = ref([])

// Prevent selecting past dates
const minDate = new Date().toISOString().split('T')[0]

// Add date to list if unique
function addDate() {
  const value = selectedDate.value
  if (value && !dates.value.includes(value)) {
    dates.value.push(value)
  }
  selectedDate.value = ''
}

// Remove a specific date
function removeDate(index) {
  dates.value.splice(index, 1)
}

// Format date for display
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Submit and close dialog
function submitDates() {
  alert('Dates submitted successfully!')
  emit('close')
}

// Click outside dialog closes it
function handleBackdropClick() {
  emit('close')
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
  padding: 16px;
}

.calendar-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  padding: 24px;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.dialog-header {
  margin-bottom: 20px;
}

.dialog-title h5 {
  margin-bottom: 6px;
  font-weight: 600;
}

.dialog-title p {
  margin: 0;
}

input[type='date'] {
  font-size: 1rem;
  padding: 10px 12px;
}

.selected-dates h6 {
  margin-bottom: 6px;
}

.list-group-item {
  font-size: 0.95rem;
  padding: 10px 12px;
}

.dialog-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}
</style>
