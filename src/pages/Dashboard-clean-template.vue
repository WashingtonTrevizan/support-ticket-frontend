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
