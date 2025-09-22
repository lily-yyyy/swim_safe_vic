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
            <p class="lead">Discover how water quality affects your health and the environment.</p>
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
          <ParameterCard icon="ph_drop.svg" title="pH" subtitle="Safe: ∈ 3–5.0" description="Too contges in strivay, galy dgg" />
          <ParameterCard icon="turbidity.svg" title="Turbidity" subtitle="Cloudness:" description="law DO  Teb kills high DOt bubble disease" />
          <ParameterCard icon="salinity.svg" title="Salinity" subtitle="Too salty" description="tou Salty☹ ; bubbde1 disease" />
          <ParameterCard icon="dissolved_oxygen.svg" title="Dissolved Oxygen" subtitle="Low DO" description="heat stress, cold shock" />
          <ParameterCard icon="phosphorus.svg" title="Phosphorus" subtitle="Drives elgal Slooms" description="rashes, f’un deaths" />
          <ParameterCard icon="enterococci.svg" title="Enterococci" subtitle="Focal indicator" description="infection risk" />
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
          <ProtectCard icon="before_swim.svg" title="Before" line1="Wait 1–2 days after etin" line2="Check signs & flags." />
          <ProtectCard icon="during_swim_no_drop.svg" title="During" line1="Don’t Swellow water" line2="Avoid draes & river mouths" />
          <ProtectCard icon="after_swim_shower.svg" title="After" line1="Shower wash hands" line2="Tell an adult it" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 🔗 Scroll to Parameters
const parameterSection = ref(null)

const scrollToParameters = () => {
  parameterSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 🖼 Hero image
const heroImage = new URL('@/assets/images/education_1.png', import.meta.url).href

// 🧩 Components
import ParameterCard from './components/ ParameterCard.vue'
import RainIcon from './components/RainIcon.vue'
import ProtectCard from './components/ProtectCard.vue'
</script>
