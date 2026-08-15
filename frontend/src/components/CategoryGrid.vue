<script setup lang="ts">
import type { Category } from '../types/gym'

defineProps<{
  categories: Category[]
}>()

const emit = defineEmits<{
  (e: 'select', categoryId: number): void
}>()
</script>

<template>
  <div class="category-grid">
    <div 
      v-for="cat in categories" 
      :key="cat.id" 
      class="category-card"
      @click="emit('select', cat.id)" 
    >
      {{ cat.name }}
    </div>
  </div>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  width: 100%;
}

.category-card {
  background-color: #2a2a2a;
  color: #fff;
  padding: 1.25rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  will-change: transform, background-color, box-shadow;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
              background-color 0.25s ease, 
              box-shadow 0.25s ease;
}

.category-card:hover {
  transform: translateY(-3px);
  background-color: #3b3b3b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>