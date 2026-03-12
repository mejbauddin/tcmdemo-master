<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { Sun, Moon, CheckCircle, AlertCircle, PartyPopper } from 'lucide-vue-next'

const emit = defineEmits(['complete'])
const authStore = useAuthStore()
const exerciseStore = useExerciseStore()

// Game state
const isCompleted = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const exercises = ref([])
const currentExerciseIndex = ref(0)

// Draggable items
const initialItems = [
  { id: 1, text: '发热 (Fever)', type: 'yang', hint: '热是温暖的，属于阳 (Heat is warm, belongs to Yang)' },
  { id: 2, text: '畏寒 (Chills)', type: 'yin', hint: '畏寒是怕冷，属于阴 (Fear of cold belongs to Yin)' },
  { id: 3, text: '头 (Head)', type: 'yang', hint: '头在上方，属于阳 (Head is upper, belongs to Yang)' },
  { id: 4, text: '脚 (Feet)', type: 'yin', hint: '脚在下方，属于阴 (Feet are lower, belong to Yin)' },
  { id: 5, text: '背部 (Back)', type: 'yang', hint: '背部接受阳光，属于阳 (Back receives sun, belongs to Yang)' },
  { id: 6, text: '腹部 (Belly)', type: 'yin', hint: '腹部阴暗，属于阴 (Abdomen is shadowy, belongs to Yin)' },
]

const items = ref([...initialItems])
const yangZoneItems = ref([])
const yinZoneItems = ref([])

// Load exercises from backend
onMounted(async () => {
  if (authStore.isAuthenticated) {
    const allExercises = await exerciseStore.fetchExercisesByLesson(1)
    exercises.value = allExercises.filter(e => e.exercise_type === 'classification')
  }
})

// Drag and Drop Handlers
const onDragStart = (event, item) => {
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('itemId', item.id)
}

const onDrop = async (event, targetZone) => {
  const itemId = parseInt(event.dataTransfer.getData('itemId'))
  const item = items.value.find(i => i.id === itemId)

  if (!item) return

  if (item.type === targetZone) {
    // Correct Drop
    if (targetZone === 'yang') {
      yangZoneItems.value.push(item)
    } else {
      yinZoneItems.value.push(item)
    }
    // Remove from source list
    items.value = items.value.filter(i => i.id !== itemId)
    
    // Check for win condition
    if (items.value.length === 0) {
      isCompleted.value = true
      emit('complete')
    }

    // If authenticated, submit to backend
    if (authStore.isAuthenticated && exercises.value[currentExerciseIndex.value]) {
      try {
        await exerciseStore.submitAnswer(
          exercises.value[currentExerciseIndex.value].id,
          targetZone
        )
        // Move to next exercise if available
        if (currentExerciseIndex.value < exercises.value.length - 1) {
          currentExerciseIndex.value++
        }
      } catch (error) {
        console.error('Failed to submit answer:', error)
      }
    }
  } else {
    // Incorrect Drop
    triggerToast(`再想想，${item.hint}`)
    
    // Track wrong answer if authenticated
    if (authStore.isAuthenticated && exercises.value[currentExerciseIndex.value]) {
      try {
        await exerciseStore.submitAnswer(
          exercises.value[currentExerciseIndex.value].id,
          item.type // Wrong answer
        )
      } catch (error) {
        console.error('Failed to submit wrong answer:', error)
      }
    }
  }
}

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const resetGame = () => {
  items.value = [...initialItems]
  yangZoneItems.value = []
  yinZoneItems.value = []
  isCompleted.value = false
  showToast.value = false
  currentExerciseIndex.value = 0
}

// Sentence Patterns Data for reference
const patterns = [
  { label: '归属句式 (Belonging)', text: 'X 属 Y (X belongs to Y)', example: '背部属阳 (The back belongs to Yang)' },
  { label: '偏好句式 (Preference)', text: 'X 喜 Y (X prefers Y)', example: '阳症喜冷 (Yang symptoms prefer cold)' },
  { label: '避讳句式 (Aversion)', text: 'X 畏 Y (X fears Y)', example: '阴症畏寒 (Yin symptoms fear cold)' }
]
</script>

