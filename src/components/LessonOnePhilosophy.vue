<script setup>
import { ref, onMounted } from 'vue'
import { Play, Pause, RefreshCw, Volume2 } from 'lucide-vue-next'

const emit = defineEmits(['complete'])

// State for audio simulation
const isPlaying = ref(false)
const activeRowIndex = ref(-1)
const intervalId = ref(null)

const yinYangData = [
  { yang: '太阳 (Sun)', yin: '月亮 (Moon)' },
  { yang: '山的南面 (South of Mountain)', yin: '山的北面 (North of Mountain)' },
  { yang: '白昼 (Day)', yin: '黑夜 (Night)' },
  { yang: '男人 (Man)', yin: '女人 (Woman)' },
  { yang: '天 (Heaven)', yin: '地 (Earth)' },
  { yang: '火: 温暖向上 (Fire: Warm/Up)', yin: '水: 寒冷向下 (Water: Cold/Down)' },
]

const togglePlay = () => {
  if (isPlaying.value) {
    stopPlay()
  } else {
    startPlay()
  }
}

const startPlay = () => {
  isPlaying.value = true
  if (activeRowIndex.value >= yinYangData.length - 1) {
    activeRowIndex.value = -1
  }
  advanceRow()
  intervalId.value = setInterval(() => {
    advanceRow()
  }, 2000)
}

const advanceRow = () => {
  if (activeRowIndex.value < yinYangData.length - 1) {
    activeRowIndex.value++
  } else {
    stopPlay()
    // Mark as complete when audio finishes
    emit('complete')
    setTimeout(() => {
        activeRowIndex.value = -1
    }, 2000)
  }
}

const stopPlay = () => {
  isPlaying.value = false
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

const reset = () => {
    stopPlay()
    activeRowIndex.value = -1
}

// Mark complete on mount for now (can be changed to require interaction)
onMounted(() => {
  // emit('complete') 
})
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
        <span>Part 2: Philosophy</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-stone-800 font-serif">
        讲解一：阴阳的本源
        <span class="block text-lg font-normal text-stone-500 mt-2 font-sans">The Origin of Yin-Yang in Philosophy</span>
      </h2>
    </div>

    <!-- Core Terms Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Yang Card -->
      <div class="bg-red-50 border border-red-100 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="text-4xl font-serif font-bold text-red-800 group-hover:text-red-600">阳</span>
            <span class="text-sm font-mono text-red-400 bg-white px-2 py-0.5 rounded border border-red-100">yáng</span>
            <Volume2 class="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600" />
          </div>
          <div class="text-sm text-red-600 font-medium">
            masculine / positive principle
          </div>
          <div class="mt-4 text-xs text-red-400 bg-white/50 p-2 rounded-lg">
            明亮 (Bright), 温暖 (Warm), 向上 (Upward)
          </div>
        </div>
      </div>

      <!-- Yin Card -->
      <div class="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="text-4xl font-serif font-bold text-blue-800 group-hover:text-blue-600">阴</span>
            <span class="text-sm font-mono text-blue-400 bg-white px-2 py-0.5 rounded border border-blue-100">yīn</span>
            <Volume2 class="w-4 h-4 text-blue-400 cursor-pointer hover:text-blue-600" />
          </div>
          <div class="text-sm text-blue-600 font-medium">
            feminine / negative principle
          </div>
          <div class="mt-4 text-xs text-blue-400 bg-white/50 p-2 rounded-lg">
            昏暗 (Dark), 寒冷 (Cold), 向下 (Downward)
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Table -->
    <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <div class="p-4 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
        <h3 class="font-bold text-stone-700">经典分类 (Classic Classification)</h3>
        <div class="flex gap-2">
          <button 
              @click="reset" 
              class="p-1.5 bg-white rounded-full border border-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
              title="Reset"
          >
              <RefreshCw class="w-3.5 h-3.5" />
          </button>
          <button 
              @click="togglePlay" 
              class="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition-all text-xs font-bold"
          >
              <component :is="isPlaying ? Pause : Play" class="w-3.5 h-3.5 fill-current" />
              <span>{{ isPlaying ? 'PAUSE' : 'PLAY' }}</span>
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-100">
            <tr>
              <th scope="col" class="px-6 py-3 w-1/2 text-center text-red-600 bg-red-50/30">阳 (Yang)</th>
              <th scope="col" class="px-6 py-3 w-1/2 text-center text-blue-600 bg-blue-50/30">阴 (Yin)</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(row, index) in yinYangData" 
              :key="index"
              class="border-b border-stone-50 last:border-none transition-colors duration-300"
              :class="activeRowIndex === index ? 'bg-yellow-50' : 'hover:bg-stone-50'"
            >
              <td class="px-6 py-4 text-center font-medium text-stone-700 border-r border-stone-100">
                {{ row.yang }}
              </td>
              <td class="px-6 py-4 text-center font-medium text-stone-700">
                {{ row.yin }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Summary Box -->
    <div class="bg-amber-50 rounded-xl p-6 border border-amber-100 flex gap-4 items-start">
      <div class="w-1.5 h-full min-h-[3rem] bg-amber-400 rounded-full shrink-0"></div>
      <div>
          <h3 class="font-bold text-amber-900 mb-2 text-sm uppercase tracking-wide">小总结 (Summary)</h3>
          <p class="text-stone-700 leading-relaxed font-medium">
              凡是具有<span class="text-red-600 bg-red-100 px-1 rounded mx-0.5">明亮、温暖、向上</span>特点的事物多属阳；<span class="text-blue-600 bg-blue-100 px-1 rounded mx-0.5">昏暗、寒冷、向下</span>特点的事物多属阴。
          </p>
      </div>
    </div>

  </div>
</template>
