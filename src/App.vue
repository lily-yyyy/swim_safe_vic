<script setup>
import { ref } from 'vue'
import CalendarDialog from '@/components/ui/CalendarDialog.vue'
import NavBar from '@/components/ui/NavBar.vue'

// Controls calendar dialog visibility
const showCalendar = ref(false)

// Open planner dialog (triggered by NavBar)
function openCalendar() {
  showCalendar.value = true
}

// Close dialog handler (called when child emits 'close')
function closeCalendar() {
  showCalendar.value = false
}
</script>

<template>
  <!-- Navbar with planner button -->
  <NavBar @open-planner="openCalendar" />

  <!-- Route views -->
  <router-view />

  <!-- Calendar dialog -->
  <CalendarDialog v-if="showCalendar" @close="closeCalendar" />
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
