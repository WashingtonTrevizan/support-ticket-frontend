<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Teste - Login Simples
        </h2>
      </div>
      <div class="bg-white p-8 rounded-lg shadow">
        <p class="text-center text-gray-600">
          Se você vê esta mensagem, o Vue está funcionando!
        </p>
        <button 
          @click="testClick"
          class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Testar Clique
        </button>
        <p v-if="clicked" class="mt-2 text-green-600 text-center">
          ✅ Clique funcionou!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const clicked = ref(false)

const testClick = () => {
  clicked.value = true
  console.log('Botão clicado - Vue está funcionando!')
}
</script>
