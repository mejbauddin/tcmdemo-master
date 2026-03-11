<script setup>
import { ref, onMounted } from 'vue'
import { Download, MessageSquare, Gamepad2 } from 'lucide-vue-next'
import LessonOneBalanceGame from './LessonOneBalanceGame.vue'

const emit = defineEmits(['complete'])
const showGame = ref(false)

onMounted(() => {
  emit('complete')
})
</script>

<template>
  <div class="space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
        <span>Part 6: Summary & Expansion</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-stone-800 font-serif">
        课堂小结与拓展
        <span class="block text-lg font-normal text-stone-500 mt-2 font-sans">Summary & Expansion</span>
      </h2>
    </div>

    <!-- Game Entry Card (New!) -->
    <div class="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg group cursor-pointer" @click="showGame = true">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
           <span class="text-4xl">⚖️</span>
        </div>
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            Challenge Game 2
          </div>
          <h3 class="text-xl md:text-2xl font-bold mb-2">阴阳平衡拼图 (Balance Puzzle)</h3>
          <p class="text-stone-300 text-sm max-w-lg">
            扮演“阴阳调和师”，使用药物和疗法砝码，让失衡的身体天平恢复平衡。赢取“阴阳大师”称号！
            <br>
            <span class="opacity-70 text-xs">Play as a Healer to restore balance to the body scale.</span>
          </p>
        </div>
        <button class="bg-white text-stone-900 px-6 py-3 rounded-full font-bold hover:bg-stone-100 transition-colors shadow-lg active:scale-95 flex items-center gap-2">
          <Gamepad2 class="w-5 h-5" />
          开始挑战 (Start)
        </button>
      </div>
    </div>

    <!-- Game Modal -->
    <LessonOneBalanceGame :isOpen="showGame" @close="showGame = false" />

    <!-- Summary Framework Card -->
    <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <div class="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center">
        <h3 class="font-bold text-stone-800">知识框架 (Knowledge Framework)</h3>
        <button class="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors">
          <Download class="w-4 h-4" />
          <span>保存 (Save)</span>
        </button>
      </div>
      
      <div class="p-6 md:p-8 space-y-6">
        <!-- 1. Philosophy -->
        <div class="flex gap-4">
          <div class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold shrink-0">1</div>
          <div>
            <h4 class="font-bold text-stone-800 mb-1">阴阳的哲学分类 (Philosophy)</h4>
            <p class="text-sm text-stone-600">
              <span class="text-red-600">阳 (Yang)</span>: 明亮、温暖、向上 (Bright, Warm, Upward)<br>
              <span class="text-blue-600">阴 (Yin)</span>: 昏暗、寒冷、向下 (Dark, Cold, Downward)
            </p>
          </div>
        </div>

        <!-- 2. Body & Symptoms -->
        <div class="flex gap-4">
          <div class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold shrink-0">2</div>
          <div>
            <h4 class="font-bold text-stone-800 mb-1">人体与症状 (Body & Symptoms)</h4>
            <p class="text-sm text-stone-600">
              部位: 头/背/气 (<span class="text-red-600">阳</span>) vs 脚/腹/血 (<span class="text-blue-600">阴</span>)<br>
              症状: 发热/兴奋 (<span class="text-red-600">阳</span>) vs 畏寒/抑制 (<span class="text-blue-600">阴</span>)
            </p>
          </div>
        </div>

        <!-- 3. Principles -->
        <div class="flex gap-4">
          <div class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold shrink-0">3</div>
          <div>
            <h4 class="font-bold text-stone-800 mb-1">核心原则 (Core Principles)</h4>
            <p class="text-sm text-stone-600">
              平衡 (Balance) = 健康 (Health)<br>
              互根 (Mutual Root) = 互为基础 (Basis for each other)
            </p>
          </div>
        </div>

        <!-- Key Sentences -->
        <div class="pt-4 border-t border-stone-100">
          <div class="bg-indigo-50 rounded-xl p-4">
            <h4 class="text-indigo-900 font-bold text-sm mb-2 uppercase tracking-wide">核心句式 (Key Sentences)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-indigo-800 font-medium">
              <div>X 属 Y (Belong)</div>
              <div>X 喜 Y (Like)</div>
              <div>X 畏 Y (Fear)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expansion Task -->
    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 flex flex-col md:flex-row gap-6 items-center">
      <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-yellow-500 shadow-sm shrink-0">
        <MessageSquare class="w-8 h-8" />
      </div>
      <div class="flex-1 text-center md:text-left">
        <h3 class="font-bold text-stone-800 text-lg mb-2">拓展小任务 (Mini Task)</h3>
        <p class="text-stone-700 text-sm leading-relaxed mb-4">
          观察生活，找出5种属阳、5种属阴的事物，在评论区分享。
          <br>
          <span class="text-stone-500 text-xs">Observe your life, find 5 Yang things and 5 Yin things, and share them in the comments.</span>
        </p>
        <button class="bg-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-yellow-600 transition-colors shadow-sm active:scale-95">
          去分享 (Share Now)
        </button>
      </div>
    </div>

  </div>
</template>
