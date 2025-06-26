// Mock authentication service for development
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: 'client' | 'support'
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'client' | 'support'
  }
}

class MockAuthService {
  // Simular delay de rede
  private delay(ms: number = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await this.delay(800)
    
    // Simular usuários de teste
    const users = [
      { email: 'client@test.com', password: '123', role: 'client' as const, name: 'Cliente Teste' },
      { email: 'support@test.com', password: '123', role: 'support' as const, name: 'Suporte Teste' },
      { email: 'admin@test.com', password: 'admin', role: 'support' as const, name: 'Admin' }
    ]

    const user = users.find(u => u.email === credentials.email && u.password === credentials.password)
    
    if (!user) {
      throw new Error('Email ou senha inválidos')
    }

    return {
      token: `mock-token-${Date.now()}`,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await this.delay(800)
    
    // Simular validação
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Todos os campos são obrigatórios')
    }

    return {
      token: `mock-token-${Date.now()}`,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'client'
      }
    }
  }

  async me(): Promise<AuthResponse['user']> {
    await this.delay(300)
    
    return {
      id: '123',
      name: 'Usuário Teste',
      email: 'test@test.com',
      role: 'client'
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    await this.delay(300)
    
    return {
      token: `mock-refresh-token-${Date.now()}`
    }
  }

  async logout(): Promise<void> {
    await this.delay(300)
    // Simular logout
  }
}

export const mockAuthService = new MockAuthService()
export default mockAuthService
