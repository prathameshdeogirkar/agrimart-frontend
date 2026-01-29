import api from './api';

export const orderService = {
  checkout: async (checkoutData) => {
    try {
      const response = await api.post('/api/orders/checkout', checkoutData);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        console.error('Forbidden error details:', error.response.data);
      }
      const errorMessage = error.response?.data?.message || 'Checkout failed';
      console.error('Checkout error message:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  getOrders: async () => {
    try {
      const response = await api.get('/api/orders');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        error: 'Failed to fetch orders'
      };
    }
  },

  downloadInvoice: async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Download invoice error:', error);
      return {
        success: false,
        error: 'Failed to download invoice'
      };
    }
  },
};



