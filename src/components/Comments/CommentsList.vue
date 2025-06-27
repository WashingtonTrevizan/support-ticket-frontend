<template>
  <div class="space-y-4">
    <div 
      v-for="comment in comments" 
      :key="comment.uuid"
      class="border border-gray-200 rounded-lg p-4"
    >
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-xs font-medium text-gray-600">
              {{ getAuthorInitials(comment.author) }}
            </span>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-1">
            <span class="text-sm font-medium text-gray-900">
              {{ comment.author?.name || comment.author?.email || 'Usuário não identificado' }}
            </span>
            <span class="text-xs text-gray-500">
              {{ formatDate(comment.createdAt) }}
            </span>
          </div>
          <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  name?: string
  email?: string
}

interface Comment {
  uuid: string
  content: string
  createdAt: string
  author: User
}

interface Props {
  comments: Comment[]
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
