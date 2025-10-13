<!-- src/features/swim/components/FilterSidebar.vue -->
<script setup>
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['update:filters', 'update:search', 'search-selected', 'result-clicked'])

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  }
})

// Mobile sidebar toggle
const isMobileOpen = ref(false)

// Filters
const filters = reactive({
  showOnMap: 'all',
  waterQuality: null,
  distance: null, 
  amenities: [],
  toiletAccessibility: null,
})

// Search query
const searchQuery = ref('')

// Emit search input
watch(searchQuery, () => {
  emit('update:search', searchQuery.value)
})

// Emit filters when updated
watch(filters, () => {
  emit('update:filters', { ...filters })
}, { deep: true })

function setFilter(group, value) {
  filters[group] = filters[group] === value ? null : value
}

function toggleAmenity(value) {
  const index = filters.amenities.indexOf(value)
  if (index === -1) filters.amenities.push(value)
  else filters.amenities.splice(index, 1)
}

// Select suggestion from dropdown
function selectSuggestion(item) {
  emit('search-selected', item)
  searchQuery.value = item.name
  // Close mobile sidebar after selection
  isMobileOpen.value = false
}

// Reset all filters + search
function resetFilters() {
  filters.showOnMap = 'all'
  filters.waterQuality = null
  filters.distance = null
  filters.amenities = []
  filters.toiletAccessibility = null
  searchQuery.value = ''
}

function toggleMobileSidebar() {
  isMobileOpen.value = !isMobileOpen.value
}

// Select result from the list
function selectResult(item) {
  emit('result-clicked', item)
  // Close mobile sidebar after selection
  isMobileOpen.value = false
}

</script>

<template>
  <div>
    <!-- Mobile Toggle Button -->
    <button 
      class="mobile-toggle-btn d-lg-none" 
      @click="toggleMobileSidebar"
      :class="{ open: isMobileOpen }"
    >
      <span v-if="!isMobileOpen">☰ Filters & Search</span>
      <span v-else>✕ Close</span>
    </button>

    <!-- Backdrop for mobile -->
    <div 
      v-if="isMobileOpen" 
      class="mobile-backdrop d-lg-none"
      @click="isMobileOpen = false"
    ></div>

    <!-- Sidebar -->
    <div 
      class="filter-sidebar"  
      :class="{ 'mobile-open': isMobileOpen }"
      style="background: linear-gradient(to bottom, #d0f4f4 0%, white 100%)"
    >
      <h2 class="text-center fw-bold mb-2">Water Quality Map</h2>

      <div class="instruction-banner">
        <p class="intro-text text-center mb-3">
          Check real-time water quality, get directions, add to planner for alerts, and rate public toilets.
        </p>
        <h6 class="instruction-title">How to Use</h6>
        <ol class="instruction-steps">
          <li>Type and search for a beach or river</li>
          <li>Apply filters to narrow results</li>
          <li>Filter amenities</li>
          <li>Click on map markers for water quality</li>
        </ol>
      </div>

      <!-- Search -->
      <div class="search-container">
        <img src="@/assets/icons/search.svg" class="search-icon" />
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="Search beach, river location"
        />

        <!-- Search Suggestions -->
        <ul v-if="searchQuery && props.results.length" class="search-suggestions">
          <li
            v-for="(item, index) in props.results"
            :key="index"
            @click="selectSuggestion(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <!-- Filters -->
      <h5>Filters</h5>

      <!-- Show on Map -->
      <section>
        <label>Show on Map</label>
        <div class="btn-group">
          <button class="btn" :class="{ active: filters.showOnMap === 'all' }" @click="setFilter('showOnMap', 'all')">
            <img src="@/assets/icons/all.png" />
            All Swim
          </button>
          <button class="btn" :class="{ active: filters.showOnMap === 'river' }" @click="setFilter('showOnMap', 'river')">
            <img src="@/assets/icons/r.png" />
            River
          </button>
          <button class="btn" :class="{ active: filters.showOnMap === 'beach' }" @click="setFilter('showOnMap', 'beach')">
            <img src="@/assets/icons/b.png" />
            Beach
          </button>
        </div>
      </section>

      <!-- Water Quality -->
      <section>
        <label>Water Quality</label>
        <div class="btn-group">
          <button class="btn" :class="{ active: filters.waterQuality === 'clean' }" @click="setFilter('waterQuality', 'clean')">
            <img src="@/assets/icons/green.png" />
            Clean
          </button>
          <button class="btn" :class="{ active: filters.waterQuality === 'moderate' }" @click="setFilter('waterQuality', 'moderate')">
            <img src="@/assets/icons/yellow.png" />
            Moderate
          </button>
          <button class="btn" :class="{ active: filters.waterQuality === 'unclean' }" @click="setFilter('waterQuality', 'unclean')">
            <img src="@/assets/icons/red.png" />
            Unclean
          </button>
        </div>
      </section>

      <!-- Distance -->
      <section>
        <label>Distance</label>
        <div class="btn-group">
          <button class="btn" :class="{ active: filters.distance === '1' }" @click="setFilter('distance', '1')">1 km</button>
          <button class="btn" :class="{ active: filters.distance === '5' }" @click="setFilter('distance', '5')">5 km</button>
          <button class="btn" :class="{ active: filters.distance === '10' }" @click="setFilter('distance', '10')">10 km</button>
        </div>
      </section>

      <!-- Amenities -->
      <section>
        <label>Amenities</label>
        <div class="btn-group">
          <button class="btn" :class="{ active: filters.amenities.includes('toilets') }" @click="toggleAmenity('toilets')">
            <img src="@/assets/icons/toilet3.png" />
            Toilets
          </button>
          <button class="btn" :class="{ active: filters.amenities.includes('fountains') }" @click="toggleAmenity('fountains')">
            <img src="@/assets/icons/fountains3.png" />
            Fountains
          </button>
        </div>
      </section>

      <!-- Results -->
      <section>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <label>Results</label>
          <button class="reset-btn" @click="resetFilters">Reset</button>
        </div>

        <!-- Results Count -->
        <div v-if="props.results.length > 0" class="mb-2">
          {{ props.results.length }} {{ props.results.length === 1 ? 'result' : 'results' }} found
        </div>

        <!-- Show result list if there are matches -->
        <div v-if="props.results.length > 0">
          <div v-for="(res, i) in props.results" :key="i" class="result-item" @click="selectResult(res)">
            <div class="result-header">
              <strong>{{ res.name }}</strong>
            </div>
            <!-- <div :class="['status', res.status?.toLowerCase()]">{{ res.status }}</div>
            <p>{{ res.description }}</p> -->
          </div>
        </div>

        <!-- No results but search/filters applied -->
        <div v-else-if="searchQuery || filters.showOnMap !== 'all' || filters.waterQuality || filters.distance || filters.amenities.length > 0 || filters.toiletAccessibility">
          <img src="@/assets/icons/noresult.png" alt="No results" class="empty-icon-img" />
          <strong class="no-results">No results match your filters or search.</strong>
        </div>

        <!-- Default state: nothing searched yet -->
        <div v-else>
          <img src="@/assets/icons/search.svg" alt="Search" class="empty-icon-img" />
          <strong class="no-results">Please search to find results.</strong>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Mobile Toggle Button */
