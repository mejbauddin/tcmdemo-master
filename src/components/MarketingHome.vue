<script setup>
import { ref, computed } from 'vue'
import { 
  BookOpen, 
  Sparkles, 
  Activity, 
  Users, 
  ArrowRight,
  Menu,
  X,
  Github,
  Mail,
  MapPin,
  CheckCircle,
  Languages,
  Brain,
  MessageCircle,
  Gamepad2,
  Video
} from 'lucide-vue-next'

const emit = defineEmits(['start-learning', 'show-login'])

// Mobile menu state
const isMenuOpen = ref(false)

// Language state (false = English, true = Chinese)
const isChinese = ref(false)

// Content dictionary
const content = {
  en: {
    nav: {
      features: 'Features',
      about: 'About',
      contact: 'Contact',
      start: 'Start Learning'
    },
    hero: {
      new: 'New: Interactive Yin-Yang Module',
      title: 'Unlock the Wisdom of Traditional Chinese Medicine',
      subtitle: 'Experience a modern approach to learning ancient TCM concepts. Interactive visualizations, gamified practice, and bilingual support designed for global learners.',
      startBtn: 'Start First Lesson',
      exploreBtn: 'Explore Features'
    },
    features: {
      tag: 'Why Choose Us',
      title: 'A Better Way to Learn TCM',
      subtitle: 'We combine traditional knowledge with modern web technology to create an immersive learning experience.',
      list: [
        {
          title: 'Interactive Visuals',
          desc: 'Understand abstract TCM concepts like Yin-Yang through dynamic, animated SVG illustrations.'
        },
        {
          title: '3D Stereoscopic Learning',
          desc: 'Explore the human body map with interactive hotspots to learn organ functions, meridians, and acupoints.'
        },
        {
          title: 'Bilingual Support',
          desc: 'Seamlessly switch between Chinese and English to master medical terminology with ease.'
        },
        {
          title: 'Adaptive Learning',
          desc: 'Intelligent tracking of learning progress, precise data push based on weak points.'
        },
        {
          title: 'Intelligent Companion System',
          desc: 'Intelligent dialogue floating box for online Q&A, also supports doctor-patient role-playing.'
        },
        {
          title: 'Gamified Exercises',
          desc: 'Consolidate classroom content through fun games, wrong questions automatically added to the wrong question bank.'
        },
        {
          title: 'Animated Micro-classroom',
          desc: 'Animated demonstration of TCM culture, breaking "cultural barriers".'
        }
      ]
    },
    about: {
      title: 'Authentic Knowledge, Modern Delivery',
      desc: 'Our content is derived from standard TCM textbooks like "Comprehensive Textbook of TCM Chinese". We ensure every term, concept, and translation is verified for accuracy.',
      points: [
        'Curriculum based on university standards',
        'Verified by linguistic experts',
        'Accessible design for all learners'
      ],
      preview: {
        title: 'Lesson Preview',
        desc: 'Interactive body map diagnostics'
      }
    },
    footer: {
      desc: 'Empowering global learners with accessible, high-quality Traditional Chinese Medicine education through technology.',
      resources: 'Resources',
      resourcesList: ['Course Catalog', 'Terminology Database', 'Learning Tools'],
      contact: 'Contact',
      rights: '© 2026 TCM Learning. All rights reserved.',
      legal: ['Privacy Policy', 'Terms of Service', 'Accessibility']
    }
  },
  zh: {
    nav: {
      features: '核心功能',
      about: '关于我们',
      contact: '联系方式',
      start: '开始学习'
    },
    hero: {
      new: '新功能：交互式阴阳模块',
      title: '开启中医智慧之旅',
      subtitle: '体验学习古老中医概念的现代方式。交互式可视化、游戏化练习和专为全球学习者设计的双语支持。',
      startBtn: '开始第一课',
      exploreBtn: '探索功能'
    },
    features: {
      tag: '为什么选择我们',
      title: '学习中医的更好方式',
      subtitle: '我们将传统知识与现代网络技术相结合，创造沉浸式的学习体验。',
      list: [
        {
          title: '交互式视觉',
          desc: '通过动态、动画 SVG 插图理解阴阳等抽象的中医概念。'
        },
        {
          title: '3D立体式学习',
          desc: '通过交互式热点探索人体地图，学习脏腑功能和经络穴位。'
        },
        {
          title: '双语支持',
          desc: '无缝切换中英文，轻松掌握医学术语。'
        },
        {
          title: '自适应学习',
          desc: '智能追踪学习情况，根据学习薄弱点进行精准数据推送。'
        },
        {
          title: '智能伴学系统',
          desc: '智能对话悬浮框在线答疑，还可进行医患角色扮演让你足不出户“精准辩证”。'
        },
        {
          title: '游戏化习题',
          desc: '通过趣味性游戏巩固课堂内容，错题自动加入错题库。'
        },
        {
          title: '动画式微课堂',
          desc: '动画形式演示中医文化，打破“文化壁垒”。'
        }
      ]
    },
    about: {
      title: '权威知识，现代演绎',
      desc: '我们的内容参考《中医汉语综合教程》等标准教材。确保每一个术语、概念和翻译都经过准确性验证。',
      points: [
        '基于大学标准的课程设置',
        '语言专家验证',
        '适合所有学习者的无障碍设计'
      ],
      preview: {
        title: '课程预览',
        desc: '交互式人体地图诊断'
      }
    },
    footer: {
      desc: '通过技术赋能全球学习者，提供无障碍、高质量的中医教育。',
      resources: '资源',
      resourcesList: ['课程目录', '术语数据库', '学习工具'],
      contact: '联系我们',
      rights: '© 2026 智启岐黄 TCM Learning. 保留所有权利。',
      legal: ['隐私政策', '服务条款', '无障碍声明']
    }
  }
}

