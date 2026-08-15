<script setup lang="ts">
import { ref } from 'vue'

const showHypertrophyEagle = ref(false)
const urlHypertrophyEagle = ref('hypertrophy-eagle.jpeg')

const toggleHypertrophyEagle = () => {
  showHypertrophyEagle.value = !showHypertrophyEagle.value
}
</script>

<template>
  <div class="smiley-container">
    <header class="smiley-header" @click="toggleHypertrophyEagle">
      ツ
    </header>
    <Transition name="fadeEagle" mode="out-in">
      <img 
        v-if="showHypertrophyEagle" 
        :src="urlHypertrophyEagle" 
        class="hypertrophy-eagle" 
        @click="toggleHypertrophyEagle"
      >
    </Transition>
  </div>
</template>

<style scoped>
.smiley-container {
  max-height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.smiley-header {
  cursor: pointer;
  user-select: none;
}

.hypertrophy-eagle {
  position: absolute;
  left: 34%;
  top: 25%;
  max-width: 30%;
  align-self: center;
  cursor: pointer;
}

.fadeEagle-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.fadeEagle-enter-active {
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>