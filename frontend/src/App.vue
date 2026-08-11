<script setup lang="ts">
import { ref , onMounted } from 'vue'

const categories = ref<string[]>([]);

//reactive state to show exercise categories
const showCategories = ref(false);

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
  

//runs automatically when component loads on screen
onMounted(async () => {
  const res = await fetch('http://localhost:3030/api/categories/'); //by defualy, it looks for get operations
  const responseData = await res.json();

  categories.value = responseData.data;
})
</script>

<template>
  <div class="app-container">
    <header class="app-header" @click="toggleCategories">
      <h1>Gym Tracker</h1>
    </header>

    <main class="content-section">
      <Transition name="fade">
        <p v-if="categories.length === 0" class="loading-state">
          Loading categories...
        </p>
      
        <div v-else v-show="showCategories" class="category-grid">
          <div v-for="cat in categories" :key="cat" class="category-card">
            <span>{{  cat  }}</span>
          </div>
        </div>
      </Transition>
    </main>
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
</style>