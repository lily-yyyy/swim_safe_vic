<template>
  <div class="bg-light">
    <!-- Hero Section -->
    <section
      class="py-5 text-center text-dark"
      style="background: linear-gradient(to bottom, #d0f4f4 0%, white 100%)"
    >
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 mb-4 mb-md-0">
            <h1 class="fw-bold display-5">Learn With Us</h1>
            <p class="lead">
              Discover how water quality affects your health and the environment.
            </p>
            <button
              class="btn btn-info text-white px-4 py-2 rounded-pill mt-3"
              @click="scrollToParameters"
            >
              Explore Parameters
            </button>
          </div>
          <div class="col-md-6 d-none d-md-block">
            <img :src="heroImage" alt="Kids studying water" class="img-fluid" />
          </div>
        </div>
      </div>
    </section>

    <!-- Water Quality Cards -->
    <section class="py-5" ref="parameterSection">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">Key Water Quality Parameters</h2>
        <div class="row g-4">
          <ParameterCard
            icon="ph_drop.svg"
            title="pH"
            subtitle="Safe range: 6.5 – 8.5"
            description="If the water is too acidic or basic, it can harm fish and irritate your skin and eyes."
          />
          <ParameterCard
            icon="turbidity.svg"
            title="Turbidity"
            subtitle="Measures cloudiness"
            description="Cloudy water can mean pollution. It blocks sunlight and can carry germs that make you sick."
          />
          <ParameterCard
            icon="salinity.svg"
            title="Salinity"
            subtitle="Salt level in water"
            description="Too much salt can hurt plants and animals. Safe levels help protect freshwater life."
          />
          <ParameterCard
            icon="dissolved_oxygen.svg"
            title="Dissolved Oxygen"
            subtitle="Oxygen for aquatic life"
            description="Fish and other animals need oxygen in water to survive. Low levels can lead to fish kills."
          />
          <ParameterCard
            icon="phosphorus.svg"
            title="Phosphorus"
            subtitle="Nutrient pollution"
            description="Too much phosphorus causes algae blooms, which can make water unsafe and smelly."
          />
          <ParameterCard
            icon="enterococci.svg"
            title="Enterococci"
            subtitle="Bacteria from poo"
            description="High levels mean the water may have feces, which can spread illness. Don’t swim if levels are high."
          />
        </div>
      </div>
    </section>

    <!-- Rain Impact Section -->
    <section class="py-5 bg-white">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">Rain Impact on Water</h2>
        <div class="d-flex justify-content-center flex-wrap gap-4 mb-4">
          <RainIcon icon="before_rain_sun.svg" label="Before Rain" />
          <RainIcon icon="rain_cloud.svg" label="Rain" />
          <RainIcon icon="warning_0_2_days.svg" label="0–2 Days" />
          <RainIcon icon="recovery_leaf.svg" label="3–14 Days" />
        </div>

        <div class="text-center fw-semibold mb-3">How to protect yourself</div>
        <div class="row g-4">
          <ProtectCard
            icon="before_swim.svg"
            title="Before"
            line1="Wait 1–2 days after heavy rain"
            line2="Check local water safety signs"
          />
          <ProtectCard
            icon="during_swim_no_drop.svg"
            title="During"
            line1="Avoid swallowing water"
            line2="Stay away from drains and river mouths"
          />
          <ProtectCard
            icon="after_swim_shower.svg"
            title="After"
            line1="Take a shower after swimming"
            line2="Wash hands before eating"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Hero image
const heroImage = new URL('@/assets/images/education_1.png', import.meta.url).href

// Refs
const parameterSection = ref(null)

// Scroll to parameter cards on button click
const scrollToParameters = () => {
  parameterSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Components

import ParameterCard from './components/ ParameterCard.vue' 
import RainIcon from './components/RainIcon.vue' 
import ProtectCard from './components/ProtectCard.vue'
</script>
