<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import NavBar from '@/components/ui/NavBar.vue'
</script>

<style>
/* Global padding to avoid content under fixed navbar */
body, html, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

main.view-wrapper {
  min-height: 100vh;
  padding-top: 70px; /* fixed-top navbar offset */
}
nav.navbar {
  z-index: 9999 !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

</style>

