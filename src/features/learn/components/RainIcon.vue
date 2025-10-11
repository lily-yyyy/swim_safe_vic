<template>
  <div class="text-center" data-testid="rain-icon">
    <img :src="iconUrl" width="40" height="40" class="mb-2" />
    <div class="small fw-medium">{{ label }}</div>
    
  </div>
</template>

<script setup>
const props = defineProps(['icon', 'label'])
const iconUrl = new URL(`/src/assets/icons/${props.icon}`, import.meta.url).href
</script>
