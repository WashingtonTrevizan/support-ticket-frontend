<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <button 
        @click="$emit('new-ticket')"
        class="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        ➕ Novo Ticket
      </button>
      <button 
        @click="$emit('view-all-tickets')"
        class="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        📋 Ver Todos os Tickets
      </button>
      <button class="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200">
        📈 Relatórios
      </button>
      <button 
        @click="$emit('refresh-stats')"
        :disabled="refreshLoading"
        class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <span v-if="refreshLoading" class="mr-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ refreshLoading ? 'Atualizando...' : '🔄 Atualizar Dados' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  refreshLoading: boolean
}

defineProps<Props>()

defineEmits<{
  'new-ticket': []
  'view-all-tickets': []
  'refresh-stats': []
}>()
</script>
