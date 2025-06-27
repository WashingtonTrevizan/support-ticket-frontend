<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Indicador de carregamento -->
    <div v-if="loading" class="col-span-full flex justify-center items-center p-8">
      <div class="flex items-center space-x-3">
        <svg class="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">Carregando estatísticas...</span>
      </div>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="error" class="col-span-full">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span class="text-red-500 text-lg">⚠️</span>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
            <button 
              @click="$emit('retry')" 
              class="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards de estatísticas -->
    <template v-else>
      <div class="bg-white overflow-hidden shadow-lg rounded-lg">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm">📋</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tickets Abertos</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.open }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-lg rounded-lg">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm">⏳</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Em Andamento</p>
              <p class="text-3xl font-bold text-yellow-600">{{ stats.in_progress }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-lg rounded-lg">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm">✅</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Resolvidos</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.closed }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-lg rounded-lg">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span class="text-white text-sm">📊</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total</p>
              <p class="text-3xl font-bold text-purple-600">{{ stats.total }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Stats {
  open: number
  in_progress: number
  closed: number
  total: number
}

interface Props {
  stats: Stats
  loading: boolean
  error: string
}

defineProps<Props>()

defineEmits<{
  retry: []
}>()
</script>
