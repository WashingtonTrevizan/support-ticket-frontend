<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation Header -->
    <DashboardHeader 
      :user-name="userName"
      :user-role="userRole"
      :logout-loading="logoutLoading"
      :active-tab="activeTab"
      @logout="handleLogout"
      @change-tab="activeTab = $event"
    />

    <!-- Conteúdo Principal com padding-top para compensar header fixo e margin-top adicional -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24 md:pt-20 mt-5">
      <div class="px-4 py-6 sm:px-0">
        
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p class="mt-2 text-gray-600">Visão geral do sistema de tickets</p>
          </div>

          <!-- Estatísticas -->
          <div class="mb-8">
            <StatsCards 
              :stats="stats"
              :loading="statsLoading"
              :error="statsError"
              @retry="loadTicketStats"
            />
          </div>

          <!-- Ações Rápidas -->
          <div class="mb-8">
            <QuickActions 
              :refresh-loading="statsLoading"
              @new-ticket="openNewTicketModal"
              @view-all-tickets="activeTab = 'tickets'"
              @refresh-stats="loadTicketStats"
            />
          </div>

          <!-- Tickets Recentes -->
          <RecentTickets 
            :tickets="recentTickets"
            :loading="recentTicketsLoading"
            @refresh="loadRecentTickets"
            @ticket-click="navigateToTicket"
          />
        </div>

        <!-- Tickets Tab -->
        <div v-if="activeTab === 'tickets'">
          <TicketsTable 
            :tickets="allTickets"
            :loading="allTicketsLoading"
            :error="ticketsError"
            :show-pagination="true"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total="totalTickets"
            :limit="limit"
            @new-ticket="openNewTicketModal"
            @refresh="loadAllTickets"
            @ticket-click="navigateToTicket"
            @previous-page="handlePreviousPage"
            @next-page="handleNextPage"
            @go-to-page="handleGoToPage"
            @change-limit="handleChangeLimit"
          />
        </div>

        <!-- My Tickets Tab (apenas para Support) -->
        <div v-if="activeTab === 'my-tickets'">
          <TicketsTable 
            :tickets="myTickets"
            :loading="myTicketsLoading"
            :error="myTicketsError"
            :show-pagination="true"
            :current-page="myCurrentPage"
            :total-pages="myTotalPages"
            :total="myTotalTickets"
            :limit="myLimit"
            @new-ticket="openNewTicketModal"
            @refresh="loadMyTickets"
            @ticket-click="navigateToTicket"
            @previous-page="handleMyPreviousPage"
            @next-page="handleMyNextPage"
            @go-to-page="handleMyGoToPage"
            @change-limit="handleMyChangeLimit"
          />
        </div>

        <!-- Users Tab (apenas para Support) -->
        <div v-if="activeTab === 'users'" class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Gestão de Usuários</h2>
          <p class="text-gray-600">Funcionalidade de gestão de usuários em desenvolvimento...</p>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Perfil do Usuário</h2>
          <p class="text-gray-600">Configurações de perfil em desenvolvimento...</p>
        </div>

      </div>
    </main>

    <!-- Modal de Novo Ticket -->
    <TicketModal 
      :is-open="showNewTicketModal"
      :loading="creatingTicket"
      @close="closeNewTicketModal"
      @submit="handleCreateTicket"
    />

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
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ticketsService, { type TicketStats } from '../services/ticketsService'

// Importar componentes
import { DashboardHeader } from '../components/Layout'
import { StatsCards, QuickActions, RecentTickets } from '../components/Dashboard'
import { TicketsTable, TicketModal } from '../components/Tickets'
import { NotificationToast } from '../components/Shared'

const router = useRouter()
const route = useRoute()

// Estado da aplicação
const activeTab = ref('dashboard')
const logoutLoading = ref(false)
const statsLoading = ref(false)
const statsError = ref('')
const recentTicketsLoading = ref(false)

