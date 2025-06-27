import api from './api'

export interface Ticket {
  uuid: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high'
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

export const ticketsService = {
  // Buscar estatísticas de tickets
  async getStats(): Promise<TicketStats> {
    try {
      console.log('Buscando estatísticas de tickets...')
      
      // Buscar tickets por status
      const [openResponse, inProgressResponse, closedResponse] = await Promise.all([
        api.get('/api/v1/tickets?status=open'),
        api.get('/api/v1/tickets?status=in_progress'),
        api.get('/api/v1/tickets?status=closed')
      ])

      // A API retorna os tickets diretamente como array
      const openTickets = openResponse.data || []
      const inProgressTickets = inProgressResponse.data || []
      const closedTickets = closedResponse.data || []

      const stats = {
        open: Array.isArray(openTickets) ? openTickets.length : 0,
        in_progress: Array.isArray(inProgressTickets) ? inProgressTickets.length : 0,
        closed: Array.isArray(closedTickets) ? closedTickets.length : 0,
        total: 0
      }
      
      stats.total = stats.open + stats.in_progress + stats.closed

      console.log('Estatísticas de tickets:', stats)
      return stats
    } catch (error) {
      console.error('Erro ao buscar estatísticas de tickets:', error)
      throw error
    }
  },

  // Buscar count de tickets abertos
  async getOpenTicketsCount(): Promise<number> {
    try {
      console.log('Buscando count de tickets abertos...')
      const response = await api.get('/api/v1/tickets?status=open')
      const tickets = response.data || []
      const count = Array.isArray(tickets) ? tickets.length : 0
      console.log('Count de tickets abertos:', count)
      return count
    } catch (error) {
      console.error('Erro ao buscar tickets abertos:', error)
      throw error
    }
  },

  // Buscar todos os tickets
  async getAllTickets(): Promise<Ticket[]> {
    try {
      console.log('Buscando todos os tickets...')
      const response = await api.get('/api/v1/tickets')
      const tickets = response.data || []
      console.log('Tickets encontrados:', tickets.length)
      return Array.isArray(tickets) ? tickets : []
    } catch (error) {
      console.error('Erro ao buscar tickets:', error)
      throw error
    }
  },

  // Buscar tickets recentes (últimos 5)
  async getRecentTickets(): Promise<Ticket[]> {
    try {
      console.log('Buscando tickets recentes...')
      const response = await api.get('/api/v1/tickets?limit=5&sort=createdAt:desc')
      const tickets = response.data || []
      console.log('Tickets recentes encontrados:', tickets.length)
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
      console.log('Criando novo ticket:', ticketData)
      const response = await api.post('/api/v1/tickets', ticketData)
      console.log('Ticket criado:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      throw error
    }
  },

  // Atualizar ticket
  async updateTicket(id: string, ticketData: Partial<Ticket>): Promise<Ticket> {
    try {
      console.log('Atualizando ticket:', id, ticketData)
      const response = await api.patch(`/api/v1/tickets/${id}`, ticketData)
      console.log('Ticket atualizado:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error)
      throw error
    }
  },

  // Deletar ticket
  async deleteTicket(id: string): Promise<void> {
    try {
      console.log('Deletando ticket:', id)
      await api.delete(`/api/v1/tickets/${id}`)
      console.log('Ticket deletado com sucesso')
    } catch (error) {
      console.error('Erro ao deletar ticket:', error)
      throw error
    }
  }
}

export default ticketsService
