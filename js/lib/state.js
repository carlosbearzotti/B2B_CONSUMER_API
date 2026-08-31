import { config } from './config.js';

/**
 * Global Reactive Store com padrão Pub/Sub (Cortex Architecture)
 */
class HubStore {
  constructor() {
    this.state = {
      activeTenant: this.loadPersistedTenant(),
      tenants: [...config.DEFAULT_TENANTS],
      kpis: {
        totalEncryptedVolume: 1248950.00,
        aesTransactionsCount: 142,
        activeFraudAlerts: 2,
        activeWebhooksCount: 3,
        totalInvestedVolume: 350000.00,
        pendingTransfersCount: 4
      },
      fraudAlerts: [],
      investmentProducts: [],
      myInvestments: [],
      webhookSubscriptions: [],
      webhookDeliveries: [],
      scheduledTransfers: [],
      auditLogs: [],
      apiInspectorLogs: []
    };

    this.listeners = new Map();
  }

  loadPersistedTenant() {
    try {
      const saved = localStorage.getItem('hub_active_tenant');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return config.DEFAULT_TENANTS[0];
  }

  setActiveTenant(tenant) {
    this.state.activeTenant = tenant;
    try {
      localStorage.setItem('hub_active_tenant', JSON.stringify(tenant));
    } catch (e) {}
    this.notify('tenant', tenant);
  }

  updateState(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  logApiRequest(entry) {
    this.state.apiInspectorLogs.unshift(entry);
    if (this.state.apiInspectorLogs.length > 50) this.state.apiInspectorLogs.pop();
    this.notify('api_inspector', this.state.apiInspectorLogs);
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const list = this.listeners.get(event) || [];
      this.listeners.set(event, list.filter(cb => cb !== callback));
    };
  }

  notify(event, data) {
    const list = this.listeners.get(event);
    if (list) list.forEach(cb => cb(data, this.state));
  }
}

export const state = new HubStore();
