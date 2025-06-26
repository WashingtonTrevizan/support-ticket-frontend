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
                  <div class="text-sm font-medium text-gray-900">{{ userName || 'Usuário' }}</div>
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
            <!-- Indicador de carregamento -->
            <div v-if="statsLoading" class="col-span-full flex justify-center items-center p-8">
              <div class="flex items-center space-x-3">
                <svg class="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600">Carregando estatísticas...</span>
              </div>
            </div>

            <!-- Mensagem de erro -->
            <div v-else-if="statsError" class="col-span-full">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="text-red-500 text-lg">⚠️</span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-800">{{ statsError }}</p>
                    <button 
                      @click="loadTicketStats" 
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

          <!-- Ações Rápidas -->
          <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button 
                @click="openNewTicketModal"
                class="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                ➕ Novo Ticket
              </button>
              <button 
                @click="activeTab = 'tickets'"
                class="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                📋 Ver Todos os Tickets
              </button>
              <button class="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                📈 Relatórios
              </button>
              <button 
                @click="loadTicketStats"
                :disabled="statsLoading"
                class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span v-if="statsLoading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ statsLoading ? 'Atualizando...' : '🔄 Atualizar Dados' }}
              </button>
            </div>
          </div>

          <!-- Tickets Recentes -->
          <div class="bg-white shadow-lg rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Tickets Recentes</h3>
              <button 
                @click="loadRecentTickets"
                :disabled="recentTicketsLoading"
                class="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
              >
                {{ recentTicketsLoading ? 'Carregando...' : '🔄 Atualizar' }}
              </button>
            </div>
            
            <!-- Indicador de carregamento -->
            <div v-if="recentTicketsLoading" class="flex justify-center items-center p-8">
              <div class="flex items-center space-x-3">
                <svg class="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600">Carregando tickets...</span>
              </div>
            </div>
            
            <!-- Lista de tickets -->
            <div v-else-if="recentTickets.length > 0" class="space-y-3">
              <div v-for="ticket in recentTickets" :key="ticket.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
        </div>

        <!-- Tickets Tab -->
        <div v-if="activeTab === 'tickets'">
          <div class="mb-8">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-3xl font-bold text-gray-900">Gerenciar Tickets</h2>
                <p class="mt-2 text-gray-600">Visualize e gerencie todos os tickets do sistema</p>
              </div>
              <div class="flex space-x-3">
                <button 
                  @click="openNewTicketModal"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                >
                  <span class="mr-2">➕</span>
                  Novo Ticket
                </button>
                <button 
                  @click="loadAllTickets"
                  :disabled="allTicketsLoading"
                  class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  <span v-if="allTicketsLoading" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span class="mr-2">🔄</span>
                  {{ allTicketsLoading ? 'Carregando...' : 'Atualizar' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Container dos Tickets -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Indicador de carregamento -->
            <div v-if="allTicketsLoading" class="flex justify-center items-center p-12">
              <div class="flex items-center space-x-3">
                <svg class="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600 text-lg">Carregando todos os tickets...</span>
              </div>
            </div>

            <!-- Mensagem de erro -->
            <div v-else-if="ticketsError" class="p-8">
              <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="text-red-500 text-xl">⚠️</span>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-red-800">Erro ao carregar tickets</h3>
                    <p class="text-sm text-red-700 mt-1">{{ ticketsError }}</p>
                    <button 
                      @click="loadAllTickets" 
                      class="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabela de Tickets -->
            <div v-else-if="allTickets.length > 0" class="overflow-x-auto">
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
                  <tr v-for="ticket in allTickets" :key="ticket.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-xs text-gray-500 font-mono">#{{ ticket.id.substring(0, 8) }}</div>
                        <div class="text-sm font-medium text-gray-900 mt-1">{{ ticket.title }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 max-w-md">
                        <p class="line-clamp-2">{{ ticket.description }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="getStatusClass(ticket.status)"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ ticket.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="getPriorityClass(ticket.priority)"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ ticket.priority }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8">
                          <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span class="text-xs font-medium text-gray-600">
                              {{ ticket.author.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ ticket.author }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ ticket.createdAt }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mensagem quando não há tickets -->
            <div v-else class="text-center p-12">
              <div class="flex flex-col items-center">
                <span class="text-6xl mb-4">📋</span>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum ticket encontrado</h3>
                <p class="text-gray-500 mb-6">Crie seu primeiro ticket para começar!</p>
                <button 
                  @click="openNewTicketModal"
                  class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                >
                  <span class="mr-2">➕</span>
                  Criar Primeiro Ticket
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Perfil do Usuário</h2>
          <p class="text-gray-600">Configurações de perfil em desenvolvimento...</p>
        </div>

      </div>
    </main>

    <!-- Modal de Novo Ticket -->
    <div 
      v-if="showNewTicketModal" 
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeNewTicketModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-lg bg-white rounded-md shadow-lg">
        <div @click.stop>
          <!-- Header do Modal -->
          <div class="flex justify-between items-center pb-3 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Criar Novo Ticket</h3>
            <button 
              @click="closeNewTicketModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span class="sr-only">Fechar</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Formulário -->
          <form @submit.prevent="handleCreateTicket" class="pt-4">
            <!-- Campo Título -->
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                id="title"
                v-model="newTicket.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite o título do ticket"
              />
            </div>

            <!-- Campo Descrição -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                id="description"
                v-model="newTicket.description"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Descreva o problema ou solicitação"
              ></textarea>
            </div>

            <!-- Campo Prioridade -->
            <div class="mb-6">
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                Prioridade *
              </label>
              <select
                id="priority"
                v-model="newTicket.priority"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione a prioridade</option>
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>

            <!-- Botões -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeNewTicketModal"
                :disabled="creatingTicket"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="creatingTicket"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <span v-if="creatingTicket" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ creatingTicket ? 'Criando...' : 'Criar Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ticketsService, { type TicketStats } from '../services/ticketsService'

const router = useRouter()

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

// Estado do modal de novo ticket
const showNewTicketModal = ref(false)
const creatingTicket = ref(false)
const newTicket = ref({
  title: '',
  description: '',
  priority: '' as 'low' | 'medium' | 'high' | ''
})

// Estado para notificações
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

// Dados do usuário (serão carregados do localStorage/token)
const userRole = ref('client')
const userName = ref('')
const userInitials = computed(() => {
  if (userName.value) {
    return userName.value.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }
  return 'U'
})

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
    
    console.log('Carregando estatísticas de tickets...')
    
    // Usar o serviço de tickets para buscar estatísticas
    const ticketStats = await ticketsService.getStats()
    
    // Atualizar estado
    stats.value = ticketStats
    
    console.log('Estatísticas carregadas:', stats.value)
    
  } catch (error: any) {
    console.error('Erro ao carregar estatísticas:', error)
    
    // Tratar diferentes tipos de erro
    if (error.response?.status === 401) {
      statsError.value = 'Sessão expirada. Faça login novamente.'
    } else if (error.response?.status === 403) {
      statsError.value = 'Sem permissão para acessar os dados.'
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      statsError.value = 'Erro de conexão com o servidor.'
    } else {
      statsError.value = error.response?.data?.message || 'Erro ao carregar dados.'
    }
    
    // Manter valores zerados em caso de erro
    stats.value = {
      open: 0,
      in_progress: 0,
      closed: 0,
      total: 0
    }
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
    
    // Transformar tickets da API para o formato do componente
    recentTickets.value = tickets.map(ticket => ({
      id: ticket.uuid,
      title: ticket.title,
      status: getStatusDisplay(ticket.status),
      createdAt: formatDate(ticket.createdAt)
    }))
    
    console.log('Tickets recentes carregados:', recentTickets.value.length)
    
  } catch (error: any) {
    console.error('Erro ao carregar tickets recentes:', error)
    // Em caso de erro, manter array vazio
    recentTickets.value = []
  } finally {
    recentTicketsLoading.value = false
  }
}

// Função para carregar todos os tickets
const loadAllTickets = async () => {
  try {
    allTicketsLoading.value = true
    ticketsError.value = ''
    
    console.log('Carregando todos os tickets...')
    
    const tickets = await ticketsService.getAllTickets()
    
    // Transformar tickets da API para o formato do componente
    allTickets.value = tickets.map(ticket => ({
      id: ticket.uuid,
      title: ticket.title,
      description: ticket.description,
      status: getStatusDisplay(ticket.status),
      priority: getPriorityDisplay(ticket.priority),
      createdAt: formatDate(ticket.createdAt),
      author: ticket.creator?.name || ticket.creator?.email || 'Usuário não identificado'
    }))
    
    console.log('Todos os tickets carregados:', allTickets.value.length)
    
  } catch (error: any) {
    console.error('Erro ao carregar todos os tickets:', error)
    
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
    
    // Em caso de erro, manter array vazio
    allTickets.value = []
  } finally {
    allTicketsLoading.value = false
  }
}

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

// Funções do modal de novo ticket
const openNewTicketModal = () => {
  showNewTicketModal.value = true
  // Resetar formulário
  newTicket.value = {
    title: '',
    description: '',
    priority: ''
  }
}

const closeNewTicketModal = () => {
  showNewTicketModal.value = false
  // Resetar formulário
  newTicket.value = {
    title: '',
    description: '',
    priority: ''
  }
}

// Função para mostrar notificações
const showNotificationMessage = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  
  // Auto-hide após 5 segundos
  setTimeout(() => {
    showNotification.value = false
  }, 5000)
}

