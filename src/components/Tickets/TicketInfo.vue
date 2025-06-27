<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <div class="text-sm text-gray-500 font-mono mb-1">
          #{{ ticket.uuid.substring(0, 8) }}
        </div>
        
        <!-- Título - Modo Edição ou Visualização -->
        <div v-if="!isEditing">
          <h1 class="text-3xl font-bold text-gray-900">{{ ticket.title }}</h1>
        </div>
        <div v-else class="mb-4">
          <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            id="edit-title"
            v-model="editingTicket.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Título do ticket"
          />
        </div>
      </div>
      
      <div class="flex items-center space-x-3 ml-4">
        <!-- Badges de Status e Prioridade - Modo Visualização -->
        <div v-if="!isEditing" class="flex space-x-3">
          <span 
            :class="getStatusClass(ticket.status)"
            class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
          >
            {{ getStatusDisplay(ticket.status) }}
          </span>
          <span 
            :class="getPriorityClass(ticket.priority)"
            class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
          >
            {{ getPriorityDisplay(ticket.priority) }}
          </span>
        </div>
        
        <!-- Botões de Edição (apenas para support) -->
        <div v-if="isSupport && !isEditing" class="flex space-x-2">
          <button
            @click="$emit('start-edit')"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center text-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Editar Ticket
          </button>
        </div>
        
        <!-- Botões de Salvar/Cancelar (modo edição) -->
        <div v-if="isEditing" class="flex space-x-2">
          <button
            @click="$emit('save-ticket')"
            :disabled="updatingTicket"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="updatingTicket" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ updatingTicket ? 'Salvando...' : 'Salvar' }}
          </button>
          <button
            @click="$emit('cancel-edit')"
            :disabled="updatingTicket"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Controles de Status e Prioridade - Modo Edição -->
    <div v-if="isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label for="edit-status" class="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="edit-status"
          v-model="editingTicket.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="open">Aberto</option>
          <option value="in_progress">Em Progresso</option>
          <option value="closed">Fechado</option>
        </select>
      </div>
      
      <div>
        <label for="edit-priority" class="block text-sm font-medium text-gray-700 mb-2">
          Prioridade
        </label>
        <select
          id="edit-priority"
          v-model="editingTicket.priority"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>
    </div>

    <!-- Ticket Meta Info -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Autor</label>
        <div class="flex items-center">
          <div class="flex-shrink-0 h-8 w-8">
            <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-xs font-medium text-gray-600">
                {{ getAuthorInitials(ticket.creator) }}
              </span>
            </div>
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-900">
              {{ ticket.creator?.name || ticket.creator?.email || 'Usuário não identificado' }}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Criado em</label>
        <div class="text-sm text-gray-900">{{ formatDate(ticket.createdAt) }}</div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Última atualização</label>
        <div class="text-sm text-gray-900">{{ formatDate(ticket.updatedAt) }}</div>
      </div>
    </div>

    <!-- Ticket Description -->
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-2">Descrição</label>
      
      <!-- Modo Visualização -->
      <div v-if="!isEditing" class="bg-gray-50 rounded-lg p-4">
        <p class="text-gray-900 whitespace-pre-wrap">{{ ticket.description }}</p>
      </div>
      
      <!-- Modo Edição -->
      <div v-else>
        <textarea
          v-model="editingTicket.description"
          rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Descrição do ticket..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Ticket {
  uuid: string
  title: string
  status: string
  priority: string
  description: string
  creator: any
  createdAt: string
  updatedAt: string
}

interface EditingTicket {
  title: string
  status: string
  priority: string
  description: string
}

interface Props {
  ticket: Ticket
  editingTicket: EditingTicket
  isEditing: boolean
  isSupport: boolean
  updatingTicket: boolean
}

defineProps<Props>()

defineEmits<{
  'start-edit': []
  'cancel-edit': []
  'save-ticket': []
}>()

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  } catch (error) {
    return dateString
  }
}

const getAuthorInitials = (user: any) => {
  if (!user) return 'U'
  const name = user.name || user.email || 'Usuario'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
}

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'open':
      return 'Aberto'
    case 'in_progress':
      return 'Em Progresso'
    case 'closed':
      return 'Fechado'
    default:
      return status
  }
}

const getPriorityDisplay = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'Baixa'
    case 'medium':
      return 'Média'
    case 'high':
      return 'Alta'
    default:
      return priority
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'closed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
