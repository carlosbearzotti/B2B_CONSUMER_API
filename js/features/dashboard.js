import { state } from '../lib/state.js';
import { utils } from '../lib/utils.js';

export const dashboardFeature = {
  init() {
    state.subscribe('tenant', () => this.refresh());
    state.subscribe('kpis', () => this.renderKPIs());
    this.renderKPIs();
  },

  renderKPIs() {
    const k = state.state.kpis;
    const t = state.state.activeTenant;

    const elVol = document.getElementById('kpiEncryptedVolume');
    const elTx = document.getElementById('kpiAesTxCount');
    const elFraud = document.getElementById('kpiFraudAlerts');
    const elWh = document.getElementById('kpiActiveWebhooks');
    const elTenantBadge = document.getElementById('currentTenantPlanBadge');

    if (elVol) elVol.textContent = utils.formatBRL(k.totalEncryptedVolume);
    if (elTx) elTx.textContent = `${k.aesTransactionsCount} txs`;
    if (elFraud) elFraud.textContent = `${k.activeFraudAlerts} retidas`;
    if (elWh) elWh.textContent = `${k.activeWebhooksCount} ativos`;
    if (elTenantBadge && t) elTenantBadge.textContent = t.plan;
  },

  refresh() {
    this.renderKPIs();
  }
};
