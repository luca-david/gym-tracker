<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchExercisesForCategory, createNewExercise } from '../api/exercises.ts';
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

const newName = ref(''); //for storing the exercise of the new exercise
const creating = ref(false); //for storing the data about the new exercise
const createError = ref(''); //error variable
const showAdd = ref(false); //brings up the add exercise component

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
  const openId = Number(route.query.open);
  if (openId) {
    activeExercise.value = exercises.value.find((e) => e.id === openId) ?? null;
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

async function addExercise() {
  if (!newName.value.trim()) {
    return
  }

  const categoryId = parseInt(route.params.id as string, 10); //reads from URL
  if (Number.isNaN(categoryId)) {
    createError.value = 'Invalid category Id';
    return;
  }

  creating.value = true;
  createError.value = '';

  console.log(route.params);

  try {
    await createNewExercise(newName.value.trim(), categoryId);
    newName.value = '';
    showAdd.value = false;
    await load();
  } catch (error) {
    createError.value = error instanceof Error ? error.message : 'Could not create new exercicse';
  } finally {
    creating.value = false;
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

      <button v-if="!showAdd" class="btn btn-ghost btn-add-exercise btn-block" @click="showAdd = true">
        + New Exercise
      </button>
      <div v-else class="add-form">
          <input v-model="newName" type="text" placeholder="Exercise name" @keyup.enter="addExercise" />
          <div class="add-actions">
            <button class="btn btn-ghost small" @click="showAdd = false">Cancel</button>
            <button class="btn btn-primary small" :disabled="creating" @click="addExercise">
              {{ creating ? 'Adding…' : 'Add' }}
            </button>
          </div>
          <p v-if="createError" class="error">{{ createError }}</p>
        </div>
    </template>

    <SetLogSheet :exercise="activeExercise" @close=closeSheet @logged=onLogged />
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

.add-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-form input {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 12px;
  font-size: 15px;
  background: var(--surface);
}

.add-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-add-exercise {
  margin-top: 1.5rem;
}

</style>
