<script setup>
import { ref, onMounted } from 'vue';
import { useExerciseStore } from '../../stores/exerciseStore';
import { useAuthStore } from '../../stores/authStore';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
    lessonId: {
        type: Number,
        default: 1
    }
});

const emit = defineEmits(['show-login']);

const exerciseStore = useExerciseStore();
const authStore = useAuthStore();
const exercises = ref([]);
const selectedExercise = ref(null);
const userAnswer = ref('');
const result = ref(null);
const loading = ref(false);
const showResults = ref(false);

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await loadExercises();
    }
});

const loadExercises = async () => {
    exercises.value = await exerciseStore.fetchExercisesByLesson(props.lessonId);
};

const submitAnswer = async (exercise) => {
    if (!userAnswer.value) return;

    loading.value = true;
    result.value = null;

    try {
        result.value = await exerciseStore.submitAnswer(exercise.id, userAnswer.value);
        if (result.value.isCorrect) {
            userAnswer.value = '';
            setTimeout(() => {
                selectedExercise.value = null;
                result.value = null;
            }, 2000);
        }
        await exerciseStore.fetchWrongAnswers();
    } catch (error) {
        console.error('Failed to submit answer:', error);
    } finally {
        loading.value = false;
    }
};

const toggleResults = () => {
    showResults.value = !showResults.value;
};
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-stone-800 font-serif flex items-center gap-2">
                <span>Lesson {{ lessonId }} Exercises</span>
            </h3>
            <button 
                v-if="authStore.isAuthenticated && exerciseStore.wrongAnswers.length > 0"
                @click="toggleResults"
                class="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
                <AlertCircle class="w-4 h-4" />
                {{ showResults ? 'Hide Wrong Answers' : 'Show Wrong Answers' }}
            </button>
        </div>

        <!-- Wrong Answers Summary -->
        <div v-if="showResults && exerciseStore.wrongAnswers.length > 0" class="bg-red-50 rounded-xl p-4 border border-red-100">
            <h4 class="font-bold text-red-800 mb-3">Wrong Answers ({{ exerciseStore.wrongAnswers.length }})</h4>
            <div class="space-y-3 max-h-60 overflow-y-auto">
                <div 
                    v-for="answer in exerciseStore.wrongAnswers" 
                    :key="answer.id"
                    class="bg-white p-3 rounded-lg border border-red-100"
                >
                    <p class="font-medium text-stone-800 mb-1">{{ answer.question_text }}</p>
                    <p class="text-sm text-red-600 mb-1">Your answer: {{ answer.wrong_answer }}</p>
                    <p class="text-sm text-green-600">Correct: {{ answer.correct_answer }}</p>
                </div>
            </div>
        </div>

        <div v-if="!authStore.isAuthenticated" class="bg-yellow-50 p-6 rounded-xl text-center">
            <p class="text-yellow-800 mb-3">Please login to access exercises and track your progress</p>
            <button 
                @click="$emit('show-login')"
                class="bg-stone-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition"
            >
                Login to Continue
            </button>
        </div>

        <div v-else-if="exercises.length === 0" class="text-center py-8 text-stone-400">
            No exercises available for this lesson yet.
        </div>

        <div v-else class="grid gap-4">
            <div 
                v-for="exercise in exercises" 
                :key="exercise.id"
                class="bg-white rounded-xl border border-stone-200 overflow-hidden"
            >
                <div 
                    @click="selectedExercise = selectedExercise === exercise.id ? null : exercise.id"
                    class="p-4 cursor-pointer hover:bg-stone-50 transition flex items-center justify-between"
                >
                    <div>
                        <p class="font-medium text-stone-800">{{ exercise.question_text }}</p>
                        <p class="text-xs text-stone-400 mt-1">Type: {{ exercise.exercise_type }}</p>
                    </div>
                    <div class="text-stone-400">
                        {{ selectedExercise === exercise.id ? '▼' : '▶' }}
                    </div>
                </div>

                <div v-if="selectedExercise === exercise.id" class="p-4 border-t border-stone-100 bg-stone-50">
                    <!-- Multiple Choice Exercise -->
                    <div v-if="exercise.options" class="space-y-3">
                        <div 
                            v-for="option in JSON.parse(exercise.options)" 
                            :key="option"
                            @click="userAnswer = option"
                            class="p-3 bg-white rounded-lg border cursor-pointer hover:border-stone-400 transition"
                            :class="userAnswer === option ? 'border-stone-900 bg-stone-50' : 'border-stone-200'"
                        >
                            {{ option }}
                        </div>
                    </div>

                    <!-- Text Input Exercise -->
                    <div v-else>
                        <input 
                            v-model="userAnswer"
                            type="text"
                            placeholder="Type your answer"
                            class="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none"
                        >
                    </div>

                    <button 
                        @click="submitAnswer(exercise)"
                        :disabled="loading || !userAnswer"
                        class="mt-4 w-full bg-stone-900 text-white py-2 rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50"
                    >
                        {{ loading ? 'Checking...' : 'Submit Answer' }}
                    </button>

                    <!-- Result Message -->
                    <div v-if="result" class="mt-4 p-3 rounded-lg" :class="result.isCorrect ? 'bg-green-50' : 'bg-red-50'">
                        <div class="flex items-center gap-2">
                            <component :is="result.isCorrect ? CheckCircle : XCircle" class="w-5 h-5" :class="result.isCorrect ? 'text-green-600' : 'text-red-600'" />
                            <span :class="result.isCorrect ? 'text-green-700' : 'text-red-700'">
                                {{ result.message }}
                            </span>
                        </div>
                        <p v-if="!result.isCorrect" class="text-sm text-stone-600 mt-2">
                            Correct answer: {{ result.correctAnswer }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>