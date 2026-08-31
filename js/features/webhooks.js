import { webhookService } from '../services/webhookService.js';
import { utils } from '../lib/utils.js';
import { toast } from '../ui/toast.js';

export const webhooksFeature = {
  init() {
    this.setupSubscribeForm();
    this.setupTestDispatch();
    this.loadSubscriptions();
    this.loadDeliveries();
  },

  async loadSubscriptions() {
    const list = document.getElementById('webhookSubsList');
    const select = document.getElementById('dispatchWebhookSelect');
    if (!list) return;

    try {
      const subs = await webhookService.getSubscriptions();
      if (!subs || subs.length === 0) {
        list.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">Nenhum webhook registrado. Cadastre um endpoint abaixo.</div>`;
        return;
      }

      list.innerHTML = subs.map(s => `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--hub-border-card); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <strong style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--hub-gold-light);">${s.url}</strong>
            <span class="badge badge-emerald">${s.status}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Eventos: <code>${s.eventTypes}</code></div>
          <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">Segredo HMAC: ${s.secretKey}</div>
        </div>
      `).join('');

      if (select) {
        select.innerHTML = subs.map(s => `<option value="${s.id}">${s.url} (${s.eventTypes})</option>`).join('');
      }
    } catch (err) {
      console.warn('Erro ao carregar webhooks:', err);
    }
  },

  async loadDeliveries() {
    const tbody = document.getElementById('webhookDeliveriesTableBody');
    if (!tbody) return;

    try {
      const deliveries = await webhookService.getDeliveries();
      if (!deliveries || deliveries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum disparo de webhook registrado.</td></tr>`;
        return;
      }

      tbody.innerHTML = deliveries.map(d => `
        <tr>
          <td><span class="badge badge-cyan">${d.eventType}</span></td>
          <td><span class="badge ${d.success ? 'badge-emerald' : 'badge-danger'}">HTTP ${d.statusCode}</span></td>
          <td style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-gold); max-width: 180px; overflow: hidden; text-overflow: ellipsis;">${d.signature || '-'}</td>
          <td style="font-family: var(--font-mono); font-size: 0.72rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${d.payload}</td>
          <td style="font-size: 0.75rem;">${utils.formatDate(d.createdAt)}</td>
        </tr>
      `).join('');
    } catch (err) {
      console.warn('Erro ao carregar entregas:', err);
    }
  },

  setupSubscribeForm() {
    const form = document.getElementById('webhookSubscribeForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = document.getElementById('whUrl').value;
      const eventTypes = document.getElementById('whEvents').value;
      const secretKey = document.getElementById('whSecret').value;

      try {
        await webhookService.subscribe(url, eventTypes, secretKey);
        toast.success('Endpoint de Webhook cadastrado com chave HMAC-SHA256!');
        form.reset();
        this.loadSubscriptions();
      } catch (err) {
        toast.error(`Erro ao cadastrar webhook: ${err.message}`);
      }
    });
  },

  setupTestDispatch() {
    const form = document.getElementById('webhookTestDispatchForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subscriptionId = parseInt(document.getElementById('dispatchWebhookSelect').value);
      const eventType = document.getElementById('dispatchEventType').value;

      try {
        toast.info('Assinando payload com HMAC-SHA256 e disparando...');
        const res = await webhookService.testDispatch(subscriptionId, eventType);
        toast.success(`Notificação entregue com sucesso! Assinatura: ${res.signature.substring(0, 20)}...`);
        this.loadDeliveries();
      } catch (err) {
        toast.error(`Erro ao disparar webhook: ${err.message}`);
      }
    });
  }
};