<template>
  <section class="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-stone-100 relative overflow-hidden min-h-[600px] flex flex-col animate-fade-in-up">
    
    <!-- Header -->
    <div class="mb-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
        <span>Part 5: Language Practice</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-stone-800 font-serif">
        语言实操：分类诊断室
        <span class="block text-lg font-normal text-stone-500 mt-2 font-sans">Practice: Classification Clinic</span>
      </h2>
    </div>

    <!-- Sentence Patterns Reference -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div v-for="(pat, idx) in patterns" :key="idx" class="bg-stone-50 p-4 rounded-xl border border-stone-100 text-center">
        <h4 class="font-bold text-stone-700 mb-1 text-sm">{{ pat.label }}</h4>
        <p class="font-medium text-stone-900 mb-1">{{ pat.text }}</p>
        <p class="text-xs text-stone-500 italic">{{ pat.example }}</p>
      </div>
    </div>

    <!-- Login Prompt if not authenticated -->
    <div v-if="!authStore.isAuthenticated" class="bg-yellow-50 p-6 rounded-xl text-center mb-6">
      <p class="text-yellow-800 mb-3">Please login to track your progress and save wrong answers</p>
      <button 
        @click="$emit('show-login')"
        class="bg-stone-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition"
      >
        Login to Continue
      </button>
    </div>

    <!-- Game Area -->
    <div class="flex-1 flex flex-col gap-8 relative">
      
      <!-- Drop Zones -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-64 md:h-80">
        
        <!-- Yang Zone -->
        <div 
          class="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 relative flex flex-col items-center p-4 transition-all duration-300"
          @dragover.prevent
          @drop="onDrop($event, 'yang')"
        >
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <Sun class="w-32 h-32 text-red-500" />
          </div>
          <h3 class="text-xl font-bold text-red-800 mb-4 z-10 flex items-center gap-2">
            <Sun class="w-5 h-5" /> 阳区域 (Yang Zone)
          </h3>
          <div class="w-full flex-1 overflow-y-auto grid grid-cols-2 gap-2 content-start z-10">
            <transition-group name="list">
              <div 
                v-for="item in yangZoneItems" 
                :key="item.id"
                class="bg-white border-l-4 border-red-500 p-3 rounded-lg shadow-sm text-sm font-medium flex items-center gap-2 animate-pop-in"
              >
                <CheckCircle class="w-4 h-4 text-green-500 shrink-0" />
                {{ item.text }}
              </div>
            </transition-group>
          </div>
        </div>

        <!-- Yin Zone -->
        <div 
          class="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 relative flex flex-col items-center p-4 transition-all duration-300"
          @dragover.prevent
          @drop="onDrop($event, 'yin')"
        >
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <Moon class="w-32 h-32 text-blue-500" />
          </div>
          <h3 class="text-xl font-bold text-blue-800 mb-4 z-10 flex items-center gap-2">
            <Moon class="w-5 h-5" /> 阴区域 (Yin Zone)
          </h3>
          <div class="w-full flex-1 overflow-y-auto grid grid-cols-2 gap-2 content-start z-10">
             <transition-group name="list">
              <div 
                v-for="item in yinZoneItems" 
                :key="item.id"
                class="bg-white border-l-4 border-blue-500 p-3 rounded-lg shadow-sm text-sm font-medium flex items-center gap-2 animate-pop-in"
              >
                <CheckCircle class="w-4 h-4 text-green-500 shrink-0" />
                {{ item.text }}
              </div>
            </transition-group>
          </div>
        </div>
      </div>

      <!-- Draggable Items Source -->
      <div class="bg-stone-50 rounded-xl p-6 border border-stone-200">
        <h4 class="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4 text-center">
          待分类卡片 (Cards to Sort)
        </h4>
        
        <transition-group 
          tag="div" 
          name="list" 
          class="flex flex-wrap justify-center gap-3 min-h-[60px]"
        >
          <div 
            v-for="item in items" 
            :key="item.id"
            draggable="true"
            @dragstart="onDragStart($event, item)"
            class="bg-white hover:bg-stone-100 border border-stone-300 hover:border-stone-400 text-stone-800 px-4 py-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:shadow-md select-none font-medium"
          >
            {{ item.text }}
          </div>
        </transition-group>

        <div v-if="items.length === 0 && !isCompleted" class="text-center text-stone-400 text-sm py-2">
          所有卡片已分类完毕！
        </div>
      </div>

      <!-- Toast Notification -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div 
          v-if="showToast" 
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-stone-800/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 z-50 pointer-events-none"
        >
          <AlertCircle class="w-5 h-5 text-yellow-400" />
          <span>{{ toastMessage }}</span>
        </div>
      </transition>

      <!-- Success Overlay -->
      <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div v-if="isCompleted" class="absolute inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-center p-8 rounded-3xl">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
            <PartyPopper class="w-12 h-12" />
          </div>
          <h2 class="text-3xl font-bold text-stone-800 mb-2 font-serif">恭喜！</h2>
          <p class="text-xl text-stone-600 mb-8">你已掌握基础阴阳分类！<br><span class="text-sm text-stone-400">(Congratulations! You've mastered basic Yin-Yang classification!)</span></p>
          
          <button 
            @click="resetGame"
            class="bg-stone-900 text-white px-8 py-3 rounded-xl hover:bg-stone-800 transition-colors font-medium shadow-lg hover:shadow-xl active:scale-95"
          >
            再玩一次 (Play Again)
          </button>
        </div>
      </transition>

    </div>
  </section>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>