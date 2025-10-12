<!-- src/features/swim/components/FilterSidebar.vue -->
<script setup>
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['update:filters', 'update:search', 'search-selected'])

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  }
})

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

//  Emit search input
watch(searchQuery, () => {
  emit('update:search', searchQuery.value)
})

//  Emit filters when updated
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
}

//  Reset all filters + search
function resetFilters() {
  filters.showOnMap = 'all'
  filters.waterQuality = null
  filters.distance = null
  filters.amenities = []
  filters.toiletAccessibility = null
  searchQuery.value = ''
}
</script>

<template>
  <div class="filter-sidebar">
    <!--  Search -->
    <div class="search-container">
      <img src="@/assets/icons/search.svg" class="search-icon" />
      <input
        v-model="searchQuery"
        class="search-input"
        type="text"
        placeholder="Search beach, river location"
      />

      <!--  Search Suggestions -->
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

    <!--  Filters -->
    <h5>Filters</h5>

    <!-- Show on Map -->
    <section>
      <label>Show on Map</label>
      <div class="btn-group">
        <button class="btn" :class="{ active: filters.showOnMap === 'all' }" @click="setFilter('showOnMap', 'all')">
          <img src="@/assets/icons/swim.svg" />
          All Swim
        </button>
        <button class="btn" :class="{ active: filters.showOnMap === 'river' }" @click="setFilter('showOnMap', 'river')">
          <img src="@/assets/icons/river.svg" />
          River
        </button>
        <button class="btn" :class="{ active: filters.showOnMap === 'beach' }" @click="setFilter('showOnMap', 'beach')">
          <img src="@/assets/icons/beach.svg" />
          Beach
        </button>
      </div>
    </section>

    <!-- Water Quality -->
    <section>
      <label>Water Quality</label>
      <div class="btn-group">
        <button class="btn" :class="{ active: filters.waterQuality === 'clean' }" @click="setFilter('waterQuality', 'clean')">Clean</button>
        <button class="btn" :class="{ active: filters.waterQuality === 'moderate' }" @click="setFilter('waterQuality', 'moderate')">Moderate</button>
        <button class="btn" :class="{ active: filters.waterQuality === 'unclean' }" @click="setFilter('waterQuality', 'unclean')">Unclean</button>
      </div>
    </section>

    <!--  Distance -->
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

      <!--  Show result list if there are matches -->
      <div v-if="props.results.length > 0">
        <div v-for="(res, i) in props.results" :key="i" class="result-item">
          <div class="result-header">
            <img src="@/assets/icons/menu.svg" />
            <strong>{{ res.name }}</strong>
          </div>
          <div :class="['status', res.status?.toLowerCase()]">{{ res.status }}</div>
          <p>{{ res.description }}</p>
        </div>
      </div>

      <!--  No results but search/filters applied -->
      <div v-else-if="searchQuery || filters.showOnMap !== 'all' || filters.waterQuality || filters.distance || filters.amenities.length > 0 || filters.toiletAccessibility">
        🚫 <strong class="no-results">No results match your filters or search.</strong>
      </div>

      <!--  Default state: nothing searched yet -->
      <div v-else>
        🔍 <strong class="no-results">Please search to find results.</strong>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filter-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  height: 100vh;
  padding-bottom: 20px;
  padding-right: 6px;
  margin-top: -20px; /* Add this - adjust the value to match your navbar height */
  padding-top: 20px; /* Add this to compensate for content inside */
}

/* Mobile scroll */
@media (max-width: 768px) {
  .filter-sidebar {
    padding: 12px;
    font-size: 14px;
  }
}

/* Header */
h5 {
  font-weight: bold;
  margin-bottom: 0;
}

/* Section */
section {
  margin-bottom: 12px;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
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
  width: 100%;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-suggestions li {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
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
  background: #f5f5f5;
  border: 1px solid #ccc;
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

.btn.active {
  background-color: #5fd5c1;
  border-color: #5fd5c1;
  color: white;
}

/* 🧾 Results */
.result-item {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
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

/* Reset Button */
.reset-btn {
  background: transparent;
  border: 1px solid #999;
  color: #333;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}
.no-results {
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  margin-top: 12px;
  padding: 10px;
  border-radius: 6px;
  color: #007b7f; 
}

.reset-btn:hover {
  background: #f0f0f0;
}
</style>
