<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Category, Exercise } from './types/gym'
import CategoryGrid from './components/CategoryGrid.vue'
import ExerciseGrid from './components/ExerciseGrid.vue'
import HypertrophyEagle from './components/HypertrophyEagle.vue'

const categories = ref<Category[]>([])
const exercises = ref<Exercise[]>([])

const showCategories = ref(false)
const showExercises = ref(false)

const toggleCategories = () => {
  if (showCategories.value === false) {
    showCategories.value = true
    closeExercises()
  } else {
    showCategories.value = false
  }
}

const toggleExercises = () => {
  showExercises.value = !showExercises.value
  showCategories.value = !showCategories.value
}

const closeExercises = () => {
  showExercises.value = false
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3030/api/categories/')
    const responseData = await res.json()
    categories.value = responseData.data
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
})

const selectCategory = async (categoryId: number) => {
  try {
    const res = await fetch(`http://localhost:3030/api/exercises/onCategory/${categoryId}`)
    const responseData = await res.json()
    exercises.value = responseData.data
    toggleExercises()
  } catch (err) {
    console.error('Failed to fetch exercises: ', err)
  }
}
</script>

<template>
  <div class="app-container">
    <header class="app-header" @click="toggleCategories">
      <h1>Gym Tracker</h1>
    </header>

    <Transition name="fade" mode="out-in">
      <CategoryGrid 
        v-if="showCategories" 
        :categories="categories" 
        @select="selectCategory" 
      />
    </Transition>

    <Transition name="fadeExercises" mode="out-in">
      <ExerciseGrid 
        v-if="showExercises" 
        :exercises="exercises" 
      />
    </Transition>
  </div>

  <HypertrophyEagle />
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
  margin: 0 auto 1rem auto;
  position: relative;
}

.app-header {
  width: fit-content;
  margin: 0 auto 1.5rem auto;
  padding: 1.5rem 0.2rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.app-header:hover {
  opacity: 0.85;
  transform: scale(1.02);
}

.fade-enter-active,
.fadeExercises-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fadeExercises-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>