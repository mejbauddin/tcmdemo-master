<script setup>
import { onMounted, ref, computed, onUnmounted, watch } from 'vue'

const emit = defineEmits(['complete'])

// Animation State
const rotation = ref(0)
const speed = ref(20) // 0-100
const isAutoPlaying = ref(true)
let animationFrameId = null

// Random Stars
const stars = ref(Array.from({ length: 50 }, () => ({
  top: Math.random() * 80 + '%',
  left: Math.random() * 100 + '%',
  size: Math.random() > 0.7 ? 'w-1 h-1' : (Math.random() > 0.4 ? 'w-0.5 h-0.5' : 'w-1.5 h-1.5'),
  delay: Math.random() * 3 + 's',
  opacity: Math.random() * 0.7 + 0.3
})))

// Status Logic
const status = computed(() => {
  if (speed.value < 20) return { text: '安宁 (Peaceful)', color: 'text-blue-600' }
  if (speed.value < 60) return { text: '流转 (Flow)', color: 'text-green-600' }
  return { text: '混乱 (Chaotic)', color: 'text-red-600' }
})

// Sky Background Logic (Opacity mixing)
// Angle 0 = Noon (Sun top), 180 = Midnight (Moon top)
// We need normalized values for opacities
const dayOpacity = computed(() => {
  // Visible around 0 (315 to 45)
  // Simple cosine based: 1 at 0, 0 at 90/270, -1 at 180
  const val = Math.cos(rotation.value * Math.PI / 180)
  return Math.max(0, val) // Only positive parts
})

const nightOpacity = computed(() => {
  // Visible around 180
  const val = -Math.cos(rotation.value * Math.PI / 180)
  return Math.max(0, val)
})

const sunsetOpacity = computed(() => {
  // Visible around 90 (Sunset) and 270 (Sunrise)
  // sin(0) = 0, sin(90) = 1, sin(180) = 0, sin(270) = -1
  // We want it visible at both 90 and 270
  return Math.abs(Math.sin(rotation.value * Math.PI / 180))
})