const hideNotification = () => {
  showNotification.value = false
}

const handleCreateTicket = async () => {
  try {
    creatingTicket.value = true
    
    console.log('Criando novo ticket:', newTicket.value)
    
    // Validar campos obrigatórios
    if (!newTicket.value.title.trim()) {
      showNotificationMessage('Por favor, digite um título para o ticket.', 'error')
      return
    }
    
    if (!newTicket.value.description.trim()) {
      showNotificationMessage('Por favor, digite uma descrição para o ticket.', 'error')
      return
    }
    
    if (!newTicket.value.priority) {
      showNotificationMessage('Por favor, selecione uma prioridade para o ticket.', 'error')
      return
    }
    
    // Preparar dados do ticket
    const ticketData = {
      title: newTicket.value.title.trim(),
      description: newTicket.value.description.trim(),
      priority: newTicket.value.priority,
      status: 'open' as const
    }
    
    // Criar ticket usando o serviço
    await ticketsService.createTicket(ticketData)
    
    console.log('Ticket criado com sucesso!')
    
    // Fechar modal
    closeNewTicketModal()
    
    // Recarregar dados (estatísticas e tickets recentes)
    await Promise.all([
      loadTicketStats(),
      loadRecentTickets()
    ])
    
    // Se estiver na aba de tickets, recarregar também todos os tickets
    if (activeTab.value === 'tickets') {
      await loadAllTickets()
    }
    
    // Mostrar mensagem de sucesso
    showNotificationMessage('Ticket criado com sucesso! 🎉', 'success')
    
  } catch (error: any) {
    console.error('Erro ao criar ticket:', error)
    
    // Tratar diferentes tipos de erro
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
  if (newTab === 'tickets' && allTickets.value.length === 0) {
    loadAllTickets()
  }
})

// Carregar dados do usuário e estatísticas
onMounted(async () => {
  // Carregar dados do localStorage
  const storedRole = localStorage.getItem('role')
  if (storedRole) {
    userRole.value = storedRole as 'client' | 'support'
  }
  
  // Tentar extrair nome do usuário do token (se disponível)
  try {
    const token = localStorage.getItem('token')
    if (token) {
      // Decodificar JWT (apenas a parte payload, sem verificar assinatura)
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.email) {
        userName.value = payload.email.split('@')[0] // Usar parte antes do @
      }
    }
  } catch (error) {
    console.warn('Erro ao extrair nome do token:', error)
  }
  
  console.log('Dashboard carregado para usuário:', userRole.value, userName.value)
  
  // Carregar dados da API em paralelo
  await Promise.all([
    loadTicketStats(),
    loadRecentTickets()
  ])
})
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