.mobile-toggle-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  background: #5fd5c1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-toggle-btn:hover {
  background: #4fc4b0;
  transform: translateX(-50%) scale(1.05);
}

.mobile-toggle-btn.open {
  background: #333;
}

/* Mobile Backdrop */
.mobile-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Sidebar */
.filter-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  height: 100vh;
  padding-bottom: 20px;
  padding-right: 6px;
  background: white;
}

/* Desktop: normal sidebar */
@media (min-width: 769px) {
  .filter-sidebar {
    position: relative;
  }
}

/* Mobile: slide-in sidebar */
@media (max-width: 768px) {
  .filter-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 85%;
    max-width: 350px;
    height: 100vh;
    z-index: 1000;
    padding: 20px;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .filter-sidebar.mobile-open {
    left: 0;
  }
}

/* Introduction Section */

.intro-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.intro-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #555;
  padding: 6px 0;
  line-height: 1.3;
}

.intro-features li img {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.8;
}

/* Instruction Banner */
.instruction-banner {
  background-color: white;
  color: #333;
  padding: 20px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.intro-text {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 16px;
}

.instruction-title {
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 15px;
  color: #333;
  padding-bottom: 6px;
}

.instruction-steps {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
  color: #666;
}

.instruction-steps li {
  margin-bottom: 6px;
}

.instruction-steps li:last-child {
  margin-bottom: 0;
}

/* Scrollbar */
.filter-sidebar::-webkit-scrollbar {
  width: 6px;
}

.filter-sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.filter-sidebar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.filter-sidebar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Header */
h5 {
  font-weight: bold;
  margin-bottom: 0;
  color: #333;
}

/* Section */
section {
  margin-bottom: 12px;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  color: #555;
}

/* Search */
.search-container {
  position: relative;
}

.search-input {
  padding: 10px 14px 10px 36px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
}

.search-input:focus {
  outline: none;
  border-color: #5fd5c1;
  box-shadow: 0 0 0 3px rgba(95, 213, 193, 0.1);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-suggestions li {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.search-suggestions li:hover {
  background: #f0f0f0;
}

/* Buttons */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn {
  /* background: #f5f5f5; */
  background: white;
  border: 1px solid #dedddd;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn img {
  width: 16px;
  height: 16px;
}

.btn:hover {
  /* background: #e8e8e8; */
  background: #f5f5f5;
}

.btn.active {
  background-color: #5fd5c1;
  border-color: #5fd5c1;
  color: white;
}

/* Results */
/* Results Count */
.result-item {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}

.result-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.result-header img {
  width: 18px;
  height: 18px;
}

.status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 6px;
  font-weight: 600;
}

.status.clean {
  background: #d4edda;
  color: #155724;
}

.status.unclean {
  background: #f8d7da;
  color: #721c24;
}

.status.moderate {
  background: #fff3cd;
  color: #856404;
}

.empty-icon-img {
  width: 40px;
  height: 40px;
  display: block;
  margin: 20px auto 12px;
  opacity: 0.4;
}

.no-results {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 10px;
}

/* Reset Button */
.reset-btn {
  background: transparent;
  border: 1px solid #999;
  color: #333;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #f0f0f0;
  border-color: #666;
}
</style>