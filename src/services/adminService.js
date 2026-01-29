import api from './api';

export const adminService = {
    // Get all orders (Admin only)
    getAllOrders: async () => {
        try {
            const response = await api.get('/api/orders/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update order status (Admin only)
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.put(`/api/orders/${orderId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
