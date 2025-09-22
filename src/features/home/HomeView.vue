<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import Planner from './components/Planer.vue'

import videoSrc from '@/assets/video/background_video.mp4'

const showDialog = ref(false)
const router = useRouter()

const goToSwimMap = () => router.push('/swim')
const goToLearn = () => router.push('/learn') // ✅ NEW
</script>

<template>
  <div class="container-fluid p-0 home-view">
    <!-- 🗓️ Planner -->
    <BaseButton label="Planner" @click="showDialog = true" />
    <Planner v-if="showDialog" @close="showDialog = false" />

    <!-- 🏖️ Hero Section -->
    <section class="hero d-flex align-items-center text-center">
      <div class="container">
        <div class="hero-content">
          <h1 class="display-2 fw-bold text-hero-title">Safe Water</h1>
          <p class="lead mb-4 text-hero-subtitle">
            Plan, check, and enjoy the clean water
          </p>
        </div>

        <!-- Hero CTA -->
        <BaseButton
          label="Explore Water Map"
          variant="primary"
          size="xl"
          class="hero-button"
          @click="goToSwimMap"
        />
      </div>
    </section>

    <!-- 📊 Did You Know Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <!-- Text Block -->
          <div class="col-md-8">
            <h2 class="fw-bold mb-3 text-dark">Did you know?</h2>
            <p class="fs-5 text-secondary">
              Nearly <strong>one-third</strong> of monitored Australian rivers show algal blooms
              triggered by excess nitrogen and phosphorus.
            </p>
          </div>
          <!-- Icon -->
          <div class="col-md-4 text-md-end text-center mt-4 mt-md-0">
            <img src="@/assets/icons/water-ban.png" alt="No swim icon" class="img-fluid" style="max-width: 120px;" />
          </div>
        </div>
      </div>
    </section>

    <!-- ⚠️ Warning Section -->
    <section class="py-5 text-white text-center warning-banner">
      <div class="container">
        <h3 class="warning-title mb-1">
          Swimming without checking water quality could put your family’s health at risk.
        </h3>
        <p class="warning-subtitle mt-2">With The Mermaids you can</p>
      </div>
    </section>

    <!-- 📌 Feature Cards Section -->
    <section class="py-5 cards-section">
      <div class="container">
        <div class="row g-4">
          <!-- 🧠 Card 1 - Learn and Protect -->
          <div class="col-md-4">
            <div class="custom-card text-center">
              <div class="card-body">
                <h5 class="card-title fw-bold mb-4">Learn and Protect</h5>
                <div class="d-grid gap-3">
                  <BaseButton label="Water Metrics" variant="primary" @click="goToLearn" />
                  <BaseButton label="How we measure water quality" variant="primary" @click="goToLearn" />
                  <BaseButton label="How to protect yourself" variant="primary" @click="goToLearn" />
                  <BaseButton label="How does rainfall impact the water" variant="primary" @click="goToLearn" />
                </div>
              </div>
            </div>
          </div>

          <!-- 🏊‍♂️ Card 2 - Swim Safety -->
          <div class="col-md-4">
            <div class="custom-card text-center">
              <div class="card-body">
                <h5 class="card-title fw-bold mb-3">Real-Time Swim Safety</h5>
                <p class="card-text mb-4">
                  Interactive map showing real-time safety indicators for beaches and rivers.
                </p>
                <BaseButton label="View Map" variant="primary" @click="goToSwimMap" />
              </div>
            </div>
          </div>

          <!-- 🚻 Card 3 - Find Amenities -->
          <div class="col-md-4">
            <div class="custom-card text-center">
              <div class="card-body">
                <h5 class="card-title fw-bold mb-3">Find Amenities</h5>
                <p class="card-text mb-4">
                  Locate public toilets and water fountains with recent cleanliness reports.
                </p>
                <BaseButton label="View Map" variant="primary" @click="goToSwimMap" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 🌍 Page Background */
.home-view {
  background-color: #FFFFE7;
}

/* 🏖️ Hero Section */
.hero {
  background: url('@/assets/images/hero-background.png') center center/cover no-repeat;
  height: 100vh;
  color: #ffffff;
}

.hero-content {
  margin-top: -60px;
}

.text-hero-title {
  font-size: 8.5rem;
  color: #504c4c;
}

.text-hero-subtitle {
  color: #504c4c;
  font-size: 3.3rem;
}

/* 🎯 Hero Button */
.hero-button {
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.75rem 2.5rem;
  border-radius: 999px;
  background-color: hsl(191, 74%, 62%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.hero-button:hover {
  background-color: #1a9fa1;
  transform: scale(1.05);
}

/* ⚠️ Warning Banner */
.warning-banner {
  background: linear-gradient(90deg, #5fd5c1 0%, #5ac1b0 100%);
  color: white;
}

.warning-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

.warning-subtitle {
  font-size: 2rem;
  font-weight: 700;
}

/* 📄 Light background override */
.bg-light {
  background-color: #FFFFE7 !important;
}

/* 🧾 Cards Section */
.cards-section {
  background-color: #FFFFE7;
}

.custom-card {
  background-color: #5fd5c1;
  border-radius: 20px;
  padding: 2rem;
  height: 100%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border: none;
  transition: transform 0.3s ease;
}

.custom-card:hover {
  transform: translateY(-4px);
}

.btn-rounded-outline {
  background-color: #5fd5c1;
  border: 2px solid #264653;
  color: #264653;
  border-radius: 999px;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-rounded-outline:hover {
  background-color: #a6ecff;
  border-color: #264653;
  color: #1b2f38;
  transform: scale(1.05);
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .text-hero-title {
    font-size: 2.8rem;
  }

  .text-hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-button {
    font-size: 1rem;
    padding: 0.6rem 2rem;
  }

  .hero-content {
    margin-top: -20px;
  }

  .warning-title {
    font-size: 1.2rem;
  }

  .warning-subtitle {
    font-size: 1.1rem;
  }
}
</style>
