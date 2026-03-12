<script setup>
import { ref, onMounted, watch } from 'vue'
import LessonOne from './LessonOne.vue'
import UserProfile from './auth/UserProfile.vue'
import LoginModal from './auth/LoginModal.vue'
import RegisterModal from './auth/RegisterModal.vue'
import ExerciseList from './exercises/ExerciseList.vue'
import { useAuthStore } from '../stores/authStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { 
  BookOpen, 
  Sparkles, 
  Wrench, 
  User, 
  Languages, 
  MessageCircle, 
  Mic, 
  Volume2, 
  Send,
  X,
  Menu,
  LogIn,
  Home,
  ChevronRight
} from 'lucide-vue-next'

// State
const isChinese = ref(true)
const isChatOpen = ref(false)
const isSidebarOpen = ref(true)
const currentView = ref('lesson') // 'lesson', 'textbook', 'features', 'tools', 'profile'
const selectedLesson = ref(1)

// Auth state
const authStore = useAuthStore()
const exerciseStore = useExerciseStore()
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showProfile = ref(false)

// Textbook data
const textbookModules = [
  {
    id: 1,
    title: '第一篇: 基础理论',
    titleEn: 'Part 1: Basic Theory',
    lessons: [
      { id: 1, title: '第一课: 日月与阴阳', titleEn: 'Lesson 1: Sun, Moon, and Yin-Yang', completed: false },
      { id: 2, title: '第二课: 五行学说', titleEn: 'Lesson 2: Five Elements Theory', completed: false },
      { id: 3, title: '第三课: 脏腑功能', titleEn: 'Lesson 3: Zang-Fu Organs', completed: false },
    ]
  },
  {
    id: 2,
    title: '第二篇: 诊断方法',
    titleEn: 'Part 2: Diagnostics',
    lessons: [
      { id: 4, title: '第四课: 望闻问切', titleEn: 'Lesson 4: Four Examinations', completed: false },
      { id: 5, title: '第五课: 脉诊基础', titleEn: 'Lesson 5: Pulse Diagnosis', completed: false },
      { id: 6, title: '第六课: 舌诊入门', titleEn: 'Lesson 6: Tongue Diagnosis', completed: false },
    ]
  },
  {
    id: 3,
    title: '第三篇: 治疗原则',
    titleEn: 'Part 3: Treatment Principles',
    lessons: [
      { id: 7, title: '第七课: 针灸基础', titleEn: 'Lesson 7: Acupuncture Basics', completed: false },
      { id: 8, title: '第八课: 中药入门', titleEn: 'Lesson 8: Herbal Medicine', completed: false },
      { id: 9, title: '第九课: 方剂学', titleEn: 'Lesson 9: Formulas', completed: false },
    ]
  }
]

// Features data
const features = [
  {
    id: 1,
    icon: '🎯',
    title: '交互式学习',
    titleEn: 'Interactive Learning',
    description: '通过动画和游戏理解中医概念',
    descriptionEn: 'Understand TCM concepts through animations and games'
  },
  {
    id: 2,
    icon: '🗣️',
    title: 'AI语音评测',
    titleEn: 'AI Voice Assessment',
    description: '实时反馈发音准确性',
    descriptionEn: 'Real-time pronunciation feedback'
  },
  {
    id: 3,
    icon: '📊',
    title: '学习进度追踪',
    titleEn: 'Progress Tracking',
    description: '自动记录错题和学习数据',
    descriptionEn: 'Auto-track wrong answers and progress'
  },
  {
    id: 4,
    icon: '🌐',
    title: '双语支持',
    titleEn: 'Bilingual Support',
    description: '中英文自由切换',
    descriptionEn: 'Switch between Chinese and English'
  }
]

// Tools data
const tools = [
  {
    id: 1,
    name: '错题本',
    nameEn: 'Wrong Answer Book',
    icon: '📝',
    route: 'wrong-answers'
  },
  {
    id: 2,
    name: ' flashcards',
    nameEn: 'Flashcards',
    icon: '🃏',
    route: 'flashcards'
  },
  {
    id: 3,
    name: '词典',
    nameEn: 'Dictionary',
    icon: '📚',
    route: 'dictionary'
  },
  {
    id: 4,
    name: '练习题库',
    nameEn: 'Practice Bank',
    icon: '✍️',
    route: 'practice'
  }
]

// Chat messages
const chatMessages = ref([
  { role: 'assistant', text: '你好！我是你的中医学习助手。有什么我可以帮你的吗？', textEn: 'Hello! I am your TCM learning assistant. How can I help you today?' }
])
const newMessage = ref('')

