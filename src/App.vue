<script setup>
import { ref } from 'vue'
import { useAuthStore } from './stores/authStore'
import TCMHome from './components/TCMHome.vue'
import MarketingHome from './components/MarketingHome.vue'
import LoginModal from './components/auth/LoginModal.vue'
import RegisterModal from './components/auth/RegisterModal.vue'

const authStore = useAuthStore()
const currentView = ref('landing')
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const navigateToCourse = () => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    showRegisterModal.value = false
  } else {
    currentView.value = 'course'
  }
}

const handleLoginSuccess = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
  currentView.value = 'course'
}

const handleRegisterSuccess = () => {
  showRegisterModal.value = false
  showLoginModal.value = false
  currentView.value = 'course'
}

const handleShowLogin = () => {
  showLoginModal.value = true
  showRegisterModal.value = false
}

const handleShowRegister = () => {
  showRegisterModal.value = true
  showLoginModal.value = false
}

const handleCloseModals = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const handleLogout = () => {
  currentView.value = 'landing'
}
</script>

<template>
  <div class="antialiased text-stone-900 bg-stone-50 min-h-screen">
    <transition name="fade" mode="out-in">
      <MarketingHome 
        v-if="currentView === 'landing'" 
        @start-learning="navigateToCourse"
        @show-login="handleShowLogin"
      />
      <TCMHome 
        v-else 
        @logout="handleLogout"
      />
    </transition>

    <!-- Login Modal -->
    <LoginModal 
      v-if="showLoginModal" 
      @close="handleCloseModals"
      @switch-to-register="switchToRegister"
      @login-success="handleLoginSuccess"
    />

    <!-- Register Modal -->
    <RegisterModal 
      v-if="showRegisterModal" 
      @close="handleCloseModals"
      @switch-to-login="switchToLogin"
      @register-success="handleRegisterSuccess"
    />
  </div>
</template>

<style>
/* Global Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for the whole app */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>