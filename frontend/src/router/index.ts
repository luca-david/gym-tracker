import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import ExercisesView from '../views/ExercisesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/categories', name: 'categories', component: CategoriesView },
    {
      path: '/categories/:id/exercises',
      name: 'exercises',
      component: ExercisesView,
      props: true,
    },
  ],
});

export default router;
