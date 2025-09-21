<template>
  <div class="col-md-4">
    <div class="card h-100 text-center shadow-sm">
      <div class="card-body">
        <img :src="iconUrl" width="40" height="40" class="mb-3" />
        <h6 class="fw-bold">{{ title }}</h6>
        <p class="small mb-1">{{ line1 }}</p>
        <p class="text-info small fst-italic">{{ line2 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['icon', 'title', 'line1', 'line2'])
const iconUrl = new URL(`/src/assets/icons/${props.icon}`, import.meta.url).href
</script>
