// Utilidade para debug de autenticação
export const debugAuth = {
  testConnection: async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
    try {
      console.log('🔍 Testando conexão com API:', apiUrl)
      
      // Teste de conexão básica
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📡 Status da conexão:', response.status)
      
      if (response.ok) {
        const data = await response.text()
        console.log('✅ API respondendo:', data)
        return true
      } else {
        console.log('❌ API não responde corretamente')
        return false
      }
    } catch (error) {
      console.error('❌ Erro de conexão:', error)
      return false
    }
  },

  testLogin: async (email: string, password: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
    try {
      console.log('🔍 Testando login:', { email, password: '***' })
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      console.log('📡 Status do login:', response.status)
      console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log('📡 Resposta bruta:', responseText)
      
      if (response.ok) {
        const data = JSON.parse(responseText)
        console.log('✅ Login bem-sucedido:', {
          token: data.token ? data.token.substring(0, 20) + '...' : 'não encontrado',
          user: data.user
        })
        return { success: true, data }
      } else {
        console.log('❌ Falha no login:', responseText)
        return { success: false, error: responseText, status: response.status }
      }
    } catch (error) {
      console.error('❌ Erro no teste de login:', error)
      return { success: false, error: error }
    }
  },

  checkStoredAuth: () => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    
    console.log('🔍 Estado atual da autenticação:')
    console.log('  Token:', token ? token.substring(0, 20) + '...' : 'não encontrado')
    console.log('  Role:', role)
    console.log('  IsAuthenticated:', isAuthenticated)
    
    return { token, role, isAuthenticated }
  }
}

// Disponibilizar globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth
}
