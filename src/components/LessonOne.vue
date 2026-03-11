<script setup>
import { ref, computed } from 'vue'
import { ArrowRight, CheckCircle, BookOpen } from 'lucide-vue-next'
import LessonOneIntro from './LessonOneIntro.vue'
import LessonOnePhilosophy from './LessonOnePhilosophy.vue'
import LessonOneBody from './LessonOneBody.vue'
import LessonOneBalance from './LessonOneBalance.vue'
import LessonOneGame from './LessonOneGame.vue'
import LessonOneSummary from './LessonOneSummary.vue'

// Current step state (0 to 5)
// 0: Intro (导入)
// 1: Philosophy (讲解一：哲学分类)
// 2: Body & Symptoms (讲解二：人体与症状)
// 3: Balance & Mutual Root (讲解三：平衡与互根)
// 4: Language Practice (语言实操)
// 5: Summary (小结)
const currentStep = ref(0)
const maxSteps = 6

// Track completion status of each step
const stepStatus = ref([
  { id: 0, title: '导入', subtitle: 'Intro', completed: false },
  { id: 1, title: '哲学分类', subtitle: 'Philosophy', completed: false },
  { id: 2, title: '人体与症状', subtitle: 'Body & Symptoms', completed: false },
  { id: 3, title: '平衡与互根', subtitle: 'Balance', completed: false },
  { id: 4, title: '语言实操', subtitle: 'Practice', completed: false },
  { id: 5, title: '小结', subtitle: 'Summary', completed: false }
])

const currentComponent = computed(() => {
  switch (currentStep.value) {
    case 0: return LessonOneIntro
    case 1: return LessonOnePhilosophy
    case 2: return LessonOneBody
    case 3: return LessonOneBalance
    case 4: return LessonOneGame
    case 5: return LessonOneSummary
    default: return LessonOneIntro
  }
})

const progress = computed(() => {
  return ((currentStep.value + 1) / maxSteps) * 100
})

const handleStepComplete = () => {
  stepStatus.value[currentStep.value].completed = true
}

const nextStep = () => {
  if (currentStep.value < maxSteps - 1) {
    // Mark current step as completed if not already (though usually handled by internal component event)
    stepStatus.value[currentStep.value].completed = true
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="max-w-4xl w-full mx-auto pb-20">
    
    <!-- Progress Header -->
    <div class="mb-8 sticky top-16 z-40 bg-white/90 backdrop-blur-md py-4 border-b border-stone-100">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-xl font-bold text-stone-800 font-serif">第一课：日月与阴阳</h1>
        <span class="text-sm font-medium text-stone-500">Step {{ currentStep + 1 }} / {{ maxSteps }}</span>
      </div>
      <!-- Progress Bar -->
      <div class="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
        <div 
          class="bg-stone-900 h-2 rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <!-- Step Indicators (Mobile hidden, Desktop visible) -->
      <div class="hidden md:flex justify-between mt-2">
        <div 
          v-for="(step, idx) in stepStatus" 
          :key="idx"
          class="flex flex-col items-center cursor-pointer"
          @click="stepStatus[idx].completed || idx <= currentStep ? currentStep = idx : null"
          :class="idx === currentStep ? 'opacity-100' : (step.completed ? 'opacity-70' : 'opacity-30')"
        >
          <div 
            class="w-2 h-2 rounded-full mb-1 transition-colors"
            :class="idx === currentStep ? 'bg-stone-900 scale-125' : (step.completed ? 'bg-green-500' : 'bg-stone-300')"
          ></div>
          <span class="text-xs font-medium text-stone-600">{{ step.title }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area with Transition -->
    <div class="min-h-[500px] relative">
      <transition 
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-4"
      >
        <component 
          :is="currentComponent" 
          @complete="handleStepComplete"
        />
      </transition>
    </div>

    <!-- Navigation Controls -->
    <div class="mt-12 flex items-center justify-between border-t border-stone-200 pt-8">
      <button 
        @click="prevStep"
        :disabled="currentStep === 0"
        class="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
        :class="currentStep === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'"
      >
        Back
      </button>

      <button 
        @click="nextStep"
        :disabled="currentStep === maxSteps - 1"
        class="flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
        :class="currentStep === maxSteps - 1 
          ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none' 
          : 'bg-stone-900 text-white hover:bg-stone-800'"
      >
        <span>{{ currentStep === maxSteps - 1 ? 'Lesson Completed' : 'Next Step' }}</span>
        <ArrowRight v-if="currentStep < maxSteps - 1" class="w-5 h-5" />
        <CheckCircle v-else class="w-5 h-5" />
      </button>
    </div>

  </div>
</template>
