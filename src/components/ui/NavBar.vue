<template>
  <nav
    class="navbar navbar-expand-lg fixed-top px-4 custom-navbar"
    :class="{
      'bg-overlay': route.path === '/swim',
      'bg-turquoise': route.path !== '/swim'
    }"
  >
    <div class="container-fluid justify-content-between align-items-center">
      
      <!-- Left: Logo -->
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/vue.svg" alt="Logo" width="30" height="30" class="me-2" />
        <span class="text-white fw-semibold">The Mermaid</span>
      </router-link>

      <!-- Toggle button (for small screens) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapsible Nav Links -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav gap-lg-5 gap-3 text-center">
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/swim">Water Map</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link text-white" to="/about">About</router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link text-white" to="/learn">Learn With Us</router-link>
          </li>
        </ul>
      </div>

      <!-- Right: Planner Button (ONLY on /home page) -->
      <button
        v-if="route.path === '/'"
        class="btn btn-outline-warning ms-3 d-none d-lg-block"
        @click="$emit('open-planner')"
      >
        Planner
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
defineEmits(['open-planner'])
const route = useRoute()
</script>

<style scoped>
/* Navbar background styles */
.bg-overlay {
  background: linear-gradient(90deg, #5fd5c1 0%, #5ac1b0 100%) !important;
  backdrop-filter: blur(8px);
}

.bg-turquoise {
  background: linear-gradient(90deg, #5fd5c1 0%, #5ac1b0 100%) !important;
}

/* General navbar styling */
.custom-navbar {
  z-index: 10000;
  transition: background-color 0.3s ease;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Nav links */
.nav-link {
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
}

/* Planner button */
.btn-outline-warning {
  color: white;
  border-color: white;
}

.btn-outline-warning:hover {
  background-color: white;
  color: #5ac1b0;
}

/* Optional: Change toggler icon background color */
.navbar-toggler {
  border-color: white;
}
.navbar-toggler-icon {
  filter: brightness(0) invert(1); /* makes icon white */
}
</style>
