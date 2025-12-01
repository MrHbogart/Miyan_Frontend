<script setup>
const pageTransition = { name: 'fade-load', mode: 'out-in' }
</script>

<template>
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>

<style>
.fade-load-enter-active,
.fade-load-leave-active {
  transition: opacity 320ms ease;
  pointer-events: none;
}

.fade-load-enter-from,
.fade-load-leave-to {
  opacity: 0;
}

.fade-load-enter-to,
.fade-load-leave-from {
  opacity: 1;
}

body.no-page-transition .fade-load-enter-active,
body.no-page-transition .fade-load-leave-active {
  transition: none !important;
}

@keyframes gradientDrift {
  0% {
    background-position: 35% 25%;
  }
  50% {
    background-position: 65% 75%;
  }
  100% {
    background-position: 35% 25%;
  }
}

@media (prefers-reduced-motion: reduce) {
  main {
    animation: none !important;
  }
}
</style>
