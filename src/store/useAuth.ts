import { create } from 'zustand'

interface AuthState {
  token: string | null
  role: 'client' | 'support' | null
  isAuthenticated: boolean
  setToken: (token: string, role: 'client' | 'support') => void
  logout: () => void
  initialize: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  role: null,
  isAuthenticated: false,
  
  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role') as 'client' | 'support' | null
      set({
        token,
        role,
        isAuthenticated: !!token
      })
    }
  },
  
  setToken: (token: string, role: 'client' | 'support') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
    }
    set({ 
      token, 
      role, 
      isAuthenticated: true 
    })
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('isAuthenticated')
    }
    set({ 
      token: null, 
      role: null, 
      isAuthenticated: false 
    })
  },
}))

// Inicializar o store quando o módulo for carregado no cliente
if (typeof window !== 'undefined') {
  useAuth.getState().initialize()
}

export default useAuth
