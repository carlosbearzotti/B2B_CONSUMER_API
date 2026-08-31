import { toast } from '../ui/toast.js';

export const billingFeature = {
  init() {
    this.cacheDom();
    this.bindEvents();
    this.renderInvoices();
  },

  cacheDom() {
    this.invoicesTableBody = document.getElementById('invoicesTableBody');
    this.btnExportConsolidated = document.getElementById('btnExportConsolidatedBilling');
    this.btnUpgradePlan = document.getElementById('btnUpgradePlan');
  },

  invoices: [
    {
      id: 'INV-2026-08',
      period: '01/08/2026 a 31/08/2026',
      totalCalls: '1.420.000 reqs',
      amount: 'R$ 14.850,00',
      dueDate: '10/09/2026',
      status: 'PENDING'
    },
    {
      id: 'INV-2026-07',
      period: '01/07/2026 a 31/07/2026',
      totalCalls: '1.290.400 reqs',
      amount: 'R$ 13.420,00',
      dueDate: '10/08/2026',
      status: 'PAID'
    },
    {
      id: 'INV-2026-06',
      period: '01/06/2026 a 30/06/2026',
      totalCalls: '1.150.000 reqs',
      amount: 'R$ 12.100,00',
      dueDate: '10/07/2026',
      status: 'PAID'
    }
  ],

  bindEvents() {
    if (this.btnExportConsolidated) {
      this.btnExportConsolidated.addEventListener('click', () => {
        toast.success('Dossiê financeiro consolidado gerado! Iniciando download (CNAB 240 / PDF)...');
      });
    }

    if (this.btnUpgradePlan) {
      this.btnUpgradePlan.addEventListener('click', () => {
        toast.info('Solicitação de upgrade para Tier Enterprise Custom enviada ao Account Manager!');
      });
    }
  },

  renderInvoices() {
    if (!this.invoicesTableBody) return;

    this.invoicesTableBody.innerHTML = this.invoices.map(inv => `
      <tr>
        <td>
          <strong style="color: var(--text-main); font-family: var(--font-mono);">${inv.id}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${inv.period}</div>
        </td>
        <td>${inv.totalCalls}</td>
        <td><strong style="color: var(--hub-gold-light); font-size: 1.05rem;">${inv.amount}</strong></td>
        <td>${inv.dueDate}</td>
        <td>
          <span class="badge ${inv.status === 'PAID' ? 'badge-emerald' : 'badge-gold'}">
            ${inv.status === 'PAID' ? '✓ Quitado' : '⏱️ Aguardando Vencimento'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;" onclick="window.billingModule.downloadInvoice('${inv.id}', 'PDF')">
              📄 PDF
            </button>
            <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;" onclick="window.billingModule.downloadInvoice('${inv.id}', 'CNAB')">
              💾 CNAB 240
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  downloadInvoice(id, format) {
    toast.success(`Download da fatura ${id} no formato ${format} concluído!`);
  }
};

window.billingModule = billingFeature;
