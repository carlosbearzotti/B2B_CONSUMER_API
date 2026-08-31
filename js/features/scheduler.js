import { transferService } from '../services/transferService.js';
import { utils } from '../lib/utils.js';
import { toast } from '../ui/toast.js';

export const schedulerFeature = {
  init() {
    this.setupScheduleForm();
    this.loadTransfers();
  },

  async loadTransfers() {
    const tbody = document.getElementById('scheduledTransfersTableBody');
    if (!tbody) return;

    try {
      const transfers = await transferService.getScheduled();
      if (!transfers || transfers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum agendamento pendente no momento.</td></tr>`;
        return;
      }

      tbody.innerHTML = transfers.map(t => `
        <tr>
          <td><strong style="color: var(--text-main);">${t.recipientName}</strong></td>
          <td><code>${t.recipientDocument}</code></td>
          <td><strong>${utils.formatBRL(t.amount)}</strong></td>
          <td><span class="badge badge-purple">${t.transferType}</span></td>
          <td><strong style="color: var(--hub-gold-light);">${t.scheduledFor}</strong></td>
          <td><span class="badge ${t.status === 'SCHEDULED' ? 'badge-gold' : (t.status === 'EXECUTED' ? 'badge-emerald' : 'badge-danger')}">${t.status}</span></td>
          <td>
            ${t.status === 'SCHEDULED' ? `<button class="btn btn-danger btn-sm" onclick="window.cancelTransfer(${t.id})">Cancelar</button>` : '-'}
          </td>
        </tr>
      `).join('');

      window.cancelTransfer = async (id) => {
        try {
          await transferService.cancel(id);
          toast.info('Agendamento cancelado com sucesso.');
          this.loadTransfers();
        } catch (err) {
          toast.error(`Erro ao cancelar: ${err.message}`);
        }
      };
    } catch (err) {
      console.warn('Erro ao carregar agendamentos:', err);
    }
  },

  setupScheduleForm() {
    const form = document.getElementById('scheduleTransferForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const recipientName = document.getElementById('schedName').value;
      const recipientDocument = document.getElementById('schedDoc').value;
      const amount = parseFloat(document.getElementById('schedAmount').value);
      const transferType = document.getElementById('schedType').value;
      const scheduledFor = document.getElementById('schedDate').value;

      try {
        await transferService.schedule({ recipientName, recipientDocument, amount, transferType, scheduledFor });
        toast.success(`Transferência de ${utils.formatBRL(amount)} agendada para ${scheduledFor} com execução em background via @Scheduled!`);
        form.reset();
        this.loadTransfers();
      } catch (err) {
        toast.error(`Erro ao agendar: ${err.message}`);
      }
    });
  }
};
