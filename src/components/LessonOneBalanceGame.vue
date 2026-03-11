<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

// Game State
const currentLevel = ref(0)
const score = ref(0)
const combo = ref(0)
const maxCombo = ref(0)
const showResult = ref(false)
const gameStatus = ref('playing') // playing, success, failure
const feedbackMessage = ref('')
const feedbackType = ref('') // success, error

// Scale Physics State
const scaleAngle = ref(0) // -degrees (left down) to +degrees (right down)

// Game Data / Levels
const items = [
  { id: 'fever', name: '发热 (Fever)', type: 'yang', value: 3, icon: '🔥' },
  { id: 'chills', name: '畏寒 (Chills)', type: 'yin', value: -3, icon: '❄️' },
  { id: 'like_cold', name: '喜冷饮 (Like Cold)', type: 'yang', value: 2, icon: '🧊' },
  { id: 'like_hot', name: '喜热饮 (Like Hot)', type: 'yin', value: -2, icon: '☕' },
  { id: 'excited', name: '兴奋 (Excited)', type: 'yang', value: 2, icon: '😊' },
  { id: 'inhibited', name: '抑制 (Inhibited)', type: 'yin', value: -2, icon: '😴' },
  { id: 'bright_face', name: '面色鲜明 (Bright)', type: 'yang', value: 1, icon: '🌞' },
  { id: 'dark_face', name: '面色晦暗 (Dark)', type: 'yin', value: -1, icon: '🌚' },
  { id: 'yellow_urine', name: '小便黄 (Yellow)', type: 'yang', value: 1, icon: '💛' },
  { id: 'clear_urine', name: '小便清 (Clear)', type: 'yin', value: -1, icon: '💧' },
  { id: 'dry_stool', name: '大便干 (Dry)', type: 'yang', value: 1, icon: '⚫' },
  { id: 'loose_stool', name: '大便稀 (Loose)', type: 'yin', value: -1, icon: '💩' },
]

const levels = [
  {
    title: 'Level 1: 初试阴阳',
    description: '病人畏寒，属阴证。请用阳药/阳法平衡之。',
    initialLeft: ['chills'], // Yin (-3)
    initialRight: [],
    // Add more distractors
    availableItems: ['fever', 'like_cold', 'excited', 'bright_face', 'dry_stool', 'yellow_urine', 'like_hot'],
    targetSum: 0 // Net sum of all items on scale should be 0
  },
  {
    title: 'Level 2: 虚实辨证',
    description: '面色晦暗且大便稀溏。',
    initialLeft: ['dark_face', 'loose_stool'], // Yin (-1) + Yin (-1) = -2
    initialRight: [],
    // Add more distractors
    availableItems: ['like_hot', 'excited', 'dry_stool', 'yellow_urine', 'like_cold', 'fever', 'bright_face', 'inhibited'],
    targetSum: 0
  },
  {
    title: 'Level 3: 复杂平衡',
    description: '由于某种原因，体内既有热又有寒，但总体偏热。',
    initialLeft: ['chills'], // -3
    initialRight: ['fever', 'excited'], // +3 +2 = +5. Net = +2 (Yang excess)
    // Goal: Add Yin to balance. Need -2.
    // Add more distractors
    availableItems: ['like_hot', 'inhibited', 'clear_urine', 'bright_face', 'loose_stool', 'dark_face', 'chills'],
    targetSum: 0
  }
]

// Current Level State
const leftTray = ref([])
const rightTray = ref([])
const handItems = ref([])

// Initialize Level
const startLevel = (levelIndex) => {
  currentLevel.value = levelIndex
  const level = levels[levelIndex]
  
  // Reset Trays
  leftTray.value = level.initialLeft.map(id => items.find(i => i.id === id))
  rightTray.value = level.initialRight.map(id => items.find(i => i.id === id))
  
  // Set Hand
  handItems.value = level.availableItems.map(id => items.find(i => i.id === id))
  
  gameStatus.value = 'playing'
  feedbackMessage.value = ''
  updateScalePhysics()
}

