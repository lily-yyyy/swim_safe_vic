<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark fixed-top px-4"
    :class="{ 'bg-overlay': route.path === '/swim', 'bg-transparent': route.path !== '/swim' }"
  >
    <div class="container-fluid justify-content-between">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/vue.svg" alt="Logo" width="30" height="30" class="me-2" />
        <span>Mermaid</span>
      </router-link>

      <div>
        <router-link to="/" class="nav-link d-inline text-white mx-2">Home</router-link>
        <router-link to="/swim" class="nav-link d-inline text-white mx-2">Swim</router-link>
        <router-link to="/refill" class="nav-link d-inline text-white mx-2">Refill</router-link>
        <router-link to="/knowb4go" class="nav-link d-inline text-white mx-2">KnowB4Go</router-link>

        <button class="btn btn-outline-warning ms-3" @click="$emit('open-planner')">
          Planner
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
defineEmits(['open-planner'])
const route = useRoute()
</script>

<style scoped>
.navbar {
  z-index: 99999;
}

.nav-link {
  color: white !important;
  font-weight: 500;
  text-decoration: none;
}

/* Home / Refill / KnowB4Go */
.bg-transparent {
  background-color: transparent !important;
}

/* Swim page (map) navbar overlay */
.bg-overlay {
  background-color: rgba(15, 32, 39, 0.85); 
  backdrop-filter: blur(8px);
}
</style>
