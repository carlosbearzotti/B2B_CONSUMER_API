import { investmentService } from '../services/investmentService.js';
import { utils } from '../lib/utils.js';
import { toast } from '../ui/toast.js';

export const investmentsFeature = {
  init() {
    this.setupSimulationForm();
    this.loadProducts();
    this.loadMyPositions();
  },

  async loadProducts() {
    const list = document.getElementById('investProductsList');
    if (!list) return;

    try {
      const products = await investmentService.getProducts();
      list.innerHTML = products.map(p => `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--hub-border-card); border-radius: var(--radius-md); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${p.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
              Indexador: <strong style="color: var(--hub-gold-light);">${p.ratePercent}% ${p.indexName}</strong> &bull; Mínimo: ${utils.formatBRL(p.minAmount)} &bull; ${p.irExempt ? '✨ Isento de IR' : 'Tabela Regressiva IR'}
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.applyInvest(${p.id}, '${p.name}')">Aplicar Capital</button>
        </div>
      `).join('');

      window.applyInvest = async (id, name) => {
        const amountStr = prompt(`Digite o valor a aplicar em ${name} (R$):`, '5000');
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        try {
          await investmentService.apply(id, amount);
          toast.success(`Aplicação de ${utils.formatBRL(amount)} realizada com sucesso em ${name}!`);
          this.loadMyPositions();
        } catch (err) {
          toast.error(`Erro ao aplicar: ${err.message}`);
        }
      };
    } catch (err) {
      console.warn('Erro ao carregar produtos:', err);
    }
  },

  async loadMyPositions() {
    const tbody = document.getElementById('myPositionsTableBody');
    if (!tbody) return;

    try {
      const positions = await investmentService.getMyFunds();
      if (!positions || positions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhuma posição de investimento ativa neste momento.</td></tr>`;
        return;
      }

      tbody.innerHTML = positions.map(pos => `
        <tr>
          <td><strong style="color: var(--text-gold);">${pos.productName}</strong></td>
          <td><span class="badge badge-gold">${pos.productType}</span></td>
          <td>${utils.formatBRL(pos.principalAmount)}</td>
          <td><strong style="color: var(--status-success);">${utils.formatBRL(pos.currentAmount)}</strong></td>
          <td>${pos.ratePercent}% CDI</td>
          <td>${utils.formatDate(pos.appliedAt)}</td>
        </tr>
      `).join('');
    } catch (err) {
      console.warn('Erro ao carregar posições:', err);
    }
  },

  setupSimulationForm() {
    const form = document.getElementById('investSimulateForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const initialAmount = parseFloat(document.getElementById('simInitialAmount').value);
      const monthlyContribution = parseFloat(document.getElementById('simMonthlyAmount').value || 0);
      const months = parseInt(document.getElementById('simMonths').value);
      const productRatePercent = parseFloat(document.getElementById('simRatePercent').value);
      const irExempt = document.getElementById('simIrExempt').checked;

      try {
        toast.info('Calculando juros compostos e tabela regressiva de IR...');
        const res = await investmentService.simulate({
          initialAmount,
          monthlyContribution,
          months,
          productRatePercent,
          irExempt
        });

        document.getElementById('simResultNetTotal').textContent = utils.formatBRL(res.netTotal);
        document.getElementById('simResultGross').textContent = utils.formatBRL(res.grossTotal);
        document.getElementById('simResultInvested').textContent = utils.formatBRL(res.totalInvested);
        document.getElementById('simResultIr').textContent = `${utils.formatBRL(res.irTaxAmount)} (${res.irTaxRate}%)`;
        document.getElementById('simResultProfitOverPoupanca').textContent = `+ ${utils.formatBRL(res.profitOverPoupanca)} a mais que a poupança`;

        document.getElementById('simResultsContainer').style.display = 'block';
        toast.success('Simulação concluída com projeção do CDI!');
      } catch (err) {
        toast.error(`Erro na simulação: ${err.message}`);
      }
    });
  }
};