// Estado para a aba de tickets
const allTicketsLoading = ref(false)
const allTickets = ref<Array<{
  id: string
  title: string
  description: string
  status: string
  priority: string
  type: string
  createdAt: string
  author: string
}>>([])
const ticketsError = ref('')

// Estado da paginação
const currentPage = ref(1)
const limit = ref(10)
const totalTickets = ref(0)
const totalPages = ref(0)

// Estado para "Meus Tickets" (para usuários Support)
const myTicketsLoading = ref(false)
const myTickets = ref<Array<{
  id: string
  title: string
  description: string
  status: string
  priority: string
  type: string
  createdAt: string
  author: string
}>>([])
const myTicketsError = ref('')
const myCurrentPage = ref(1)
const myLimit = ref(10)
const myTotalTickets = ref(0)
const myTotalPages = ref(0)

// Estado do modal de novo ticket
const showNewTicketModal = ref(false)
const creatingTicket = ref(false)

// Estado para notificações
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

// Dados do usuário (serão carregados do localStorage/token)
const userRole = ref('support') // Temporariamente forçado para 'support' para testar
const userName = ref('')

// Estatísticas (serão carregadas da API)
const stats = ref<TicketStats>({
  open: 0,
  in_progress: 0,
  closed: 0,
  total: 0
})

// Tickets recentes (carregados da API)
const recentTickets = ref<Array<{
  id: string
  title: string
  status: string
  createdAt: string
}>>([])

// Funções para carregar dados da API
const loadTicketStats = async () => {
  try {
    statsLoading.value = true
    statsError.value = ''
    
    const ticketStats = await ticketsService.getStats()
    stats.value = ticketStats
    
  } catch (error: any) {
    console.error('Erro ao carregar estatísticas:', error)
    
    if (error.response?.status === 401) {
      statsError.value = 'Sessão expirada. Faça login novamente.'
    } else if (error.response?.status === 403) {
      statsError.value = 'Sem permissão para acessar os dados.'
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      statsError.value = 'Erro de conexão com o servidor.'
    } else {
      statsError.value = error.response?.data?.message || 'Erro ao carregar dados.'
    }
    
    stats.value = { open: 0, in_progress: 0, closed: 0, total: 0 }
  } finally {
    statsLoading.value = false
  }
}

// Função para carregar tickets recentes
const loadRecentTickets = async () => {
  try {
    recentTicketsLoading.value = true
    
    const tickets = await ticketsService.getRecentTickets()
    
    recentTickets.value = tickets.map(ticket => ({
      id: ticket.uuid,
      title: ticket.title,
      status: getStatusDisplay(ticket.status),
      createdAt: formatDate(ticket.createdAt)
    }))
    
  } catch (error: any) {
    console.error('Erro ao carregar tickets recentes:', error)
    recentTickets.value = []
  } finally {
    recentTicketsLoading.value = false
  }
}

// Função para carregar todos os tickets com paginação
const loadAllTickets = async () => {
  try {
    allTicketsLoading.value = true
    ticketsError.value = ''
    
    // Usar método paginado
    const response = await ticketsService.getTicketsPaginated({
      page: currentPage.value,
      limit: limit.value
    })
    
    // Atualizar estado da paginação
    totalTickets.value = response.total
    totalPages.value = response.totalPages
    currentPage.value = response.page
    limit.value = response.limit
    
    // Transformar tickets da API para o formato do componente
    allTickets.value = response.tickets.map(ticket => ({
      id: ticket.uuid,
      title: ticket.title,
      description: ticket.description,
      status: getStatusDisplay(ticket.status),
      priority: getPriorityDisplay(ticket.priority),
      type: ticket.type || 'suporte_tecnico',
      createdAt: formatDate(ticket.createdAt),
      author: ticket.creator?.name || ticket.creator?.email || 'Usuário não identificado'
    }))
    
  } catch (error: any) {
    console.error('❌ Erro ao carregar todos os tickets:', error)
    
    // Tratar diferentes tipos de erro
    if (error.response?.status === 401) {
      ticketsError.value = 'Sessão expirada. Faça login novamente.'
    } else if (error.response?.status === 403) {
      ticketsError.value = 'Sem permissão para acessar os tickets.'
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      ticketsError.value = 'Erro de conexão com o servidor.'
    } else {
      ticketsError.value = error.response?.data?.message || 'Erro ao carregar tickets.'
    }
    
    allTickets.value = []
    totalTickets.value = 0
    totalPages.value = 0
  } finally {
    allTicketsLoading.value = false
  }
}

