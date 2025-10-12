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

        <!-- Latest Comments -->
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

          <!-- Comment input with 100-word limit -->
          <p><strong>Write your comment (max 100 words):</strong></p>
          <textarea
            v-model="comment"
            placeholder="Share your experience..."
            rows="3"
          ></textarea>

          <!-- Live word counter -->
          <p class="word-count">
            {{ wordCount }} / 100 words
          </p>
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
import { ref, computed, watch } from 'vue'

// Props: receives toilet object from parent
const props = defineProps({
  toilet: { type: Object, required: true }
})

// Emits for closing and submitting
const emit = defineEmits(['close', 'submit'])

// Local states for feedback form
const cleanStatus = ref('yes')
const rating = ref(0)
const comment = ref('')

// Computed property for live word counting
const wordCount = computed(() =>
  comment.value.trim().split(/\s+/).filter(Boolean).length
)

// Watcher to enforce 100-word maximum limit
watch(comment, (newVal) => {
  const words = newVal.trim().split(/\s+/)
  if (words.length > 100) {
    // If over limit, truncate and show alert
    comment.value = words.slice(0, 100).join(' ')
    alert('You can only type up to 100 words.')
  }
})

// Handle directions button click
function handleDirections() {
  if (props.toilet.getDirections) props.toilet.getDirections()
  else alert('Directions not available.')
  emit('close')
}

// Submit form data to parent
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

/* Header */
.dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
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

/* Content */
.dialog-content {
  padding: 16px 20px;
  overflow-y: auto;
  flex-grow: 1;
}

/* Footer */
.dialog-footer {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  background: white;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

/* Rating */
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

/* Accessibility icons */
.access-icons span {
  font-size: 1.2rem;
  margin-right: 6px;
}

/* Directions button */
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

/* Radio & Stars */
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

/* Textarea */
textarea {
  width: 100%;
  padding: 8px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-family: inherit;
}

/* Word counter */
.word-count {
  text-align: right;
  font-size: 0.8rem;
  color: #555;
  margin-top: 4px;
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

/* Responsive */
@media (max-height: 500px) {
  .dialog {
    max-height: 100vh;
  }
}
</style>