// Watch for authentication changes
watch(() => authStore.isAuthenticated, (newValue) => {
  if (!newValue) {
    emit('logout')
  }
})

// Methods
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
  
  const userMsg = { role: 'user', text: newMessage.value }
  chatMessages.value.push(userMsg)
  
  // Simulate AI response
  setTimeout(() => {
    chatMessages.value.push({ 
      role: 'assistant', 
      text: isChinese.value ? '我正在学习，请稍后...' : 'I am learning, please wait...',
      textEn: 'I am learning, please wait...'
    })
  }, 1000)
  
  newMessage.value = ''
}

const openLogin = () => {
  showLoginModal.value = true
  showRegisterModal.value = false
  showProfile.value = false
}

const openRegister = () => {
  showRegisterModal.value = true
  showLoginModal.value = false
  showProfile.value = false
}

const closeModals = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
  showProfile.value = false
}

const handleLogout = () => {
  showProfile.value = false
  emit('logout')
}

const selectLesson = (lessonId) => {
  selectedLesson.value = lessonId
  currentView.value = 'lesson'
  isSidebarOpen.value = false // Auto-close sidebar on mobile
}

const navigateTo = (view) => {
  currentView.value = view
  if (view === 'profile') {
    showProfile.value = true
  } else {
    showProfile.value = false
  }
}

// Load exercises on mount
onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchProfile()
    exerciseStore.fetchExercises()
    exerciseStore.fetchWrongAnswers()
  }
})

