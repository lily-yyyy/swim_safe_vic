<!-- src/App.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/ui/NavBar.vue'
import Planner from '@/features/home/components/Planer.vue'
import PasswordApp from './components/ui/security/PasswordApp.vue'

// Controls planner dialog visibility
const showCalendar = ref(false)
const plannerKey = ref(0) // For remounting planner

// Track site access
const isAuthenticated = ref(false)

// On mount: check if already authenticated
onMounted(() => {
  isAuthenticated.value = localStorage.getItem('site_authenticated') === 'true'
})

// Triggered when password is correct
function handleAuthSuccess() {
  isAuthenticated.value = true
}

// Open planner (from NavBar)
function openCalendar() {
  showCalendar.value = true
  plannerKey.value++ // remount planner to reset state
}

// Close planner (from child)
function closeCalendar() {
  showCalendar.value = false
}
</script>

<template>
  <!-- Step 1: Require Password Gate -->
  <div v-if="!isAuthenticated">
    <PasswordApp @authenticated="handleAuthSuccess" />
  </div>

  <!-- Step 2: Show app if authenticated -->
  <div v-else>
    <!-- Navbar -->
    <NavBar @open-planner="openCalendar" />

    <!-- Router View -->
    <router-view />

    <!-- Planner Dialog -->
    <Planner
      v-if="showCalendar"
      :key="plannerKey"
      @close="closeCalendar"
    />
  </div>
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
