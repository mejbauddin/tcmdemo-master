import { defineStore } from 'pinia';
import { exerciseService } from '../services/exerciseService';

export const useExerciseStore = defineStore('exercise', {
    state: () => ({
        exercises: [],
        currentExercise: null,
        wrongAnswers: [],
        loading: false,
        error: null
    }),

    getters: {
        getExercisesByLesson: (state) => (lessonId) => {
            return state.exercises.filter(e => e.lesson_id === lessonId);
        },
        getWrongAnswersCount: (state) => state.wrongAnswers.length
    },

    actions: {
        async fetchExercises() {
            this.loading = true;
            this.error = null;
            try {
                this.exercises = await exerciseService.getAllExercises();
                console.log('✅ Exercises loaded:', this.exercises.length);
            } catch (error) {
                console.error('❌ Failed to fetch exercises:', error);
                this.error = error.response?.data?.message || 'Failed to fetch exercises';
            } finally {
                this.loading = false;
            }
        },

        async fetchExercisesByLesson(lessonId) {
            this.loading = true;
            this.error = null;
            try {
                const exercises = await exerciseService.getExercisesByLesson(lessonId);
                console.log(`✅ Exercises for lesson ${lessonId}:`, exercises.length);
                return exercises;
            } catch (error) {
                console.error('❌ Failed to fetch exercises:', error);
                this.error = error.response?.data?.message || 'Failed to fetch exercises';
                return [];
            } finally {
                this.loading = false;
            }
        },

        async submitAnswer(exerciseId, answer) {
            this.loading = true;
            this.error = null;
            try {
                const result = await exerciseService.submitAnswer(exerciseId, answer);
                console.log('✅ Answer submitted:', result);
                
                // Refresh wrong answers if answer was wrong
                if (!result.isCorrect) {
                    await this.fetchWrongAnswers();
                } else {
                    // Remove from wrong answers if it was there
                    this.wrongAnswers = this.wrongAnswers.filter(wa => wa.exercise_id !== exerciseId);
                }
                
                return result;
            } catch (error) {
                console.error('❌ Failed to submit answer:', error);
                this.error = error.response?.data?.message || 'Failed to submit answer';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchWrongAnswers() {
            this.loading = true;
            this.error = null;
            try {
                this.wrongAnswers = await exerciseService.getWrongAnswers();
                console.log('✅ Wrong answers loaded:', this.wrongAnswers.length);
            } catch (error) {
                console.error('❌ Failed to fetch wrong answers:', error);
                this.error = error.response?.data?.message || 'Failed to fetch wrong answers';
            } finally {
                this.loading = false;
            }
        },

        clearWrongAnswers() {
            this.wrongAnswers = [];
        }
    }
});