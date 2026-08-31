import { fraudService } from '../services/fraudService.js';
import { state } from '../lib/state.js';
import { utils } from '../lib/utils.js';
import { toast } from '../ui/toast.js';

export const fraudShieldFeature = {
  init() {
    this.setupTestEvaluator();
    this.loadAlerts();
    this.initRadarCanvas();
    state.subscribe('tenant', () => this.loadAlerts());
  },

  async loadAlerts() {
    const tbody = document.getElementById('fraudAlertsTableBody');
    if (!tbody) return;

    try {
      const alerts = await fraudService.getAlerts();
      state.updateState('fraudAlerts', alerts);
      this.renderAlerts(alerts);
    } catch (err) {
      console.warn('Usando alertas de demonstração:', err);
      const mock = [
        {
          id: 1,
          userId: 1,
          transactionAmount: 75000.00,
          originLat: -15.7801,
          originLng: -47.9292,
          userLat: -23.5505,
          userLng: -46.6333,
          distanceKm: 872.4,
          riskScore: 85,
          reason: 'GEOFENCING_BREACH: Distância 872km excede 500km | HIGH_AMOUNT_ALERT: R$ 75.000,00',
          status: 'UNDER_REVIEW',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          userId: 1,
          transactionAmount: 12000.00,
          originLat: -22.9068,
          originLng: -43.1729,
          userLat: -23.5505,
          userLng: -46.6333,
          distanceKm: 358.1,
          riskScore: 60,
          reason: 'LOCATION_ANOMALY: Transação no RJ divergente de SP | ELEVATED_VALUE',
          status: 'UNDER_REVIEW',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      this.renderAlerts(mock);
    }
  },

  renderAlerts(alerts) {
    const tbody = document.getElementById('fraudAlertsTableBody');
    if (!tbody) return;

    if (!alerts || alerts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">🛡️ Nenhuma transação retida por suspeita de fraude no momento.</td></tr>`;
      return;
    }

    tbody.innerHTML = alerts.map(a => {
      const statusBadge = a.status === 'UNDER_REVIEW'
        ? `<span class="badge badge-danger">Sob Análise (${a.riskScore}%)</span>`
        : (a.status === 'APPROVED' ? `<span class="badge badge-emerald">Aprovada</span>` : `<span class="badge badge-danger">Bloqueada</span>`);

      const actions = a.status === 'UNDER_REVIEW'
        ? `
          <button class="btn btn-success btn-sm" onclick="window.fraudApprove(${a.id})">✓ Aprovar</button>
          <button class="btn btn-danger btn-sm" onclick="window.fraudReject(${a.id})">✕ Bloquear</button>
        `
        : `<span style="font-size: 0.75rem; color: var(--text-muted);">${a.status} por ${a.reviewedBy || 'Admin'}</span>`;

      return `
        <tr>
          <td><strong style="font-family: var(--font-mono); color: var(--text-gold);">#TX-${a.id}</strong></td>
          <td><strong>${utils.formatBRL(a.transactionAmount)}</strong></td>
          <td>${a.distanceKm ? a.distanceKm + ' km' : '-'}</td>
          <td>${statusBadge}</td>
          <td style="font-size: 0.78rem; max-width: 260px;">${a.reason}</td>
          <td style="font-size: 0.75rem;">${utils.formatDate(a.createdAt)}</td>
          <td><div style="display: flex; gap: 0.4rem;">${actions}</div></td>
        </tr>
      `;
    }).join('');

    // Global review actions
    window.fraudApprove = async (id) => {
      try {
        await fraudService.review(id, 'APPROVED', 'Backoffice Security Team');
        toast.success(`Transação #TX-${id} aprovada e liberada no cofre!`);
        this.loadAlerts();
      } catch (err) {
        toast.error(`Erro ao aprovar: ${err.message}`);
      }
    };

    window.fraudReject = async (id) => {
      try {
        await fraudService.review(id, 'REJECTED', 'Backoffice Security Team');
        toast.warning(`Transação #TX-${id} bloqueada por fraude confirmada!`);
        this.loadAlerts();
      } catch (err) {
        toast.error(`Erro ao bloquear: ${err.message}`);
      }
    };
  },

  setupTestEvaluator() {
    const form = document.getElementById('fraudTestForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('fraudTestAmount').value);
      const originLat = parseFloat(document.getElementById('fraudTestLat').value);
      const originLng = parseFloat(document.getElementById('fraudTestLng').value);

      try {
        toast.info('Calculando risco de fraude via Geofencing...');
        const res = await fraudService.evaluate({ amount, originLat, originLng, userId: 1 });

        const resultBox = document.getElementById('fraudEvalResult');
        if (resultBox) {
          resultBox.style.display = 'block';
          resultBox.innerHTML = `
            <div style="padding: 1rem; border-radius: var(--radius-md); background: ${res.approved ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border: 1px solid ${res.approved ? 'var(--status-success)' : 'var(--status-danger)'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong>Decisão: ${res.decision}</strong>
                <span class="badge ${res.approved ? 'badge-emerald' : 'badge-danger'}">Risco: ${res.riskScore}/100</span>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Distância calculada: <strong>${res.distanceKm} km</strong> da residência cadastrada.</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${res.triggeredRules?.join('<br>') || 'Nenhum gatilho de anomalia disparado.'}</div>
            </div>
          `;
        }

        if (res.approved) {
          toast.success('Transação aprovada pelas regras de segurança!');
        } else {
          toast.warning('Transação retida pelo Fraud Shield para análise!');
          this.loadAlerts();
        }
      } catch (err) {
        toast.error(`Erro ao avaliar: ${err.message}`);
      }
    });
  },

  initRadarCanvas() {
    const canvas = document.getElementById('fraudRadarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 400;
    canvas.height = 240;

    let angle = 0;
    const render = () => {
      ctx.fillStyle = 'rgba(6, 9, 17, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Concentric circles
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 30; r <= 100; r += 30) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshair
      ctx.beginPath();
      ctx.moveTo(cx - 110, cy);
      ctx.lineTo(cx + 110, cy);
      ctx.moveTo(cx, cy - 110);
      ctx.lineTo(cx, cy + 110);
      ctx.stroke();

      // Sweeper
      angle += 0.03;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 100, cy + Math.sin(angle) * 100);
      ctx.stroke();

      // Mock Dots
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx + 45, cy - 35, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx - 25, cy + 20, 4, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(render);
    };
    render();
  }
};
