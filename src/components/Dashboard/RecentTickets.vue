<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">Tickets Recentes</h3>
      <button 
        @click="$emit('refresh')"
        :disabled="loading"
        class="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
      >
        {{ loading ? 'Carregando...' : '🔄 Atualizar' }}
      </button>
    </div>
    
    <!-- Indicador de carregamento -->
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div class="flex items-center space-x-3">
        <svg class="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">Carregando tickets...</span>
      </div>
    </div>
    
    <!-- Lista de tickets -->
    <div v-else-if="tickets.length > 0" class="space-y-3">
      <div 
        v-for="ticket in tickets" 
        :key="ticket.id" 
        @click="$emit('ticket-click', ticket.id)"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
      >
        <div>
          <p class="font-medium text-gray-900">#{{ ticket.id.substring(0, 8) }} - {{ ticket.title }}</p>
          <p class="text-sm text-gray-500">{{ ticket.createdAt }}</p>
        </div>
        <span 
          :class="getStatusClass(ticket.status)"
          class="px-2 py-1 text-xs font-medium rounded-full"
        >
          {{ ticket.status }}
        </span>
      </div>
    </div>
    
    <!-- Mensagem quando não há tickets -->
    <div v-else class="text-center p-8 text-gray-500">
      <p>Nenhum ticket encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Ticket {
  id: string
  title: string
  status: string
  createdAt: string
}

interface Props {
  tickets: Ticket[]
  loading: boolean
}

defineProps<Props>()

defineEmits<{
  refresh: []
  'ticket-click': [ticketId: string]
}>()

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Aberto':
      return 'bg-blue-100 text-blue-800'
    case 'Em Progresso':
      return 'bg-yellow-100 text-yellow-800'
    case 'Fechado':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
