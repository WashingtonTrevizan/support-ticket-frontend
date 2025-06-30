<template>
  <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
    <!-- Header principal -->
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
            <!-- Dashboard sempre aparece -->
            <button 
              @click="$emit('change-tab', 'dashboard')"
              :class="activeTab === 'dashboard' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </button>
            
            <!-- Condicional para Support -->
            <template v-if="userRole === 'support'">
              <button 
                @click="$emit('change-tab', 'tickets')"
                :class="activeTab === 'tickets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
              >
                Tickets
              </button>
              <button 
                @click="$emit('change-tab', 'my-tickets')"
                :class="activeTab === 'my-tickets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
              >
                Meus Tickets
              </button>
              <button 
                @click="$emit('change-tab', 'users')"
                :class="activeTab === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
              >
                Usuarios
              </button>
            </template>

            <!-- Menu padrão para outros usuários -->
            <template v-else>
              <button 
                @click="$emit('change-tab', 'tickets')"
                :class="activeTab === 'tickets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
              >
                Meus Tickets
              </button>
            </template>

            <!-- Perfil sempre aparece -->
            <button 
              @click="$emit('change-tab', 'profile')"
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
              @click="$emit('logout')"
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
          @click="$emit('change-tab', 'dashboard')"
          :class="activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </button>

        <!-- Condicional mobile para Support -->
        <template v-if="userRole === 'support'">
          <button 
            @click="$emit('change-tab', 'tickets')"
            :class="activeTab === 'tickets' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
            class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
          >
            Tickets
          </button>
          <button 
            @click="$emit('change-tab', 'my-tickets')"
            :class="activeTab === 'my-tickets' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
            class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
          >
            Meus Tickets
          </button>
          <button 
            @click="$emit('change-tab', 'users')"
            :class="activeTab === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
            class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
          >
            Usuarios
          </button>
        </template>

        <!-- Menu mobile padrão -->
        <template v-else>
          <button 
            @click="$emit('change-tab', 'tickets')"
            :class="activeTab === 'tickets' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
            class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
          >
            Meus Tickets
          </button>
        </template>

        <button 
          @click="$emit('change-tab', 'profile')"
          :class="activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  userName: string
  userRole: string
  logoutLoading: boolean
  activeTab: string
}

const props = defineProps<Props>()

defineEmits<{
  logout: []
  'change-tab': [tab: string]
}>()

const userInitials = computed(() => {
  if (props.userName) {
    return props.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }
  return 'U'
})
</script>
