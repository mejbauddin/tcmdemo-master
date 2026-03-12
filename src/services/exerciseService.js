import api from './api';

export const exerciseService = {
    async getAllExercises() {
        try {
            const response = await api.get('/exercises');
            return response.data;
        } catch (error) {
            console.error('Error in getAllExercises:', error);
            throw error;
        }
    },

    async getExercisesByLesson(lessonId) {
        try {
            const response = await api.get(`/exercises/lesson/${lessonId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getExercisesByLesson:', error);
            throw error;
        }
    },

    async submitAnswer(exerciseId, answer) {
        try {
            const response = await api.post('/exercises/submit', { 
                exerciseId, 
                answer: answer.toString().toLowerCase().trim() 
            });
            return response.data;
        } catch (error) {
            console.error('Error in submitAnswer:', error);
            throw error;
        }
    },

    async getWrongAnswers() {
        try {
            const response = await api.get('/exercises/wrong-answers');
            return response.data;
        } catch (error) {
            console.error('Error in getWrongAnswers:', error);
            throw error;
        }
    }
};