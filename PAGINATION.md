# Sistema de Paginação de Tickets

## 📋 Visão Geral

Foi implementado um sistema completo de paginação para a aba de tickets no Dashboard, permitindo navegar pelos tickets com limite configurável por página.

## 🔧 Funcionalidades Implementadas

### 1. **Paginação de Tickets**
- Limite padrão de 10 tickets por página
- Opções de limite: 5, 10, 20, 50 tickets por página
- Navegação por páginas (anterior/próximo)
- Navegação direta para página específica
- Contadores de resultados (mostrando X a Y de Z resultados)

### 2. **Componente Pagination Reutilizável**
- Localizado em `src/components/Shared/Pagination.vue`
- Interface responsiva (mobile e desktop)
- Navegação inteligente (com "..." quando há muitas páginas)
- Seletor de limite por página
- Eventos tipados para todas as ações

### 3. **Service Atualizado**
- Novo método `getTicketsPaginated()` no `ticketsService`
- Suporte a parâmetros de query: `page`, `limit`, `status`, `priority`, `sort`
- Fallback para simular paginação se a API não suportar nativamente
- Interface `PaginatedTicketsResponse` para resposta tipada

## 🏗️ Estrutura da Implementação

### Arquivos Modificados/Criados

1. **`src/components/Shared/Pagination.vue`** (NOVO)
   - Componente de paginação reutilizável
   - Props: currentPage, totalPages, total, limit
   - Events: previous, next, go-to-page, change-limit

2. **`src/components/Tickets/TicketsTable.vue`** (MODIFICADO)
   - Adicionado suporte à paginação
   - Novas props opcionais para dados de paginação
   - Eventos de paginação

3. **`src/pages/Dashboard.vue`** (MODIFICADO)
   - Estado de paginação (currentPage, limit, totalTickets, totalPages)
   - Funções para controlar navegação
   - Integração com TicketsTable paginado

4. **`src/services/ticketsService.ts`** (MODIFICADO)
   - Interface `PaginationParams`
   - Interface `PaginatedTicketsResponse`
   - Método `getTicketsPaginated()`

5. **`src/components/Shared/index.ts`** (MODIFICADO)
   - Export do novo componente Pagination

## 📖 Como Usar

### URL da API

```
# Página 1 com limite padrão (10)
GET /api/v1/tickets

# Página 2 com limite 5
GET /api/v1/tickets?page=2&limit=5

# Combinado com filtros
GET /api/v1/tickets?page=1&limit=10&status=open&priority=high
```

### Exemplo de Implementação

```vue
<template>
  <TicketsTable 
    :tickets="tickets"
    :loading="loading"
    :error="error"
    :show-pagination="true"
    :current-page="currentPage"
    :total-pages="totalPages"
    :total="totalTickets"
    :limit="limit"
    @previous-page="handlePreviousPage"
    @next-page="handleNextPage"
    @go-to-page="handleGoToPage"
    @change-limit="handleChangeLimit"
  />
</template>

<script setup>
const currentPage = ref(1)
const limit = ref(10)
const totalTickets = ref(0)
const totalPages = ref(0)

const handleGoToPage = (page: number) => {
  currentPage.value = page
  loadTickets()
}

const handleChangeLimit = (newLimit: number) => {
  limit.value = newLimit
  currentPage.value = 1 // Reset para primeira página
  loadTickets()
}
</script>
```

### Uso do Service

```typescript
import ticketsService, { type PaginationParams } from '../services/ticketsService'

const loadTickets = async () => {
  const params: PaginationParams = {
    page: currentPage.value,
    limit: limit.value,
    status: 'open', // opcional
    priority: 'high' // opcional
  }
  
  const response = await ticketsService.getTicketsPaginated(params)
  
  tickets.value = response.tickets
  totalTickets.value = response.total
  totalPages.value = response.totalPages
  currentPage.value = response.page
  limit.value = response.limit
}
```

## 🎨 Interface do Usuário

### Desktop
- Barra de paginação completa com números das páginas
- Seletor de limite "Por página: [5][10][20][50]"
- Contadores "Mostrando 1 a 10 de 45 resultados"
- Botões anterior/próximo com ícones

### Mobile
- Botões simplificados "Anterior" e "Próximo"
- Layout otimizado para telas pequenas

### Navegação Inteligente
- Páginas 1-7: mostra todas as páginas
- Muitas páginas: usa "..." para economia de espaço
- Exemplos:
  - `1 2 3 4 5 ... 20` (início)
  - `1 ... 8 9 10 ... 20` (meio)
  - `1 ... 16 17 18 19 20` (fim)

## 🔍 Benefícios

### 1. **Performance**
- Carrega apenas os tickets necessários
- Reduz tempo de loading inicial
- Melhora experiência do usuário

### 2. **Usabilidade**
- Navegação intuitiva
- Controle de quantos itens ver por página
- Informações claras sobre posição atual

### 3. **Escalabilidade**
- Suporta grandes volumes de tickets
- Componente reutilizável para outras listagens
- Preparado para filtros futuros

### 4. **Responsividade**
- Interface adaptada para mobile e desktop
- Controles adequados para cada tamanho de tela

## 🚀 Próximos Passos

1. **Filtros Avançados**
   - Integrar filtros de status e prioridade
   - Busca por texto
   - Filtros por data

2. **Ordenação**
   - Ordenar por título, data, status, prioridade
   - Ascendente/descendente

3. **URL State**
   - Manter estado da paginação na URL
   - Permitir compartilhar links com página específica

4. **Cache**
   - Implementar cache das páginas visitadas
   - Melhorar performance de navegação

## 📊 Exemplo de Resposta da API

```json
{
  "tickets": [
    {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Problema com login",
      "description": "Não consigo fazer login...",
      "status": "open",
      "priority": "high",
      "createdAt": "2025-06-27T10:00:00Z",
      "creator": {
        "name": "João Silva",
        "email": "joao@example.com"
      }
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

A implementação está completa e funcional, proporcionando uma experiência de usuário moderna e eficiente para navegação de tickets! 🎉
