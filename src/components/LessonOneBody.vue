<script setup>
import { ref, onMounted } from 'vue'
import { Info, Volume2 } from 'lucide-vue-next'

const emit = defineEmits(['complete'])

// Body parts data with interactive hotspots - EXACT from design doc
const bodyParts = [
  { 
    id: 'head', 
    label: '头 (Head)', 
    cx: 200, 
    cy: 80, 
    type: 'yang',
    content: '头在上，属阳 (The head is upper, belongs to Yang)',
    pinyin: 'tóu zài shàng, shǔ yáng'
  },
  { 
    id: 'back', 
    label: '背 (Back)', 
    cx: 260, 
    cy: 220, 
    type: 'yang',
    content: '背为阳，腹为阴 (The back is Yang, the abdomen is Yin)',
    pinyin: 'bèi wéi yáng, fù wéi yīn'
  },
  { 
    id: 'abdomen', 
    label: '腹 (Abdomen)', 
    cx: 140, 
    cy: 220, 
    type: 'yin',
    content: '腹为阴，背为阳 (The abdomen is Yin, the back is Yang)',
    pinyin: 'fù wéi yīn, bèi wéi yáng'
  },
  { 
    id: 'feet', 
    label: '脚 (Feet)', 
    cx: 200, 
    cy: 450, 
    type: 'yin',
    content: '脚在下，属阴 (The feet are lower, belong to Yin)',
    pinyin: 'jiǎo zài xià, shǔ yīn'
  },
  { 
    id: 'surface', 
    label: '体表 (Body Surface)', 
    cx: 200, 
    cy: 150, 
    type: 'yang',
    content: '体表属阳 (Body surface belongs to Yang)',
    pinyin: 'tǐ biǎo shǔ yáng'
  },
  { 
    id: 'interior', 
    label: '体内 (Body Interior)', 
    cx: 200, 
    cy: 300, 
    type: 'yin',
    content: '体内属阴 (Body interior belongs to Yin)',
    pinyin: 'tǐ nèi shǔ yīn'
  }
]

// Symptoms data - EXACT from design doc
const symptoms = [
  {
    type: 'yang',
    title: '阳症 (Yang Symptoms)',
    desc: '色泽鲜明 (Bright color), 发热 (Fever), 口渴喜冷 (Thirsty & prefers cold), 兴奋 (Excited), 烦躁 (Irritable), 面红 (Red face), 怕热 (Heat intolerance), 喜冷饮 (Prefers cold drinks), 小便黄 (Yellow urine), 大便干 (Dry stool)',
    example: '发热属阳 (Fever belongs to Yang)'
  },
  {
    type: 'yin',
    title: '阴症 (Yin Symptoms)',
    desc: '色泽晦暗 (Dull color), 畏寒 (Chills), 口不渴/喜热 (Not thirsty/prefers hot), 抑制 (Inhibited), 面色白 (Pale face), 怕冷 (Cold intolerance), 喜温 (Prefers warmth), 小便清长 (Clear urine), 大便稀溏 (Loose stool)',
    example: '畏寒属阴 (Chills belong to Yin)'
  }
]

// Current active selection
const activePartId = ref(null)
const activePart = ref(null)

const handlePartClick = (part) => {
  activePartId.value = part.id
  activePart.value = part
}

const sentencePatterns = [
  { text: '头在上，属阳。', pinyin: 'Tóu zài shàng, shǔ yáng.', trans: 'The head is above, belongs to Yang.' },
  { text: '脚在下，属阴。', pinyin: 'Jiǎo zài xià, shǔ yīn.', trans: 'The feet are below, belong to Yin.' },
  { text: '气为阳，血为阴。', pinyin: 'Qì wéi yáng, xuè wéi yīn.', trans: 'Qi is Yang, blood is Yin.' },
  { text: '背为阳，腹为阴。', pinyin: 'Bèi wéi yáng, fù wéi yīn.', trans: 'The back is Yang, the abdomen is Yin.' }
]

onMounted(() => {
  // emit('complete')
})
</script>

