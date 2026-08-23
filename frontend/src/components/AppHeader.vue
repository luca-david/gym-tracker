<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const titles: Record<string, string> = {
  home: 'Today',
  categories: 'Categories',
  exercises: 'Exercises',
};
</script>

<template>
  <header class="header">
    <button v-if="route.name !== 'home'" class="back" @click="router.back()" aria-label="Back">
      ‹
    </button>
    <span v-else class="spacer" />
    <h1>{{ titles[route.name as string] ?? '' }}</h1>
    <span class="spacer" />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  border-bottom: 1px solid var(--line);
  background: var(--paper);
  position: sticky;
  top: 0;
  z-index: 5;
}

.header h1 {
  font-size: 20px;
}

.back {
  background: none;
  border: none;
  font-size: 26px;
  line-height: 1;
  color: var(--accent);
  width: 32px;
  text-align: left;
}

.spacer {
  width: 32px;
  display: inline-block;
}
</style>
