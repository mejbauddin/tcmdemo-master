import api from './api';

export const voiceService = {
    async submitVoiceAssessment(exerciseId, audioFile, expectedText = null) {
        try {
            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('exerciseId', exerciseId);
            if (expectedText) {
                formData.append('expectedText', expectedText);
            }

            const response = await api.post('/voice/assess', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000 // 30 seconds for voice processing
            });
            
            console.log('✅ Voice assessment submitted:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Voice assessment error:', error);
            throw error;
        }
    },

    async getVoiceAssessments() {
        try {
            const response = await api.get('/voice/assessments');
            return response.data;
        } catch (error) {
            console.error('❌ Failed to get voice assessments:', error);
            throw error;
        }
    }
};