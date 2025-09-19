<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import NavBar from '@/components/ui/NavBar.vue'
import Planner from '@/features/home/components/Planer.vue'

// Controls planner dialog visibility
const showCalendar = ref(false)

// Forces re-render to reset state
const plannerKey = ref(0)

// Called when "Planner" button is clicked
function openCalendar() {
  showCalendar.value = true
  plannerKey.value++ // 🔁 Force remount
}

// Called when Planner emits "close"
function closeCalendar() {
  showCalendar.value = false
}
</script>

<template>
  <!-- Navbar -->
  <NavBar @open-planner="openCalendar" />

  <!-- Router View -->
  <router-view />

  <!-- Planner Dialog (only one!) -->
  <Planner
    v-if="showCalendar"
    :key="plannerKey"
    @close="closeCalendar"
  />
</template>

<style>
main.view-wrapper {
  min-height: 100vh;
  padding-top: 70px; /* navbar height */
}

nav.navbar {
  z-index: 9999 !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
</style>
