<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import AppHeader from './components/AppHeader.vue';


const homeIconUrl = '/home-icon.png'
//const homeIconUrl = '/hypertrophy-eagle.jpeg'

const router = useRouter();
const route = useRoute();

const goToMain = () => {
  router.push('/')
}
</script>

<template>
  <div class="app-shell">
    <!-- hide button if already on main page -->
    <button class="home-btn" v-if="route.path !== '/'" @click="goToMain">
      <img class="home-icon" :src="homeIconUrl" alt="Main Page"/>
    </button>
    <AppHeader />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>

.home-icon {
  width: 32px;       /* this is for adjusting the size */
  height: 32px;
  display: block;
}

/* 2. Clean up the button and push it to the right */
.home-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;  /* pushes the button all the way to the right edge */
  margin-right: 1rem; /* small gap from the right border */
  margin-top: 0.5rem; /* small gap from the top border */
}

</style>