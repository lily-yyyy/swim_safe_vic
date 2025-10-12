<template>
  <div class="info-dialog shadow rounded bg-white">
    <!-- ========== SECTION 1: Header ========== -->
    <div class="dialog-header">
      <div class="header-content">
        <!-- Name -->
        <h5 class="location-name">{{ location.name }}</h5>
        
        <!-- Badges Row -->
        <div class="badges-row">
          <!-- Type Badge -->
          <span class="badge badge-type" :class="typeBadgeClass">
            <span class="badge-icon">{{ typeIcon }}</span>
            <span class="badge-text">{{ typeText }}</span>
          </span>
          
          <!-- Pet Friendly Badge -->
          <span v-if="location.is_pet_friendly" class="badge badge-pet">
            <span class="badge-icon">🐕</span>
            <span class="badge-text">Pet Friendly</span>
          </span>
        </div>
      </div>
      
      <!-- Close Button -->
      <button class="btn-close" @click="$emit('close')" aria-label="Close"></button>
    </div>

    <hr class="divider" />

    <!-- ========== SECTION 2: Swimming Status ========== -->
    <div class="status-section">
      <div class="status-card" :class="statusCardClass">
        <div class="status-icon-large">{{ statusIcon }}</div>
        <div class="status-content">
          <div class="status-label">{{ statusLabel }}</div>
          <div class="status-message">{{ swimMessage }}</div>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- ========== SECTION 3: ML Data Metrics ========== -->
    <div class="metrics-section">
      <h6 class="section-title">Current Conditions</h6>
      
      <div class="metrics-grid">
        <!-- Rainfall (Both Beach & River) -->
        <div class="metric-card" v-if="showRainfall">
          <div class="metric-icon">🌧️</div>
          <div class="metric-content">
            <div class="metric-label">Rainfall</div>
            <div class="metric-value">{{ rainfallValue }}mm</div>
            <div class="metric-sublabel">Last 24 hours</div>
          </div>
        </div>

        <!-- Temperature -->
        <div class="metric-card" v-if="location.temperature && location.temperature !== 'N/A'">
          <div class="metric-icon">🌡️</div>
          <div class="metric-content">
            <div class="metric-label">Temperature</div>
            <div class="metric-value">{{ location.temperature }}°C</div>
            <div class="metric-sublabel">Current temp</div>
          </div>
        </div>

        <!-- Water Quality Score -->
        <div class="metric-card metric-highlight" v-if="waterQualityValue">
          <div class="metric-icon">💧</div>
          <div class="metric-content">
            <div class="metric-label">Water Quality</div>
            <div class="metric-value">{{ waterQualityValue }}</div>
            <div class="metric-sublabel">{{ waterQualityUnit }}</div>
          </div>
        </div>

        <!-- Beach: Enterococci -->
        <div 
          class="metric-card metric-primary" 
          v-if="location.type === 'beach' && location.enterococci"
        >
          <div class="metric-icon">🦠</div>
          <div class="metric-content">
            <div class="metric-label">Enterococci</div>
            <div class="metric-value">{{ Math.round(location.enterococci) }}</div>
            <div class="metric-sublabel">orgs/100mL</div>
          </div>
        </div>

        <!-- River: WQI -->
        <div 
          class="metric-card metric-primary" 
          v-if="location.type === 'river' && location.wqi"
        >
          <div class="metric-icon">📊</div>
          <div class="metric-content">
            <div class="metric-label">WQI Index</div>
            <div class="metric-value">{{ location.wqi }}</div>
            <div class="metric-sublabel">Water Quality Index</div>
          </div>
        </div>

        <!-- River: pH Level -->
        <div 
          class="metric-card" 
          v-if="location.type === 'river' && location.predicted?.ph"
        >
          <div class="metric-icon">⚗️</div>
          <div class="metric-content">
            <div class="metric-label">pH Level</div>
            <div class="metric-value">{{ location.predicted.ph.toFixed(1) }}</div>
            <div class="metric-sublabel">Acidity/Alkalinity</div>
          </div>
        </div>

        <!-- River: Turbidity -->
        <div 
          class="metric-card" 
          v-if="location.type === 'river' && location.predicted?.turbidity_ntu"
        >
          <div class="metric-icon">🌫️</div>
          <div class="metric-content">
            <div class="metric-label">Turbidity</div>
            <div class="metric-value">{{ Math.round(location.predicted.turbidity_ntu) }}</div>
            <div class="metric-sublabel">NTU</div>
          </div>
        </div>
      </div>

      <!-- Safety Threshold Info -->
      <div v-if="location.type === 'beach' && location.enterococci" class="threshold-info">
        <small class="text-muted">
          ℹ️ Safe threshold: ≤ 40 orgs/100mL
        </small>
      </div>
    </div>

    <!-- Weather Context (if heavy rain) -->
    <div 
      v-if="rainfallValue > 5" 
      class="alert-box"
      :class="rainfallAlertClass"
    >
      <div class="alert-icon">{{ rainfallAlertIcon }}</div>
      <div class="alert-text">{{ rainfallAlertText }}</div>
    </div>

    <!-- Data Freshness -->
    <div class="data-info">
      <div class="timestamp-card" :class="{ 'timestamp-stale': isDataStale }">
        <div class="timestamp-icon">{{ isDataStale ? '⚠️' : '🕐' }}</div>
        <div class="timestamp-content">
          <div class="timestamp-label">Last Updated</div>
          <div class="timestamp-value">{{ formattedTimestamp }}</div>
          <div class="timestamp-relative">{{ relativeTime }}</div>
          <div v-if="isDataStale" class="stale-warning">
            ⚠️ Data may be outdated
          </div>
        </div>
        <div v-if="dataSourceBadge" class="data-source-badge">
          {{ dataSourceBadge }}
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- ========== SECTION 4: Description (Optional) ========== -->
    <div v-if="location.description" class="description-section">
      <p class="description-text">{{ location.description }}</p>
    </div>

    <!-- ========== SECTION 5: Action Buttons ========== -->
    <div class="action-section">
      <button class="btn btn-primary w-100 mb-2" @click="handleDirections">
        <span class="btn-icon">📍</span>
        <span>Get Directions</span>
      </button>
      
      <button class="btn btn-secondary w-100" @click="openPlanner">
        <span class="btn-icon">🗓️</span>
        <span>Add to Planner</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'open-planner'])

