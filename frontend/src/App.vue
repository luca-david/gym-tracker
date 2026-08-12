<script setup lang="ts">
import { ref , onMounted } from 'vue'

interface Category {
  id: number,
  name: string,
  user_id: number
}

interface Exercise {
  id: number,
  name: string,
  category_id: number
}

const categories = ref<Category[]>([]);
const exercises = ref<Exercise[]>([]);
//const selectedCategory = ref<number | null>(null);

//reactive state to show exercise categories
const showCategories = ref(false);
const showExercises = ref(false);

//function to toggle categories state
const toggleCategories = () => {
  //showCategories.value = !showCategories.value -> smart way to do it
  if (showCategories.value === false) {
    showCategories.value = true;
  }
  else {
    showCategories.value = false;
  }
}

//function to toggle exercises state
const toggleExercises = () => {
  showExercises.value = !showExercises.value;
  showCategories.value = !showCategories.value;
}


//runs automatically when component loads on screen
onMounted(async () => {
  const res = await fetch('http://localhost:3030/api/categories/'); //by defualt, it looks for get operations
  const responseData = await res.json();

  categories.value = responseData.data;
})

//runs when a category is clicked
const selectCategory = async (categoryId: number) => {
  //selectedCategory.value = categoryId;
  
  try {
    const res = await fetch(`http://localhost:3030/api/exercises/onCategory/${categoryId}`);
    const responseData = await res.json();

    exercises.value = responseData.data;

    toggleExercises();
  } catch (err) {
    console.error('Failed to fetch exercises: ', err);
  }
}
</script>

<template>
  <div class="app-container">
    <header class="app-header" @click="toggleCategories">
      <h1>Gym Tracker</h1>
    </header>
    <Transition name="fade">
      <div v-if="showCategories" class="category-grid">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          class="category-card"
          @click="selectCategory(cat.id)" 
        >
          {{ cat.name }}
        </div>
      </div>
    </Transition>

    <Transition name="fadeExercises">
      <div v-if="showExercises" class="exercise-grid">
        <div
          v-for="ex in exercises"
          :key="ex.id"
          class="exercise-card"
          >
            {{ ex.name }}
          </div>
      </div>
    </Transition>
    
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 800px;
  padding: 0rem 1rem;
  margin-bottom: 5rem;
  margin-left: 13rem;
}

.app-header {
  width: fit-content;
  margin: 0 auto;
  padding: 2rem 0.2rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.loading-state {
  position: absolute;
  left: 46%;
  text-align: center;
}

.app-header:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

.fadeExercises-enter-active,
.fadeExercises-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fadeExercises-enter-from,
.fadeExercises-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.category-card {
  background-color: #2a2a2a;
  color: #fff;
  padding: 1.25rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  background-color: #3b3b3b;
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.exercise-card {
  background-color: #2a2a2a;
  color: #fff;
  padding: 1.25rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

</style>