<script setup>
// Import background image and reusable button component
import bgImage from '@/assets/images/bg.png'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <!-- Hero section with background image -->
  <div
    class="hero-container text-white"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Semi-transparent overlay for readability -->
    <div class="overlay d-flex flex-column justify-content-center h-100">
      <div class="container text-center py-5">
        <!-- Headline -->
        <h1 class="display-4 fw-bold">Safer water choices, wherever you go</h1>
        <p class="lead mt-2">Tap, fountain, river or beach — one quick check.</p>

        <!-- Primary action button (not linked yet) -->
        <BaseButton
          label="Start safety check"
          variant="info"
          size="lg"
          class="mt-4"
        />

        <!-- Navigation buttons -->
        <div class="d-flex justify-content-center gap-4 mt-5 flex-wrap">
          <BaseButton to="/swim" label="Swim" size="lg" />
          <BaseButton to="/knowb4go" label="KnowB4Go" size="lg" />
          <BaseButton to="/refill" label="Refill" size="lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hero container takes full viewport */
.hero-container {
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

/* Overlay darkens background for better text contrast */
.overlay {
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
  width: 100%;
}
</style>