// ========== Timestamp Formatting ==========
const formattedTimestamp = computed(() => {
  // Try multiple locations for timestamp:
  // 1. Top level prediction_timestamp (beaches & rivers use this now)
  // 2. predicted.timestamp (fallback for rivers)
  // 3. extraInfo.timestamp (fallback)
  const timestamp = 
    props.location.prediction_timestamp || 
    props.location.predicted?.timestamp ||
    props.location.extraInfo?.timestamp
  
  if (!timestamp) return 'Unknown'
  
  try {
    const date = new Date(timestamp)
    
    // Format: "7:00 AM, 12 Oct 2025"
    const timeString = date.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    const dateString = date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
    
    return `${timeString}, ${dateString}`
  } catch (e) {
    return 'Unknown'
  }
})

const relativeTime = computed(() => {
  const timestamp = 
    props.location.prediction_timestamp || 
    props.location.predicted?.timestamp ||
    props.location.extraInfo?.timestamp
  
  if (!timestamp) return ''
  
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return 'Over a week ago'
  } catch (e) {
    return ''
  }
})

const isDataStale = computed(() => {
  const timestamp = 
    props.location.prediction_timestamp || 
    props.location.predicted?.timestamp ||
    props.location.extraInfo?.timestamp
    
  if (!timestamp) return false
  
  const diffHours = (new Date() - new Date(timestamp)) / (1000 * 60 * 60)
  return diffHours > 24 // Stale if older than 24 hours
})

