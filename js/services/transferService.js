import { api } from '../lib/api.js';

export const transferService = {
  getScheduled() {
    return api.get('/api/transfers/scheduled');
  },

  schedule(data) {
    return api.post('/api/transfers/schedule', data);
  },

  cancel(id) {
    return api.delete(`/api/transfers/schedule/${id}`);
  }
};
