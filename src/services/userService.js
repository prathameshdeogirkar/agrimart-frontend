import api from './api';

export const userService = {
    getProfile: async () => {
        try {
            const response = await api.get('/api/users/me');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching profile:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to fetch profile' };
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await api.put('/api/users/me', userData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
        }
    }
};
