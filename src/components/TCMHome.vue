<script setup>
import { ref } from 'vue'
import LessonOne from './LessonOne.vue'
import { 
  BookOpen, 
  Sparkles, 
  Wrench, 
  User, 
  Languages, 
  MessageCircle, 
  Mic, 
  Volume2, 
  ChevronRight,
  Send,
  X,
  Menu
} from 'lucide-vue-next'

// State for language (true = Chinese, false = English)
const isChinese = ref(true)

// State for AI Assistant chat window
const isChatOpen = ref(false)

// State for Sidebar visibility
const isSidebarOpen = ref(true)

// Mock data for Sidebar (Textbook Directory)
const textbookModules = [
  {
    title: '第一篇: 基础理论 (Part 1: Basic Theory)',
    lessons: [
      { id: 1, title: '第一课: 日月与阴阳 (Lesson 1: Sun, Moon, and Yin-Yang)', active: true },
      { id: 2, title: '第二课: 五行学说 (Lesson 2: Five Elements Theory)', active: false },
      { id: 3, title: '第三课: 脏腑功能 (Lesson 3: Zang-Fu Organs)', active: false },
    ]
  },
  {
    title: '第二篇: 诊断方法 (Part 2: Diagnostics)',
    lessons: [
      { id: 4, title: '第四课: 望闻问切 (Lesson 4: Four Examinations)', active: false },
      { id: 5, title: '第五课: 脉诊基础 (Lesson 5: Pulse Diagnosis)', active: false },
    ]
  }
]

// Mock data for user progress
const userProgress = ref(15) // percentage

// Chat messages
const chatMessages = ref([
  { role: 'assistant', text: '你好！我是你的中医学习助手。有什么我可以帮你的吗？(Hello! I am your TCM learning assistant. How can I help you today?)' }
])
const newMessage = ref('')

