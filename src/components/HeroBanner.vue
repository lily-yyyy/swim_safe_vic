<script setup>
import bgImage from '@/assets/images/bg.png'
</script>

<template>
  <div
    class="hero-container text-white"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="overlay d-flex flex-column justify-content-center h-100">
      <div class="container text-center py-5">
        <h1 class="display-4 fw-bold">Safer water choices, wherever you go</h1>
        <p class="lead mt-2">Tap, fountain, river or beach — one quick check.</p>
        <button class="btn btn-info btn-lg mt-4">Start safety check</button>

        <div class="d-flex justify-content-center gap-3 mt-5 flex-wrap">
          <router-link to="/swim" class="btn btn-outline-light px-4">Swim</router-link>
          <router-link to="/knowb4go" class="btn btn-outline-light px-4">KnowB4Go</router-link>
          <router-link to="/refill" class="btn btn-outline-light px-4">Refill</router-link>
        </div>
      </div>
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
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
  width: 100%;
}

.btn-outline-light {
  border-radius: 12px;
  min-width: 120px;
}
</style>
