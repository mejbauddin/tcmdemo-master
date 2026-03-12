import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Create Pinia instance
const pinia = createPinia()

// Create Vue app
const app = createApp(App)

// Use Pinia
app.use(pinia)

// Mount app
app.mount('#app')

// Optional: Add global error handler for development
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
}

// Optional: Add performance marks in development
if (import.meta.env.DEV) {
  performance.mark('app-mounted')
  console.log('App mounted at:', performance.now())
}