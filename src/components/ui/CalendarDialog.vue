<template>
  <div class="calendar-dialog shadow p-4 bg-white rounded">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Select Dates</h5>
      <button class="btn-close" @click="$emit('close')"></button>
    </div>

    <input
      type="date"
      class="form-control"
      v-model="selectedDate"
      @change="addDate"
    />

    <div v-if="dates.length" class="mt-4">
      <h6>Selected Dates:</h6>
      <ul class="list-group small">
        <li
          v-for="(date, index) in dates"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ date }}
          <button class="btn btn-sm btn-outline-danger" @click="removeDate(index)">
            Remove
          </button>
        </li>
      </ul>
    </div>

    <div v-else class="mt-4 text-muted small">
      No dates selected yet.
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
</script>

<style scoped>
.calendar-dialog {
  position: absolute;
  top: 100px;
  right: 20px;
  width: 360px;
  max-width: 90%;
  z-index: 1000;
  border: 1px solid #ccc;
}
</style>
