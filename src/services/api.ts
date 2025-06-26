import axios from 'axios'
import { useAuth } from '../store/useAuth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = useAuth.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (Unauthorized), fazer logout automático
    if (error.response?.status === 401) {
      useAuth.getState().logout()
      window.location.href = '/login'
    }
    
    // Tratar erro de conexão
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Erro de conexão com a API:', error.message)
      error.message = 'Não foi possível conectar com o servidor. Verifique sua conexão.'
    }
    
    return Promise.reject(error)
  }
)

export default api
