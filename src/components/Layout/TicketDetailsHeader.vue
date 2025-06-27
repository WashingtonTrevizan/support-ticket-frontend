<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <button 
            @click="$emit('go-back')"
            class="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-gray-900">
            🎫 Detalhes do Ticket
          </h1>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineEmits<{
  'go-back': []
}>()
</script>
