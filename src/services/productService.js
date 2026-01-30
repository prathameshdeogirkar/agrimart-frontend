import api from './api';

export const productService = {
  // Public endpoints
  getAll: async (page = 0, size = 10, search = '', sort = 'id,desc') => {
    try {
      const queryParams = new URLSearchParams({
        page,
        size,
        sort
      });
      if (search) {
        queryParams.append('search', search);
      }
      const url = `/api/products?${queryParams.toString()}`;
      console.log('API Request:', url);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getAllAdmin: async (page = 0, size = 10, search = '', sort = 'id,desc') => {
    try {
      const queryParams = new URLSearchParams({
        page,
        size,
        sort
      });
      if (search) {
        queryParams.append('search', search);
      }
      const response = await api.get(`/api/products/admin?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  getByCategory: async (category) => {
    try {
      const response = await api.get(`/api/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },



  // Admin-only endpoints
  create: async (productData) => {
    try {
      const response = await api.post('/api/products', productData);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: 'Only administrators can create products' };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create product',
      };
    }
  },

  update: async (id, productData) => {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: 'Only administrators can update products' };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update product',
      };
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      return { success: true };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: 'Only administrators can delete products' };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete product',
      };
    }
  },
};



