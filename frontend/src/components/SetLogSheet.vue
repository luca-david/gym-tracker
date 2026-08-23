<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Exercise } from '../types';
import { useSessionStore } from '../stores/session';

const props = defineProps<{ exercise: Exercise | null }>();
const emit = defineEmits<{ close: []; logged: [] }>();

const session = useSessionStore();

const reps = ref<number | null>(null);
const weight = ref<number | null>(null);
const note = ref('');
const saving = ref(false);
const error = ref('');

// Prefill with the last set logged for this exercise in the current
// workout, so repeat sets are a single tap.
const lastSetForExercise = computed(() => {
  if (!props.exercise) return null;
  const sets = session.loggedSets.filter((s) => s.exerciseId === props.exercise!.id);
  return sets.length ? sets[sets.length - 1] : null;
});

watch(
  () => props.exercise,
  () => {
    reps.value = lastSetForExercise.value?.reps ?? null;
    weight.value = lastSetForExercise.value?.weight ?? null;
    note.value = '';
    error.value = '';
  },
  { immediate: true }
);

async function submit() {
  if (!props.exercise) return;
  if (!reps.value || !weight.value) {
    error.value = 'Enter both weight and reps';
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    await session.logSet(props.exercise.id, props.exercise.name, {
      reps: reps.value,
      weight: weight.value,
      note: note.value || undefined,
    });
    emit('logged');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not log the set';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <teleport to="body">
    <transition name="backdrop">
      <div v-if="exercise" class="backdrop" @click="emit('close')" />
    </transition>
    <transition name="sheet">
      <div v-if="exercise" class="sheet" role="dialog" aria-modal="true">
        <div class="sheet-handle" />
        <h2>{{ exercise.name }}</h2>

        <div class="fields">
          <div class="weight-field">
            <label>
              <span class="eyebrow">Weight (kg)</span>
              <input v-model.number="weight" type="number" inputmode="decimal" min="0" autofocus />
            </label>
          </div>
          <div class="reps-field">
            <label>
              <span class="eyebrow">Reps</span>
              <input v-model.number="reps" type="number" inputmode="numeric" min="0" />
            </label>
          </div>
        </div>

        <label class="note-field">
          <span class="eyebrow">Note (optional)</span>
          <input v-model="note" type="text" placeholder="" />
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="actions">
          <button class="btn btn-ghost btn-block" @click="emit('close')">Cancel</button>
          <button class="btn btn-primary btn-block" :disabled="saving" @click="submit">
            {{ saving ? 'Logging…' : 'Log set' }}
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>

.btn-primary {
  background-color: #6f1e0c;
  color: white;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(28, 28, 30, 0.35);
  z-index: 20;
}

.sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 21;
  max-width: 480px;
  margin: 0 auto;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  padding: 10px 20px 24px;
  box-shadow: 0 -4px 24px rgba(28, 28, 30, 0.15);
}

.sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--line);
  margin: 6px auto 16px;
}

.sheet h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.reps-field {
  max-width: 55%;
}

.fields label,
.note-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.note-field {
  margin-bottom: 12px;
}

input {
  font-family: var(--font-mono);
  font-size: 20px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px;
  background: var(--paper);
  color: var(--ink);
}

.note-field input {
  font-family: var(--font-body);
  font-size: 15px;
}

.error {
  font-size: 13px;
  color: var(--accent);
  margin-bottom: 8px;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