// Physics Calculation
const updateScalePhysics = () => {
  const leftSum = leftTray.value.reduce((sum, item) => sum + Math.abs(item.value), 0)
  const rightSum = rightTray.value.reduce((sum, item) => sum + Math.abs(item.value), 0)
  
  // Calculate Net Value (Standard TCM: Yang is positive, Yin is negative)
  // But physically on a scale:
  // If we map Yin items to Left Tray and Yang items to Right Tray...
  // Left Mass = Sum of absolute values on Left
  // Right Mass = Sum of absolute values on Right
  // Angle is proportional to (RightMass - LeftMass)
  
  const diff = rightSum - leftSum
  // Limit angle
  scaleAngle.value = Math.max(-20, Math.min(20, diff * 5))
}

// Drag & Drop Handlers
const onDragStart = (event, item, source, index) => {
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('itemId', item.id)
  event.dataTransfer.setData('source', source)
  event.dataTransfer.setData('index', index)
}

const onDrop = (event, targetTrayName) => {
  const itemId = event.dataTransfer.getData('itemId')
  const source = event.dataTransfer.getData('source')
  const index = parseInt(event.dataTransfer.getData('index'))
  
  const item = items.find(i => i.id === itemId)
  
  if (!item) return

  // Logic Check: Can only put Yang items on Right, Yin items on Left?
  // Or allow mistakes?
  // The user prompt implies: "If put wrong, scale tilts more...".
  // So we allow putting any item on any tray, but it affects the mass.
  
  // Actually, physically:
  // If I put a -3 (Yin) item on the Right Tray... does it add weight?
  // Conceptually, Yin belongs to Left. If put on Right, it's weird.
  // Let's enforce: Yin items -> Left Tray, Yang items -> Right Tray.
  // OR allow free placement but calculate mass based on item value?
  // Let's simulate a "Magic Scale":
  // Left Tray measures Yin. Right Tray measures Yang.
  // If I put "Fever (+3)" on Left Tray?
  // It effectively reduces the "Yin" weight? Or adds "Yang" weight to the Left side (making it lighter/heavier)?
  // Let's simplify:
  // Weight = Abs(Value).
  // Placement is free.
  // But correct solution requires balancing weights.
  
  // Let's use Source Array and Target Array logic
  let sourceArray = null
  if (source === 'hand') sourceArray = handItems
  else if (source === 'left') sourceArray = leftTray
  else if (source === 'right') sourceArray = rightTray
  
  let targetArray = targetTrayName === 'left' ? leftTray : rightTray
  
  // Remove from source
  if (sourceArray) {
    if (source === 'hand') {
       // Find by ID in hand (since hand might have duplicates if we allowed, but here unique)
       const idx = sourceArray.value.findIndex(i => i.id === itemId)
       if (idx > -1) sourceArray.value.splice(idx, 1)
    } else {
       sourceArray.value.splice(index, 1)
    }
  }
  
  // Add to target
  targetArray.value.push(item)
  
  // Check Result
  checkBalance()
}

const checkBalance = () => {
  updateScalePhysics()
  
  // Check Logic
  // Total Yin Value (Sum of all Yin items everywhere on scale) vs Total Yang Value?
  // No, the scale balances "Mass".
  // Mass on Left vs Mass on Right.
  // If I put "Fever (+3)" on Left, it adds 3 mass to Left.
  // If Left has "Chills (-3)" (mass 3) and "Fever (+3)" (mass 3) -> Total 6.
  // Right has 0.
  // Scale tilts Left massively.
  // This seems wrong for "Balancing Yin Yang".
  // "Balancing Yin Yang" usually means Neutralizing.
  // If body has Chills (-3), we add Fever (+3) -> Net 0.
  // So visually, we probably want to "Add weights to the lighter side".
  // If Left is heavy (Yin excess), we add weights to Right (Yang).
  // So:
  // Left Tray Mass = Sum(Abs(Items on Left))
  // Right Tray Mass = Sum(Abs(Items on Right))
  // We want Left Mass == Right Mass.
  
  const leftMass = leftTray.value.reduce((sum, i) => sum + Math.abs(i.value), 0)
  const rightMass = rightTray.value.reduce((sum, i) => sum + Math.abs(i.value), 0)
  
  if (leftMass === rightMass) {
    // Success!
    gameStatus.value = 'success'
    feedbackMessage.value = '阴阳平衡！(Balance Restored!)'
    feedbackType.value = 'success'
    combo.value++
    if (combo.value > maxCombo.value) maxCombo.value = combo.value
    score.value += 10 + (combo.value * 2)
    
    // Play sound effect (simulated via visual)
    setTimeout(() => {
      if (currentLevel.value < levels.length - 1) {
        startLevel(currentLevel.value + 1)
      } else {
        showResult.value = true
        saveScore()
      }
    }, 1500)
  } else {
    // Check if user made it worse?
    // Not implemented for simplicity, just update physics
    gameStatus.value = 'playing'
  }
}

