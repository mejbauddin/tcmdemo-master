<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useExerciseStore } from '../../stores/exerciseStore';
import { exerciseBank, allExercises } from '../../data/exercises';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, RotateCcw, BookOpen, Activity, Brain, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  lessonId: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['show-login']);

const authStore = useAuthStore();
const exerciseStore = useExerciseStore();

// State
const currentCategory = ref('all');
const currentExerciseIndex = ref(0);
const selectedAnswer = ref('');
const showResult = ref(false);
const result = ref(null);
const score = ref(0);
const completedExercises = ref([]);
const showExplanation = ref(false);
const filterMode = ref('all');
const loading = ref(false);

// Computed
const filteredExercises = computed(() => {
  let exercises = [];
  
  if (currentCategory.value === 'vocabulary') {
    exercises = exerciseBank.vocabulary || [];
  } else if (currentCategory.value === 'yinYang') {
    exercises = exerciseBank.yinYangProperties || [];
  } else if (currentCategory.value === 'application') {
    exercises = exerciseBank.application || [];
  } else {
    exercises = allExercises || [];
  }
  
  // Filter by wrong answers if authenticated
  if (authStore.isAuthenticated && filterMode.value === 'wrong' && exerciseStore.wrongAnswers) {
    const wrongIds = exerciseStore.wrongAnswers.map(wa => wa.exercise_id);
    exercises = exercises.filter(e => wrongIds.includes(e.id));
  }
  
  return exercises;
});

const currentExercise = computed(() => {
  return filteredExercises.value[currentExerciseIndex.value] || null;
});

const progress = computed(() => {
  if (!filteredExercises.value || filteredExercises.value.length === 0) return 0;
  return ((currentExerciseIndex.value + 1) / filteredExercises.value.length) * 100;
});

const categoryStats = computed(() => {
  return {
    vocabulary: exerciseBank.vocabulary?.length || 0,
    yinYang: exerciseBank.yinYangProperties?.length || 0,
    application: exerciseBank.application?.length || 0,
    total: allExercises?.length || 0
  };
});

// Methods
const selectAnswer = (option) => {
  if (showResult.value) return;
  selectedAnswer.value = option;
};

const checkAnswer = async () => {
  if (!selectedAnswer.value || !currentExercise.value) return;
  
  const isCorrect = selectedAnswer.value === currentExercise.value.correct;
  
  result.value = {
    isCorrect,
    correctAnswer: currentExercise.value.correct,
    explanation: currentExercise.value.explanation || '暂无解析',
    userAnswer: selectedAnswer.value
  };
  
  showResult.value = true;
  
  if (isCorrect) {
    score.value++;
    if (!completedExercises.value.includes(currentExercise.value.id)) {
      completedExercises.value.push(currentExercise.value.id);
    }
  }
  
  // Submit to backend if authenticated
  if (authStore.isAuthenticated) {
    try {
      await exerciseStore.submitAnswer(
        currentExercise.value.id,
        selectedAnswer.value
      );
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  }
  
  saveProgress();
};

const nextExercise = () => {
  if (currentExerciseIndex.value < filteredExercises.value.length - 1) {
    currentExerciseIndex.value++;
    resetExercise();
  }
};

const prevExercise = () => {
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--;
    resetExercise();
  }
};

const resetExercise = () => {
  selectedAnswer.value = '';
  showResult.value = false;
  result.value = null;
  showExplanation.value = false;
};

const resetAll = () => {
  currentExerciseIndex.value = 0;
  score.value = 0;
  completedExercises.value = [];
  resetExercise();
  localStorage.removeItem('exercise_progress');
};

const getOptionLetter = (index) => {
  return String.fromCharCode(65 + index);
};

const getOptionClass = (option) => {
  if (!showResult.value) {
    return selectedAnswer.value === option
      ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900'
      : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50';
  }
  
  if (option === currentExercise.value.correct) {
    return 'border-green-500 bg-green-50 ring-2 ring-green-500';
  }
  
  if (option === selectedAnswer.value && option !== currentExercise.value.correct) {
    return 'border-red-500 bg-red-50 ring-2 ring-red-500';
  }
  
  return 'border-stone-200 opacity-50';
};

