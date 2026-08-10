<script setup lang="ts">
import { ref , onMounted } from 'vue'

const categories = ref<string[]>([])

//runs automatically when component loads on screen
onMounted(async () => {
  const res = await fetch('http://localhost:3030/api/categories/'); //how does this know that this is a get and not a post
  const responseData = await res.json();

  categories.value = responseData.data;
})
</script>

<template>
  <div>
    <h1>Gym Tracker App</h1>
  </div>

  <div>
    <h2>Categories from Database</h2>
    <p v-if="categories.length === 0">Loading categories or database is empty...</p>
    <ul>
      <li v-for="cat in categories" :key="cat">
        {{ cat }}
      </li>
    </ul>
  </div>
</template>

