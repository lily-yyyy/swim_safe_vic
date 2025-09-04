<script setup>
// Define props for reusability and styling flexibility for button
defineProps({
  label: String,       
  to: String,          
  type: {
    type: String,
    default: 'button'  
  },
  variant: {
    type: String,
    default: 'outline-light' 
  },
  size: {
    type: String,
    default: 'lg' // Bootstrap size: sm, md, lg
  }
})
</script>

<template>
  <!-- If 'to' prop is provided, render as router-link -->
  <router-link
    v-if="to"
    :to="to"
    class="btn"
    :class="['btn-' + variant, 'btn-' + size, 'base-button']"
  >
    {{ label }}
  </router-link>

  <!-- Otherwise, render as standard button -->
  <button
    v-else
    :type="type"
    class="btn"
    :class="['btn-' + variant, 'btn-' + size, 'base-button']"
  >
    {{ label }}
  </button>
</template>

<style scoped>
/* Base styling shared across all button types */
.base-button {
  border-radius: 12px;
  min-width: 150px;
  padding: 0.8rem 1.6rem;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

/* Slight zoom effect on hover */
.base-button:hover {
  transform: scale(1.05);
}
</style>
