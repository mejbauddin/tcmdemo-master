<script setup>
import { ref, onMounted } from 'vue'
import { Download, MessageSquare, Gamepad2, Mic, X, BookOpen, Award } from 'lucide-vue-next'
import LessonOneBalanceGame from './LessonOneBalanceGame.vue'
import VoiceAssessment from './voice/VoiceAssessment.vue'
import ExerciseBank from './exercises/ExerciseBank.vue'
import { useAuthStore } from '../stores/authStore'

const emit = defineEmits(['complete', 'show-login'])
const authStore = useAuthStore()
const showGame = ref(false)
const showVoice = ref(false)
const showExercises = ref(false)
const selectedVoiceExercise = ref(7)

const voiceExercises = [
  { id: 7, text: '头在上，属阳', description: '头在上方，属于阳' },
  { id: 8, text: '气为阳，血为阴', description: '气是阳，血是阴' },
  { id: 9, text: '天属阳，地属阴', description: '天属于阳，地属于阴' },
  { id: 10, text: '背为阳，腹为阴', description: '背部是阳，腹部是阴' },
  { id: 11, text: '口渴喜冷', description: '口渴喜欢喝冷的' },
  { id: 12, text: '畏寒', description: '害怕寒冷' }
]

onMounted(() => {
  emit('complete')
})

const openVoiceAssessment = (exercise) => {
  selectedVoiceExercise.value = exercise.id
  showVoice.value = true
}
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
        <span>课堂小结与练习</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-stone-800 font-serif">
        第一课：日月与阴阳
        <span class="block text-lg font-normal text-stone-500 mt-2 font-sans">Summary & Practice</span>
      </h2>
    </div>

    <!-- Personalized Completion Message -->
    <div v-if="authStore.isAuthenticated" class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Award class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p class="text-lg text-stone-700">
            <span class="font-bold text-green-700">{{ authStore.user?.username }}</span>，恭喜你完成第一课！
          </p>
          <p class="text-sm text-stone-500">你已经掌握了60道练习题，可以继续挑战游戏和语音评测。</p>
        </div>
      </div>
    </div>

    <!-- Exercise Bank Card -->
    <div class="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg group cursor-pointer" @click="showExercises = true">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
          <BookOpen class="w-10 h-10" />
        </div>
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
            练习题 Bank
          </div>
          <h3 class="text-xl md:text-2xl font-bold mb-2">第一课 60题</h3>
          <p class="text-blue-200 text-sm max-w-lg">
            词汇理解 · 阴阳属性 · 临床应用
            <br>
            <span class="opacity-70 text-xs">包含全部60道练习题，自动记录错题</span>
          </p>
        </div>
        <button class="bg-white text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
          开始练习
        </button>
      </div>
    </div>

    <!-- Voice Assessment Cards -->
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-stone-800 flex items-center gap-2">
        <Mic class="w-5 h-5 text-indigo-600" />
        AI 语音评测练习
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="exercise in voiceExercises" 
          :key="exercise.id"
          @click="openVoiceAssessment(exercise)"
          class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Volume2 class="w-6 h-6 text-indigo-600" />
            </div>
            <div class="flex-1">
              <p class="font-bold text-indigo-900 mb-1 text-lg">"{{ exercise.text }}"</p>
              <p class="text-sm text-indigo-600">{{ exercise.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Card -->
    <div class="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg group cursor-pointer" @click="showGame = true">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
           <span class="text-4xl">⚖️</span>
        </div>
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            挑战游戏
          </div>
          <h3 class="text-xl md:text-2xl font-bold mb-2">阴阳调和师</h3>
          <p class="text-stone-300 text-sm max-w-lg">
            分类诊断室 · 平衡药房
            <br>
            <span class="opacity-70 text-xs">通过游戏巩固阴阳知识</span>
          </p>
        </div>
        <button class="bg-white text-stone-900 px-6 py-3 rounded-full font-bold hover:bg-stone-100 transition-colors shadow-lg">
          开始挑战
        </button>
      </div>
    </div>

    <!-- Modals -->
    <LessonOneBalanceGame :isOpen="showGame" @close="showGame = false" />

    <!-- Exercise Modal -->
    <div v-if="showExercises" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-stone-100 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="bg-white p-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-lg font-bold text-stone-800">第一课 练习题 (共60题)</h3>
          <button @click="showExercises = false" class="text-stone-400 hover:text-stone-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6">
          <ExerciseBank :lesson-id="1" @show-login="$emit('show-login')" />
        </div>
      </div>
    </div>

    <!-- Voice Assessment Modal -->
    <div v-if="showVoice" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-stone-100 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="bg-white p-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-lg font-bold text-stone-800">AI 语音评测</h3>
          <button @click="showVoice = false" class="text-stone-400 hover:text-stone-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6">
          <VoiceAssessment 
            :exercise-id="selectedVoiceExercise"
            @show-login="$emit('show-login')"
          />
        </div>
      </div>
    </div>

    <!-- Knowledge Framework -->
    <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <div class="bg-stone-50 p-4 border-b border-stone-200">
        <h3 class="font-bold text-stone-800">知识框架</h3>
      </div>
      
      <div class="p-6 space-y-4">
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">1</div>
          <div>
            <h4 class="font-bold text-stone-800 mb-1">阴阳的哲学分类</h4>
            <p class="text-sm text-stone-600">
              <span class="text-red-600">阳</span>: 太阳、白昼、天、火、温暖、向上<br>
              <span class="text-blue-600">阴</span>: 月亮、黑夜、地、水、寒冷、向下
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">2</div>
          <div>
            <h4 class="font-bold text-stone-800 mb-1">人体与症状</h4>
            <p class="text-sm text-stone-600">
              <span class="text-red-600">阳症</span>: 发热、口渴喜冷、兴奋、面色鲜明<br>
              <span class="text-blue-600">阴症</span>: 畏寒、口不渴、抑制、面色晦暗
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">3</div>
          <div>
            <h4 class="font-bold text-stone-800 mb-1">核心原则</h4>
            <p class="text-sm text-stone-600">
              阴阳平衡 = 健康<br>
              阴阳互根 = 互为基础、互相促进
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">4</div>
          <div>
            <h4 class="font-bold text-stone-800 mb-1">核心句式</h4>
            <p class="text-sm text-stone-600">
              X 属 Y (X belongs to Y)<br>
              X 喜 Y (X prefers Y)<br>
              X 畏 Y (X fears Y)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Extension Task -->
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
      <div class="flex flex-col md:flex-row gap-6 items-center">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-yellow-500 shadow-sm shrink-0">
          <MessageSquare class="w-8 h-8" />
        </div>
        <div class="flex-1 text-center md:text-left">
          <h3 class="font-bold text-stone-800 text-lg mb-2">拓展小任务</h3>
          <p class="text-stone-700 text-sm leading-relaxed mb-4">
            观察生活，找出5种属阳的事物，5种属阴的事物，在评论区分享。
          </p>
          <button class="bg-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-yellow-600 transition-colors">
            去分享
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>