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

const showHypertrophyEagle = ref(false);
const urlHypertrophyEagle = ref('favicon.ico');

//function to toggle categories state
const toggleCategories = () => {
  //showCategories.value = !showCategories.value -> smart way to do it
  if (showCategories.value === false) {
    showCategories.value = true;
    closeExercises();
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

const closeExercises = () => {
  showExercises.value = false;
}

const toggleHypertrophyEagle = () => {
  showHypertrophyEagle.value = !showHypertrophyEagle.value;
}


//runs automatically when component loads on screen
onMounted(async () => {
  const res = await fetch('http://localhost:3030/api/categories/'); //by default, it looks for get operations
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
    <Transition name="fade" mode="out-in">
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

    <Transition name="fadeExercises" mode="out-in">
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

  <div class="smiley-container">
    <header class="smiley-header" @click="toggleHypertrophyEagle">
      ツ
    </header>
    <Transition name="fadeEagle" mode="out-in">
      <img v-if="showHypertrophyEagle" :src="urlHypertrophyEagle" class="hypertrophy-eagle" @click="toggleHypertrophyEagle">
    </Transition>
  </div>

</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
  margin: 0 auto 1rem auto; /* Removed hardcoded 13rem left margin */
  position: relative; /* Serves as position reference for smooth transition overlays */
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

.loading-state {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

/* Base Transition Configuration */
.fade-enter-active,
.fadeExercises-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Taking leaving elements out of document flow prevents layout snapping */
/*Commented out because I don't need exit animations for now*/
/* .fade-leave-active,
.fadeExercises-leave-active {
  transition: opacity 0.25s cubic-bezier(0.7, 0, 0.84, 0), 
              transform 0.25s cubic-bezier(0.7, 0, 0.84, 0);
  position: absolute; 
  width: calc(100% - 2rem); Fits container padding during exit
  pointer-events: none;
} */

/* Initial and Exit States */
.fade-enter-from,
.fadeExercises-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

/*Commented out because I don't need exit animations for now*/
/* .fade-leave-to,
.fadeExercises-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
} */

/* Shared Grid Styles */
.category-grid,
.exercise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  width: 100%;
}

/* Shared Card Styles */
.category-card,
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

.category-card:hover,
.exercise-card:hover {
  transform: translateY(-3px);
  background-color: #3b3b3b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.smiley-header {
  cursor: pointer
}

.hypertrophy-eagle {
  position: absolute;
  left: 34%;
  top: 25%;
  max-width: 30%;
  align-self: center;
}

/* CE LULA MEA FACE ASTA CA NU SE SCHIMBa nimic */
.fadeEagle-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.fadeEagle-enter-active {
  transition: opacity 3s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 3s cubic-bezier(0.16, 1, 0.3, 1);
}



</style>