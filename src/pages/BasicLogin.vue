<template>
  <div style="min-height: 100vh; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center;">
    <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px;">
      <h1 style="text-align: center; margin-bottom: 2rem; color: #1f2937;">Login</h1>
      
      <div v-if="error" style="background: #fee2e2; border: 1px solid #fca5a5; color: #dc2626; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem;">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: bold; margin-bottom: 0.5rem;">Email:</label>
          <input
            v-model="email"
            type="email"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px;"
            placeholder="Digite seu email"
          />
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-weight: bold; margin-bottom: 0.5rem;">Senha:</label>
          <input
            v-model="password"
            type="password"
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px;"
            placeholder="Digite sua senha"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          style="width: 100%; background: #3b82f6; color: white; padding: 0.75rem; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;"
          :style="loading ? 'opacity: 0.5; cursor: not-allowed;' : ''"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      
      <div style="margin-top: 1rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
        <p>Teste: test@example.com / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('test@example.com')
const password = ref('123456')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Fazendo login:', email.value)
    
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    
    console.log('Status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('Login OK:', data)
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      
      window.location.href = '/dashboard'
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Erro no login'
    }
    
  } catch (err) {
    console.error('Erro:', err)
    error.value = 'Erro de conexão'
  } finally {
    loading.value = false
  }
}
</script>
