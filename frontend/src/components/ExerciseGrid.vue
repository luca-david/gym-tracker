<script setup lang="ts">
import type { Exercise } from '../types/gym'

defineProps<{
  exercises: Exercise[]
}>()

const emit = defineEmits<{
  (e: 'select', exercise: Exercise): void
}>()
</script>

<template>
  <div class="exercise-grid">
    <div
      v-for="ex in exercises"
      :key="ex.id"
      class="exercise-card"
      @click="emit('select', ex)"
    >
      {{ ex.name }}
    </div>
  </div>
</template>

<style scoped>
.exercise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  width: 100%;
}

.exercise-card {
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

.exercise-card:hover {
  transform: translateY(-3px);
  background-color: #3b3b3b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>