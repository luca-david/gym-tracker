<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import SetRow from '../components/SetRow.vue';
import SetLogSheet from '@/components/SetLogSheet.vue';
import type { Exercise } from '@/types/index.ts';

const session = useSessionStore();
const router = useRouter();

const loading = ref(false);
const error = ref('');

const activeExercise = ref<Exercise | null>(null);

async function start() {
  loading.value = true;
  error.value = '';
  try {
    await session.startWorkout();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not start a workout';
  } finally {
    loading.value = false;
  }
}

async function finish() {
  loading.value = true;
  error.value = '';
  try {
    await session.finishWorkout();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not finish the workout';
  } finally {
    loading.value = false;
  }
}

async function discard() {
  if (!confirm('Discard this workout and everything logged in it?')) return;
  loading.value = true;
  error.value = '';
  try {
    await session.discardWorkout();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not delete the workout';
  } finally {
    loading.value = false;
  }
}

// function addExercise() {
//   router.push({ name: 'categories' });
// }

function repeatLastExercise() {
  const last = session.loggedSets[session.loggedSets.length - 1]; //last logged set in current session

  //const activeExerciseId = session.loggedSets[session.loggedSets.length - 1]?.exerciseId

  // /api/exercises/onCategory/:categoryId -> path for the router

  if (last) {
    //plan: go to the page for exercises based on categoryId
    activeExercise.value = { id: last.exerciseId, name: last.exerciseName, category_id: last.categoryId};
    router.push({ 'name': 'exercises', 'params': {id: last.categoryId}, 'query': { open: String(last.exerciseId) } });
  } else {
    router.push({ name: 'categories' });
  }
}

function formattedDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <div>
    <p v-if="error" class="banner-error">{{ error }}</p>

    <!-- No workout yet -->
    <div v-if="!session.activeWorkout" class="empty-state">
      <h3>No workout yet</h3>
      <p class="muted">Start one to begin logging sets.</p>
      <button class="btn btn-primary" style="margin-top: 20px" :disabled="loading" @click="start">
        {{ loading ? 'Starting…' : 'Start workout' }}
      </button>
    </div>

    <!-- Active or finished workout -->
    <div v-else>
      <div class="summary card">
        <div>
          <span class="eyebrow">{{
            session.activeWorkout.status === 'in_progress' ? 'In progress' : 'Finished'
          }}</span>
          <h2>{{ formattedDate(session.activeWorkout.date) }}</h2>
        </div>
        <div class="volume">
          <span class="value">{{ session.totalVolume }}</span>
          <span class="unit">kg total</span>
        </div>
      </div>

      <button
        v-if="session.hasActiveWorkout"
        class="btn btn-primary btn-block"
        style="margin: 16px 0"
        @click="repeatLastExercise"
      >
        + Log a set
      </button>

      <transition-group name="list" tag="div" class="sets">
        <SetRow
          v-for="(set, i) in session.loggedSets"
          :key="set.id"
          :set="set"
          :index="i"
        />
      </transition-group>

      <div v-if="!session.loggedSets.length" class="empty-state small">
        <p class="muted">No sets logged yet.</p>
      </div>

      <div v-if="session.hasActiveWorkout" class="footer-actions">
        <button class="btn btn-ghost btn-block" :disabled="loading" @click="finish">
          Finish workout
        </button>
        <button class="btn btn-danger btn-block" :disabled="loading" @click="discard">
          Discard workout
        </button>
      </div>

      <button
        v-else
        class="btn btn-primary btn-block"
        style="margin-top: 20px"
        :disabled="loading"
        @click="start"
      >
        Start a new workout
      </button>
    </div>
    <SetLogSheet :exercise="activeExercise" @close="activeExercise = null" @logged="activeExercise = null" />
  </div>
</template>

<style scoped>
.banner-error {
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: var(--radius);
  padding: 12px 14px;
  font-size: 13px;
  margin-bottom: 16px;
}

.btn-block {
  background-color: #6f1e0c;
}

.btn {
  background-color: #6f1e0c;
  color: #ffff;
}

.empty-state.small {
  padding: 24px 0;
  
}

.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary h2 {
  font-size: 22px;
  margin-top: 2px;
}

.volume {
  text-align: right;
  font-family: var(--font-mono);
}

.volume .value {
  display: block;
  font-size: 22px;
  font-weight: 600;
}

.volume .unit {
  font-size: 11px;
  color: var(--muted);
}

.sets {
  position: relative;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
}
</style>
