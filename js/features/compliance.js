import { complianceService } from '../services/complianceService.js';
import { utils } from '../lib/utils.js';
import { toast } from '../ui/toast.js';

export const complianceFeature = {
  init() {
    this.setupExport();
    this.setupAnonymize();
    this.loadAuditLogs();
  },

  async loadAuditLogs() {
    const tbody = document.getElementById('auditLogsTableBody');
    if (!tbody) return;

    try {
      const logs = await complianceService.getAuditLogs();
      if (!logs || logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum log de auditoria registrado ainda.</td></tr>`;
        return;
      }

      tbody.innerHTML = logs.map(l => `
        <tr>
          <td><span class="badge badge-purple">${l.action}</span></td>
          <td>${l.entityName ? l.entityName + ' #' + l.entityId : '-'}</td>
          <td style="font-size: 0.8rem; color: var(--text-main);">${l.details || '-'}</td>
          <td style="font-size: 0.75rem;">${utils.formatDate(l.createdAt)}</td>
        </tr>
      `).join('');
    } catch (err) {
      console.warn('Erro ao carregar auditoria:', err);
    }
  },

  setupExport() {
    const btn = document.getElementById('lgpdExportBtn');
    const out = document.getElementById('lgpdExportResult');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      try {
        toast.info('Coletando e consolidando pacote de dados pessoais LGPD...');
        const data = await complianceService.exportData(1);
        if (out) {
          out.style.display = 'block';
          out.textContent = JSON.stringify(data, null, 2);
        }
        toast.success('Dossiê de Titular LGPD gerado com sucesso!');
        this.loadAuditLogs();
      } catch (err) {
        toast.error(`Erro ao exportar dados: ${err.message}`);
      }
    });
  },

  setupAnonymize() {
    const btn = document.getElementById('lgpdAnonymizeBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      if (!confirm('ATENÇÃO: Deseja realmente anonimizar os dados do titular da conta (Direito ao Esquecimento)? Esta ação é irreversível.')) {
        return;
      }

      try {
        toast.info('Anonimizando CPF, e-mail e coordenadas do usuário no schema...');
        const user = await complianceService.anonymize(1, 'Direito ao Esquecimento exercido pelo titular');
        toast.success(`Usuário anonimizado com sucesso: ${user.name}`);
        this.loadAuditLogs();
      } catch (err) {
        toast.error(`Erro ao anonimizar: ${err.message}`);
      }
    });
  }
};
