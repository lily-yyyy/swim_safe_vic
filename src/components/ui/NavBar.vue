<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top px-4">
    <div class="container-fluid justify-content-between">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/vue.svg" alt="Logo" width="30" height="30" class="me-2" />
        <span>Name of App</span>
      </router-link>

      <div>
        <router-link to="/" class="nav-link d-inline text-white mx-2">Home</router-link>
        <router-link to="/swim" class="nav-link d-inline text-white mx-2">Swim</router-link>
        <router-link to="/refill" class="nav-link d-inline text-white mx-2">Refill</router-link>
        <router-link to="/knowb4go" class="nav-link d-inline text-white mx-2">KnowB4Go</router-link>
        <button class="btn btn-success ms-3">Login</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.navbar {
  z-index: 9999;
}

.nav-link {
  color: white !important;
  font-weight: 500;
  text-decoration: none;
}
</style>
