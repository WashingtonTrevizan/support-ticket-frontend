<template>
  <div class="border-t pt-6">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          Adicionar comentário
        </label>
        <textarea
          id="comment"
          :value="comment"
          @input="$emit('update', ($event.target as HTMLTextAreaElement).value)"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Digite seu comentário..."
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="!comment.trim() || isSubmitting"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <span v-if="isSubmitting" class="mr-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isSubmitting ? 'Enviando...' : 'Enviar Comentário' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface Props {
  comment: string
  isSubmitting: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  update: [value: string]
  submit: []
}>()

const handleSubmit = () => {
  emit('submit')
}
</script>
