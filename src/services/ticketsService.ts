import api from './api'

export interface Ticket {
  uuid: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high'
  type: 'bug' | 'suporte_tecnico' | 'solicitacao' | 'sugestao_implementacao'
  createdAt: string
  updatedAt: string
  UserUuid: string
  CompanyUuid: string
  creator: {
    uuid: string
    name: string
    email: string
  }
}

export interface TicketStats {
  total: number
  open: number
  in_progress: number
  closed: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  status?: 'open' | 'in_progress' | 'closed'
  priority?: 'low' | 'medium' | 'high'
  sort?: string
}

export interface PaginatedTicketsResponse {
  tickets: Ticket[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const ticketsService = {
  // Buscar estatísticas de tickets
  async getStats(): Promise<TicketStats> {
    try {
      // Buscar tickets por status usando a nova estrutura da API
      const [openResponse, inProgressResponse, closedResponse] = await Promise.all([
        api.get('/api/v1/tickets?status=open'),
        api.get('/api/v1/tickets?status=in_progress'),
        api.get('/api/v1/tickets?status=closed')
      ])

      // A API agora retorna { tickets: [...], pagination: {...} }
      const getTicketsCount = (response: any) => {
        if (response.tickets && Array.isArray(response.tickets)) {
          return response.tickets.length
        }
        // Fallback para estrutura antiga
        if (Array.isArray(response)) {
          return response.length
        }
        return 0
      }

      const openCount = getTicketsCount(openResponse.data)
      const inProgressCount = getTicketsCount(inProgressResponse.data)
      const closedCount = getTicketsCount(closedResponse.data)

      const stats = {
        open: openCount,
        in_progress: inProgressCount,
        closed: closedCount,
        total: openCount + inProgressCount + closedCount
      }

      return stats
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas de tickets:', error)
      throw error
    }
  },

  // Buscar count de tickets abertos
  async getOpenTicketsCount(): Promise<number> {
    try {
      const response = await api.get('/api/v1/tickets?status=open')
      const tickets = response.data || []
      const count = Array.isArray(tickets) ? tickets.length : 0
      return count
    } catch (error) {
      console.error('Erro ao buscar tickets abertos:', error)
      throw error
    }
  },

  // Buscar todos os tickets
  async getAllTickets(): Promise<Ticket[]> {
    try {
      const response = await api.get('/api/v1/tickets')
      const tickets = response.data || []
      return Array.isArray(tickets) ? tickets : []
    } catch (error) {
      console.error('Erro ao buscar tickets:', error)
      throw error
    }
  },

  // Buscar tickets recentes (últimos 5)
  async getRecentTickets(): Promise<Ticket[]> {
    try {
      const response = await api.get('/api/v1/tickets?page=1&limit=5')
      
      // A API pode retornar no formato paginado ou no formato simples
      let tickets = []
      if (response.data.tickets) {
        // Formato paginado
        tickets = response.data.tickets
      } else if (Array.isArray(response.data)) {
        // Formato simples (array direto)
        tickets = response.data.slice(0, 5)
      }
      
      return Array.isArray(tickets) ? tickets : []
    } catch (error) {
      console.error('Erro ao buscar tickets recentes:', error)
      // Fallback: buscar todos e pegar os últimos 5
      try {
        const allTickets = await this.getAllTickets()
        return allTickets
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      } catch (fallbackError) {
        console.error('Erro no fallback de tickets recentes:', fallbackError)
        return []
      }
    }
  },

  // Criar novo ticket
  async createTicket(ticketData: Omit<Ticket, 'uuid' | 'createdAt' | 'updatedAt' | 'UserUuid' | 'CompanyUuid' | 'creator'>): Promise<Ticket> {
    try {
      const response = await api.post('/api/v1/tickets', ticketData)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      throw error
    }
  },

  // Atualizar ticket
  async updateTicket(id: string, ticketData: Partial<Ticket>): Promise<Ticket> {
    try {
      const response = await api.patch(`/api/v1/tickets/${id}`, ticketData)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error)
      throw error
    }
  },

  // Deletar ticket
  async deleteTicket(id: string): Promise<void> {
    try {
      await api.delete(`/api/v1/tickets/${id}`)
    } catch (error) {
      console.error('Erro ao deletar ticket:', error)
      throw error
    }
  },

  // Buscar todos os tickets com paginação
  async getTicketsPaginated(params: PaginationParams = {}): Promise<PaginatedTicketsResponse> {
    try {
      const { page = 1, limit = 10, status, priority, sort } = params
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (status) queryParams.append('status', status)
      if (priority) queryParams.append('priority', priority)
      if (sort) queryParams.append('sort', sort)
      
      const response = await api.get(`/api/v1/tickets?${queryParams.toString()}`)
      
      
      // Se a API retornar no formato novo com "pagination"
      if (response.data.tickets && response.data.pagination) {
        const { tickets, pagination } = response.data
        const result = {
          tickets: Array.isArray(tickets) ? tickets : [],
          total: pagination.totalItems || 0,
          page: pagination.currentPage || page,
          limit: pagination.itemsPerPage || limit,
          totalPages: pagination.totalPages || Math.ceil((pagination.totalItems || 0) / limit)
        }
        return result
      }
      
      // Se a API retornar no formato antigo
      if (response.data.tickets && response.data.total !== undefined) {
        const result = {
          tickets: Array.isArray(response.data.tickets) ? response.data.tickets : [],
          total: response.data.total || 0,
          page: response.data.page || page,
          limit: response.data.limit || limit,
          totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / limit)
        }
        return result
      }
      
      // Fallback: se a API não retornar dados paginados, simular paginação
      const allTickets = Array.isArray(response.data) ? response.data : []
      const total = allTickets.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const tickets = allTickets.slice(startIndex, endIndex)
      
      const result = {
        tickets,
        total,
        page,
        limit,
        totalPages
      }
      
      return result
    } catch (error) {
      console.error('Erro ao buscar tickets paginados:', error)
      throw error
    }
  }
}

export default ticketsService
