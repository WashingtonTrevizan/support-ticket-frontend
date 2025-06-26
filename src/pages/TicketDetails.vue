<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button 
              @click="goBack"
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

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center p-12">
          <div class="flex items-center space-x-3">
            <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600 text-lg">Carregando detalhes do ticket...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-red-500 text-xl">⚠️</span>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-red-800">Erro ao carregar ticket</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
              <button 
                @click="loadTicketDetails" 
                class="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>

        <!-- Ticket Details -->
        <div v-else-if="ticket" class="space-y-6">
          <!-- Ticket Header -->
          <div class="bg-white shadow-lg rounded-lg p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="text-sm text-gray-500 font-mono mb-1">
                  #{{ ticket.uuid.substring(0, 8) }}
                </div>
                <h1 class="text-3xl font-bold text-gray-900">{{ ticket.title }}</h1>
              </div>
              <div class="flex space-x-3">
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
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-900 whitespace-pre-wrap">{{ ticket.description }}</p>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="bg-white shadow-lg rounded-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-900">Comentários</h2>
              <span class="text-sm text-gray-500">
                {{ comments.length }} {{ comments.length === 1 ? 'comentário' : 'comentários' }}
              </span>
            </div>

            <!-- Comments List -->
            <div v-if="comments.length > 0" class="space-y-4 mb-6">
              <div 
                v-for="comment in comments" 
                :key="comment.uuid"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600">
                        {{ getAuthorInitials(comment.author) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm font-medium text-gray-900">
                        {{ comment.author?.name || comment.author?.email || 'Usuário não identificado' }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(comment.createdAt) }}
                      </span>
                    </div>
                    <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Comments State -->
            <div v-else class="text-center py-8">
              <span class="text-4xl mb-4 block">💬</span>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum comentário ainda</h3>
              <p class="text-gray-500 mb-4">Seja o primeiro a comentar neste ticket!</p>
            </div>

            <!-- Add Comment Form -->
            <div class="border-t pt-6">
              <form @submit.prevent="handleAddComment">
                <div class="mb-4">
                  <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar comentário
                  </label>
                  <textarea
                    id="comment"
                    v-model="newComment"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Digite seu comentário..."
                  ></textarea>
                </div>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="!newComment.trim() || submittingComment"
                    class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    <span v-if="submittingComment" class="mr-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    {{ submittingComment ? 'Enviando...' : 'Enviar Comentário' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Notificação Toast -->
    <div 
      v-if="showNotification"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out"
      :class="notificationType === 'success' ? 'border-green-500' : 'border-red-500'"
    >
      <div class="p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span v-if="notificationType === 'success'" class="text-green-500 text-xl">✅</span>
            <span v-else class="text-red-500 text-xl">❌</span>
          </div>
          <div class="ml-3 flex-1">
            <p :class="notificationType === 'success' ? 'text-green-800' : 'text-red-800'" class="text-sm font-medium">
              {{ notificationMessage }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="hideNotification"
              class="inline-flex text-gray-400 hover:text-gray-600"
            >
              <span class="sr-only">Fechar</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import commentsService from '../services/commentsService'

const router = useRouter()
const route = useRoute()

// Estado da aplicação
const loading = ref(true)
const error = ref('')
const ticket = ref<any>(null)
const comments = ref<any[]>([])
const newComment = ref('')
const submittingComment = ref(false)

// Estado para notificações
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

// Funções auxiliares
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

// Função para mostrar notificações
const showNotificationMessage = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  
  setTimeout(() => {
    showNotification.value = false
  }, 5000)
}

const hideNotification = () => {
  showNotification.value = false
}

// Carregar detalhes do ticket
const loadTicketDetails = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const ticketId = route.params.id as string
    console.log('Carregando detalhes do ticket:', ticketId)
    
    const response = await api.get(`/api/v1/tickets/${ticketId}?includeComments=true`)
    const data = response.data
    
    ticket.value = data
    comments.value = data.comments || []
    
    console.log('Detalhes do ticket carregados:', data)
    
  } catch (err: any) {
    console.error('Erro ao carregar detalhes do ticket:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Ticket não encontrado.'
    } else if (err.response?.status === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
    } else if (err.response?.status === 403) {
      error.value = 'Sem permissão para acessar este ticket.'
    } else {
      error.value = err.response?.data?.message || 'Erro ao carregar detalhes do ticket.'
    }
  } finally {
    loading.value = false
  }
}

// Adicionar comentário
const handleAddComment = async () => {
  try {
    submittingComment.value = true
    
    const ticketId = route.params.id as string
    const commentData = {
      content: newComment.value.trim()
    }
    
    console.log('Adicionando comentário:', commentData)
    
    const newCommentData = await commentsService.createComment(ticketId, commentData)
    
    // Adicionar novo comentário à lista
    comments.value.push(newCommentData)
    
    // Limpar formulário
    newComment.value = ''
    
    showNotificationMessage('Comentário adicionado com sucesso! 💬', 'success')
    
  } catch (err: any) {
    console.error('Erro ao adicionar comentário:', err)
    
    let errorMessage = 'Erro ao adicionar comentário. Tente novamente.'
    
    if (err.response?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.'
    } else if (err.response?.status === 403) {
      errorMessage = 'Sem permissão para comentar neste ticket.'
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    }
    
    showNotificationMessage(errorMessage, 'error')
    
  } finally {
    submittingComment.value = false
  }
}

// Voltar à página anterior
const goBack = () => {
  // Redirecionar para o dashboard com a aba tickets ativa
  router.push('/dashboard?tab=tickets')
}

// Carregar dados na montagem
onMounted(() => {
  loadTicketDetails()
})
</script>