<template>
  <section class="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-stone-100 relative overflow-hidden animate-fade-in-up">
    <!-- Decorative background -->
    <div class="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-blue-500 via-stone-200 to-red-500"></div>

    <div class="mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
        <span>Part 3: Body & Symptoms</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-stone-800 font-serif">
        讲解二：人体与症状
        <span class="text-lg font-normal text-stone-500 block mt-2 font-sans">Yin-Yang in Body and Symptoms</span>
      </h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      <!-- Left Column: Interactive Body Map -->
      <div class="relative bg-stone-50 rounded-2xl p-6 border border-stone-100 min-h-[500px] flex flex-col items-center justify-center">
        <h3 class="text-stone-500 font-bold mb-4 w-full text-center text-sm uppercase tracking-wider">人体部位 (Body Parts)</h3>
        
        <div class="relative w-full max-w-[300px] h-[450px]">
          <!-- Simple Human Body SVG Outline -->
          <svg viewBox="0 0 400 600" class="w-full h-full drop-shadow-sm">
            <!-- Body Outline -->
            <path 
              d="M200 40 
                 C230 40 250 60 250 90 
                 C250 110 240 125 225 130 
                 L260 150 
                 L280 250 
                 L260 350 
                 L240 480 
                 L220 560 
                 L180 560 
                 L160 480 
                 L140 350 
                 L120 250 
                 L140 150 
                 L175 130 
                 C160 125 150 110 150 90 
                 C150 60 170 40 200 40 Z" 
              fill="white" 
              stroke="#78716c" 
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            
            <!-- Midline -->
            <line x1="200" y1="40" x2="200" y2="350" stroke="#e7e5e4" stroke-width="2" stroke-dasharray="5,5" />

            <!-- Connecting Lines -->
            <line v-for="part in bodyParts" :key="'line-'+part.id"
              :x1="part.cx" 
              :y1="part.cy" 
              :x2="part.cx > 200 ? part.cx + 40 : part.cx - 40" 
              :y2="part.cy" 
              stroke="#a8a29e" 
              stroke-width="1"
              :opacity="activePartId === part.id ? 1 : 0.3"
            />

            <!-- Hotspots -->
            <g v-for="part in bodyParts" :key="part.id" 
               @click="handlePartClick(part)" 
               class="cursor-pointer group"
            >
              <!-- Ripple effect -->
              <circle 
                :cx="part.cx" 
                :cy="part.cy" 
                r="20" 
                :class="[
                  part.type === 'yang' ? 'fill-red-500' : 'fill-blue-500',
                  activePartId === part.id ? 'opacity-20 animate-ping' : 'opacity-0 group-hover:opacity-10'
                ]"
              />
              
              <!-- Core dot -->
              <circle 
                :cx="part.cx" 
                :cy="part.cy" 
                r="8" 
                :class="[
                  part.type === 'yang' ? 'fill-red-500' : 'fill-blue-500',
                  'transition-all duration-300 ease-out shadow-sm',
                  activePartId === part.id ? 'scale-125 stroke-white stroke-2' : 'group-hover:scale-110'
                ]"
              />

              <!-- Label -->
              <text 
                :x="part.cx > 200 ? part.cx + 50 : part.cx - 50" 
                :y="part.cy + 5" 
                :text-anchor="part.cx > 200 ? 'start' : 'end'"
                class="text-sm font-bold fill-stone-600 transition-opacity duration-300"
                :class="activePartId === part.id ? 'opacity-100 font-bold' : 'opacity-60'"
              >
                {{ part.label }}
              </text>
            </g>
          </svg>

          <!-- Interactive Popup/Tooltip -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-4 scale-95"
          >
            <div 
              v-if="activePart" 
              class="absolute bottom-6 left-2 right-2 bg-white/95 backdrop-blur-sm p-4 rounded-xl border shadow-lg z-20 text-center"
              :class="activePart.type === 'yang' ? 'border-red-100 shadow-red-50' : 'border-blue-100 shadow-blue-50'"
            >
               <div class="flex items-center justify-center gap-2 mb-1">
                 <h4 class="font-bold text-stone-800" :class="activePart.type === 'yang' ? 'text-red-700' : 'text-blue-700'">
                    {{ activePart.content }}
                 </h4>
                 <Volume2 class="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" :class="activePart.type === 'yang' ? 'text-red-400' : 'text-blue-400'" />
               </div>
               <p class="text-xs text-stone-500 font-serif italic">{{ activePart.pinyin }}</p>
            </div>
            <!-- Initial Prompt -->
            <div 
              v-else 
              class="absolute bottom-6 left-6 right-6 bg-white/80 p-4 rounded-xl border border-stone-200 text-center text-stone-500 text-sm animate-pulse"
            >
              点击身体红/蓝圆点查看详情 (Click dots to explore)
            </div>
          </transition>
        </div>
      </div>

      <!-- Right Column: Symptoms & Sentences -->
      <div class="space-y-8">
        
        <!-- Symptoms List - EXACT from design doc -->
        <div class="bg-stone-50 rounded-2xl p-6 border border-stone-100">
           <h3 class="text-stone-500 font-bold mb-4 w-full text-sm uppercase tracking-wider">常见症状 (Common Symptoms)</h3>
           <div class="space-y-4">
             <div v-for="(sym, idx) in symptoms" :key="idx" 
               class="bg-white p-4 rounded-xl border transition-all hover:shadow-sm"
               :class="sym.type === 'yang' ? 'border-red-100 hover:border-red-200' : 'border-blue-100 hover:border-blue-200'"
             >
               <div class="flex items-center gap-2 mb-2">
                 <span class="w-2 h-2 rounded-full" :class="sym.type === 'yang' ? 'bg-red-500' : 'bg-blue-500'"></span>
                 <h4 class="font-bold text-stone-800">{{ sym.title }}</h4>
               </div>
               <p class="text-sm text-stone-600 mb-2 leading-relaxed">{{ sym.desc }}</p>
               <div class="bg-stone-50 px-3 py-1.5 rounded text-xs font-mono text-stone-500 border border-stone-100 inline-block">
                 例: {{ sym.example }}
               </div>
             </div>
           </div>
        </div>

        <!-- Key Pattern -->
        <div class="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
          <h3 class="text-indigo-900 font-bold mb-4 w-full text-sm uppercase tracking-wider">核心句式 (Key Pattern)</h3>
          
          <div class="text-center mb-6 bg-white rounded-xl p-6 border border-indigo-100 shadow-sm">
            <div class="text-3xl font-bold text-stone-800 mb-2 tracking-wide">
              X <span class="text-indigo-600 relative inline-block group cursor-help border-b-2 border-indigo-200">
                属
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-normal bg-indigo-600 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">shǔ</span>
              </span> Y
            </div>
            <div class="text-sm text-stone-500 font-serif italic">
              (X belongs to Y)
            </div>
          </div>
          
          <div class="grid gap-2">
             <div class="flex items-center gap-2 text-sm text-indigo-800">
               <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
               <span>喜 (xǐ) = like / prefer</span>
             </div>
             <div class="flex items-center gap-2 text-sm text-indigo-800">
               <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
               <span>畏 (wèi) = fear / avoid</span>
             </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>