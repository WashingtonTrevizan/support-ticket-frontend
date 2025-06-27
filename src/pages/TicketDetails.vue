<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <TicketDetailsHeader @go-back="goBack" />

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        
        <!-- Loading State -->
        <LoadingState 
          v-if="loading" 
          message="Carregando detalhes do ticket..." 
        />

        <!-- Error State -->
        <ErrorState 
          v-else-if="error" 
          :message="error"
          title="Erro ao carregar ticket"
          @retry="loadTicketDetails"
        />

        <!-- Ticket Details -->
        <div v-else-if="ticket" class="space-y-6">
          <!-- Ticket Header -->
          <TicketInfo 
            :ticket="ticket"
            :editing-ticket="editingTicket"
            :is-editing="isEditing"
            :is-support="isSupport"
            :updating-ticket="updatingTicket"
            @start-edit="startEdit"
            @save-ticket="saveTicket"
            @cancel-edit="cancelEdit"
          />

          <!-- Comments Section -->
          <CommentsSection 
            :comments="comments"
            :new-comment="newComment"
            :submitting-comment="submittingComment"
            @update-comment="newComment = $event"
            @add-comment="handleAddComment"
          />
        </div>
      </div>
    </main>

    <!-- Notificação Toast -->
    <NotificationToast 
      :is-visible="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="hideNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import commentsService from '../services/commentsService'
import ticketsService from '../services/ticketsService'

// Componentes
import { TicketDetailsHeader } from '../components/Layout'
import { LoadingState, ErrorState, NotificationToast } from '../components/Shared'
import { TicketInfo } from '../components/Tickets'
import { CommentsSection } from '../components/Comments'

const router = useRouter()
const route = useRoute()

// Estado da aplicação
const loading = ref(true)
const error = ref('')
const ticket = ref<any>(null)
const comments = ref<any[]>([])
const newComment = ref('')
const submittingComment = ref(false)

// Estado para edição (apenas para support)
const isEditing = ref(false)
const editingTicket = ref<{
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high'
}>({
  title: '',
  description: '',
  status: 'open',
  priority: 'low'
})
const updatingTicket = ref(false)

// Estado para notificações
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

// Estado do usuário atual
const currentUser = ref<any>(null)

// Verificar se o usuário é support
const isSupport = computed(() => currentUser.value?.role === 'support')

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

// Carregar usuário atual
const loadCurrentUser = async () => {
  try {
    // TODO: Quando a API /auth/me estiver pronta, descommentar e remover simulação
    // currentUser.value = await authService.me()
    // console.log('Usuário atual:', currentUser.value)
    
    // Temporário: simular usuário support enquanto a API não tem /auth/me
    console.log('⚠️ Simulando usuário support (API /auth/me não disponível)')
    currentUser.value = {
      uuid: 'temp-user-id',
      name: 'Usuário Support',
      email: 'support@example.com',
      role: 'support'
    }
    console.log('Usuário atual (simulado):', currentUser.value)
    
  } catch (error) {
    console.error('Erro ao carregar usuário atual:', error)
    // Em caso de erro, assumir que é support para teste
    currentUser.value = {
      uuid: 'temp-user-id',
      name: 'Usuário Support',
      email: 'support@example.com',
      role: 'support'
    }
  }
}

// Iniciar edição do ticket
const startEdit = () => {
  if (!ticket.value || !isSupport.value) return
  
  editingTicket.value = {
    title: ticket.value.title,
    description: ticket.value.description,
    status: ticket.value.status,
    priority: ticket.value.priority
  }
  isEditing.value = true
}

// Cancelar edição
const cancelEdit = () => {
  isEditing.value = false
  editingTicket.value = {
    title: '',
    description: '',
    status: 'open',
    priority: 'low'
  }
}

// Salvar alterações do ticket
const saveTicket = async () => {
  try {
    updatingTicket.value = true
    
    const ticketId = route.params.id as string
    console.log('Salvando alterações do ticket:', editingTicket.value)
    
    const updatedTicket = await ticketsService.updateTicket(ticketId, editingTicket.value)
    
    // Atualizar dados locais
    ticket.value = { ...ticket.value, ...updatedTicket }
    
    // Sair do modo de edição
    isEditing.value = false
    
    showNotificationMessage('Ticket atualizado com sucesso! ✅', 'success')
    
  } catch (err: any) {
    console.error('Erro ao atualizar ticket:', err)
    
    let errorMessage = 'Erro ao atualizar ticket. Tente novamente.'
    
    if (err.response?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.'
    } else if (err.response?.status === 403) {
      errorMessage = 'Sem permissão para editar este ticket.'
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    }
    
    showNotificationMessage(errorMessage, 'error')
    
  } finally {
    updatingTicket.value = false
  }
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
onMounted(async () => {
  await Promise.all([
    loadTicketDetails(),
    loadCurrentUser()
  ])
})
</script>
