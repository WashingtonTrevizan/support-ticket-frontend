import { reactive } from 'vue'

// Versão simplificada para debug
interface AuthState {
  token: string | null
  role: 'client' | 'support' | null
  isAuthenticated: boolean
}

export const authState = reactive<AuthState>({
  token: null,
  role: null,
  isAuthenticated: false
})

export const useAuthSimple = () => {
  const setToken = (token: string, role: 'client' | 'support') => {
    authState.token = token
    authState.role = role
    authState.isAuthenticated = true
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
    }
  }

  const logout = () => {
    authState.token = null
    authState.role = null
    authState.isAuthenticated = false
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }

  return {
    ...authState,
    setToken,
    logout
  }
}
