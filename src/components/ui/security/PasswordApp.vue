<template>
  <div class="password-gate d-flex flex-column align-items-center justify-content-center vh-100">
    <h4 class="mb-3">🔒 Protected Access</h4>
    <input
      v-model="input"
      type="password"
      placeholder="Enter access password"
      class="form-control mb-2"
      @keyup.enter="checkPassword"
    />
    <button class="btn btn-primary" @click="checkPassword">Unlock</button>
    <p v-if="error" class="text-danger mt-2">Incorrect password. Try again.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const correctPassword = 'm123'

const input = ref('')
const error = ref(false)

const emit = defineEmits(['authenticated'])

function checkPassword() {
  if (input.value === correctPassword) {
    localStorage.setItem('site_authenticated', 'true')
    emit('authenticated')
  } else {
    error.value = true
  }
}
</script>

<style scoped>
.password-gate {
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 2rem;
}
</style>
