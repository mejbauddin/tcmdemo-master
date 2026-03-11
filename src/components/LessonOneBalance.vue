<script setup>
import { onMounted } from 'vue'
import { Scale, RefreshCw } from 'lucide-vue-next'

const emit = defineEmits(['complete'])

onMounted(() => {
  // emit('complete')
})
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
        <span>Part 4: Balance & Mutual Root</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-stone-800 font-serif">
        讲解三：阴阳的核心原则
        <span class="block text-lg font-normal text-stone-500 mt-2 font-sans">Core Principles: Balance & Mutual Root</span>
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Balance Section -->
      <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col">
        <h3 class="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <Scale class="w-5 h-5 text-indigo-600" />
          阴阳平衡 (Yin-Yang Balance)
        </h3>
        
        <div class="flex-1 flex flex-col items-center justify-center py-8">
          <!-- Balance Animation Placeholder -->
          <div class="relative w-48 h-32 flex items-center justify-center mb-6">
            <div class="w-40 h-1 bg-stone-300 rounded-full relative">
              <!-- Pivot -->
              <div class="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-stone-400"></div>
              <!-- Left Weight (Yang) -->
              <div class="absolute left-0 bottom-2 -translate-x-1/2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md animate-bounce-slight">阳</div>
              <!-- Right Weight (Yin) -->
              <div class="absolute right-0 bottom-2 translate-x-1/2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md animate-bounce-slight-delay">阴</div>
            </div>
          </div>

          <div class="text-center space-y-2">
            <p class="font-bold text-stone-800">阴阳平衡 = 健康</p>
            <p class="text-sm text-stone-500">Yin-Yang Balance = Health</p>
            <div class="w-full h-px bg-stone-100 my-2"></div>
            <p class="font-bold text-stone-800">阴阳失衡 = 疾病</p>
            <p class="text-sm text-stone-500">Yin-Yang Imbalance = Disease</p>
          </div>
        </div>
      </div>

      <!-- Mutual Root Section -->
      <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col">
        <h3 class="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <RefreshCw class="w-5 h-5 text-indigo-600" />
          阴阳互根 (Mutual Root)
        </h3>

        <div class="flex-1 flex flex-col items-center justify-center py-8">
          <!-- Tai Chi Symbol CSS -->
          <div class="taichi mb-6 animate-spin-slow"></div>

          <div class="text-center space-y-4">
            <p class="text-stone-700 text-sm leading-relaxed">
              阴与阳不能单独存在，互为基础、互相促进。
              <br>
              <span class="text-stone-400 text-xs">(Yin and Yang cannot exist alone; they are the basis for each other and promote each other.)</span>
            </p>
            
            <div class="bg-stone-50 p-3 rounded-lg text-left">
              <p class="text-sm font-bold text-stone-800 mb-1">专业延伸 (Professional Note):</p>
              <p class="text-xs text-stone-600">
                <span class="text-red-600">气为阳</span>，<span class="text-blue-600">血为阴</span>。<br>
                气促血生，血养气 (Qi promotes blood production; Blood nourishes Qi).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rhyme Summary -->
    <div class="bg-gradient-to-r from-stone-800 to-stone-900 rounded-xl p-8 text-center text-white shadow-lg">
      <h3 class="text-lg font-bold mb-4 text-stone-200 uppercase tracking-widest text-xs">口诀 (Chant)</h3>
      <div class="space-y-2 font-serif text-xl md:text-2xl">
        <p>阴阳相对，互根互促</p>
        <p>平衡则健，失衡则病</p>
      </div>
      <div class="mt-6 text-sm text-stone-400 font-sans max-w-lg mx-auto">
        Yin and Yang are opposite yet rooted in each other.<br>
        Balance brings health; imbalance brings disease.
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-bounce-slight {
  animation: bounceSlight 2s infinite ease-in-out;
}
.animate-bounce-slight-delay {
  animation: bounceSlight 2s infinite ease-in-out 1s;
}

@keyframes bounceSlight {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -5px); }
}

.taichi {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(to bottom, #000 50%, #fff 50%);
  border: 1px solid #e7e5e4;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.taichi::before {
  content: '';
  position: absolute;
  top: 25%;
  left: 0;
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  border: 18px solid #000;
  box-sizing: border-box;
}

.taichi::after {
  content: '';
  position: absolute;
  bottom: 25%;
  left: 0;
  width: 50px;
  height: 50px;
  background: #000;
  border-radius: 50%;
  border: 18px solid #fff;
  box-sizing: border-box;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
