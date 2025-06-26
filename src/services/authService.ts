import api from './api'

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

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData)
    return response.data
  }

  async me(): Promise<AuthResponse['user']> {
    const response = await api.get('/auth/me')
    return response.data
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh')
    return response.data
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  }
}

const authService = new AuthService()
export default authService
