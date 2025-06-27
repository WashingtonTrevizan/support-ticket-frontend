<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-900">Comentários</h2>
      <span class="text-sm text-gray-500">
        {{ comments.length }} {{ comments.length === 1 ? 'comentário' : 'comentários' }}
      </span>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="mb-6">
      <CommentsList :comments="comments" />
    </div>

    <!-- No Comments State -->
    <div v-else class="text-center py-8">
      <span class="text-4xl mb-4 block">💬</span>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum comentário ainda</h3>
      <p class="text-gray-500 mb-4">Seja o primeiro a comentar neste ticket!</p>
    </div>

    <!-- Add Comment Form -->
    <CommentForm 
      :comment="newComment"
      :is-submitting="submittingComment"
      @update="$emit('update-comment', $event)"
      @submit="$emit('add-comment')"
    />
  </div>
</template>

<script setup lang="ts">
import CommentsList from './CommentsList.vue'
import CommentForm from './CommentForm.vue'

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
  newComment: string
  submittingComment: boolean
}

defineProps<Props>()

defineEmits<{
  'update-comment': [value: string]
  'add-comment': []
}>()
</script>
