<script setup>
import { useAuthStore } from '../../stores/authStore';
import { useExerciseStore } from '../../stores/exerciseStore';
import { ref, onMounted } from 'vue';
import { User, Mail, Calendar, BookOpen, AlertCircle, X, LogOut } from 'lucide-vue-next';

const emit = defineEmits(['close', 'logout']);
const authStore = useAuthStore();
const exerciseStore = useExerciseStore();
const showWrongAnswers = ref(false);

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await exerciseStore.fetchWrongAnswers();
    }
});

const handleLogout = () => {
    authStore.logout();
    emit('logout');
    emit('close');
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>

<template>
    <div class="bg-white rounded-2xl p-6 shadow-xl border border-stone-200 relative">
        <!-- Close button -->
        <button 
            @click="$emit('close')"
            class="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
        >
            <X class="w-5 h-5" />
        </button>

        <div class="flex items-center justify-between mb-6 pr-8">
            <h2 class="text-xl font-bold text-stone-800 font-serif">My Profile</h2>
            <button 
                @click="handleLogout"
                class="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
                <LogOut class="w-4 h-4" />
                Logout
            </button>
        </div>

        <div class="space-y-4">
            <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <User class="w-5 h-5 text-stone-500" />
                <div>
                    <p class="text-sm text-stone-500">Username</p>
                    <p class="font-medium text-stone-800">{{ authStore.user?.username || 'N/A' }}</p>
                </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <Mail class="w-5 h-5 text-stone-500" />
                <div>
                    <p class="text-sm text-stone-500">Email</p>
                    <p class="font-medium text-stone-800">{{ authStore.user?.email || 'N/A' }}</p>
                </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <Calendar class="w-5 h-5 text-stone-500" />
                <div>
                    <p class="text-sm text-stone-500">Member Since</p>
                    <p class="font-medium text-stone-800">
                        {{ formatDate(authStore.user?.created_at) }}
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <BookOpen class="w-5 h-5 text-stone-500" />
                <div>
                    <p class="text-sm text-stone-500">Total Exercises</p>
                    <p class="font-medium text-stone-800">{{ exerciseStore.exercises.length || 0 }}</p>
                </div>
            </div>
        </div>

        <!-- Wrong Answers Section -->
        <div class="mt-8">
            <button 
                @click="showWrongAnswers = !showWrongAnswers"
                class="flex items-center justify-between w-full p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition"
            >
                <div class="flex items-center gap-2">
                    <AlertCircle class="w-5 h-5 text-red-500" />
                    <span class="font-medium text-stone-800">Wrong Answers</span>
                </div>
                <span class="text-sm text-stone-500">{{ exerciseStore.wrongAnswers.length }}</span>
            </button>

            <div v-if="showWrongAnswers" class="mt-4 space-y-3 max-h-64 overflow-y-auto">
                <div 
                    v-for="answer in exerciseStore.wrongAnswers" 
                    :key="answer.id"
                    class="p-3 bg-red-50 rounded-lg border border-red-100"
                >
                    <p class="font-medium text-stone-800 mb-1">{{ answer.question_text }}</p>
                    <p class="text-sm text-red-600 mb-1">Your answer: {{ answer.wrong_answer }}</p>
                    <p class="text-sm text-green-600">Correct: {{ answer.correct_answer }}</p>
                    <p class="text-xs text-stone-400 mt-2">
                        Attempts: {{ answer.attempt_count }} | Last: {{ formatDate(answer.last_attempt) }}
                    </p>
                </div>

                <div v-if="exerciseStore.wrongAnswers.length === 0" class="text-center py-4 text-stone-500">
                    No wrong answers yet. Keep practicing!
                </div>
            </div>
        </div>
    </div>
</template>