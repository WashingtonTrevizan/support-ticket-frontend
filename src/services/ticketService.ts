import api from './api'

export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'em-andamento' | 'resolved' | 'resolvido' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt?: string
  userId?: string
  assignedTo?: string
}

export interface TicketStats {
  open: number
  inProgress: number
  resolved: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  count?: number
  message?: string
}

class TicketService {
  /**
   * Busca tickets com filtros opcionais
   */
  async getTickets(params?: {
    status?: string
    priority?: string
    limit?: number
    offset?: number
  }): Promise<Ticket[]> {
    try {
      const response = await api.get('/api/v1/tickets', { params })
      
      // Tratar diferentes formatos de resposta da API
      if (Array.isArray(response.data)) {
        return response.data
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data
      } else if (response.data.tickets && Array.isArray(response.data.tickets)) {
        return response.data.tickets
      }
      
      return []
    } catch (error) {
      console.error('Erro ao buscar tickets:', error)
      throw error
    }
  }

  /**
   * Busca tickets abertos especificamente
   */
  async getOpenTickets(): Promise<Ticket[]> {
    return this.getTickets({ status: 'open' })
  }

  /**
   * Busca estatísticas dos tickets
   */
  async getTicketStats(): Promise<TicketStats> {
    try {
      // Tentar buscar estatísticas de um endpoint específico primeiro
      try {
        const statsResponse = await api.get('/api/v1/tickets/stats')
        if (statsResponse.data) {
          return {
            open: statsResponse.data.open || 0,
            inProgress: statsResponse.data.inProgress || statsResponse.data['in-progress'] || 0,
            resolved: statsResponse.data.resolved || statsResponse.data.closed || 0,
            total: statsResponse.data.total || 0
          }
        }
      } catch (statsError) {
        // Se não houver endpoint de stats, calcular manualmente
        console.log('Endpoint de stats não disponível, calculando manualmente...')
      }

      // Buscar todos os tickets e calcular estatísticas
      const allTickets = await this.getTickets()
      
      const stats: TicketStats = {
        open: 0,
        inProgress: 0,
        resolved: 0,
        total: allTickets.length
      }

      // Contar tickets por status
      allTickets.forEach(ticket => {
        switch (ticket.status) {
          case 'open':
            stats.open++
            break
          case 'in-progress':
          case 'em-andamento':
            stats.inProgress++
            break
          case 'resolved':
          case 'resolvido':
          case 'closed':
            stats.resolved++
            break
        }
      })

      return stats
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }

  /**
   * Cria um novo ticket
   */
  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    try {
      const response = await api.post('/api/v1/tickets', ticket)
      return response.data
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      throw error
    }
  }

  /**
   * Atualiza um ticket existente
   */
  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    try {
      const response = await api.put(`/api/v1/tickets/${id}`, updates)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error)
      throw error
    }
  }

  /**
   * Busca um ticket específico por ID
   */
  async getTicketById(id: string): Promise<Ticket> {
    try {
      const response = await api.get(`/api/v1/tickets/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar ticket:', error)
      throw error
    }
  }

  /**
   * Deleta um ticket
   */
  async deleteTicket(id: string): Promise<void> {
    try {
      await api.delete(`/api/v1/tickets/${id}`)
    } catch (error) {
      console.error('Erro ao deletar ticket:', error)
      throw error
    }
  }
}

export const ticketService = new TicketService()
export default ticketService
