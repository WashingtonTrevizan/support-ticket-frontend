<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Gerenciar Tickets</h2>
          <p class="mt-1 text-sm text-gray-600">Visualize e gerencie todos os tickets do sistema</p>
        </div>
        <div class="flex space-x-3">
          <button 
            @click="$emit('new-ticket')"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
          >
            <span class="mr-2">➕</span>
            Novo Ticket
          </button>
          <button 
            @click="$emit('refresh')"
            :disabled="loading"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span class="mr-2">🔄</span>
            {{ loading ? 'Carregando...' : 'Atualizar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Indicador de carregamento -->
    <div v-if="loading" class="flex justify-center items-center p-12">
      <div class="flex items-center space-x-3">
        <svg class="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 text-lg">Carregando todos os tickets...</span>
      </div>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="error" class="p-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span class="text-red-500 text-xl">⚠️</span>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-red-800">Erro ao carregar tickets</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button 
              @click="$emit('refresh')" 
              class="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Tickets -->
    <div v-if="!loading && !error && tickets.length > 0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID / Título
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criado em
              </th>
            </tr>
          </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="ticket in tickets" 
            :key="ticket.id" 
            @click="$emit('ticket-click', ticket.id)"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-xs text-gray-500 font-mono">#{{ (ticket.id || '').substring(0, 8) }}</div>
                <div class="text-sm font-medium text-gray-900 mt-1">{{ ticket.title || 'Sem título' }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 max-w-md">
                <p class="line-clamp-2">{{ ticket.description || 'Sem descrição' }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="getStatusClass(ticket.status || '')"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ ticket.status || 'Sem status' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="getPriorityClass(ticket.priority || '')"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ ticket.priority || 'Sem prioridade' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-600">
                      {{ (ticket.author || 'N/A').split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2) }}
                    </span>
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ ticket.author || 'Usuário não identificado' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ ticket.createdAt || 'Data não disponível' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginação -->
      <Pagination 
        v-if="props.showPagination"
        :current-page="props.currentPage"
        :total-pages="props.totalPages"
        :total="props.total"
        :limit="props.limit"
        @previous="$emit('previous-page')"
        @next="$emit('next-page')"
        @go-to-page="$emit('go-to-page', $event)"
        @change-limit="$emit('change-limit', $event)"
      />
    </div>

    <!-- Mensagem quando não há tickets -->
    <div v-else-if="!loading && tickets.length === 0" class="text-center p-12">
      <div class="flex flex-col items-center">
        <span class="text-6xl mb-4">📋</span>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum ticket encontrado</h3>
        <p class="text-gray-500 mb-6">Crie seu primeiro ticket para começar!</p>
        <button 
          @click="$emit('new-ticket')"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
        >
          <span class="mr-2">➕</span>
          Criar Primeiro Ticket
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '../Shared/Pagination.vue'

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  createdAt: string
  author: string
}

interface Props {
  tickets: Ticket[]
  loading: boolean
  error: string
  // Paginação
  showPagination?: boolean
  currentPage?: number
  totalPages?: number
  total?: number
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  showPagination: false,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  limit: 10
})

defineEmits<{
  'new-ticket': []
  refresh: []
  'ticket-click': [ticketId: string]
  // Eventos de paginação
  'previous-page': []
  'next-page': []
  'go-to-page': [page: number]
  'change-limit': [limit: number]
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

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return 'bg-red-100 text-red-800'
    case 'Média':
      return 'bg-yellow-100 text-yellow-800'
    case 'Baixa':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