// Função para carregar "Meus Tickets" (tickets atribuídos ao usuário support)
const loadMyTickets = async () => {
  try {
    myTicketsLoading.value = true
    myTicketsError.value = ''
    
    // Por enquanto, vamos usar a mesma API de tickets mas com filtro
    // Você pode implementar uma endpoint específica para "meus tickets" depois
    const response = await ticketsService.getTicketsPaginated({
      page: myCurrentPage.value,
      limit: myLimit.value
      // Aqui você pode adicionar filtro por assignee quando implementar
    })
    
    // Atualizar estado da paginação para "Meus Tickets"
    myTotalTickets.value = response.total
    myTotalPages.value = response.totalPages
    myCurrentPage.value = response.page
    myLimit.value = response.limit
    
    // Transformar tickets da API para o formato do componente
    myTickets.value = response.tickets.map(ticket => ({
      id: ticket.uuid,
      title: ticket.title,
      description: ticket.description,
      status: getStatusDisplay(ticket.status),
      priority: getPriorityDisplay(ticket.priority),
      type: ticket.type || 'suporte_tecnico',
      createdAt: formatDate(ticket.createdAt),
      author: ticket.creator?.name || ticket.creator?.email || 'Usuário não identificado'
    }))
    
  } catch (error: any) {
    console.error('❌ Erro ao carregar meus tickets:', error)
    
    if (error.response?.status === 401) {
      myTicketsError.value = 'Sessão expirada. Faça login novamente.'
    } else if (error.response?.status === 403) {
      myTicketsError.value = 'Sem permissão para acessar os tickets.'
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      myTicketsError.value = 'Erro de conexão com o servidor.'
    } else {
      myTicketsError.value = error.response?.data?.message || 'Erro ao carregar meus tickets.'
    }
    
    myTickets.value = []
    myTotalTickets.value = 0
    myTotalPages.value = 0
  } finally {
    myTicketsLoading.value = false
  }
}

// Funções de paginação
const handlePreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadAllTickets()
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadAllTickets()
  }
}

const handleGoToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadAllTickets()
  }
}

const handleChangeLimit = (newLimit: number) => {
  limit.value = newLimit
  currentPage.value = 1
  loadAllTickets()
}

// Funções de paginação para "Meus Tickets"
const handleMyPreviousPage = () => {
  if (myCurrentPage.value > 1) {
    myCurrentPage.value--
    loadMyTickets()
  }
}

const handleMyNextPage = () => {
  if (myCurrentPage.value < myTotalPages.value) {
    myCurrentPage.value++
    loadMyTickets()
  }
}

const handleMyGoToPage = (page: number) => {
  if (page >= 1 && page <= myTotalPages.value) {
    myCurrentPage.value = page
    loadMyTickets()
  }
}

const handleMyChangeLimit = (newLimit: number) => {
  myLimit.value = newLimit
  myCurrentPage.value = 1
  loadMyTickets()
}

// Funções auxiliares
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'open': return 'Aberto'
    case 'in_progress': return 'Em Progresso'
    case 'closed': return 'Fechado'
    default: return status
  }
}

