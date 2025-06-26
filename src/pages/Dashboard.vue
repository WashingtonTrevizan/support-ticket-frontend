<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo e Título -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-gray-900">
                🎫 Oncar Suporte
              </h1>
            </div>
          </div>

          <!-- Menu de navegação principal -->
          <div class="hidden md:flex md:items-center md:space-x-8">
            <button 
              @click="activeTab = 'dashboard'"
              :class="activeTab === 'dashboard' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </button>
            <button 
              @click="activeTab = 'tickets'"
              :class="activeTab === 'tickets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
            >
              Tickets
            </button>
            <button 
              @click="activeTab = 'profile'"
              :class="activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
            >
              Perfil
            </button>
          </div>

          <!-- Menu do usuário -->
          <div class="flex items-center space-x-4">
            <!-- Informações do usuário -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ userInitials }}</span>
                </div>
                <div class="hidden md:block">
                  <div class="text-sm font-medium text-gray-900">Usuário</div>
                  <div class="text-xs text-gray-500 capitalize">{{ userRole }}</div>
                </div>
              </div>
              
              <!-- Badge do role -->
              <div v-if="userRole" class="hidden md:block">
                <span 
                  :class="userRole === 'support' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ userRole === 'support' ? 'Suporte' : 'Cliente' }}
                </span>
              </div>
            </div>

            <!-- Botão de logout -->
            <button
              @click="handleLogout"
              :disabled="logoutLoading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="logoutLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ logoutLoading ? 'Saindo...' : 'Sair' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Menu mobile -->
    <div class="md:hidden bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 py-3 space-y-1">
        <button 
          @click="activeTab = 'dashboard'"
          :class="activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </button>
        <button 
          @click="activeTab = 'tickets'"
          :class="activeTab === 'tickets' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Tickets
        </button>
        <button 
          @click="activeTab = 'profile'"
          :class="activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Perfil
        </button>
      </div>
    </div>

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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <p class="text-3xl font-bold text-yellow-600">{{ stats.inProgress }}</p>
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
                    <p class="text-3xl font-bold text-green-600">{{ stats.resolved }}</p>
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
          </div>

          <!-- Ações Rápidas -->
          <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button class="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                ➕ Novo Ticket
              </button>
              <button class="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
                📋 Ver Todos os Tickets
              </button>
              <button class="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                📈 Relatórios
              </button>
            </div>
          </div>

          <!-- Tickets Recentes -->
          <div class="bg-white shadow-lg rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Tickets Recentes</h3>
            <div class="space-y-3">
              <div v-for="ticket in recentTickets" :key="ticket.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">#{{ ticket.id }} - {{ ticket.title }}</p>
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
          </div>
        </div>

        <!-- Tickets Tab -->
        <div v-if="activeTab === 'tickets'" class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Gerenciar Tickets</h2>
          <p class="text-gray-600">Funcionalidade de tickets em desenvolvimento...</p>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Perfil do Usuário</h2>
          <p class="text-gray-600">Configurações de perfil em desenvolvimento...</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado da aplicação
const activeTab = ref('dashboard')
const logoutLoading = ref(false)

// Dados do usuário (simulados por enquanto)
const userRole = ref('client')
const userInitials = computed(() => 'U')

// Estatísticas (simuladas)
const stats = ref({
  open: 12,
  inProgress: 5,
  resolved: 28,
  total: 45
})

// Tickets recentes (simulados)
const recentTickets = ref([
  {
    id: '001',
    title: 'Problema de login',
    status: 'Aberto',
    createdAt: '2 horas atrás'
  },
  {
    id: '002',
    title: 'Erro no sistema',
    status: 'Em Progresso',
    createdAt: '1 dia atrás'
  },
  {
    id: '003',
    title: 'Solicitação de recurso',
    status: 'Resolvido',
    createdAt: '3 dias atrás'
  }
])

// Funções auxiliares
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Aberto':
      return 'bg-blue-100 text-blue-800'
    case 'Em Progresso':
      return 'bg-yellow-100 text-yellow-800'
    case 'Resolvido':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Função de logout
const handleLogout = async () => {
  logoutLoading.value = true
  
  try {
    console.log('Fazendo logout...')
    
    // Limpar dados do localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('isAuthenticated')
    
    // Simular delay de API (opcional)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Logout realizado com sucesso')
    
    // Redirecionar para login
    router.push('/login')
    
  } catch (error) {
    console.error('Erro durante logout:', error)
    // Mesmo com erro, limpar dados locais e redirecionar
    localStorage.clear()
    router.push('/login')
  } finally {
    logoutLoading.value = false
  }
}

// Carregar dados do usuário
onMounted(() => {
  // Carregar role do localStorage
  const storedRole = localStorage.getItem('role')
  if (storedRole) {
    userRole.value = storedRole as 'client' | 'support'
  }
  
  console.log('Dashboard carregado para usuário:', userRole.value)
})
</script>
