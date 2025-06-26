import api from './api'

export interface Comment {
  uuid: string
  content: string
  isInternal: boolean
  createdAt: string
  updatedAt: string
  TicketUuid: string
  UserUuid: string
  author?: {
    uuid: string
    name: string
    role: string
  }
}

export interface CreateCommentData {
  content: string
}

export const commentsService = {
  // Criar novo comentário
  async createComment(ticketId: string, commentData: CreateCommentData): Promise<Comment> {
    try {
      console.log('Criando comentário para ticket:', ticketId, commentData)
      const response = await api.post(`/api/v1/tickets/${ticketId}/comments`, commentData)
      console.log('Comentário criado:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erro ao criar comentário:', error)
      throw error
    }
  },

  // Buscar comentários de um ticket
  async getTicketComments(ticketId: string): Promise<Comment[]> {
    try {
      console.log('Buscando comentários do ticket:', ticketId)
      const response = await api.get(`/api/v1/tickets/${ticketId}/comments`)
      const comments = response.data || []
      console.log('Comentários encontrados:', comments.length)
      return Array.isArray(comments) ? comments : []
    } catch (error) {
      console.error('Erro ao buscar comentários:', error)
      throw error
    }
  },

  // Atualizar comentário
  async updateComment(commentId: string, commentData: Partial<CreateCommentData>): Promise<Comment> {
    try {
      console.log('Atualizando comentário:', commentId, commentData)
      const response = await api.put(`/api/v1/comments/${commentId}`, commentData)
      console.log('Comentário atualizado:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error)
      throw error
    }
  },

  // Deletar comentário
  async deleteComment(commentId: string): Promise<void> {
    try {
      console.log('Deletando comentário:', commentId)
      await api.delete(`/api/v1/comments/${commentId}`)
      console.log('Comentário deletado com sucesso')
    } catch (error) {
      console.error('Erro ao deletar comentário:', error)
      throw error
    }
  }
}

export default commentsService
