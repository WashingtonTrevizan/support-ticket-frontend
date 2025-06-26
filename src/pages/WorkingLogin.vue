<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login - Versão Funcional
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Teste direto com API
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Exibir erro se houver -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <!-- Exibir sucesso se houver -->
        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ success }}
        </div>
        
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              v-model="password"
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

        <!-- Debug info -->
        <div v-if="debugInfo" class="mt-4 p-3 bg-gray-100 rounded text-xs">
          <pre>{{ debugInfo }}</pre>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const debugInfo = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  debugInfo.value = ''
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const loginData = {
      email: email.value,
      password: password.value
    }
    
    debugInfo.value = `Fazendo login em: ${apiUrl}/auth/login\nDados: ${JSON.stringify(loginData, null, 2)}`
    
    // Fazer requisição para a API
    const response = await axios.post(`${apiUrl}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    debugInfo.value += `\n\nResposta (${response.status}): ${JSON.stringify(response.data, null, 2)}`
    
    // Verificar se a resposta é positiva
    if (response.status === 200 && response.data.token) {
      success.value = 'Login realizado com sucesso!'
      
      // Salvar no localStorage manualmente
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', response.data.user?.role || 'client')
      localStorage.setItem('isAuthenticated', 'true')
      
      // Aguardar um pouco e redirecionar
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      
    } else {
      error.value = 'Resposta inválida da API'
    }
    
  } catch (err: any) {
    console.error('Erro no login:', err)
    
    let errorMessage = 'Erro desconhecido'
    
    if (err.response) {
      // Erro da API
      errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`
      debugInfo.value += `\n\nErro da API (${err.response.status}): ${JSON.stringify(err.response.data, null, 2)}`
    } else if (err.request) {
      // Erro de conexão
      errorMessage = 'Não foi possível conectar com o servidor'
      debugInfo.value += `\n\nErro de conexão: ${err.message}`
    } else {
      // Erro genérico
      errorMessage = err.message
      debugInfo.value += `\n\nErro: ${err.message}`
    }
    
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>
