<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchExercisesForCategory } from '../api/exercises.ts';
import { useSessionStore } from '../stores/session';
import type { Exercise } from '../types';
import SetLogSheet from '../components/SetLogSheet.vue';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const exercises = ref<Exercise[]>([]);
const loading = ref(true);
const error = ref('');
const startingWorkout = ref(false);

const activeExercise = ref<Exercise | null>(null);

const categoryName = computed(() => (route.query.name as string) ?? 'Exercises');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    exercises.value = await fetchExercisesForCategory(route.params.id as string);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not load exercises';
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function pick(exercise: Exercise) {
  activeExercise.value = exercise;
}

function closeSheet() {
  activeExercise.value = null;
}

function onLogged() {
  activeExercise.value = null;
  router.push({ name: 'home' });
}

async function startWorkoutNow() {
  startingWorkout.value = true;
  error.value = '';
  try {
    await session.startWorkout();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not start a workout';
  } finally {
    startingWorkout.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="category-title">{{ categoryName }}</h2>

    <div v-if="!session.hasActiveWorkout" class="banner-warn">
      <span>Start a workout to begin logging sets.</span>
      <button class="btn btn-primary small" :disabled="startingWorkout" @click="startWorkoutNow">
        {{ startingWorkout ? 'Starting…' : 'Start workout' }}
      </button>
    </div>

    <p v-if="error" class="banner-error">{{ error }}</p>

    <div v-if="loading" class="empty-state">
      <p class="muted">Loading…</p>
    </div>

    <template v-else>
      <transition-group name="list" tag="div" class="list">
        <button
          v-for="(ex, i) in exercises"
          :key="ex.id"
          class="list-item"
          :style="{ transitionDelay: `${i * 30}ms` }"
          @click="pick(ex)"
        >
          <span>{{ ex.name }}</span>
          <span class="chevron">+</span>
        </button>
      </transition-group>

      <div v-if="!exercises.length" class="empty-state">
        <p class="muted">No exercises in this category yet.</p>
      </div>
    </template>

    <SetLogSheet :exercise="activeExercise" @close="closeSheet" @logged="onLogged" />
  </div>
</template>

<style scoped>
.category-title {
  font-size: 26px;
  margin-bottom: 16px;
}

.banner-warn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 12px 14px;
  margin-bottom: 16px;
  font-size: 13px;
}

.banner-error {
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: var(--radius);
  padding: 12px 14px;
  font-size: 13px;
  margin-bottom: 16px;
}

.chevron {
  color: var(--accent);
  font-size: 18px;
  font-weight: 600;
}

.btn.small {
  padding: 8px 14px;
  font-size: 13px;
  white-space: nowrap;
}
</style>
