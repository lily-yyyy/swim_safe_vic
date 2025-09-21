<template>
  <div class="toilet-info-overlay">
    <div class="dialog">
      <div class="dialog-header">
        <h2>{{ toilet.toilet_name || 'Unnamed Toilet' }}</h2>
        <p class="subtitle">Public Toilet Information</p>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="dialog-body">
        <!-- Rating -->
        <div class="rating-row">
          <span class="stars">★ ★ ★ ★ ★</span>
          <span class="rating-value">{{ toilet.rating ?? '4.2' }}</span>
        </div>

        <!-- Details -->
        <p><strong>Opening hours:</strong> {{ toilet.opening_hours || '7:00 am – 9:00 pm' }}</p>

        <p><strong>Accessible for:</strong>
          <span class="access-icons">
            <template v-if="toilet.unisex">
              <span title="Men">👨</span>
              <span title="Women">👩</span>
              <span title="Disability Access">♿</span>
              <span title="All Genders">🧑‍🦽</span>
            </template>
            <template v-else>
              <span v-if="toilet.male" title="Men">👨</span>
              <span v-if="toilet.female" title="Women">👩</span>
              <span v-if="toilet.accessible" title="Disability Access">♿</span>
              <span v-if="toilet.all_gender" title="All Genders">🧑‍🦽</span>
            </template>
          </span>
        </p>

        <p><strong>Baby Change:</strong> {{ toilet.baby_change ? 'Available' : 'Not available' }}</p>

        <!-- Directions -->
        <button class="directions-btn" @click="handleDirections">📍 Directions</button>

        <!-- Feedback Form -->
        <div class="form-section">
          <p><strong>Is this toilet clean?</strong></p>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="cleanStatus" value="yes" />
              Yes
            </label>
            <label>
              <input type="radio" v-model="cleanStatus" value="no" />
              No
            </label>
          </div>

          <p><strong>Rate the toilet:</strong></p>
          <div class="stars-input">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= rating }"
              @click="rating = star"
            >★</span>
          </div>

          <p><strong>Write your comment:</strong></p>
          <textarea
            v-model="comment"
            placeholder="Share your experience..."
            rows="3"
          ></textarea>

          <div class="form-actions">
            <button class="submit-btn" @click="submitForm">Submit</button>
            <button class="cancel-btn" @click="$emit('close')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  toilet: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// Form data
const cleanStatus = ref('yes')
const rating = ref(0)
const comment = ref('')


function handleDirections() {
  if (props.toilet.getDirections) {
    props.toilet.getDirections()
  } else {
    alert('Directions not available.')
  }

  // Close dialog after requesting directions
  emit('close')
}


function submitForm() {
  const data = {
    toiletId: props.toilet.id,
    isClean: cleanStatus.value === 'yes',
    rating: rating.value,
    comment: comment.value
  }

  console.log('🧻 Submitted Toilet Feedback:', data)
  emit('submit', data)
  emit('close') // Optionally close dialog after submit
}
</script>

<style scoped>
.toilet-info-overlay {
  position: fixed;
  top: 64px; /* leave space below nav */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  z-index: 9999;
}

.dialog {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 420px;
  max-width: 95%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  position: relative;
}

.dialog-header {
  margin-bottom: 16px;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.subtitle {
  color: #4b6584;
  font-size: 0.95rem;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 1.4rem;
  background: none;
  border: none;
  cursor: pointer;
}

.rating-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.stars {
  color: #f5a623;
  font-size: 1.2rem;
}

.rating-value {
  margin-left: 6px;
  font-weight: bold;
}

.access-icons span {
  font-size: 1.2rem;
  margin-right: 8px;
}

.directions-btn {
  background: #007b7f;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin: 12px 0;
  font-size: 0.95rem;
}

.form-section {
  margin-top: 16px;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin: 6px 0 12px;
}

.stars-input {
  display: flex;
  font-size: 1.4rem;
  margin: 6px 0 12px;
}

.stars-input .star {
  cursor: pointer;
  color: #ccc;
  margin-right: 4px;
}

.stars-input .star.filled {
  color: #f5a623;
}

textarea {
  width: 100%;
  padding: 8px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-family: inherit;
}

.form-actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}

.submit-btn {
  background: #007b7f;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #999;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
