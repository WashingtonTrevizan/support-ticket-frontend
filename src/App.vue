<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-8">
        <div class="flex justify-center space-x-8 mb-8">
          <a href="https://vite.dev" target="_blank" class="transition-transform hover:scale-110">
            <img src="/vite.svg" class="h-24 w-24" alt="Vite logo" />
          </a>
          <a href="https://vuejs.org/" target="_blank" class="transition-transform hover:scale-110">
            <img src="./assets/vue.svg" class="h-24 w-24" alt="Vue logo" />
          </a>
        </div>
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Support Ticket Frontend</h1>
        <p class="text-lg text-gray-600">Built with Vite + Vue + Tailwind CSS</p>
      </div>
      <HelloWorld msg="Vite + Vue" />
    </div>
  </div>
</template>

<style scoped>
/* Custom component styles can go here */
</style>
