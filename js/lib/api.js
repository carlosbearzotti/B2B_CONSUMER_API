import { config } from './config.js';
import { state } from './state.js';

/**
 * Cliente HTTP para o Backoffice com injeção dinâmica de X-API-Key do Tenant
 */
export const api = {
  async request(endpoint, options = {}) {
    const url = `${config.API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    const activeKey = state.state.activeTenant?.apiKey || 'fintech-startup-key-12345';

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': activeKey,
      ...options.headers
    };

    const startTime = performance.now();

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      const durationMs = Math.round(performance.now() - startTime);

      let data = null;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = text;
      }

      state.logApiRequest({
        timestamp: new Date().toLocaleTimeString(),
        method,
        endpoint,
        status: res.status,
        durationMs,
        requestBody: options.body,
        responseBody: data,
        tenant: state.state.activeTenant?.name
      });

      if (!res.ok) {
        const error = new Error((data && data.message) || `Erro HTTP ${res.status}`);
        error.status = res.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (!err.status) {
        state.logApiRequest({
          timestamp: new Date().toLocaleTimeString(),
          method,
          endpoint,
          status: 0,
          durationMs: Math.round(performance.now() - startTime),
          requestBody: options.body,
          responseBody: { error: err.message },
          tenant: state.state.activeTenant?.name
        });
      }
      throw err;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};