const getPriorityDisplay = (priority: string) => {
  switch (priority) {
    case 'low': return 'Baixa'
    case 'medium': return 'Média'
    case 'high': return 'Alta'
    default: return priority
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    
    if (diffInHours < 1) {
      return 'Agora há pouco'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} horas atrás`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} dias atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  } catch (error) {
    return dateString
  }
}

// Função de logout
const handleLogout = async () => {
  logoutLoading.value = true
  
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('isAuthenticated')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/login')
    
  } catch (error) {
    console.error('Erro durante logout:', error)
    localStorage.clear()
    router.push('/login')
  } finally {
    logoutLoading.value = false
  }
}

// Funções do modal de novo ticket
const openNewTicketModal = () => {
  showNewTicketModal.value = true
}

const closeNewTicketModal = () => {
  showNewTicketModal.value = false
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

const handleCreateTicket = async (formData: { title: string; description: string; priority: 'low' | 'medium' | 'high' | ''; type: 'bug' | 'suporte_tecnico' | 'solicitacao' | 'sugestao_implementacao' | '' }) => {
  try {
    creatingTicket.value = true
    
    if (!formData.title.trim()) {
      showNotificationMessage('Por favor, digite um título para o ticket.', 'error')
      return
    }
    
    if (!formData.description.trim()) {
      showNotificationMessage('Por favor, digite uma descrição para o ticket.', 'error')
      return
    }
    
    if (!formData.priority) {
      showNotificationMessage('Por favor, selecione uma prioridade para o ticket.', 'error')
      return
    }

    if (!formData.type) {
      showNotificationMessage('Por favor, selecione um tipo para o ticket.', 'error')
      return
    }
    
    const ticketData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      type: formData.type,
      status: 'open' as const
    }
    
    await ticketsService.createTicket(ticketData)
    
    closeNewTicketModal()
    
    await Promise.all([
      loadTicketStats(),
      loadRecentTickets()
    ])
    
    if (activeTab.value === 'tickets') {
      await loadAllTickets()
    }
    
    showNotificationMessage('Ticket criado com sucesso! 🎉', 'success')
    
  } catch (error: any) {
    console.error('Erro ao criar ticket:', error)
    
    let errorMessage = 'Erro ao criar ticket. Tente novamente.'
    
    if (error.response?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.'
    } else if (error.response?.status === 403) {
      errorMessage = 'Sem permissão para criar tickets.'
    } else if (error.response?.status === 422) {
      errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    showNotificationMessage(errorMessage, 'error')
    
  } finally {
    creatingTicket.value = false
  }
}

// Watcher para carregar tickets quando a aba for ativada
watch(activeTab, (newTab) => {
  if (newTab === 'tickets') {
    loadAllTickets()
  } else if (newTab === 'my-tickets') {
    loadMyTickets()
  }
})

// Função para navegar para detalhes do ticket
const navigateToTicket = (ticketId: string) => {
  router.push(`/ticket/${ticketId}`)
}

// Carregar dados do usuário e estatísticas
onMounted(async () => {
  // Carregar dados do localStorage
  const storedRole = localStorage.getItem('role')
  if (storedRole) {
    userRole.value = storedRole as 'client' | 'support'
  }
  
  // Verificar se há parâmetro de query para definir a aba ativa
  const tabParam = route.query.tab as string
  if (tabParam && ['dashboard', 'tickets', 'my-tickets', 'users', 'profile'].includes(tabParam)) {
    activeTab.value = tabParam
  }
  
  // Tentar extrair nome do usuário do token (se disponível)
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.email) {
        userName.value = payload.email.split('@')[0]
      }
    }
  } catch (error) {
    console.warn('Erro ao extrair nome do token:', error)
  }
  
  // Carregar dados da API em paralelo
  await Promise.all([
    loadTicketStats(),
    loadRecentTickets(),
    loadAllTickets(),
    // Carregar "Meus Tickets" também se o usuário for support
    userRole.value === 'support' ? loadMyTickets() : Promise.resolve()
  ])
})
</script>
