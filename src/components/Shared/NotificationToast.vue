<template>
  <div 
    v-if="isVisible"
    class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out"
    :class="type === 'success' ? 'border-green-500' : 'border-red-500'"
  >
    <div class="p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <span v-if="type === 'success'" class="text-green-500 text-xl">✅</span>
          <span v-else class="text-red-500 text-xl">❌</span>
        </div>
        <div class="ml-3 flex-1">
          <p :class="type === 'success' ? 'text-green-800' : 'text-red-800'" class="text-sm font-medium">
            {{ message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button
            @click="$emit('close')"
            class="inline-flex text-gray-400 hover:text-gray-600"
          >
            <span class="sr-only">Fechar</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  message: string
  type: 'success' | 'error'
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>