// Animation Loop
const animate = () => {
  if (isAutoPlaying.value) {
    // Non-linear speed for better control at low values
    // Using a power function: speed^2 gives finer control at low end while allowing high speed at max
    // Reduced multiplier to slow down the 'Harmony' range
    const increment = Math.pow(speed.value, 2) * 0.0002
    rotation.value = (rotation.value + increment) % 360
  }
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  emit('complete')
  animate()
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header Section -->
    <section class="text-center space-y-6">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-sm font-medium">
        <span>Part 1: Introduction</span>
      </div>
      
      <h1 class="text-3xl md:text-4xl font-bold text-stone-800 font-serif leading-tight">
        你好，阴阳！
        <span class="block text-xl font-normal text-stone-500 mt-2 font-sans">Hello, Yin and Yang!</span>
      </h1>
    </section>

    <!-- Visual Animation Container -->
    <section class="relative h-96 w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-stone-200 group">
      <!-- Sky Background Layers -->
      <!-- Day Layer (Blue) -->
      <div 
        class="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-blue-100 transition-opacity duration-300"
        :style="{ opacity: dayOpacity }"
      ></div>
      
      <!-- Night Layer (Dark Blue/Black) -->
      <div 
        class="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 transition-opacity duration-300"
        :style="{ opacity: nightOpacity }"
      >
        <!-- Dynamic Stars -->
        <div 
          v-for="(star, index) in stars" 
          :key="index"
          class="absolute bg-white rounded-full animate-pulse shadow-[0_0_2px_#fff]"
          :class="star.size"
          :style="{ 
            top: star.top, 
            left: star.left, 
            animationDelay: star.delay,
            opacity: star.opacity 
          }"
        ></div>
      </div>

      <!-- Sunset/Sunrise Layer (Orange/Pink) -->
      <div 
        class="absolute inset-0 bg-gradient-to-b from-orange-500 via-rose-400 to-amber-200 mix-blend-overlay transition-opacity duration-300"
        :style="{ opacity: sunsetOpacity }"
      ></div>

      <!-- Celestial Orbit Container -->
      <!-- Centered, rotates with 'rotation' -->
      <div 
        class="absolute top-1/2 left-1/2 w-72 h-72 -mt-36 -ml-36 rounded-full border border-white/10"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <!-- Sun (Top at 0deg) -->
        <!-- Counter-rotate to keep upright -->
        <div 
          class="absolute top-0 left-1/2 -ml-12 -mt-12 w-24 h-24 transition-transform duration-75"
          :style="{ transform: `rotate(-${rotation}deg)` }"
        >
          <div class="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.6)] flex items-center justify-center relative overflow-hidden">
             <!-- Sun rays/texture -->
             <div class="absolute inset-0 bg-white/20 rounded-full blur-sm transform scale-75"></div>
             <span class="relative text-2xl font-bold text-orange-900 z-10 drop-shadow-sm">阳</span>
          </div>
        </div>
        
        <!-- Moon (Bottom at 180deg) -->
        <!-- Start at bottom (180deg rotation relative to parent), then counter-rotate -->
        <div 
          class="absolute bottom-0 left-1/2 -ml-10 -mb-10 w-20 h-20 transition-transform duration-75"
          :style="{ transform: `rotate(-${rotation}deg)` }"
        >
          <div class="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center relative overflow-hidden border border-slate-200/50">
             <!-- Craters -->
             <div class="absolute top-2 left-3 w-3 h-3 bg-slate-400/20 rounded-full"></div>
             <div class="absolute bottom-3 right-3 w-4 h-4 bg-slate-400/20 rounded-full"></div>
             <span class="relative text-lg font-bold text-slate-600 z-10 drop-shadow-sm">阴</span>
          </div>
        </div>
      </div>

      <!-- Ground/Horizon (Parallax Layers) -->
      <!-- Back Mountain -->
      <div class="absolute bottom-0 w-full h-32 transform translate-y-4">
         <svg class="w-full h-full text-stone-700 transition-colors duration-1000" :class="nightOpacity > 0.5 ? 'text-slate-800' : 'text-stone-300'" viewBox="0 0 400 100" preserveAspectRatio="none">
           <path d="M0 100 L120 30 L280 70 L400 20 V 100 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
      <!-- Front Mountain -->
      <div class="absolute bottom-0 w-full h-24">
         <svg class="w-full h-full text-stone-800 transition-colors duration-1000" :class="nightOpacity > 0.5 ? 'text-slate-900' : 'text-stone-400'" viewBox="0 0 400 100" preserveAspectRatio="none">
           <path d="M0 100 L80 50 L180 90 L320 40 L400 100 Z" fill="currentColor" />
        </svg>
      </div>

      <!-- Controls Overlay -->
      <div class="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-3 shadow-lg border border-white/50 transition-all hover:bg-white/95">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-xs uppercase tracking-wider text-stone-500 font-semibold">Cycle Speed</span>
            <span class="text-sm font-bold text-stone-800">循环速度</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-100 shadow-sm" :class="status.color">
            <span class="text-sm font-bold">{{ status.text }}</span>
          </div>
        </div>
        
        <div class="relative w-full h-6 flex items-center">
          <!-- Custom Range Slider Track -->
          <div class="absolute w-full h-2 bg-stone-200 rounded-full overflow-hidden">
             <div class="h-full bg-stone-800 transition-all duration-75" :style="{ width: speed + '%' }"></div>
          </div>
          <input 
            type="range" 
            v-model.number="speed" 
            min="0" 
            max="100" 
            class="relative w-full h-full opacity-0 cursor-pointer z-10"
          >
          <!-- Thumb Indicator (Visual only, follows speed) -->
          <div 
            class="absolute top-1/2 w-4 h-4 bg-white border-2 border-stone-800 rounded-full shadow-md transform -translate-y-1/2 pointer-events-none transition-all duration-75"
            :style="{ left: `calc(${speed}% - 8px)` }"
          ></div>
        </div>

        <div class="flex justify-between text-[10px] uppercase tracking-wide text-stone-400 font-medium px-1">
          <span>Stagnation</span>
          <span>Harmony</span>
          <span>Chaos</span>
        </div>
      </div>
    </section>

    <!-- Dialogue / Content -->
    <section class="bg-white rounded-2xl p-6 md:p-8 border border-stone-100 shadow-sm space-y-6">
      <!-- Greeting -->
      <div class="flex gap-4">
        <div class="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white shrink-0 font-bold">
          师
        </div>
        <div class="space-y-2">
          <p class="text-stone-800 text-lg leading-relaxed">
            大家好，欢迎来到中医汉语微课堂。今天我们学习中医最基础也最核心的概念——<span class="text-red-600 font-bold">阴阳</span>。
          </p>
          <p class="text-stone-500 text-sm">
            Hello everyone, welcome to the TCM Chinese Mini-Class. Today we will learn the most basic and core concept of TCM — Yin and Yang.
          </p>
        </div>
      </div>

      <!-- Question -->
      <div class="flex gap-4">
        <div class="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white shrink-0 font-bold">
          师
        </div>
        <div class="space-y-2">
          <p class="text-stone-800 text-lg leading-relaxed">
            我们看到太阳和月亮，白天和黑夜，山的南面和北面，这些生活中的事物，在中医里有怎样的分类？
          </p>
          <p class="text-stone-500 text-sm">
            We see the sun and moon, day and night, the south and north sides of a mountain. How are these everyday things classified in TCM?
          </p>
        </div>
      </div>

      <!-- Key Point -->
      <div class="bg-amber-50 rounded-xl p-5 border border-amber-100">
        <p class="font-bold text-amber-900 mb-2">重点 (Key Point)</p>
        <p class="text-stone-700">
          阴阳不仅是中国古代哲学思想，更是中医解释世界、解释人体的基础。
          <br>
          <span class="text-stone-500 text-sm font-normal mt-1 block">
            Yin-Yang is not only an ancient Chinese philosophical thought, but also the foundation for TCM to explain the world and the human body.
          </span>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes floatReverse {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

.animate-float-slow {
  animation: float 4s ease-in-out infinite;
}

.animate-float-reverse-slow {
  animation: floatReverse 5s ease-in-out infinite;
}
</style>
