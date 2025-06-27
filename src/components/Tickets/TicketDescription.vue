<template>
  <div>
    <label class="block text-sm font-medium text-gray-500 mb-2">Descrição</label>
    
    <!-- Modo Visualização -->
    <div v-if="!isEditing" class="bg-gray-50 rounded-lg p-4">
      <p class="text-gray-900 whitespace-pre-wrap">{{ description }}</p>
    </div>
    
    <!-- Modo Edição -->
    <div v-else>
      <textarea
        :value="editValue"
        @input="$emit('update', ($event.target as HTMLTextAreaElement).value)"
        rows="6"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Descrição do ticket..."
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description: string
  isEditing: boolean
  editValue?: string
}

defineProps<Props>()

defineEmits<{
  update: [value: string]
}>()
</script>
