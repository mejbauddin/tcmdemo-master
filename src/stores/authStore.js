import { defineStore } from 'pinia';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: authService.getCurrentUser(),
        token: authService.getToken(),
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        username: (state) => state.user?.username || 'Guest',
        userId: (state) => state.user?.id || null
    },

    actions: {
        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authService.register(userData);
                this.user = response;
                this.token = response.token;
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authService.login(credentials);
                this.user = response;
                this.token = response.token;
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchProfile() {
            if (!this.token) return;
            try {
                const profile = await authService.getProfile();
                this.user = { ...this.user, ...profile };
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        },

        logout() {
            authService.logout();
            this.user = null;
            this.token = null;
        }
    }
});