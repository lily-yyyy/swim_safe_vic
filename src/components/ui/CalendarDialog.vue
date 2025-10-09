<template>
  <div
    class="calendar-dialog-backdrop"
    data-testid="calendar-backdrop"
    @click="handleBackdropClick"
  >
    <div class="calendar-dialog shadow bg-white rounded" @click.stop>
      <!-- Header -->
      <div class="dialog-header d-flex justify-content-between align-items-start">
        <div class="dialog-title">
          <h5>Plan Your Visit</h5>
          <p class="text-muted small">
            Select your preferred date, time and place to get water safety alerts before visiting.
          </p>
        </div>
        <button class="btn-close" @click="$emit('close')" title="Close"></button>
      </div>

      <!-- Body -->
      <div class="dialog-body">
        <!-- Email Input -->
        <div v-if="showEmailInput">
          <label for="email" class="form-label fw-semibold">Email</label>
          <input
            id="email"
            type="email"
            class="form-control mb-3"
            :value="userEmail"
            placeholder="Enter your email"
            @input="$emit('update:email', $event.target.value)"
            required
          />
        </div>

        <!-- Date -->
        <label for="date" class="form-label fw-semibold">Date</label>
        <input
          id="date"
          type="date"
          class="form-control mb-3"
          :value="selectedDate"
          :min="minDate"
          @input="$emit('update:date', $event.target.value)"
        />

        <!-- Time -->
        <label for="time" class="form-label fw-semibold">Time</label>
        <input
          id="time"
          type="time"
          class="form-control mb-3"
          :value="selectedTime"
          @input="$emit('update:time', $event.target.value)"
        />

        <!-- Place Type -->
        <label for="place-type" class="form-label fw-semibold">Place Type</label>
        <select
          id="place-type"
          class="form-select mb-3"
          :value="placeType"
          @change="$emit('update:place-type', $event.target.value)"
        >
          <option disabled value="">Select Type</option>
          <option value="beach">Beach</option>
          <option value="river">River</option>
        </select>

        <!-- Location -->
        <label for="location" class="form-label fw-semibold">Location</label>
        <select
          id="location"
          class="form-select mb-3"
          :value="selectedPlaceId"
          :disabled="!places.length"
          @change="$emit('update:place-id', $event.target.value)"
        >
          <option disabled value="">Select Location</option>
          <option v-for="place in places" :key="place.id" :value="place.id">
            {{ place.name }}
          </option>
        </select>
      </div>

      <!-- Footer -->
      <div class="dialog-footer d-flex justify-content-end mt-4">
        <button
          class="btn btn-primary px-4"
          :disabled="!isFormValid"
          @click="$emit('submit')"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'

// -------------------
// Props from parent
// -------------------
const props = defineProps({
  selectedDate: String,
  selectedTime: String,
  placeType: String,
  selectedPlaceId: [String, Number],
  userEmail: String,
  places: {
    type: Array,
    default: () => []
  },
  showEmailInput: {
    type: Boolean,
    default: true
  }
})

// Emits back to parent
const emit = defineEmits([
  'update:date',
  'update:time',
  'update:place-type',
  'update:place-id',
  'update:email',
  'submit',
  'close'
])

// ⏰ Minimum selectable date = today
const minDate = new Date().toISOString().split('T')[0]

// ✅ Form validation
const isFormValid = computed(() => {
  const hasDate = props.selectedDate
  const hasTime = props.selectedTime
  const hasPlace = props.placeType && props.selectedPlaceId
  const hasEmail = !props.showEmailInput || (props.userEmail && validateEmail(props.userEmail))

  return hasDate && hasTime && hasPlace && hasEmail
})

// 📧 Email format validator
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

//  Handle click outside to close
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
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 90vh;
}

.dialog-header {
  margin-bottom: 20px;
}

.dialog-title h5 {
  margin-bottom: 6px;
  font-weight: 600;
}

.dialog-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}
</style>
