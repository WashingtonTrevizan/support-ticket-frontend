<template>
  <div style="min-height: 100vh; background-color: #f3f4f6;">
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
      <!-- Header -->
      <div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin: 0;">Dashboard</h1>
            <p style="color: #6b7280; margin: 0.5rem 0 0 0;">Bem-vindo ao sistema de tickets</p>
          </div>
          <button
            @click="handleLogout"
            style="background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;"
          >
            Sair
          </button>
        </div>
      </div>

      <!-- User Info -->
      <div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 1.5rem; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin: 0 0 1rem 0;">Informações do Usuário</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151;">Token</label>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #1f2937; font-family: monospace;">
              {{ authInfo.token || 'Não encontrado' }}
            </p>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151;">Role</label>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #1f2937;">{{ authInfo.role || 'Não definido' }}</p>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151;">Status</label>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #1f2937;">{{ authInfo.isAuthenticated ? 'Autenticado' : 'Não autenticado' }}</p>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1rem;">
        <div style="display: flex; align-items: flex-start;">
          <div style="flex-shrink: 0;">
            <svg style="height: 1.25rem; width: 1.25rem; color: #22c55e;" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div style="margin-left: 0.75rem;">
            <h3 style="font-size: 0.875rem; font-weight: 500; color: #166534; margin: 0;">Login realizado com sucesso!</h3>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #15803d;">
              Você está autenticado e pode acessar o sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const authInfo = ref({
  token: '',
  role: '',
  isAuthenticated: false
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('isAuthenticated')
  
  window.location.href = '/login'
}

onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  
  authInfo.value = {
    token: token ? token.substring(0, 20) + '...' : '',
    role: role || '',
    isAuthenticated: !!token
  }
  
  console.log('Dashboard carregado. Estado da auth:', authInfo.value)
  
  // Se não estiver autenticado, redirecionar para login
  if (!token) {
    window.location.href = '/login'
  }
})
</script>
