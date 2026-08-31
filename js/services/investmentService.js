import { api } from '../lib/api.js';

export const investmentService = {
  getProducts() {
    return api.get('/api/investments/products');
  },

  simulate(params) {
    return api.post('/api/investments/simulate', params);
  },

  apply(productId, amount) {
    return api.post('/api/investments/apply', { productId, amount });
  },

  getMyFunds() {
    return api.get('/api/investments/my-funds');
  }
};
