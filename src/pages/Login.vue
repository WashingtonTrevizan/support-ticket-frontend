<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Faça login em sua conta
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Exibir erro se houver -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Senha</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Senha"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <router-link
              to="/register"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Não tem conta? Registre-se
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Fazendo login para:', email.value)
    
    const response = await authService.login({
      email: email.value,
      password: password.value
    })
    
    console.log('Login bem-sucedido!')
    
    // Salvar no localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('role', response.user.role)
    
    // Redirecionar para dashboard
    router.push('/dashboard')
    
  } catch (err: any) {
    console.error('Erro no login:', err)
    
    if (err.response) {
      const status = err.response.status
      const message = err.response.data?.message || 'Erro desconhecido'
      
      if (status === 401) {
        error.value = 'Email ou senha incorretos'
      } else if (status === 400) {
        error.value = 'Dados inválidos'
      } else if (status >= 500) {
        error.value = 'Erro no servidor. Tente novamente.'
      } else {
        error.value = `Erro: ${message}`
      }
    } else if (err.request) {
      error.value = 'Não foi possível conectar com o servidor.'
    } else {
      error.value = 'Erro desconhecido'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('Login carregado')
  // Se já estiver autenticado, redirecionar para dashboard
  if (localStorage.getItem('token')) {
    router.push('/dashboard')
  }
})
</script>
