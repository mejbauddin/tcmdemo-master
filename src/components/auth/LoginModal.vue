<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const emit = defineEmits(['close', 'switch-to-register', 'login-success']);

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
    if (!email.value || !password.value) {
        error.value = 'Please fill in all fields';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        await authStore.login({
            email: email.value,
            password: password.value
        });
        emit('login-success');
        emit('close');
    } catch (err) {
        error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
    } finally {
        loading.value = false;
    }
};

const switchToRegister = () => {
    emit('switch-to-register');
};
</script>

<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="$emit('close')">
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative animate-fade-in-up">
            <!-- Close button -->
            <button 
                @click="$emit('close')"
                class="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="Close"
            >
                <span class="text-2xl">&times;</span>
            </button>

            <h2 class="text-2xl font-bold text-stone-800 mb-6 text-center">Login to TCM Learning</h2>

            <!-- Error message -->
            <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
                {{ error }}
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-stone-700 mb-2">Email</label>
                    <input 
                        v-model="email"
                        type="email"
                        required
                        class="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition"
                        placeholder="Enter your email"
                    >
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-stone-700 mb-2">Password</label>
                    <input 
                        v-model="password"
                        type="password"
                        required
                        class="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition"
                        placeholder="Enter your password"
                    >
                </div>

                <button 
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>
            </form>

            <p class="text-center mt-4 text-sm text-stone-600">
                Don't have an account? 
                <button 
                    @click="switchToRegister"
                    class="text-stone-900 font-medium hover:underline focus:outline-none"
                >
                    Register
                </button>
            </p>
        </div>
    </div>
</template>

<style scoped>
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
    animation: fadeInUp 0.3s ease-out;
}
</style>