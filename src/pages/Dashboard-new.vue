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

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
          <!-- Debug: Botão temporário para forçar carregamento -->
          <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm text-yellow-800 mb-2">🔧 Debug: Estado atual dos tickets</p>
            <div class="text-xs text-yellow-700 space-y-1">
              <p>Tickets length: {{ allTickets.length }}</p>
              <p>Loading: {{ allTicketsLoading }}</p>
              <p>Error: {{ ticketsError || 'nenhum' }}</p>
              <p>Página: {{ currentPage }}/{{ totalPages }}</p>
              <p>Total: {{ totalTickets }}</p>
              <p>Token: {{ hasToken ? '✅ Presente' : '❌ Ausente' }} | Backend: {{ backendUrl }}</p>
            </div>
            <button 
              @click="loadAllTickets" 
              class="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 mr-2"
            >
              🔄 Forçar Carregamento
            </button>
            <button 
              @click="checkAuth" 
              class="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              🔍 Verificar Auth
            </button>
          </div>
          
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
import { ref, onMounted, watch, computed } from 'vue'
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
  createdAt: string
  author: string
}>>([])
const ticketsError = ref('')

// Estado da paginação
const currentPage = ref(1)
const limit = ref(10)
const totalTickets = ref(0)
const totalPages = ref(0)

// Estado do modal de novo ticket
const showNewTicketModal = ref(false)
const creatingTicket = ref(false)

// Estado para notificações
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

// Dados do usuário (serão carregados do localStorage/token)
const userRole = ref('client')
const userName = ref('')

// Estatísticas (serão carregadas da API)
const stats = ref<TicketStats>({
  open: 0,
  in_progress: 0,
  closed: 0,
  total: 0
})

// Propriedades computadas para debug
const hasToken = computed(() => {
  return !!localStorage.getItem('token')
})

const backendUrl = computed(() => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3001'
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
    
    console.log('Carregando estatísticas de tickets...')
    const ticketStats = await ticketsService.getStats()
    stats.value = ticketStats
    console.log('Estatísticas carregadas:', stats.value)
    
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
    console.log('Carregando tickets recentes...')
    
    const tickets = await ticketsService.getRecentTickets()
    
    recentTickets.value = tickets.map(ticket => ({
      id: ticket.uuid,
      title: ticket.title,
      status: getStatusDisplay(ticket.status),
      createdAt: formatDate(ticket.createdAt)
    }))
    
    console.log('Tickets recentes carregados:', recentTickets.value.length)
    
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
    
    console.log(`🔄 Carregando tickets - Página ${currentPage.value}, Limite ${limit.value}`)
    
    // Usar método paginado
    const response = await ticketsService.getTicketsPaginated({
      page: currentPage.value,
      limit: limit.value
    })
    
    console.log('✅ Resposta da paginação:', response)
    
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
      createdAt: formatDate(ticket.createdAt),
      author: ticket.creator?.name || ticket.creator?.email || 'Usuário não identificado'
    }))
    
    console.log(`✅ Tickets carregados: ${allTickets.value.length} de ${totalTickets.value} total`)
    
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

// Função para verificar autenticação (debug)
const checkAuth = () => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  
  console.log('🔍 Verificação de Autenticação:')
  console.log('Token:', token ? `${token.substring(0, 20)}...` : 'Não encontrado')
  console.log('Role:', role)
  console.log('Backend URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001')
  
  if (!token) {
    alert('❌ Token não encontrado! Faça login novamente.')
    router.push('/login')
  } else {
    alert('✅ Token encontrado! Verificando comunicação com API...')
    loadAllTickets()
  }
}

// Função de logout
const handleLogout = async () => {
  logoutLoading.value = true
  
  try {
    console.log('Fazendo logout...')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('isAuthenticated')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Logout realizado com sucesso')
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

const handleCreateTicket = async (formData: { title: string; description: string; priority: 'low' | 'medium' | 'high' | '' }) => {
  try {
    creatingTicket.value = true
    
    console.log('Criando novo ticket:', formData)
    
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
    
    const ticketData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: 'open' as const
    }
    
    await ticketsService.createTicket(ticketData)
    
    console.log('Ticket criado com sucesso!')
    
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
  console.log('🔄 Mudou para aba:', newTab)
  if (newTab === 'tickets') {
    console.log('📋 Carregando tickets para aba tickets...')
    loadAllTickets()
  }
})

// Debug: watch do estado dos tickets
watch([allTickets, allTicketsLoading, ticketsError], ([tickets, loading, error]) => {
  console.log('🎫 Estado dos tickets mudou:', {
    ticketsCount: tickets.length,
    loading,
    error,
    currentPage: currentPage.value,
    totalTickets: totalTickets.value,
    totalPages: totalPages.value
  })
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
  if (tabParam && ['dashboard', 'tickets', 'profile'].includes(tabParam)) {
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
  
  console.log('Dashboard carregado para usuário:', userRole.value, userName.value)
  
  // Carregar dados da API em paralelo
  await Promise.all([
    loadTicketStats(),
    loadRecentTickets(),
    loadAllTickets()
  ])
  
  console.log('✅ Dashboard totalmente carregado!')
})
</script>
