<!-- src/components/HeroBanner.vue -->

<script setup>
// Import image from assets
import bgImage from '@/assets/images/bg.png'
</script>

<template>
  <!-- Hero Wrapper with Background -->
  <div
    class="hero-container text-white"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Dark Overlay -->
    <div class="overlay d-flex flex-column justify-content-between h-100">
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark px-4 pt-3">
        <div class="container-fluid justify-content-between">
          <a class="navbar-brand d-flex align-items-center" href="#">
            <img src="@/assets/vue.svg" alt="Logo" width="30" height="30" class="me-2" />
            <span>Name of App</span>
          </a>
          <div>
            <router-link to="/" class="nav-link d-inline text-white mx-3">Home</router-link>
            <router-link to="/swim" class="nav-link d-inline text-white mx-3">Swim</router-link>
            <router-link to="/refill" class="nav-link d-inline text-white mx-3">Refill</router-link>
            <router-link to="/knowb4go" class="nav-link d-inline text-white mx-3">KnowB4Go</router-link>
            <button class="btn btn-success ms-3">Login</button>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="container text-center my-auto py-5">
        <h1 class="display-4 fw-bold">Safer water choices, wherever you go</h1>
        <p class="lead mt-2">Tap, fountain, river or beach — one quick check.</p>
        <button class="btn btn-info btn-lg mt-4">Start safety check</button>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-center gap-3 mt-5 flex-wrap">
          <router-link to="/swim" class="btn btn-outline-light px-4">Swim</router-link>
          <router-link to="/knowb4go" class="btn btn-outline-light px-4">KnowB4Go</router-link>
          <router-link to="/refill" class="btn btn-outline-light px-4">Refill</router-link>
        </div>
      </div>

      <!-- Spacer at bottom if needed -->
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.6); /* dark overlay */
  height: 100%;
  width: 100%;
}

.nav-link {
  color: white !important;
  font-weight: 500;
  text-decoration: none;
}

.btn-outline-light {
  border-radius: 12px;
  min-width: 120px;
}
</style>