const toggleLanguage = () => {
  isChinese.value = !isChinese.value
}

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  chatMessages.value.push({ role: 'user', text: newMessage.value })
  // Simulate AI response
  setTimeout(() => {
    chatMessages.value.push({ role: 'assistant', text: '这是一个模拟回复。(This is a simulated response.)' })
  }, 1000)
  newMessage.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
    <!-- Navbar -->
    <nav class="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div class="flex items-center gap-3">
        <!-- Sidebar Toggle -->
        <button 
          @click="toggleSidebar"
          class="p-2 -ml-2 mr-1 rounded-md text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu class="w-5 h-5" />
        </button>

        <!-- Logo Placeholder (Tai Chi Concept) -->
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-900 to-stone-100 border border-stone-200 flex items-center justify-center relative overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-1/2 bg-stone-900"></div>
             <div class="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
             <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white z-10"></div>
             <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-900 z-10"></div>
        </div>
        <span class="font-serif text-xl font-bold tracking-wide text-stone-800">智启岐黄 <span class="text-sm font-normal text-stone-500 ml-1">TCM Learning</span></span>
      </div>

      <div class="hidden md:flex items-center gap-8">
        <a href="#" class="flex items-center gap-2 text-stone-600 hover:text-red-700 transition-colors font-medium">
          <BookOpen class="w-4 h-4" />
          <span>{{ isChinese ? '教材目录' : 'Textbook' }}</span>
        </a>
        <a href="#" class="flex items-center gap-2 text-stone-600 hover:text-red-700 transition-colors font-medium">
          <Sparkles class="w-4 h-4" />
          <span>{{ isChinese ? '核心功能' : 'Features' }}</span>
        </a>
        <a href="#" class="flex items-center gap-2 text-stone-600 hover:text-red-700 transition-colors font-medium">
          <Wrench class="w-4 h-4" />
          <span>{{ isChinese ? '学习工具' : 'Tools' }}</span>
        </a>
        <a href="#" class="flex items-center gap-2 text-stone-600 hover:text-red-700 transition-colors font-medium">
          <User class="w-4 h-4" />
          <span>{{ isChinese ? '个人中心' : 'Profile' }}</span>
        </a>
      </div>

      <button 
        @click="toggleLanguage"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 hover:border-red-600 hover:text-red-600 transition-colors text-sm"
      >
        <Languages class="w-4 h-4" />
        <span>{{ isChinese ? 'EN' : '中' }}</span>
      </button>
    </nav>

    <div class="flex flex-1 overflow-hidden relative">
      <!-- Sidebar (Textbook Directory) -->
      <transition 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="-ml-80 opacity-0"
        enter-to-class="ml-0 opacity-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="ml-0 opacity-100"
        leave-to-class="-ml-80 opacity-0"
      >
        <aside 
          v-show="isSidebarOpen"
          class="w-80 bg-stone-100 border-r border-stone-200 overflow-y-auto hidden md:block shrink-0 h-full"
        >
          <div class="p-6">
            <h2 class="text-lg font-bold text-stone-800 mb-4 font-serif border-b border-stone-300 pb-2">
              {{ isChinese ? '教材目录' : 'Table of Contents' }}
            </h2>
            
            <div class="space-y-6">
              <div v-for="(module, index) in textbookModules" :key="index">
                <h3 class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 px-2">
                  {{ module.title }}
                </h3>
                <ul class="space-y-1">
                  <li v-for="lesson in module.lessons" :key="lesson.id">
                    <a 
                      href="#" 
                      class="block px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-4"
                      :class="[
                        lesson.active 
                          ? 'bg-white text-red-800 border-red-600 shadow-sm font-medium' 
                          : 'text-stone-600 border-transparent hover:bg-stone-200 hover:text-stone-900'
                      ]"
                    >
                      {{ lesson.title }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Main Content -->
      <main class="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col items-center justify-start pt-10">
        
        <LessonOne />

      </main>
    </div>

    <!-- Floating AI Assistant -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <!-- Chat Window -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div v-if="isChatOpen" class="bg-white rounded-2xl shadow-2xl border border-stone-200 w-80 md:w-96 mb-4 overflow-hidden flex flex-col max-h-[500px]">
          <!-- Chat Header -->
          <div class="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sparkles class="w-4 h-4" />
              </div>
              <div>
                <h3 class="font-bold text-sm text-stone-800">TCM Assistant</h3>
                <p class="text-xs text-stone-500">Ask about terms or concepts</p>
              </div>
            </div>
            <button @click="toggleChat" class="text-stone-400 hover:text-stone-600">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Shortcuts -->
          <div class="px-4 py-2 bg-white border-b border-stone-100 flex gap-2 overflow-x-auto">
             <button class="flex items-center gap-1 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 rounded-full text-xs text-stone-600 transition-colors border border-stone-200 whitespace-nowrap">
               <Mic class="w-3 h-3" />
               <span>拼音标注 (Pinyin)</span>
             </button>
             <button class="flex items-center gap-1 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 rounded-full text-xs text-stone-600 transition-colors border border-stone-200 whitespace-nowrap">
               <Volume2 class="w-3 h-3" />
               <span>朗读 (Read Aloud)</span>
             </button>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 p-4 overflow-y-auto bg-stone-50/30 space-y-4 min-h-[250px]">
            <div v-for="(msg, idx) in chatMessages" :key="idx" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
              <div 
                class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
                :class="msg.role === 'user' ? 'bg-stone-800 text-white rounded-br-none' : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'"
              >
                {{ msg.text }}
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-3 bg-white border-t border-stone-200">
            <div class="relative">
              <input 
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text" 
                :placeholder="isChinese ? '输入问题...' : 'Ask a question...'"
                class="w-full pl-4 pr-10 py-3 bg-stone-100 border-transparent focus:bg-white focus:border-stone-300 focus:ring-0 rounded-xl text-sm transition-all"
              >
              <button 
                @click="sendMessage"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-colors"
              >
                <Send class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Floating Trigger Button -->
      <button 
        @click="toggleChat"
        class="w-14 h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 group relative"
      >
        <MessageCircle v-if="!isChatOpen" class="w-7 h-7" />
        <X v-else class="w-7 h-7" />
        
        <!-- Pulse effect for notification (optional) -->
        <span v-if="!isChatOpen" class="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 5px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background-color: #e7e5e4;
  border-radius: 20px;
}
</style>
