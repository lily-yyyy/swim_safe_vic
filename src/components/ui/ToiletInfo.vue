<template>
  <div class="toilet-info-overlay">
    <div class="dialog">
      <!-- Fixed Header -->
      <div class="dialog-header">
        <h2>{{ toilet.toilet_name || 'Unnamed Toilet' }}</h2>
        <p class="subtitle">Public Toilet Information</p>
      </div>

      <!-- Scrollable Content -->
      <div class="dialog-content">
        <!-- Rating -->
        <div class="rating-row">
          <span class="stars">★ ★ ★ ★ ★</span>
          <span class="rating-value">{{ toilet.averageRating ?? 'No rating' }}</span>
        </div>

        <!-- Details -->
        <p><strong>Opening hours:</strong> {{ toilet.openingHours || '7:00 am – 9:00 pm' }}</p>

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
              <span v-if="toilet.allGender" title="All Genders">🧑‍🦽</span>
            </template>
          </span>
        </p>

        <p><strong>Baby Change:</strong> {{ toilet.babyChange ? 'Available' : 'Not available' }}</p>

        <!--  Latest Comments -->
        <div v-if="toilet.comments?.length" class="mb-3">
          <h6>Latest Comments:</h6>
          <ul class="list-group">
            <li
              v-for="c in toilet.comments"
              :key="c.id"
              class="list-group-item"
            >
              <p class="mb-1">“{{ c.comment }}”</p>
              <small class="text-muted">
                {{ new Date(c.created_at).toLocaleDateString() }}
                • {{ new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </small>
            </li>
          </ul>
        </div>
        <p v-else class="text-muted">No comments yet</p>

        <!-- Directions -->
        <button class="directions-btn" @click="handleDirections">📍 Directions</button>

        <!-- Feedback Form -->
        <div class="form-section">
          <p><strong>Is this toilet clean?</strong></p>
          <div class="radio-group">
            <label><input type="radio" v-model="cleanStatus" value="yes" /> Yes</label>
            <label><input type="radio" v-model="cleanStatus" value="no" /> No</label>
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
        </div>
      </div>

      <!-- Fixed Footer -->
      <div class="dialog-footer">
        <button class="submit-btn" @click="submitForm">Submit</button>
        <button class="cancel-btn" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  toilet: { type: Object, required: true }
})

const emit = defineEmits(['close', 'submit'])

const cleanStatus = ref('yes')
const rating = ref(0)
const comment = ref('')

function handleDirections() {
  if (props.toilet.getDirections) props.toilet.getDirections()
  else alert('Directions not available.')
  emit('close')
}

function submitForm() {
  const data = {
    toiletId: props.toilet.id,
    isClean: cleanStatus.value === 'yes',
    rating: rating.value,
    comment: comment.value
  }

  
  emit('submit', data)
  
}
</script>

<style scoped>
.toilet-info-overlay {
  position: fixed;
  top: 64px; /* leave space below navbar */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  z-index: 9999;
  overflow-y: auto;
}

.dialog {
  background: #fff;
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

/* Fixed Header */
.dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  position: relative;
  background: white;
  z-index: 1;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.subtitle {
  font-size: 0.9rem;
  color: #555;
}

/* Scrollable Content */
.dialog-content {
  padding: 16px 20px;
  overflow-y: auto;
  flex-grow: 1;
}

/* Fixed Footer */
.dialog-footer {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  background: white;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

/* Shared Styles */
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
  margin-right: 6px;
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
  width: 100%;
}

.radio-group {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stars-input {
  display: flex;
  font-size: 1.4rem;
  margin-bottom: 12px;
}

.star {
  cursor: pointer;
  color: #ccc;
  margin-right: 4px;
}

.star.filled {
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

/* Buttons */
.submit-btn {
  background: #007b7f;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #999;
  color: #333;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
}

/* Responsive (Optional) */
@media (max-height: 500px) {
  .dialog {
    max-height: 100vh;
  }
}
</style>