// ========== SECTION 1: Type & Badges ==========
const typeIcon = computed(() => {
  return props.location.type === 'beach' ? '🏖️' : '🏞️'
})

const typeText = computed(() => {
  return props.location.type === 'beach' ? 'Beach' : 'River'
})

const typeBadgeClass = computed(() => {
  return props.location.type === 'beach' ? 'badge-beach' : 'badge-river'
})

// ========== SECTION 2: Status ==========
const statusIcon = computed(() => {
  const s = props.location.status?.toLowerCase()
  if (s === 'excellent' || s === 'surveillance') return '✅'
  if (s === 'good') return '🟢'
  if (s === 'moderate' || s === 'alert') return '⚠️'
  if (s === 'poor' || s === 'action') return '🔴'
  if (s === 'very poor') return '❌'
  return '❓'
})

const statusLabel = computed(() => {
  return props.location.statusLabel || props.location.status || 'Unknown'
})

const swimMessage = computed(() => {
  const s = props.location.status?.toLowerCase()
  
  if (s === 'excellent' || s === 'surveillance') return 'Safe for swimming'
  if (s === 'good') return 'Good conditions for swimming'
  if (s === 'moderate' || s === 'alert') return 'Swim with caution - not recommended for sensitive groups'
  if (s === 'poor' || s === 'action') return 'Not safe for swimming - avoid water contact'
  if (s === 'very poor') return 'Dangerous - do not swim'
  
  return 'Water quality information unavailable'
})

const statusCardClass = computed(() => {
  const s = props.location.status?.toLowerCase()
  if (s === 'excellent' || s === 'surveillance' || s === 'good') return 'status-safe'
  if (s === 'moderate' || s === 'alert') return 'status-caution'
  if (s === 'poor' || s === 'action' || s === 'very poor') return 'status-unsafe'
  return 'status-unknown'
})

// ========== SECTION 3: Metrics ==========
const waterQualityValue = computed(() => {
  const s = props.location.status
  if (s === 'Excellent') return 'Excellent'
  if (s === 'Good') return 'Good'
  if (s === 'Moderate') return 'Moderate'
  if (s === 'Poor') return 'Poor'
  if (s === 'Very Poor') return 'Very Poor'
  return s || 'N/A'
})

const waterQualityUnit = computed(() => {
  return props.location.type === 'beach' ? 'Beach quality' : 'River quality'
})

// ========== NEW: Rainfall handling for both beaches and rivers ==========
const showRainfall = computed(() => {
  return props.location.rainfall_mm !== undefined || 
         props.location.predicted?.rainfall_mm !== undefined
})

const rainfallValue = computed(() => {
  return props.location.rainfall_mm || 
         props.location.predicted?.rainfall_mm || 
         0
})

// Rainfall Alert
const rainfallAlertIcon = computed(() => {
  const r = rainfallValue.value
  if (r > 20) return '🌧️'
  if (r > 5) return '🌦️'
  return '💧'
})

const rainfallAlertText = computed(() => {
  const r = rainfallValue.value
  if (r > 20) return 'Heavy rainfall detected. Water quality may be poor for 24-48 hours.'
  if (r > 5) return 'Light rain recently. Water quality may be temporarily affected.'
  return ''
})

const rainfallAlertClass = computed(() => {
  const r = rainfallValue.value
  if (r > 20) return 'alert-danger'
  if (r > 5) return 'alert-warning'
  return ''
})

// ========== NEW: Data Source Badge ==========
const dataSourceBadge = computed(() => {
  if (props.location.type === 'beach') {
    return props.location.extraInfo?.dataSource
  }
  if (props.location.type === 'river' && props.location.wqi) {
    return 'ML Prediction'
  }
  return null
})

