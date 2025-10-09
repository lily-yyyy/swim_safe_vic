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

    <!-- Parameters Section -->
    <section class="py-5" ref="parameterSection">
      <div class="container">
        <h2 class="text-center fw-bold mb-2">Key Water Quality Parameters</h2>
        <p class="text-center text-muted mb-4">
          Swipe through cards and hover/click to learn more
        </p>

        <!-- Mode Toggle -->
        <div class="text-center mb-4">
          <div class="btn-group" role="group">
            <button
              @click="toggleMode('simple')"
              :class="['btn', 'btn-lg', mode === 'simple' ? 'btn-info text-white' : 'btn-outline-info']"
            >
            Easy explanations for everyone
            </button>
            <button
              @click="toggleMode('professional')"
              :class="['btn', 'btn-lg', mode === 'professional' ? 'btn-info text-white' : 'btn-outline-info']"
            >
            Detailed scientific information
            </button>
          </div>
        </div>

        <Swiper
          :modules="modules"
          :effect="'coverflow'"
          :grab-cursor="true"
          :centered-slides="true"
          :slides-per-view="'auto'"
          :coverflow-effect="{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }"
          :pagination="{ clickable: true }"
          :navigation="true"
          class="parameter-swiper"
        >
          <SwiperSlide v-for="(param, index) in allParameters" :key="index">
            <div
              class="parameter-flip-card"
              @mouseenter="handleMouseEnter(param.title)"
              @mouseleave="handleMouseLeave(param.title)"
              @click="handleClick(param.title)"
              :class="{ 'is-flipped': isActive(param.title) }"
            >
              <!-- Front Side - Icon View -->
              <div class="flip-card-front">
                <div class="icon-container">
                  <img
                    :src="param.icon"
                    :alt="param.title"
                    class="parameter-icon"
                  />
                  <h4 class="icon-title">{{ param.title }}</h4>
                  <p class="icon-hint">Hover or tap to learn more</p>
                </div>
              </div>

              <!-- Back Side - Information View -->
              <div class="flip-card-back">
                <div class="parameter-info-card">
                  <!-- Header -->
                  <div class="info-header">
                    <h3 class="info-title">{{ param.title }}</h3>
                    <p class="safe-range">Safe Range: {{ param.safeRange }}</p>
                  </div>

                  <!-- Definition Section -->
                  <div class="info-section definition-section">
                    <div class="section-title"> DEFINITION</div>
                    <p class="section-content">
                      {{ mode === 'simple' ? param.definitionSimple : param.definitionPro }}
                    </p>
                  </div>

                  <!-- Human Impact Section -->
                  <div class="info-section human-section">
                    <div class="section-title"> HUMAN IMPACT</div>
                    <p class="section-content">
                      {{ mode === 'simple' ? param.humanImpactSimple : param.humanImpactPro }}
                    </p>
                  </div>

                  <!-- Aquatic Impact Section -->
                  <div class="info-section aquatic-section">
                    <div class="section-title"> AQUATIC LIFE IMPACT</div>
                    <p class="section-content">
                      {{ mode === 'simple' ? param.aquaticImpactSimple : param.aquaticImpactPro }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>

    <!-- Water quality index Section-->
     <section class="py-5 text-center bg-white">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">Water Quality Index (WQI)</h2>
        
        <!-- Labels -->
        <div class="d-flex justify-content-center flex-wrap gap-4 mb-4">
          <RainIcon icon="excellent.png" label="Excellent (80-100): Safe to swim" />
          <RainIcon icon="good.png" label="Good (70-79): Usually safe" />
          <RainIcon icon="moderate.png" label="Moderate (50-69): Be careful" />
          <RainIcon icon="poor.png" label="Poor (30-49): Avoid swimming" />
          <RainIcon icon="verypoor.png" label="Very Poor (0-29): Stay out!" />
        </div>

        <!-- Description -->
        <p class="text-gray-700 text-lg mb-4">
          Our beaches show real-time <span class="font-semibold text-blue-600">Water Quality Index</span> in the app!
        </p>
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
const mode = ref('simple')
const activeParam = ref(null)
const hoveredParam = ref(null)

// Scroll to parameter cards on button click
const scrollToParameters = () => {
  parameterSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleMouseEnter = (title) => {
  hoveredParam.value = title
}

const handleMouseLeave = (title) => {
  hoveredParam.value = null
}

const handleClick = (title) => {
  // Toggle on click for mobile devices
  activeParam.value = activeParam.value === title ? null : title
}

const isActive = (title) => {
  // Show info if either hovered (desktop) or clicked (mobile)
  return hoveredParam.value === title || activeParam.value === title
}

const toggleMode = (newMode) => {
  mode.value = newMode
}

// Components
import ParameterCard from './components/ ParameterCard.vue'
import RainIcon from './components/RainIcon.vue'
import ProtectCard from './components/ProtectCard.vue'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'

// Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Import water index icons
import pHIcon from '@/assets/water_icons/pH.png'
import turbidityIcon from '@/assets/water_icons/Turbidity.png'
import salinityIcon from '@/assets/water_icons/Salinity.png'
import dissolvedOxygenIcon from '@/assets/water_icons/DissolvedOxygen.png'
import phosphorusIcon from '@/assets/water_icons/TotalPhosphorus.png'
import enterococciIcon from '@/assets/water_icons/Enterococci.png'

// Swiper modules
const modules = [EffectCoverflow, Pagination, Navigation]

// Parameters data with enhanced content
const allParameters = [
  {
    title: 'pH',
    icon: pHIcon,
    safeRange: '6.5 – 8.5',
    definitionSimple: 'pH measures if water is acidic (sour like lemon) or basic (bitter like soap). Safe water should be neutral, like pure water.',
    definitionPro: 'pH is a logarithmic scale measuring hydrogen ion concentration (H⁺) in water, indicating acidity or alkalinity. The scale ranges from 0-14, with 7 being neutral.',
    humanImpactSimple: 'Water that is too acidic or too basic can irritate your skin, eyes, and stomach. It can also affect how safe the water is to drink.',
    humanImpactPro: 'pH levels outside 6.5-8.5 can cause dermatological irritation, mucous membrane inflammation, and gastrointestinal discomfort. Extreme pH affects the solubility of heavy metals, increasing toxicity risk.',
    aquaticImpactSimple: 'Fish and water plants need the right pH to stay healthy. Wrong pH levels can hurt their skin and gills, making it hard to breathe.',
    aquaticImpactPro: 'pH imbalance disrupts osmoregulation in aquatic organisms, damages gill epithelium, and affects enzyme function. pH < 5 or > 9 causes acute stress responses and mortality in sensitive species.'
  },
  {
    title: 'Turbidity',
    icon: turbidityIcon,
    safeRange: '< 5 NTU',
    definitionSimple: 'Turbidity measures how cloudy or murky the water is. Clear water has low turbidity, while muddy water has high turbidity.',
    definitionPro: 'Turbidity quantifies suspended particulate matter in water using nephelometric measurements (NTU). It indicates the degree to which light is scattered by suspended solids.',
    humanImpactSimple: 'Cloudy water can hide harmful germs and bacteria. It makes it harder to clean water properly and can cause stomach problems if you drink it.',
    humanImpactPro: 'Elevated turbidity harbors pathogenic microorganisms, reduces disinfection efficacy by shielding bacteria, and serves as a vector for chemical contaminants. Associated with increased gastrointestinal illness rates.',
    aquaticImpactSimple: 'Murky water blocks sunlight that plants need to grow. It also clogs fish gills, making it hard for them to breathe, and covers fish eggs so they can\'t hatch.',
    aquaticImpactPro: 'High turbidity reduces photosynthetic capacity in phytoplankton and macrophytes, limiting primary productivity. Suspended particles cause gill abrasion, respiratory stress, and reduced egg fertilization/hatching success in fish populations.'
  },
  {
    title: 'Salinity',
    icon: salinityIcon,
    safeRange: '< 500 ppm (freshwater)',
    definitionSimple: 'Salinity measures how much salt is in the water. Ocean water has high salinity, while river and lake water should have low salinity.',
    definitionPro: 'Salinity measures total dissolved salts (primarily NaCl) expressed in parts per million (ppm) or practical salinity units (PSU). Indicates water ionic composition and conductivity.',
    humanImpactSimple: 'Too much salt in drinking water can raise your blood pressure and cause dehydration. It also makes water taste bad and can damage pipes.',
    humanImpactPro: 'Chronic exposure to elevated salinity (>500 ppm) contributes to hypertension, cardiovascular strain, and electrolyte imbalance. High salinity accelerates infrastructure corrosion and affects agricultural irrigation suitability.',
    aquaticImpactSimple: 'Freshwater fish can\'t survive in salty water because it pulls water out of their bodies. Plants that need fresh water will die if there\'s too much salt.',
    aquaticImpactPro: 'Salinity changes disrupt osmotic balance in freshwater organisms lacking osmoregulatory adaptations. Results in cellular dehydration, metabolic stress, and community composition shifts favoring euryhaline species.'
  },
  {
    title: 'Dissolved Oxygen',
    icon: dissolvedOxygenIcon,
    safeRange: '> 5 mg/L',
    definitionSimple: 'Dissolved oxygen (DO) is the amount of oxygen mixed into water. Fish and other water creatures breathe this oxygen to stay alive.',
    definitionPro: 'Dissolved oxygen (DO) quantifies molecular oxygen (O₂) present in water, measured in milligrams per liter (mg/L) or percent saturation. Critical for aerobic respiration in aquatic biota.',
    humanImpactSimple: 'While we don\'t breathe water oxygen, low DO means water is polluted. This pollution can make water unsafe to swim in or drink.',
    humanImpactPro: 'Low DO indicates organic pollution, eutrophication, or thermal stress. Indirectly affects human health through compromised water quality, increased pathogen survival, and production of toxic anaerobic metabolites.',
    aquaticImpactSimple: 'Fish need oxygen in water like we need oxygen in air. When DO drops below 5 mg/L, fish struggle to breathe and can die. It kills the smallest creatures first.',
    aquaticImpactPro: 'DO < 5 mg/L causes hypoxic stress, reducing growth rates and reproductive success. DO < 2 mg/L creates hypoxic "dead zones" causing mass mortality. Affects benthic macroinvertebrates first, cascading through food webs.'
  },
  {
    title: 'Phosphorus',
    icon: phosphorusIcon,
    safeRange: '< 0.025 mg/L',
    definitionSimple: 'Phosphorus is a nutrient that comes from fertilizers and detergents. A little bit is good, but too much causes problems.',
    definitionPro: 'Phosphorus (P) is a limiting macronutrient in aquatic ecosystems, measured as total phosphorus (TP) or orthophosphate (PO₄³⁻). Primary driver of eutrophication in freshwater systems.',
    humanImpactSimple: 'Too much phosphorus causes toxic algae blooms. These algae can produce poisons that make you sick if you swim in or drink the water. The water also smells bad.',
    humanImpactPro: 'Phosphorus-driven eutrophication leads to harmful algal blooms (HABs) producing hepatotoxins and neurotoxins (e.g., microcystin). Causes dermatotoxicity, hepatotoxicity, and respiratory irritation in exposed populations.',
    aquaticImpactSimple: 'Excess phosphorus makes too much algae grow. When algae die, they use up all the oxygen, suffocating fish and other animals. It destroys whole underwater ecosystems.',
    aquaticImpactPro: 'Elevated phosphorus (>0.025 mg/L) triggers algal blooms that deplete DO upon decomposition, creating hypoxic/anoxic conditions. Alters species composition, eliminates sensitive taxa, and causes trophic cascade disruptions.'
  },
  {
    title: 'Enterococci',
    icon: enterococciIcon,
    safeRange: '< 35 CFU/100mL (swimming)',
    definitionSimple: 'Enterococci are bacteria found in the poop of humans and animals. They tell us if water has been contaminated by sewage.',
    definitionPro: 'Enterococci are fecal indicator bacteria (FIB) measured in colony-forming units per 100mL (CFU/100mL). Strong correlation with gastrointestinal illness risk in recreational waters.',
    humanImpactSimple: 'Swimming in water with high enterococci can make you sick with diarrhea, vomiting, skin rashes, and ear infections. Don\'t swim if bacteria levels are high!',
    humanImpactPro: 'Enterococci levels >35 CFU/100mL correlate with significantly elevated gastrointestinal illness (GI) risk (>8 cases per 1000 swimmers). Associated with skin infections, otitis externa, and respiratory illness in immunocompromised individuals.',
    aquaticImpactSimple: 'High bacteria levels mean sewage pollution. While the bacteria themselves don\'t harm fish, the pollution that comes with them (like chemicals and low oxygen) does.',
    aquaticImpactPro: 'Enterococci serve as indicators of fecal contamination and associated pathogens. The pollution sources (sewage, agricultural runoff) introduce nutrients, pharmaceuticals, and endocrine disruptors that affect aquatic organism reproduction and development.'
  }
]
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  padding: 2rem 0;
}

.hero-section img {
  max-height: 500px;
  object-fit: cover;
}

/* Override Bootstrap hover behavior for mode buttons */
.btn-outline-info:hover,
.btn-outline-info:focus {
  color: white !important;  /* keep text white */
}

/* Swiper Container */
.parameter-swiper {
  padding: 3rem 0;
  width: 100%;
  min-height: 700px;
}

.parameter-swiper :deep(.swiper-slide) {
  width: 400px;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Flip Card Container */
.parameter-flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  cursor: pointer;
}

/* Flip Card Front and Back */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.6s ease-in-out;
  border-radius: 1.25rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.flip-card-front {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotateY(0deg);
}

.flip-card-back {
  background: white;
  transform: rotateY(180deg);
  overflow-y: auto;
}

/* Flipped State */
.parameter-flip-card.is-flipped .flip-card-front {
  transform: rotateY(-180deg);
}

.parameter-flip-card.is-flipped .flip-card-back {
  transform: rotateY(0deg);
}

/* Icon View (Front) */
.icon-container {
  text-align: center;
  padding: 2rem;
}

.parameter-icon {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.parameter-flip-card:hover .parameter-icon {
  transform: scale(1.05);
}

.icon-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #17a2b8;
  margin-bottom: 0.5rem;
}

.icon-hint {
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 1rem;
}

/* Information View (Back) */
.parameter-info-card {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.info-header {
  text-align: center;
  border-bottom: 3px solid #17a2b8;
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
}

.info-title {
  color: #17a2b8;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.safe-range {
  color: #6c757d;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
}

/* Info Sections */
/* .info-section {
  padding: 0.875rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
}

.section-title {
  font-weight: bold;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.section-content {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #333;
} */

/* Definition Section */
.definition-section .section-title {
  color: #17a2b8;
}

/* Human Impact Section */
.human-section .section-title {
  color: #ff9800;
}

/* Aquatic Impact Section */
.aquatic-section .section-title {
  color: #4caf50;
}

/* Swiper Navigation Customization */
.parameter-swiper :deep(.swiper-button-next),
.parameter-swiper :deep(.swiper-button-prev) {
  color: #17a2b8;
  font-weight: bold;
}

.parameter-swiper :deep(.swiper-button-next):hover,
.parameter-swiper :deep(.swiper-button-prev):hover {
  color: #138496;
}

.parameter-swiper :deep(.swiper-pagination-bullet) {
  background-color: #6c757d;
}

.parameter-swiper :deep(.swiper-pagination-bullet-active) {
  background-color: #17a2b8;
  width: 30px;
  border-radius: 5px;
}

/* Responsive */
@media (max-width: 768px) {
  .parameter-swiper {
    min-height: 650px;
  }

  .parameter-swiper :deep(.swiper-slide) {
    width: 340px;
    height: 520px;
  }

  .parameter-icon {
    width: 140px;
    height: 140px;
  }

  .icon-title {
    font-size: 1.5rem;
  }

  .parameter-info-card {
    padding: 1.25rem;
  }

  .info-title {
    font-size: 1.35rem;
  }

  .section-content {
    font-size: 0.8rem;
  }
}

/* Scrollbar for info card */
.parameter-info-card::-webkit-scrollbar {
  width: 6px;
}

.parameter-info-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.parameter-info-card::-webkit-scrollbar-thumb {
  background: #17a2b8;
  border-radius: 10px;
}

.parameter-info-card::-webkit-scrollbar-thumb:hover {
  background: #138496;
}
</style>