<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">Autor</label>
      <div class="flex items-center">
        <div class="flex-shrink-0 h-8 w-8">
          <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-xs font-medium text-gray-600">
              {{ getAuthorInitials(author) }}
            </span>
          </div>
        </div>
        <div class="ml-3">
          <div class="text-sm font-medium text-gray-900">
            {{ author?.name || author?.email || 'Usuário não identificado' }}
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">Criado em</label>
      <div class="text-sm text-gray-900">{{ formatDate(createdAt) }}</div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">Última atualização</label>
      <div class="text-sm text-gray-900">{{ formatDate(updatedAt) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  name?: string
  email?: string
}

interface Props {
  author: User
  createdAt: string
  updatedAt: string
}

defineProps<Props>()

const getAuthorInitials = (user: User) => {
  if (!user) return 'U'
  const name = user.name || user.email || 'Usuario'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  } catch (error) {
    return dateString
  }
}
</script>
