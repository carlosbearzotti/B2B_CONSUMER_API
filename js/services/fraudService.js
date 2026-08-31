import { api } from '../lib/api.js';

export const fraudService = {
  getAlerts(status) {
    const q = status ? `?status=${status}` : '';
    return api.get(`/api/fraud/alerts${q}`);
  },

  evaluate(data) {
    return api.post('/api/fraud/evaluate', data);
  },

  review(alertId, decision, reviewerName = 'Admin BackOffice') {
    return api.post(`/api/fraud/review/${alertId}`, { decision, reviewerName });
  },

  updateRules(rules) {
    return api.put('/api/fraud/rules', rules);
  }
};