// Titles
const getTitle = computed(() => {
  if (score.value >= 86) return '阴阳大师 (Grandmaster)'
  if (score.value >= 71) return '熟练调和师 (Skilled Healer)'
  return '见习调和师 (Apprentice)'
})

const saveScore = () => {
  const highScore = localStorage.getItem('tcm_game_score') || 0
  if (score.value > highScore) {
    localStorage.setItem('tcm_game_score', score.value)
  }
}

onMounted(() => {
  startLevel(0)
})

watch(() => props.isOpen, (val) => {
  if (val) startLevel(0)
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
    <div class="bg-stone-100 w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-stone-200 transition-colors"
      >
        <span class="text-xl font-bold text-stone-600">×</span>
      </button>

      <!-- Game Header -->
      <div class="bg-white px-6 py-4 border-b border-stone-200 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-stone-800 font-serif">阴阳平衡拼图 (Balance Puzzle)</h2>
          <p class="text-sm text-stone-500">{{ levels[currentLevel].description }}</p>
        </div>
        <div class="flex gap-4 text-sm font-bold text-stone-700">
          <div class="flex flex-col items-center">
            <span class="text-xs text-stone-400">SCORE</span>
            <span>{{ score }}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-xs text-stone-400">LEVEL</span>
            <span>{{ currentLevel + 1 }}/{{ levels.length }}</span>
          </div>
        </div>
      </div>

      <!-- Game Area -->
      <div class="flex-1 relative bg-[url('https://images.unsplash.com/photo-1524128527306-02d216960d7b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center overflow-hidden">
        <div class="absolute inset-0 bg-stone-50/90 backdrop-blur-[2px]"></div>
        
        <!-- Feedback Overlay -->
        <div v-if="feedbackMessage" class="absolute top-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce-in">
           <div class="px-6 py-3 rounded-full shadow-lg font-bold text-white flex items-center gap-2"
             :class="feedbackType === 'success' ? 'bg-green-500' : 'bg-red-500'">
             <span>{{ feedbackType === 'success' ? '✨' : '⚠️' }}</span>
             {{ feedbackMessage }}
           </div>
        </div>

        <!-- Scale Container (Centered Vertically) -->
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- The Scale (SVG-based for better visuals) -->
          <div class="relative w-[600px] h-[400px]">
            <!-- Main Beam & Stand -->
            <!-- Using SVG for clean lines -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              <!-- Base Stand -->
              <path d="M300 380 L300 100" stroke="#57534e" stroke-width="8" stroke-linecap="round" />
              <path d="M260 380 L340 380" stroke="#57534e" stroke-width="8" stroke-linecap="round" />
              <!-- Pivot Circle -->
              <circle cx="300" cy="100" r="8" fill="#f59e0b" stroke="#fff" stroke-width="2" />
            </svg>

            <!-- Rotating Beam Container -->
            <div 
              class="absolute top-[100px] left-1/2 w-full h-0 -translate-x-1/2 transition-transform duration-700 ease-out-elastic"
              :style="{ transform: `rotate(${scaleAngle}deg)` }"
            >
               <!-- The Beam Itself (Visual) -->
               <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-2 bg-stone-700 rounded-full -mt-1"></div>
               
               <!-- Left Chain & Tray (Yin) -->
               <div class="absolute left-[50px] top-0 flex flex-col items-center origin-top transition-transform duration-700"
                    :style="{ transform: `rotate(${-scaleAngle}deg)` }">
                  <!-- Chain -->
                  <div class="w-0.5 h-24 bg-stone-400"></div>
                  <!-- Tray -->
                  <div 
                    class="w-40 h-32 border-b-4 border-stone-400 rounded-b-3xl bg-blue-50/80 shadow-lg backdrop-blur-sm flex flex-wrap content-end justify-center p-2 gap-1 relative"
                    @dragover.prevent
                    @drop="onDrop($event, 'left')"
                  >
                    <div class="absolute -top-6 text-blue-800 font-bold bg-blue-100 px-3 py-0.5 rounded-full text-xs shadow-sm border border-blue-200">Yin (阴)</div>
                    <!-- Items on Left Tray -->
                    <div 
                      v-for="(item, idx) in leftTray" 
                      :key="idx"
                      class="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl cursor-grab active:cursor-grabbing border border-stone-200 hover:scale-110 transition-transform"
                      draggable="true"
                      @dragstart="onDragStart($event, item, 'left', idx)"
                      :title="item.name"
                    >
                      {{ item.icon }}
                    </div>
                  </div>
               </div>

               <!-- Right Chain & Tray (Yang) -->
               <div class="absolute right-[50px] top-0 flex flex-col items-center origin-top transition-transform duration-700"
                    :style="{ transform: `rotate(${-scaleAngle}deg)` }">
                  <!-- Chain -->
                  <div class="w-0.5 h-24 bg-stone-400"></div>
                  <!-- Tray -->
                  <div 
                    class="w-40 h-32 border-b-4 border-stone-400 rounded-b-3xl bg-red-50/80 shadow-lg backdrop-blur-sm flex flex-wrap content-end justify-center p-2 gap-1 relative"
                    @dragover.prevent
                    @drop="onDrop($event, 'right')"
                  >
                    <div class="absolute -top-6 text-red-800 font-bold bg-red-100 px-3 py-0.5 rounded-full text-xs shadow-sm border border-red-200">Yang (阳)</div>
                    <!-- Items on Right Tray -->
                    <div 
                      v-for="(item, idx) in rightTray" 
                      :key="idx"
                      class="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl cursor-grab active:cursor-grabbing border border-stone-200 hover:scale-110 transition-transform"
                      draggable="true"
                      @dragstart="onDragStart($event, item, 'right', idx)"
                      :title="item.name"
                    >
                      {{ item.icon }}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hand / Inventory -->
      <div class="h-48 bg-white border-t border-stone-200 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
        <h3 class="text-sm font-bold text-stone-500 mb-4 uppercase tracking-wide flex items-center gap-2">
          <span>Available Items / 可用砝码</span>
          <span class="text-xs font-normal bg-stone-100 px-2 py-0.5 rounded text-stone-400">Drag to scale</span>
        </h3>
        <div class="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
          <div 
            v-for="(item, idx) in handItems" 
            :key="idx"
            class="flex flex-col items-center gap-2 min-w-[80px] cursor-grab active:cursor-grabbing group hover:-translate-y-1 transition-transform"
            draggable="true"
            @dragstart="onDragStart($event, item, 'hand', idx)"
          >
            <div class="w-14 h-14 rounded-2xl bg-stone-50 border-2 border-stone-100 group-hover:border-stone-400 group-hover:bg-white flex items-center justify-center text-3xl shadow-sm transition-all relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" :class="item.type === 'yang' ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-500'"></div>
              {{ item.icon }}
            </div>
            <span class="text-xs font-medium text-stone-600 text-center leading-tight max-w-[80px]">{{ item.name }}</span>
            <!-- Hidden Value for student challenge -->
            <!-- <span class="text-[10px] font-bold" :class="item.type === 'yang' ? 'text-red-500' : 'text-blue-500'">
              {{ item.value > 0 ? '+' : ''}}{{ item.value }}
            </span> -->
          </div>
        </div>
      </div>

      <!-- Result Modal -->
      <div v-if="showResult" class="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <div class="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
          🏆
        </div>
        <h2 class="text-3xl font-bold text-stone-800 mb-2">恭喜通关! (Congratulations!)</h2>
        <p class="text-stone-500 mb-8">You have restored balance to all patients.</p>
        
        <div class="bg-stone-50 rounded-2xl p-8 w-full max-w-md border border-stone-100 mb-8">
          <div class="flex justify-between items-center mb-4">
            <span class="text-stone-500">Final Score</span>
            <span class="text-2xl font-bold text-stone-800">{{ score }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-stone-500">Title Earned</span>
            <span class="text-xl font-bold text-amber-600">{{ getTitle }}</span>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          class="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition-colors shadow-lg active:scale-95"
        >
          返回课程 (Return to Lesson)
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ease-out-elastic {
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
