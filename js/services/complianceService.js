import { api } from '../lib/api.js';

export const complianceService = {
  exportData(userId = 1) {
    return api.get(`/api/compliance/export-data?userId=${userId}`);
  },

  anonymize(userId, reason) {
    return api.post('/api/compliance/anonymize', { userId, reason });
  },

  getAuditLogs() {
    return api.get('/api/compliance/audit-logs');
  }
};
