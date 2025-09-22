<template>
  <div class="col-md-4">
    <div class="card h-100 border-0 shadow-sm rounded-4 p-3">
      <div class="d-flex align-items-start gap-3">
        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
          <img :src="iconUrl" :alt="title" width="24" height="24" />
        </div>
        <div>
          <h6 class="fw-bold mb-1">{{ title }}</h6>
          <p class="small text-muted mb-0">{{ subtitle }}</p>
        </div>
      </div>
      <div class="mt-3">
        <p class="small mb-1"><strong>Humans:</strong> {{ description }}</p>
        <a href="#" class="text-primary small text-decoration-none fw-medium">Learn more</a>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: String,
  title: String,
  subtitle: String,
  description: String,
})
const iconUrl = new URL(`/src/assets/icons/${props.icon}`, import.meta.url).href
</script>
