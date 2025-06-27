<template>
  <div class="bg-red-50 border border-red-200 rounded-lg p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <span class="text-red-500 text-xl">⚠️</span>
      </div>
      <div class="ml-3">
        <h3 class="text-lg font-medium text-red-800">{{ title }}</h3>
        <p class="text-sm text-red-700 mt-1">{{ message }}</p>
        <button 
          v-if="showRetry"
          @click="$emit('retry')" 
          class="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Erro',
  showRetry: true
})

defineEmits<{
  retry: []
}>()
</script>
