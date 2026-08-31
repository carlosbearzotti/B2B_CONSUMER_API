import { state } from '../lib/state.js';
import { toast } from './toast.js';

export const appShell = {
  init() {
    this.setupTabs();
    this.setupTenantPicker();
    this.setupInspector();
  },

  setupTabs() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tabId = item.getAttribute('data-tab');

        navItems.forEach(n => n.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        item.classList.add('active');
        const target = document.getElementById(`tab-${tabId}`);
        if (target) target.classList.add('active');
      });
    });
  },

  setupTenantPicker() {
    const select = document.getElementById('topbarTenantSelect');
    const badge = document.getElementById('activeApiKeyDisplay');

    if (select) {
      select.value = state.state.activeTenant.id;
      if (badge) badge.textContent = state.state.activeTenant.apiKey;

      select.addEventListener('change', (e) => {
        const found = state.state.tenants.find(t => t.id === e.target.value);
        if (found) {
          state.setActiveTenant(found);
          if (badge) badge.textContent = found.apiKey;
          toast.info(`Tenant alternado para ${found.name} (Schema: ${found.id})`);
        }
      });
    }
  },

  setupInspector() {
    const logList = document.getElementById('inspectorLiveLogs');
    state.subscribe('api_inspector', (logs) => {
      if (!logList) return;
      if (!logs || logs.length === 0) {
        logList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.75rem;">Nenhuma chamada interceptada ainda.</div>`;
        return;
      }

      logList.innerHTML = logs.slice(0, 15).map(l => `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--hub-border-card); border-radius: var(--radius-sm); padding: 0.6rem; margin-bottom: 0.4rem; font-family: var(--font-mono); font-size: 0.72rem;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="color: ${l.status >= 200 && l.status < 300 ? 'var(--status-success)' : 'var(--status-danger)'};">${l.method} ${l.endpoint}</strong>
            <span style="color: var(--text-muted);">${l.durationMs}ms</span>
          </div>
          <div style="color: var(--hub-gold-light); margin-top: 0.2rem;">Tenant: ${l.tenant} &bull; HTTP ${l.status}</div>
        </div>
      `).join('');
    });
  }
};
