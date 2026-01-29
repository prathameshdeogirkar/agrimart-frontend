import api from './api';

export const paymentService = {
    // Create Razorpay Order
    createOrder: async () => {
        try {
            const response = await api.post('/api/payment/create-order');
            if (response.data.status === 'created') {
                return {
                    orderId: response.data.orderId,
                    amount: response.data.amount,
                    currency: response.data.currency,
                    keyId: response.data.keyId,
                };
            } else {
                // If the backend returns a map (which it does), handle it directly
                // PaymentController returns: Map.of("orderId", ..., "keyId", ...)
                // It does NOT return { status: 'created', ... } structure wrapped like that unless I look at the controller again.
                // Let's re-verify the controller return value.
                // Controller: return ResponseEntity.ok(response);
                // Service: return Map.of("orderId", ...);
                // So response.data IS the map. It does NOT have a 'status' field.

                // Wait, I should verify the Controller return structure first to be safe.

                return {
                    orderId: response.data.orderId,
                    amount: response.data.amount,
                    currency: response.data.currency,
                    keyId: response.data.keyId,
                };
            }
        } catch (error) {
            throw error.response?.data?.message || 'Error creating payment order';
        }
    },

    // Verify Payment Signature
    verifyPayment: async (data) => {
        try {
            const response = await api.post('/api/payment/verify-payment', data);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Payment verification failed',
            };
        }
    },
};
