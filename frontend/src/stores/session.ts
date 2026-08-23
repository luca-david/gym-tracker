import { defineStore } from 'pinia';
import { createUser } from '../api/users';
import {
  startWorkout as apiStartWorkout,
  endWorkout as apiEndWorkout,
  deleteWorkout as apiDeleteWorkout,
} from '../api/workouts';
import { logSet as apiLogSet, updateSet as apiUpdateSet } from '../api/sets';
import type { ActiveWorkout, LoggedSet } from '../types';

const USER_KEY = 'gym.userId';
const WORKOUT_KEY = 'gym.activeWorkout';
const SETS_KEY = 'gym.loggedSets';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// There is only one user in this app, and the backend has no endpoint to
// list users, so we create one on first launch and remember the id locally.
const DEFAULT_USER_NAME = 'Me';

export const useSessionStore = defineStore('session', {
  state: () => ({
    userId: loadJSON<number | null>(USER_KEY, null),
    activeWorkout: loadJSON<ActiveWorkout | null>(WORKOUT_KEY, null),
    loggedSets: loadJSON<LoggedSet[]>(SETS_KEY, []),
  }),

  getters: {
    hasActiveWorkout: (state) => state.activeWorkout?.status === 'in_progress',
    totalVolume: (state) =>
      state.loggedSets.reduce((sum, s) => sum + s.reps * s.weight, 0),
  },

  actions: {
    persist() {
      localStorage.setItem(USER_KEY, JSON.stringify(this.userId));
      localStorage.setItem(WORKOUT_KEY, JSON.stringify(this.activeWorkout));
      localStorage.setItem(SETS_KEY, JSON.stringify(this.loggedSets));
    },

    async ensureUser(): Promise<number> {
      if (this.userId) return this.userId;
      const res = await createUser(DEFAULT_USER_NAME);
      if (!res.userId) {
        throw new Error(
          'The server did not return a userId. The /api/users/new endpoint needs the one-line fix described in the integration notes.'
        );
      }
      this.userId = res.userId;
      this.persist();
      return this.userId;
    },

    async startWorkout() {
      const userId = await this.ensureUser();
      const date = new Date().toISOString();
      const res = await apiStartWorkout(userId, date);
      if (!res.workoutId) {
        throw new Error(
          'The server did not return a workoutId. The POST /api/workouts endpoint needs the one-line fix described in the integration notes.'
        );
      }
      this.activeWorkout = { id: res.workoutId, date, status: 'in_progress' };
      this.loggedSets = [];
      this.persist();
    },

    async finishWorkout() {
      if (!this.activeWorkout) return;
      await apiEndWorkout(this.activeWorkout.id);
      this.activeWorkout = { ...this.activeWorkout, status: 'finished' };
      this.persist();
    },

    async discardWorkout() {
      if (!this.activeWorkout) return;
      await apiDeleteWorkout(this.activeWorkout.id);
      this.activeWorkout = null;
      this.loggedSets = [];
      this.persist();
    },

    clearFinishedWorkout() {
      this.activeWorkout = null;
      this.loggedSets = [];
      this.persist();
    },

    async logSet(
      exerciseId: number,
      exerciseName: string,
      payload: { reps: number; weight: number; note?: string }
    ) {
      if (!this.activeWorkout) throw new Error('No active workout to log a set into.');
      const res = await apiLogSet(this.activeWorkout.id, { ...payload, exerciseId });
      this.loggedSets.push({
        id: res.setId,
        exerciseId,
        exerciseName,
        reps: payload.reps,
        weight: payload.weight,
        note: payload.note,
      });
      this.persist();
    },

    async editSet(setId: number, updates: { reps?: number; weight?: number }) {
      await apiUpdateSet(setId, updates);
      const target = this.loggedSets.find((s) => s.id === setId);
      if (target) {
        if (updates.reps !== undefined) target.reps = updates.reps;
        if (updates.weight !== undefined) target.weight = updates.weight;
        this.persist();
      }
    },
  },
});