// ========== Actions ==========
function handleDirections() {
  if (props.location.lat && props.location.lon) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${props.location.lat},${props.location.lon}`
    window.open(url, '_blank')
  } else {
    alert('No coordinates available for this location.')
  }
}

function openPlanner() {
  emit('open-planner', props.location)
}
</script>

<style scoped>
/* ========== Container ========== */
.info-dialog {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 380px;
  max-width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid #e0e0e0;
  padding: 0;
}

/* ========== SECTION 1: Header ========== */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 16px 20px;
  gap: 10px;
}

.header-content {
  flex: 1;
}

.location-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge-icon {
  font-size: 1em;
}

.badge-text {
  font-size: 0.85em;
}

.badge-beach {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #90caf9;
}

.badge-river {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #81c784;
}

.badge-pet {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ffb74d;
}

.btn-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

/* ========== Divider ========== */
.divider {
  margin: 0;
  border: none;
  border-top: 1px solid #e9ecef;
}

/* ========== SECTION 2: Status ========== */
.status-section {
  padding: 20px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  border-radius: 12px;
  border-left: 5px solid;
}

.status-safe {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-left-color: #28a745;
}

.status-caution {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-left-color: #ffc107;
}

.status-unsafe {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border-left-color: #dc3545;
}

.status-unknown {
  background: linear-gradient(135deg, #e2e3e5 0%, #d6d8db 100%);
  border-left-color: #6c757d;
}

.status-icon-large {
  font-size: 2.5em;
  line-height: 1;
}

.status-content {
  flex: 1;
}

.status-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.status-message {
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.4;
}

/* ========== SECTION 3: Metrics ========== */
.metrics-section {
  padding: 20px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.metric-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  transition: all 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.metric-highlight {
  background: #e8f4f8;
  border-color: #90caf9;
}

.metric-primary {
  background: #e3f2fd;
  border: 2px solid #1976d2;
  grid-column: span 2;
}

.metric-icon {
  font-size: 1.8em;
  line-height: 1;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
}

.metric-sublabel {
  font-size: 0.75rem;
  color: #868e96;
  margin-top: 2px;
}

.threshold-info {
  text-align: center;
  margin-top: 10px;
  padding: 8px;
  background: #f1f3f5;
  border-radius: 6px;
}

/* Alert Box */
.alert-box {
  margin: 0 20px 15px 20px;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.alert-warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #dc3545;
}

.alert-icon {
  font-size: 1.3em;
}

.alert-text {
  flex: 1;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #495057;
}

/* Data Info */
.data-info {
  padding: 0 20px 15px 20px;
}

.timestamp-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 10px;
  transition: all 0.3s;
}

.timestamp-stale {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-color: #ffc107;
}

.timestamp-icon {
  font-size: 1.8em;
  line-height: 1;
}

.timestamp-content {
  flex: 1;
}

.timestamp-label {
  font-size: 0.7rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
}

.timestamp-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.timestamp-relative {
  font-size: 0.75rem;
  color: #868e96;
}

.stale-warning {
  font-size: 0.75rem;
  color: #856404;
  font-weight: 500;
  margin-top: 4px;
}

.data-source-badge {
  background: #007b7f;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

/* ========== SECTION 4: Description ========== */
.description-section {
  padding: 0 20px 20px 20px;
}

.description-text {
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.6;
  margin: 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

/* ========== SECTION 5: Actions ========== */
.action-section {
  padding: 0 20px 20px 20px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon {
  font-size: 1.2em;
}

.btn-primary {
  background: #007b7f;
  color: white;
}

.btn-primary:hover {
  background: #006266;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 127, 0.3);
}

.btn-secondary {
  background: white;
  color: #007b7f;
  border: 2px solid #007b7f;
}

.btn-secondary:hover {
  background: #007b7f;
  color: white;
  transform: translateY(-2px);
}

/* ========== Responsive ========== */
@media (max-width: 480px) {
  .info-dialog {
    width: 95%;
    right: 2.5%;
    top: 80px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metric-primary {
    grid-column: span 1;
  }
}

/* ========== Scrollbar ========== */
.info-dialog::-webkit-scrollbar {
  width: 6px;
}

.info-dialog::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.info-dialog::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}

.info-dialog::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>