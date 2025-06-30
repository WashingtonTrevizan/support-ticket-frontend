<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" v-if="isOpen">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-lg bg-white rounded-md shadow-lg">
      <div>
        <!-- Header do Modal -->
        <div class="flex justify-between items-center pb-3 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Criar Novo Ticket</h3>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span class="sr-only">Fechar</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="pt-4">
          <!-- Campo Título -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Digite o título do ticket"
            />
          </div>

          <!-- Campo Descrição -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descreva o problema ou solicitação"
            ></textarea>
          </div>

          <!-- Campo Prioridade -->
          <div class="mb-4">
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
              Prioridade *
            </label>
            <select
              id="priority"
              v-model="form.priority"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione a prioridade</option>
              <option value="low">🟢 Baixa</option>
              <option value="medium">🟡 Média</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>

          <!-- Campo Tipo -->
          <div class="mb-6">
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              id="type"
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione o tipo</option>
              <option value="bug">🐛 Bug</option>
              <option value="suporte_tecnico">🛠️ Suporte Técnico</option>
              <option value="solicitacao">📋 Solicitação</option>
              <option value="sugestao_implementacao">💡 Sugestão de Implementação</option>
            </select>
          </div>

          <!-- Botões -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <span v-if="loading" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Criando...' : 'Criar Ticket' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface TicketForm {
  title: string
  description: string
  priority: '' | 'low' | 'medium' | 'high'
  type: '' | 'bug' | 'suporte_tecnico' | 'solicitacao' | 'sugestao_implementacao'
}

interface Props {
  isOpen: boolean
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [formData: TicketForm]
}>()

const form = ref<TicketForm>({
  title: '',
  description: '',
  priority: '',
  type: ''
})

const handleSubmit = () => {
  // Emitir evento com os dados do formulário
  emit('submit', form.value)
}

// Resetar formulário quando modal fechar
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    form.value = {
      title: '',
      description: '',
      priority: '',
      type: ''
    }
  }
})
</script>
