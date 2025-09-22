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

// 🔁 Emit search input
watch(searchQuery, () => {
  emit('update:search', searchQuery.value)
})

// 🔁 Emit filters when updated
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
</script>

<template>
  <div class="filter-sidebar">
    <!-- 🔍 Search with icon -->
    <div class="search-container">
      <img src="@/assets/icons/search.svg" class="search-icon" />
      <input
        v-model="searchQuery"
        class="search-input"
        type="text"
        placeholder="Search beach, river location"
      />

      <!-- 🔽 Search Suggestions -->
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

    <!-- 🎯 Filters -->
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
        <button class="btn" :class="{ active: filters.waterQuality === 'safe' }" @click="setFilter('waterQuality', 'safe')">Safe</button>
        <button class="btn" :class="{ active: filters.waterQuality === 'caution' }" @click="setFilter('waterQuality', 'caution')">Caution</button>
        <button class="btn" :class="{ active: filters.waterQuality === 'unsafe' }" @click="setFilter('waterQuality', 'unsafe')">Unsafe</button>
      </div>
    </section>

    <!-- Distance -->
    <!-- <section>
      <label>Distance</label>
      <div class="btn-group">
        <button class="btn" :class="{ active: filters.distance === '1km' }" @click="setFilter('distance', '1km')">1km</button>
        <button class="btn" :class="{ active: filters.distance === '5km' }" @click="setFilter('distance', '5km')">5km</button>
        <button class="btn" :class="{ active: filters.distance === '10km' }" @click="setFilter('distance', '10km')">10km</button>
      </div>
    </section> -->

    <!-- Amenities -->
    <section>
      <label>Amenities</label>
      <div class="btn-group">
        <button class="btn" :class="{ active: filters.amenities.includes('toilets') }" @click="toggleAmenity('toilets')">
          <img src="@/assets/icons/toilet1.png" />
          Toilets
        </button>
        <button class="btn" :class="{ active: filters.amenities.includes('fountains') }" @click="toggleAmenity('fountains')">
          <img src="@/assets/icons/fountains.svg" />
          Fountains
        </button>
      </div>
    </section>

    <!-- Toilet Accessibility -->
    <!-- <section>
      <label>Toilet Accessibility</label>
      <div class="btn-group">
        <button class="btn" :class="{ active: filters.toiletAccessibility === 'female' }" @click="setFilter('toiletAccessibility', 'female')">Female</button>
        <button class="btn" :class="{ active: filters.toiletAccessibility === 'male' }" @click="setFilter('toiletAccessibility', 'male')">Male</button>
        <button class="btn" :class="{ active: filters.toiletAccessibility === 'all' }" @click="setFilter('toiletAccessibility', 'all')">All Gender</button>
      </div>
    </section> -->

    <!-- 🧾 Results section -->
    <section>
      <label>Results</label>
      <div v-for="(res, i) in props.results" :key="i" class="result-item">
        <div class="result-header">
          <img src="@/assets/icons/menu.svg" />
          <strong>{{ res.name }}</strong>
        </div>
        <div :class="['status', res.status?.toLowerCase()]">{{ res.status }}</div>
        <p>{{ res.description }}</p>
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
  height: 100%;
  padding-bottom: 20px;
  padding-right: 6px;
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

.status.safe {
  background: #d4edda;
  color: #155724;
}

.status.unsafe {
  background: #f8d7da;
  color: #721c24;
}

.status.caution {
  background: #fff3cd;
  color: #856404;
}
</style>