const t = computed(() => isChinese.value ? content.zh : content.en)

const featuresList = [
  {
    icon: Sparkles,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    icon: Activity,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    icon: MessageCircle,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    icon: Gamepad2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    icon: Video,
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  }
]

// Hero section image URL
const heroPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d6d3d1' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleLanguage = () => {
  isChinese.value = !isChinese.value
}

const startLearning = () => {
  emit('start-learning')
}

const showLogin = () => {
  emit('show-login')
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-red-100 selection:text-red-900">
    
    <!-- Navigation -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" @click="startLearning">
            <div class="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center relative overflow-hidden border border-stone-200">
              <div class="absolute inset-0 bg-gradient-to-br from-stone-800 to-black"></div>
              <span class="text-white font-serif font-bold text-xs relative z-10">TCM</span>
            </div>
            <span class="font-serif font-bold text-xl tracking-tight text-stone-800">
              智启岐黄 <span class="text-stone-400 font-sans font-normal text-sm ml-1 hidden sm:inline">TCM Learning</span>
            </span>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-stone-600 hover:text-stone-900 font-medium transition-colors">{{ t.nav.features }}</a>
            <a href="#about" class="text-stone-600 hover:text-stone-900 font-medium transition-colors">{{ t.nav.about }}</a>
            <a href="#contact" class="text-stone-600 hover:text-stone-900 font-medium transition-colors">{{ t.nav.contact }}</a>
            
            <!-- Language Toggle -->
            <button 
              @click="toggleLanguage"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 hover:border-red-600 hover:text-red-600 transition-colors text-sm"
              :aria-label="isChinese ? 'Switch to English' : 'Switch to Chinese'"
            >
              <Languages class="w-4 h-4" />
              <span>{{ isChinese ? 'EN' : '中' }}</span>
            </button>

            <!-- Login Button (NEW) -->
            <button 
              @click="showLogin"
              class="text-stone-600 hover:text-stone-900 font-medium transition-colors"
            >
              {{ isChinese ? '登录' : 'Login' }}
            </button>

            <button 
              @click="startLearning"
              class="bg-stone-900 text-white px-5 py-2 rounded-full font-medium hover:bg-stone-800 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {{ t.nav.start }}
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <div class="flex md:hidden items-center gap-4">
             <!-- Mobile Language Toggle -->
             <button 
              @click="toggleLanguage"
              class="flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-stone-300 text-xs"
            >
              <Languages class="w-3.5 h-3.5" />
              <span>{{ isChinese ? 'EN' : '中' }}</span>
            </button>

            <button 
              @click="toggleMenu"
              class="text-stone-500 hover:text-stone-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-200"
              aria-label="Toggle menu"
            >
              <Menu v-if="!isMenuOpen" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMenuOpen" class="md:hidden bg-white border-b border-stone-200 shadow-lg">
          <div class="px-4 pt-2 pb-6 space-y-2">
            <a href="#features" @click="isMenuOpen = false" class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50">{{ t.nav.features }}</a>
            <a href="#about" @click="isMenuOpen = false" class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50">{{ t.nav.about }}</a>
            <a href="#contact" @click="isMenuOpen = false" class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50">{{ t.nav.contact }}</a>
            
            <!-- Mobile Login Button (NEW) -->
            <button 
              @click="showLogin(); isMenuOpen = false"
              class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50"
            >
              {{ isChinese ? '登录' : 'Login' }}
            </button>
            
            <button 
              @click="startLearning"
              class="w-full mt-4 bg-stone-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              {{ t.nav.start }}
            </button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-40" :style="{ backgroundImage: `url(${heroPattern})` }"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-medium mb-8 border border-red-100 animate-fade-in-up">
          <span class="flex h-2 w-2 rounded-full bg-red-600"></span>
          {{ t.hero.new }}
        </div>
        
        <h1 class="text-4xl md:text-6xl font-serif font-bold text-stone-900 tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
           {{ isChinese ? '开启中医智慧之旅' : 'Unlock the Wisdom of' }} <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-stone-800 via-stone-600 to-stone-800">
            {{ isChinese ? '' : 'Traditional Chinese Medicine' }}
          </span>
        </h1>
        
        <p class="mt-4 max-w-2xl mx-auto text-xl text-stone-600 mb-10 animate-fade-in-up delay-200">
          {{ t.hero.subtitle }}
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
          <button 
            @click="startLearning"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-full text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {{ t.hero.startBtn }}
            <ArrowRight class="w-5 h-5" />
          </button>
          <a 
            href="#features"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-full text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition-all"
          >
            {{ t.hero.exploreBtn }}
          </a>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-base text-red-600 font-semibold tracking-wide uppercase">{{ t.features.tag }}</h2>
          <p class="mt-2 text-3xl leading-8 font-serif font-bold tracking-tight text-stone-900 sm:text-4xl">
            {{ t.features.title }}
          </p>
          <p class="mt-4 max-w-2xl text-xl text-stone-500 mx-auto">
            {{ t.features.subtitle }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div 
            v-for="(feature, index) in featuresList" 
            :key="index"
            class="relative p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow duration-300 group"
          >
            <div 
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
              :class="[feature.bg, feature.color]"
            >
              <component :is="feature.icon" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-stone-900 mb-3">{{ t.features.list[index].title }}</h3>
            <p class="text-stone-600 leading-relaxed">
              {{ t.features.list[index].desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About / Trust Section -->
    <section id="about" class="py-20 bg-stone-50 border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div class="mb-10 lg:mb-0">
            <h2 class="text-3xl font-serif font-bold text-stone-900 mb-6" v-html="t.about.title.replace(',', '<br />')">
            </h2>
            <p class="text-lg text-stone-600 mb-6 leading-relaxed">
              {{ t.about.desc }}
            </p>
            <ul class="space-y-4">
              <li v-for="(point, idx) in t.about.points" :key="idx" class="flex items-start gap-3">
                <CheckCircle class="w-6 h-6 text-green-600 shrink-0" />
                <span class="text-stone-700">{{ point }}</span>
              </li>
            </ul>
          </div>
          <div class="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-xl bg-stone-200 flex items-center justify-center group">
            <!-- Placeholder for a real image - Using a semantic SVG representation -->
             <svg class="w-full h-full text-stone-300 group-hover:scale-105 transition-transform duration-700" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <rect width="400" height="300" fill="#e7e5e4" />
                <circle cx="200" cy="150" r="80" fill="#d6d3d1" />
                <path d="M200 70 C244 70 280 106 280 150 C280 194 244 230 200 230 C156 230 120 194 120 150 C120 106 156 70 200 70 Z" fill="white" fill-opacity="0.5" />
                <path d="M200 70 C178 70 160 106 160 150 C160 194 178 230 200 230" stroke="#a8a29e" stroke-width="2" fill="none" />
                <path d="M200 70 C222 70 240 106 240 150 C240 194 222 230 200 230" stroke="#a8a29e" stroke-width="2" fill="none" />
                <line x1="120" y1="150" x2="280" y2="150" stroke="#a8a29e" stroke-width="2" />
             </svg>
             <div class="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl border border-stone-200">
               <div class="font-bold text-stone-900">{{ t.about.preview.title }}</div>
               <div class="text-sm text-stone-500">{{ t.about.preview.desc }}</div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="bg-stone-900 text-stone-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4 text-white">
              <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                 <div class="absolute inset-0 bg-stone-900 rounded-full scale-50"></div>
              </div>
              <span class="font-serif font-bold text-xl">智启岐黄 TCM Learning</span>
            </div>
            <p class="text-sm leading-relaxed max-w-xs mb-6">
              {{ t.footer.desc }}
            </p>
            <div class="flex gap-4">
              <a href="#" class="hover:text-white transition-colors" aria-label="Github">
                <Github class="w-5 h-5" />
              </a>
              <a href="#" class="hover:text-white transition-colors" aria-label="Email">
                <Mail class="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="text-white font-bold mb-4">{{ t.footer.resources }}</h3>
            <ul class="space-y-2 text-sm">
              <li v-for="(item, idx) in t.footer.resourcesList" :key="idx">
                <a href="#" class="hover:text-white transition-colors">{{ item }}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-white font-bold mb-4">{{ t.footer.contact }}</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <Mail class="w-4 h-4" />
                <span>support@tcmlearning.demo</span>
              </li>
              <li class="flex items-center gap-2">
                <MapPin class="w-4 h-4" />
                <span>Yunnan University, China</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>{{ t.footer.rights }}</p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a v-for="(item, idx) in t.footer.legal" :key="idx" href="#" class="hover:text-white transition-colors">{{ item }}</a>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0; /* Start hidden */
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}
</style>