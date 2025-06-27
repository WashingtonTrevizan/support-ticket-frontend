<template>
  <div>
    <!-- Menu desktop -->
    <div class="hidden md:flex md:items-center md:space-x-8">
      <button 
        @click="$emit('change-tab', 'dashboard')"
        :class="activeTab === 'dashboard' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
      >
        Dashboard
      </button>
      <button 
        @click="$emit('change-tab', 'tickets')"
        :class="activeTab === 'tickets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
      >
        Tickets
      </button>
      <button 
        @click="$emit('change-tab', 'profile')"
        :class="activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
      >
        Perfil
      </button>
    </div>

    <!-- Menu mobile -->
    <div class="md:hidden bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 py-3 space-y-1">
        <button 
          @click="$emit('change-tab', 'dashboard')"
          :class="activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </button>
        <button 
          @click="$emit('change-tab', 'tickets')"
          :class="activeTab === 'tickets' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Tickets
        </button>
        <button 
          @click="$emit('change-tab', 'profile')"
          :class="activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'"
          class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium"
        >
          Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string
}

defineProps<Props>()

defineEmits<{
  'change-tab': [tab: string]
}>()
</script>