// Save progress
const saveProgress = () => {
  localStorage.setItem('exercise_progress', JSON.stringify({
    score: score.value,
    completed: completedExercises.value
  }));
};

// Load saved progress
onMounted(async () => {
  console.log('ExerciseBank mounted');
  console.log('All exercises:', allExercises?.length);
  console.log('Vocabulary:', exerciseBank.vocabulary?.length);
  console.log('YinYang:', exerciseBank.yinYangProperties?.length);
  console.log('Application:', exerciseBank.application?.length);
  
  const saved = localStorage.getItem('exercise_progress');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      score.value = parsed.score || 0;
      completedExercises.value = parsed.completed || [];
    } catch (e) {
      console.error('Failed to load saved progress:', e);
    }
  }
  
  if (authStore.isAuthenticated) {
    await exerciseStore.fetchWrongAnswers();
  }
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6">
      <h2 class="text-2xl font-bold font-serif mb-2">第一课 练习题</h2>
      <p class="text-stone-300 text-sm">Lesson 1 Exercises ({{ categoryStats.total }} questions)</p>
    </div>

    <!-- Stats Bar -->
    <div class="bg-stone-50 p-4 border-b border-stone-200 grid grid-cols-4 gap-2">
      <div class="text-center">
        <div class="text-xs text-stone-500">得分</div>
        <div class="text-lg font-bold text-stone-800">{{ score }}</div>
      </div>
      <div class="text-center">
        <div class="text-xs text-stone-500">已完成</div>
        <div class="text-lg font-bold text-stone-800">{{ completedExercises.length }}/{{ categoryStats.total }}</div>
      </div>
      <div class="text-center">
        <div class="text-xs text-stone-500">正确率</div>
        <div class="text-lg font-bold text-stone-800">
          {{ completedExercises.length ? Math.round((score / completedExercises.length) * 100) : 0 }}%
        </div>
      </div>
      <div class="text-center">
        <div class="text-xs text-stone-500">错题</div>
        <div class="text-lg font-bold text-red-600">{{ exerciseStore.wrongAnswers?.length || 0 }}</div>
      </div>
    </div>

    <!-- Category Navigation -->
    <div class="p-4 border-b border-stone-200 flex flex-wrap gap-2">
      <button
        @click="currentCategory = 'all'; currentExerciseIndex = 0; resetExercise()"
        class="px-4 py-2 rounded-full text-sm font-medium transition"
        :class="currentCategory === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
      >
        <BookOpen class="w-4 h-4 inline mr-1" />
        全部 ({{ categoryStats.total }})
      </button>
      <button
        @click="currentCategory = 'vocabulary'; currentExerciseIndex = 0; resetExercise()"
        class="px-4 py-2 rounded-full text-sm font-medium transition"
        :class="currentCategory === 'vocabulary' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
      >
        <BookOpen class="w-4 h-4 inline mr-1" />
        词汇 ({{ categoryStats.vocabulary }})
      </button>
      <button
        @click="currentCategory = 'yinYang'; currentExerciseIndex = 0; resetExercise()"
        class="px-4 py-2 rounded-full text-sm font-medium transition"
        :class="currentCategory === 'yinYang' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
      >
        <Activity class="w-4 h-4 inline mr-1" />
        阴阳属性 ({{ categoryStats.yinYang }})
      </button>
      <button
        @click="currentCategory = 'application'; currentExerciseIndex = 0; resetExercise()"
        class="px-4 py-2 rounded-full text-sm font-medium transition"
        :class="currentCategory === 'application' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
      >
        <Brain class="w-4 h-4 inline mr-1" />
        应用 ({{ categoryStats.application }})
      </button>
    </div>

    <!-- Filter Bar -->
    <div v-if="authStore.isAuthenticated" class="px-4 py-2 bg-stone-50 border-b border-stone-200 flex gap-2">
      <button
        @click="filterMode = 'all'"
        class="px-3 py-1 rounded-full text-xs font-medium transition"
        :class="filterMode === 'all' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'"
      >
        全部题目
      </button>
      <button
        @click="filterMode = 'wrong'"
        class="px-3 py-1 rounded-full text-xs font-medium transition"
        :class="filterMode === 'wrong' ? 'bg-red-600 text-white' : 'bg-white text-stone-600 border border-stone-200'"
      >
        错题本 ({{ exerciseStore.wrongAnswers?.length || 0 }})
      </button>
    </div>

    <!-- Login Required -->
    <div v-if="!authStore.isAuthenticated" class="p-8 text-center">
      <div class="bg-yellow-50 rounded-xl p-6 max-w-md mx-auto">
        <AlertCircle class="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p class="text-yellow-800 mb-4">请登录后查看练习题</p>
        <button
          @click="$emit('show-login')"
          class="bg-stone-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-stone-800 transition"
        >
          登录
        </button>
      </div>
    </div>

    <!-- No Exercises -->
    <div v-else-if="!filteredExercises || filteredExercises.length === 0" class="p-12 text-center">
      <div class="text-stone-400 mb-4">暂无题目</div>
      <button
        @click="filterMode = 'all'"
        class="text-stone-600 hover:text-stone-900 underline"
      >
        查看全部题目
      </button>
    </div>

    <!-- Exercise Area -->
    <div v-else-if="currentExercise" class="p-6">
      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-stone-500 mb-2">
          <span>第 {{ currentExerciseIndex + 1 }} / {{ filteredExercises.length }} 题</span>
          <span>{{ currentExercise.category || '未分类' }}</span>
        </div>
        <div class="w-full bg-stone-100 rounded-full h-2">
          <div
            class="bg-stone-900 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Question -->
      <div class="mb-8">
        <div class="flex items-start gap-3">
          <span class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold shrink-0">
            {{ currentExercise.id }}
          </span>
          <h3 class="text-lg font-medium text-stone-800 leading-relaxed">
            {{ currentExercise.question }}
          </h3>
        </div>
      </div>

      <!-- Options -->
      <div class="space-y-3 mb-8">
        <div
          v-for="(option, index) in currentExercise.options"
          :key="index"
          @click="selectAnswer(getOptionLetter(index))"
          class="p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-3"
          :class="getOptionClass(getOptionLetter(index))"
        >
          <span class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-600">
            {{ getOptionLetter(index) }}
          </span>
          <span class="flex-1">{{ option }}</span>
          <CheckCircle v-if="showResult && getOptionLetter(index) === currentExercise.correct" class="w-5 h-5 text-green-500" />
          <XCircle v-if="showResult && getOptionLetter(index) === selectedAnswer && getOptionLetter(index) !== currentExercise.correct" class="w-5 h-5 text-red-500" />
        </div>
      </div>

      <!-- Explanation -->
      <div v-if="showResult && showExplanation" class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p class="text-sm text-blue-800">{{ result.explanation }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 justify-between items-center">
        <div class="flex gap-2">
          <button
            @click="prevExercise"
            :disabled="currentExerciseIndex === 0"
            class="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            @click="nextExercise"
            :disabled="currentExerciseIndex === filteredExercises.length - 1"
            class="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <div class="flex gap-2">
          <button
            v-if="showResult"
            @click="showExplanation = !showExplanation"
            class="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
          >
            {{ showExplanation ? '隐藏解析' : '查看解析' }}
          </button>
          
          <button
            v-if="!showResult"
            @click="checkAnswer"
            :disabled="!selectedAnswer"
            class="px-6 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50"
          >
            提交答案
          </button>

          <button
            v-if="showResult"
            @click="nextExercise"
            class="px-6 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition"
          >
            下一题
          </button>
        </div>
      </div>

      <!-- Reset Button -->
      <div class="mt-6 text-center">
        <button
          @click="resetAll"
          class="text-sm text-stone-400 hover:text-stone-600 transition flex items-center gap-1 mx-auto"
        >
          <RotateCcw class="w-4 h-4" />
          重置进度
        </button>
      </div>
    </div>
  </div>
</template>