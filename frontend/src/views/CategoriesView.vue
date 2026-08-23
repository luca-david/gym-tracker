<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCategories, createCategory } from '../api/categories';
import type { Category } from '../types';

const router = useRouter();

const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref('');

const newName = ref('');
const creating = ref(false);
const createError = ref('');
const showAdd = ref(false);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    categories.value = await fetchCategories();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not load categories';
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function openExercises(category: Category) {
  router.push({ name: 'exercises', params: { id: category.id }, query: { name: category.name } });
}

async function addCategory() {
  if (!newName.value.trim()) return;
  creating.value = true;
  createError.value = '';
  try {
    await createCategory(newName.value.trim());
    newName.value = '';
    showAdd.value = false;
    await load();
  } catch (e) {
    createError.value = e instanceof Error ? e.message : 'Could not create category';
  } finally {
    creating.value = false;
  }
}
</script>

<template>
  <div>
    <p v-if="error" class="banner-error">{{ error }}</p>

    <div v-if="loading" class="empty-state">
      <p class="muted">Loading…</p>
    </div>

    <template v-else>
      <transition-group name="list" tag="div" class="list">
        <button
          v-for="(cat, i) in categories"
          :key="cat.id"
          class="list-item"
          :style="{ transitionDelay: `${i * 30}ms` }"
          @click="openExercises(cat)"
        >
          <span>{{ cat.name }}</span>
          <span class="chevron">›</span>
        </button>
      </transition-group>

      <div v-if="!categories.length" class="empty-state">
        <p class="muted">No categories yet.</p>
      </div>

      <div class="add-block">
        <button v-if="!showAdd" class="btn btn-ghost btn-block" @click="showAdd = true">
          + New category
        </button>
        <div v-else class="add-form">
          <input v-model="newName" type="text" placeholder="Category name" @keyup.enter="addCategory" />
          <div class="add-actions">
            <button class="btn btn-ghost small" @click="showAdd = false">Cancel</button>
            <button class="btn btn-primary small" :disabled="creating" @click="addCategory">
              {{ creating ? 'Adding…' : 'Add' }}
            </button>
          </div>
          <p v-if="createError" class="error">{{ createError }}</p>
        </div>
      </div>
    </template>
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

.chevron {
  color: var(--muted);
  font-size: 18px;
}

.add-block {
  margin-top: 20px;
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

.btn.small {
  padding: 8px 14px;
  font-size: 13px;
}

.btn-primary {
  background-color: #6f1e0c;
}

.error {
  font-size: 12px;
  color: var(--accent);
}
</style>
