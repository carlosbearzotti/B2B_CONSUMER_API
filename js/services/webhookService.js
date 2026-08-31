import { api } from '../lib/api.js';

export const webhookService = {
  getSubscriptions() {
    return api.get('/api/webhooks/subscriptions');
  },

  subscribe(url, eventTypes, secretKey) {
    return api.post('/api/webhooks/subscriptions', { url, eventTypes, secretKey });
  },

  getDeliveries() {
    return api.get('/api/webhooks/deliveries');
  },

  testDispatch(subscriptionId, eventType, samplePayload) {
    return api.post('/api/webhooks/test-dispatch', { subscriptionId, eventType, samplePayload });
  }
};