// Define emits
const emit = defineEmits(['logout'])
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
    <!-- Navbar -->
    <nav class="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-sm">
      <div class="flex items-center gap-2 md:gap-3">
        <!-- Sidebar Toggle -->
        <button 
          @click="toggleSidebar"
          class="p-2 -ml-2 rounded-md text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          :title="isChinese ? '切换菜单' : 'Toggle Menu'"
        >
          <Menu class="w-5 h-5" />
        </button>

        <!-- Logo -->
        <div class="flex items-center gap-2 cursor-pointer" @click="navigateTo('lesson')">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-900 to-stone-100 border border-stone-200 flex items-center justify-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1/2 bg-stone-900"></div>
            <div class="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
            <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white z-10"></div>
            <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-900 z-10"></div>
          </div>
          <span class="font-serif text-lg md:text-xl font-bold tracking-wide text-stone-800">
            智启岐黄 
            <span class="text-xs md:text-sm font-normal text-stone-500 ml-1 hidden sm:inline">TCM Learning</span>
          </span>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <button 
          @click="navigateTo('textbook')"
          class="flex items-center gap-2 text-stone-600 hover:text-red-700 transition-colors font-medium"
          :class="{ 'text-red-700': currentView === 'textbook' }"
        >
          <BookOpen class="w-4 h-4" />
          <span>{{ isChinese ? '教材' : 'Textbook' }}</span>
        </button>
        
        <button 
          @click="navigateTo('features')"
          class="flex items-center gap-2 text-stone-600 hover:text-red-700 transition-colors font-medium"
          :class="{ 'text-red-700': currentView === 'features' }"
        >
          <Sparkles class="w-4 h-4" />
          <span>{{ isChinese ? '功能' : 'Features' }}</span>
        </button>
        
        <button 
          @click="navigateTo('tools')"
          class="flex items-center gap-2 text-stone-600 hover:text-red-700 transition-colors font-medium"
          :class="{ 'text-red-700': currentView === 'tools' }"
        >
          <Wrench class="w-4 h-4" />
          <span>{{ isChinese ? '工具' : 'Tools' }}</span>
        </button>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        <!-- Language Toggle -->
        <button 
          @click="toggleLanguage"
          class="flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-full border border-stone-300 hover:border-red-600 hover:text-red-600 transition-colors text-xs md:text-sm"
        >
          <Languages class="w-3 h-3 md:w-4 md:h-4" />
          <span class="hidden sm:inline">{{ isChinese ? 'EN' : '中' }}</span>
        </button>

        <!-- Auth Buttons -->
        <template v-if="!authStore.isAuthenticated">
          <button 
            @click="openLogin"
            class="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <LogIn class="w-4 h-4" />
            <span>{{ isChinese ? '登录' : 'Login' }}</span>
          </button>
        </template>

        <template v-else>
          <button 
            @click="navigateTo('profile')"
            class="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            <User class="w-4 h-4" />
            <span class="text-xs md:text-sm font-medium hidden sm:inline">{{ authStore.user?.username || 'User' }}</span>
          </button>
        </template>
      </div>
    </nav>

    <div class="flex flex-1 overflow-hidden relative">
      <!-- Sidebar -->
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
          class="w-64 md:w-80 bg-white border-r border-stone-200 overflow-y-auto absolute md:relative h-full z-40 shadow-lg md:shadow-none"
        >
          <div class="p-4 md:p-6">
            <div class="flex items-center justify-between mb-4 md:hidden">
              <h2 class="text-lg font-bold text-stone-800">
                {{ isChinese ? '目录' : 'Menu' }}
              </h2>
              <button @click="toggleSidebar" class="text-stone-400 hover:text-stone-600">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Quick Navigation -->
            <div class="mb-6">
              <button 
                @click="navigateTo('lesson')"
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-2"
                :class="{ 'bg-stone-100 text-red-700': currentView === 'lesson' }"
              >
                <Home class="w-5 h-5" />
                <span class="font-medium">{{ isChinese ? '当前课程' : 'Current Lesson' }}</span>
              </button>
              
              <button 
                @click="navigateTo('textbook')"
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-2"
                :class="{ 'bg-stone-100 text-red-700': currentView === 'textbook' }"
              >
                <BookOpen class="w-5 h-5" />
                <span class="font-medium">{{ isChinese ? '教材' : 'Textbook' }}</span>
              </button>
              
              <button 
                @click="navigateTo('features')"
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-2"
                :class="{ 'bg-stone-100 text-red-700': currentView === 'features' }"
              >
                <Sparkles class="w-5 h-5" />
                <span class="font-medium">{{ isChinese ? '功能' : 'Features' }}</span>
              </button>
              
              <button 
                @click="navigateTo('tools')"
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-2"
                :class="{ 'bg-stone-100 text-red-700': currentView === 'tools' }"
              >
                <Wrench class="w-5 h-5" />
                <span class="font-medium">{{ isChinese ? '工具' : 'Tools' }}</span>
              </button>
            </div>

            <!-- Textbook Sections -->
            <h2 class="text-lg font-bold text-stone-800 mb-4 font-serif border-b border-stone-200 pb-2">
              {{ isChinese ? '课程目录' : 'Lessons' }}
            </h2>
            
            <div class="space-y-6">
              <div v-for="module in textbookModules" :key="module.id">
                <h3 class="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2 px-2">
                  {{ isChinese ? module.title : module.titleEn }}
                </h3>
                <ul class="space-y-1">
                  <li v-for="lesson in module.lessons" :key="lesson.id">
                    <button 
                      @click="selectLesson(lesson.id)"
                      class="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 border-l-4"
                      :class="[
                        selectedLesson === lesson.id 
                          ? 'bg-stone-100 text-red-800 border-red-600 font-medium' 
                          : 'text-stone-600 border-transparent hover:bg-stone-50 hover:text-stone-900'
                      ]"
                    >
                      {{ isChinese ? lesson.title : lesson.titleEn }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-8 overflow-y-auto">
        <!-- Lesson View -->
        <div v-if="currentView === 'lesson'">
          <LessonOne :lessonId="selectedLesson" />
        </div>

        <!-- Textbook View -->
        <div v-else-if="currentView === 'textbook'" class="max-w-4xl mx-auto">
          <h1 class="text-2xl md:text-3xl font-bold text-stone-800 mb-6 font-serif">
            {{ isChinese ? '教材目录' : 'Textbook' }}
          </h1>
          
          <div class="space-y-8">
            <div v-for="module in textbookModules" :key="module.id" class="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
              <h2 class="text-xl font-bold text-stone-800 mb-4">{{ isChinese ? module.title : module.titleEn }}</h2>
              <div class="grid gap-3">
                <div 
                  v-for="lesson in module.lessons" 
                  :key="lesson.id"
                  class="flex items-center justify-between p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  @click="selectLesson(lesson.id)"
                >
                  <div>
                    <h3 class="font-medium text-stone-800">{{ isChinese ? lesson.title : lesson.titleEn }}</h3>
                    <p class="text-sm text-stone-500 mt-1">
                      {{ isChinese ? '点击开始学习' : 'Click to start learning' }}
                    </p>
                  </div>
                  <ChevronRight class="w-5 h-5 text-stone-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features View -->
        <div v-else-if="currentView === 'features'" class="max-w-4xl mx-auto">
          <h1 class="text-2xl md:text-3xl font-bold text-stone-800 mb-6 font-serif">
            {{ isChinese ? '核心功能' : 'Features' }}
          </h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="feature in features" 
              :key="feature.id"
              class="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
            >
              <div class="text-4xl mb-4">{{ feature.icon }}</div>
              <h3 class="text-lg font-bold text-stone-800 mb-2">{{ isChinese ? feature.title : feature.titleEn }}</h3>
              <p class="text-stone-600">{{ isChinese ? feature.description : feature.descriptionEn }}</p>
            </div>
          </div>
        </div>

        <!-- Tools View -->
        <div v-else-if="currentView === 'tools'" class="max-w-4xl mx-auto">
          <h1 class="text-2xl md:text-3xl font-bold text-stone-800 mb-6 font-serif">
            {{ isChinese ? '学习工具' : 'Learning Tools' }}
          </h1>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="tool in tools" 
              :key="tool.id"
              class="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow cursor-pointer"
              @click="navigateTo(tool.route)"
            >
              <div class="flex items-center gap-4">
                <span class="text-3xl">{{ tool.icon }}</span>
                <div>
                  <h3 class="font-bold text-stone-800">{{ isChinese ? tool.name : tool.nameEn }}</h3>
                  <p class="text-sm text-stone-500 mt-1">
                    {{ isChinese ? '点击查看' : 'Click to view' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Wrong Answers Section (if authenticated) -->
          <div v-if="authStore.isAuthenticated && exerciseStore.wrongAnswers.length > 0" class="mt-8">
            <h2 class="text-xl font-bold text-stone-800 mb-4">{{ isChinese ? '近期错题' : 'Recent Wrong Answers' }}</h2>
            <div class="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
              <ExerciseList :lessonId="selectedLesson" />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Profile Dropdown -->
    <div v-if="showProfile && authStore.isAuthenticated" class="absolute top-16 right-4 md:right-6 z-50 w-72 md:w-80">
      <UserProfile @close="showProfile = false" @logout="handleLogout" />
    </div>

    <!-- Auth Modals -->
    <LoginModal 
      v-if="showLoginModal" 
      @close="closeModals"
      @switch-to-register="openRegister"
      @login-success="closeModals"
    />

    <RegisterModal 
      v-if="showRegisterModal" 
      @close="closeModals"
      @switch-to-login="openLogin"
      @register-success="closeModals"
    />

    <!-- Floating AI Assistant -->
    <div class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
      <!-- Chat Window -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div v-if="isChatOpen" class="bg-white rounded-2xl shadow-2xl border border-stone-200 w-72 md:w-96 mb-4 overflow-hidden flex flex-col max-h-[500px]">
          <!-- Chat Header -->
          <div class="bg-stone-50 p-3 md:p-4 border-b border-stone-200 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sparkles class="w-4 h-4" />
              </div>
              <div>
                <h3 class="font-bold text-sm text-stone-800">TCM Assistant</h3>
                <p class="text-xs text-stone-500">{{ isChinese ? '提问中医知识' : 'Ask about TCM' }}</p>
              </div>
            </div>
            <button @click="toggleChat" class="text-stone-400 hover:text-stone-600">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 p-3 md:p-4 overflow-y-auto bg-stone-50/30 space-y-3 min-h-[250px] max-h-[300px]">
            <div v-for="(msg, idx) in chatMessages" :key="idx" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
              <div 
                class="max-w-[85%] rounded-2xl px-3 py-2 md:px-4 md:py-2.5 text-sm leading-relaxed shadow-sm"
                :class="msg.role === 'user' ? 'bg-stone-800 text-white rounded-br-none' : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'"
              >
                {{ isChinese ? (msg.text || msg.textEn) : (msg.textEn || msg.text) }}
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
                class="w-full pl-4 pr-10 py-2 md:py-3 bg-stone-100 border-transparent focus:bg-white focus:border-stone-300 focus:ring-0 rounded-xl text-sm transition-all"
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
        class="w-12 h-12 md:w-14 md:h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 group relative"
      >
        <MessageCircle v-if="!isChatOpen" class="w-5 h-5 md:w-7 md:h-7" />
        <X v-else class="w-5 h-5 md:w-7 md:h-7" />
        
        <!-- Pulse effect -->
        <span v-if="!isChatOpen" class="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3 md:h-4 md:w-4">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-red-500 border-2 border-white"></span>
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

/* Mobile optimizations */
@media (max-width: 768px) {
  aside {
    position: fixed;
    top: 64px;
    left: 0;
    height: calc(100vh - 64px);
    z-index: 40;
  }
}
</style>