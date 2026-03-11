<script setup>
import { ref } from 'vue'
import TCMHome from './components/TCMHome.vue'
import MarketingHome from './components/MarketingHome.vue'

// Determine current view state ('landing' or 'course')
const currentView = ref('landing')

const navigateToCourse = () => {
  currentView.value = 'course'
}
</script>

<template>
  <div class="antialiased text-stone-900 bg-stone-50 min-h-screen">
    <transition name="fade" mode="out-in">
      <MarketingHome 
        v-if="currentView === 'landing'" 
        @start-learning="navigateToCourse" 
      />
      <TCMHome v-else />
    </transition>
  </div>
</template>

<style>
/* Global Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
