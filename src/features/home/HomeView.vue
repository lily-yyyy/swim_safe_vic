<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import Planner from './components/Planer.vue'

import videoSrc from '@/assets/video/background_video.mp4'
// import videoSrc from '@/assets/video/bgv.mov'

const showDialog = ref(false)
const videoLoaded = ref(false)
const router = useRouter()

const goToSwimMap = () => router.push('/swim')
const goToLearn = () => router.push('/learn')

const handleVideoLoad = () => {
  videoLoaded.value = true
}

const scrollToNextSection = () => {
  const nextSection = document.querySelector('.py-5.bg-light')
  nextSection?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="container-fluid p-0 home-view">
    <!-- Planner -->
    <BaseButton label="Planner" @click="showDialog = true" />
    <Planner v-if="showDialog" @close="showDialog = false" />
    
    <!-- Hero Section with Cards -->
    <section class="hero-section">
      <!-- Background video -->
      <video 
        class="hero-video" 
        :src="videoSrc" 
        aria-label="Background video of Melbourne waterways"
        @loadeddata="handleVideoLoad"
        autoplay 
        muted 
        loop 
        playsinline
      ></video>
      
      <div class="hero-overlay"></div>
      
      <div class="container hero-content-wrapper">
        <!-- Hero Title -->
        <div class="hero-content">
          <h1 class="display-2 fw-bold text-hero-title">
            MELBOURNE<br>CLEAN WATER
          </h1>
          <p class="lead mb-4 text-hero-subtitle">
            Plan, check, and enjoy the clean water with real-time water quality map
          </p>
        </div>

        <!-- 3 Step Cards in Hero -->
        <div class="hero-cards-container">
          <div class="row g-3 justify-content-center">
            <!-- Card 1 - Learn -->
            <div class="col-lg-4 col-md-6">
              <div class="hero-card">
              
                <div class="card-illustration">
                  <img src="@/assets/icons/card3.png" alt="Learn illustration" class="card-bg-image" />
                </div>
                <div class="card-content">
                  <h5 class="card-title">Step 1: Learn & Understand</h5>
                  <p class="card-description">
                    Discover how water quality affects the health
                  </p>
                  <button class="card-button" @click="goToLearn">
                    Key Water Quality Metrics
                  </button>
                  <button class="card-button" @click="goToLearn">
                    Rainfall impact
                  </button>
                </div>
              </div>
            </div>

            <!-- Card 2 - Check Quality -->
            <div class="col-lg-4 col-md-6">
              <div class="hero-card hero-card-primary">
                <div class="card-illustration">
                  <img src="@/assets/icons/card1.png" alt="Weather illustration" class="card-bg-image" />
                </div>
                <div class="card-content">
                  <h5 class="card-title">Step 2: Check Water Quality and Plan</h5>
                  <p class="card-description">
                    Real-time safety indicators for beaches & rivers. User our planner to get email notification of changed water quality.
                  </p>
                  <button class="card-button card-button-primary" @click="goToSwimMap">
                    Water Quality Map
                  </button>
                  <button class="card-button card-button-primary" @click="goToSwimMap">
                    Planner
                  </button>
                </div>
              </div>
            </div>

            <!-- Card 3 - Find Amenities -->
            <div class="col-lg-4 col-md-6">
              <div class="hero-card">
                <div class="card-illustration">
                  <img src="@/assets/icons/card2.png" alt="Swimmer illustration" class="card-bg-image" />
                </div>
                <div class="card-content">
                  <h5 class="card-title">Step 3: Find Free Amenities</h5>
                  <p class="card-description">
                    Locate free public toilets & water fountains. Provide rating to public toilet to report cleanliness.
                  </p>
                  <button class="card-button" @click="goToSwimMap">
                    Rate Public Toilets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Page Background */
.home-view {
  background-color: #FFFFE7;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 0 60px;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 110%;
  min-height: 110%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  object-fit: cover;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.01),
    rgba(0, 0, 0, 0.2)
  );
  z-index: 1;
}

/* Hero Content */
.hero-content-wrapper {
  position: relative;
  z-index: 2;
}

.hero-content {
  text-align: center;
  margin-bottom: 3rem;
  /* animation: fadeInDown 1s ease; */
}

.text-hero-title {
  font-size: 5rem;
  color: #ffffff;
  text-shadow: 3px 5px 10px rgba(0, 0, 0, 0.7);
  line-height: 1.1;
  margin-bottom: 1rem;
}

.text-hero-subtitle {
  color: #ffffff;
  font-size: 1.5rem;
  text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.6);
}

/* Hero Cards Container */
/* .hero-cards-container {
  animation: fadeInUp 1s ease 0.3s backwards;
} */

/* Hero Cards */
.hero-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  height: 100%;
  min-height: 320px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(95, 213, 193, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Card Illustration Container */
.card-illustration {
  position: relative;
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  z-index: 1;
}

.card-bg-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.hero-card:hover .card-bg-image {
  opacity: 1;
  transform: scale(1.05);
}

.hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #5fd5c1, #5ac1b0);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

/* .hero-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border-color: #5fd5c1;
} */

/* .hero-card:hover::before {
  transform: scaleX(1);
} */

.hero-card-primary {
  background: linear-gradient(135deg, rgba(95, 213, 193, 0.95), rgba(90, 193, 176, 0.95));
  border-color: rgba(255, 255, 255, 0.5);
}

.hero-card-primary .card-title,
.hero-card-primary .card-description {
  color: white;
}

.hero-card-primary .card-bg-image {
  opacity: 0.8;
  filter: brightness(1.1);
}

.hero-card-primary::before {
  background: white;
}

.step-badge {
  position: absolute;
  top: -15px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: #5fd5c1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.hero-card-primary .step-badge {
  background: white;
  color: #5fd5c1;
}

/* Card Content */
.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #264653;
  margin-bottom: 0.8rem;
}

.card-description {
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 1.5rem;
  min-height: 45px;
  font-weight: 500;
}

.card-button {
  margin-bottom: 0.5rem;
  background: #5fd5c1;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.7rem 1.8rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(95, 213, 193, 0.3);
}

.card-button:hover {
  background: #5ac1b0;
  box-shadow: 0 6px 15px rgba(95, 213, 193, 0.4);
}

.card-button-primary {
  background: white;
  color: #5fd5c1;
}

.card-button-primary:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Background Override */
.bg-light {
  background-color: #FFFFE7 !important;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .hero-section {
    padding: 60px 0 40px;
  }

  .text-hero-title {
    font-size: 3.5rem;
  }

  .text-hero-subtitle {
    font-size: 1.3rem;
  }

  .hero-cards-container {
    margin-top: 2rem;
  }

  .hero-card {
    min-height: 260px;
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 0 30px;
  }

  .text-hero-title {
    font-size: 2.5rem;
  }

  .text-hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-content {
    margin-bottom: 2rem;
  }

  .hero-card {
    min-height: 280px;
    padding: 1.5rem 1.2rem;
  }

  .card-illustration {
    height: 100px;
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .card-description {
    font-size: 0.85rem;
  }

  .scroll-hint {
    bottom: 15px;
  }

  .stat-circle {
    width: 150px;
    height: 150px;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .warning-title {
    font-size: 1.2rem;
  }

  .warning-subtitle {
    font-size: 1.5rem;
  }

  .trust-icon {
    font-size: 2rem;
  }

  .trust-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .text-hero-title {
    font-size: 2rem;
  }

  .text-hero-subtitle {
    font-size: 1rem;
  }

  .hero-card {
    min-height: auto;
  }

  .card-button {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>