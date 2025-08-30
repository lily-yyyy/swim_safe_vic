<template>
  <div class="info-dialog shadow rounded p-4 bg-white">
    <h5 class="title mb-1">{{ location.name }}</h5>
    <p class="status text-muted">{{ location.status }}</p>
    <p class="last-tested text-muted small mb-3">Last Tested: {{ location.lastTested }}</p>

    <hr />

    <p class="tip-title fw-semibold mb-1">Tip: <span class="fst-italic">{{ location.tipTitle }}</span></p>
    <p class="tip-detail small text-muted">{{ location.tipDetail }}</p>

    <div class="d-flex justify-content-between mt-3 mb-2 text-muted small">
      <span><i class="bi bi-geo-alt-fill"></i> {{ location.distance }}</span>
      <span><i class="bi bi-clock-fill"></i> {{ location.time }}</span>
    </div>

    <div class="d-flex justify-content-between mt-3">
      <button class="btn btn-outline-secondary btn-sm px-3">Save</button>
      <button class="btn btn-primary btn-sm px-3">Directions</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  location: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Location Name',
      status: 'Reliable',
      lastTested: '4 days ago',
      tipTitle: 'Flush the Fountain',
      tipDetail: '10–30 seconds before filling your bottle',
      distance: '0.5 mi',
      time: '8 min',
    }),
  },
})
</script>

<style scoped>
.info-dialog {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 320px;
  max-width: 90%;
  z-index: 1000;
  border: 1px solid #ddd;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
