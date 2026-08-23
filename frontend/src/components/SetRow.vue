<script setup lang="ts">
import { ref } from 'vue';
import type { LoggedSet } from '../types';
import { useSessionStore } from '../stores/session';

const props = defineProps<{ set: LoggedSet; index: number }>();
const session = useSessionStore();

const editing = ref(false);
const draftReps = ref(props.set.reps);
const draftWeight = ref(props.set.weight);
const saving = ref(false);
const error = ref('');

function startEdit() {
  draftReps.value = props.set.reps;
  draftWeight.value = props.set.weight;
  error.value = '';
  editing.value = true;
}

async function save() {
  saving.value = true;
  error.value = '';
  try {
    await session.editSet(props.set.id, { reps: draftReps.value, weight: draftWeight.value });
    editing.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not save the change';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="set-row">
    <div class="set-row-main">
      <span class="eyebrow">Set {{ index + 1 }} · {{ set.exerciseName }}</span>

      <div v-if="!editing" class="plate-tag" @click="startEdit" role="button" tabindex="0">
        <span class="value">{{ set.weight }}</span>
        <span class="unit">kg</span>
        <span class="sep">×</span>
        <span class="value">{{ set.reps }}</span>
        <span class="unit">reps</span>
      </div>

      <div v-else class="edit-row">
        <label>
          <span class="unit">kg</span>
          <input v-model.number="draftWeight" type="number" inputmode="decimal" min="0" />
        </label>
        <label>
          <span class="unit">reps</span>
          <input v-model.number="draftReps" type="number" inputmode="numeric" min="0" />
        </label>
        <button class="btn btn-ghost small" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
        <button class="btn btn-ghost small" @click="editing = false">Cancel</button>
      </div>

      <p v-if="set.note" class="note">{{ set.note }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.set-row {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.set-row-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plate-tag {
  cursor: pointer;
}

.edit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.edit-row label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  color: var(--muted);
}

.edit-row input {
  width: 64px;
  font-family: var(--font-mono);
  font-size: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px 8px;
  background: var(--surface);
  color: var(--ink);
}

.btn.small {
  padding: 8px 12px;
  font-size: 13px;
}

.note {
  font-size: 13px;
  color: var(--muted);
  font-style: italic;
}

.error {
  font-size: 12px;
  color: var(--accent);
}
</style>
