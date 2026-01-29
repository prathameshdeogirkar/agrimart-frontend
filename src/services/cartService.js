import api from './api';

export const cartService = {
  addToCart: async (productId, quantity) => {
    try {
      const response = await api.post(`/api/cart/add?productId=${productId}&quantity=${quantity}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: 'Only logged-in users can add to cart' };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  },

  getCart: async () => {
    try {
      const response = await api.get('/api/cart');
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: 'Only logged-in users can view cart' };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch cart',
      };
    }
  },

  removeFromCart: async (cartId) => {
    try {
      await api.delete(`/api/cart/${cartId}`);
      return { success: true };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: 'Only logged-in users can modify cart' };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove from cart',
      };
    }
  },

  // Update cart item quantity - Frontend handles optimistic update,
  // this syncs the new quantity with backend
  updateCartQuantity: async (cartId, quantity) => {
    try {
      const response = await api.put(`/api/cart/${cartId}?quantity=${quantity}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: 'Only logged-in users can modify cart' };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update cart quantity',
      };
    }
  },
};



