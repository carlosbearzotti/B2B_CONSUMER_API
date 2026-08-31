export const messagingFeature = {
  init() {
    this.cacheDom();
    this.bindEvents();
    this.renderDlq();
  },

  cacheDom() {
    this.dlqTableBody = document.getElementById('dlqTableBody');
    this.injectEventForm = document.getElementById('injectEventForm');
    this.reprocessAllDlqBtn = document.getElementById('reprocessAllDlqBtn');
    this.sidebarDlqBadge = document.getElementById('sidebarDlqBadge');
    this.kpiDlqCount = document.getElementById('kpiDlqCount');
  },

  bindEvents() {
    if (this.injectEventForm) {
      this.injectEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEventInjection();
      });
    }

    if (this.reprocessAllDlqBtn) {
      this.reprocessAllDlqBtn.addEventListener('click', () => {
        this.handleReprocessAll();
      });
    }
  },

  // Mock data for DLQ
  dlqMessages: [
    {
      id: 'msg_98412_a',
      topic: 'erp.sync.events',
      reason: 'HTTP 503 Service Unavailable (ERP Timeout)',
      attempts: 3,
      failedAt: '2026-08-31T14:30:00Z'
    },
    {
      id: 'msg_98413_b',
      topic: 'integrados.transacoes.v1',
      reason: 'Validation Error: JSON malformado',
      attempts: 1,
      failedAt: '2026-08-31T14:32:15Z'
    },
    {
      id: 'msg_98414_c',
      topic: 'erp.sync.events',
      reason: 'HTTP 401 Unauthorized (API Key Expired)',
      attempts: 5,
      failedAt: '2026-08-31T14:45:00Z'
    }
  ],

  renderDlq() {
    if (!this.dlqTableBody) return;

    if (this.dlqMessages.length === 0) {
      this.dlqTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 1.5rem; color: var(--status-success);">🎉 DLQ vazia! Todos os eventos foram processados com sucesso.</td></tr>';
      this.updateBadge(0);
      return;
    }

    this.dlqTableBody.innerHTML = '';
    this.dlqMessages.forEach(msg => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: monospace;">${msg.id}</td>
        <td><span class="badge badge-cyan">${msg.topic}</span></td>
        <td style="color: var(--status-danger); max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${msg.reason}">${msg.reason}</td>
        <td>${msg.attempts}</td>
        <td style="font-size: 0.8rem;">${new Date(msg.failedAt).toLocaleString()}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="alert('Reprocessando mensagem ${msg.id}...')">Reprocessar</button>
        </td>
      `;
      this.dlqTableBody.appendChild(tr);
    });

    this.updateBadge(this.dlqMessages.length);
  },

  updateBadge(count) {
    if (this.sidebarDlqBadge) {
      this.sidebarDlqBadge.textContent = count;
      this.sidebarDlqBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
    if (this.kpiDlqCount) {
      this.kpiDlqCount.textContent = count + ' itens';
      this.kpiDlqCount.style.color = count > 0 ? 'var(--status-danger)' : 'var(--status-success)';
      this.kpiDlqCount.parentElement.style.borderColor = count > 0 ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)';
      this.kpiDlqCount.parentElement.style.background = count > 0 ? 'rgba(248, 113, 113, 0.02)' : 'rgba(52, 211, 153, 0.02)';
    }
  },

  handleEventInjection() {
    const topic = document.getElementById('simTopic').value;
    const btn = this.injectEventForm.querySelector('button');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simulate API call to publish event
    setTimeout(() => {
      btn.textContent = 'Publicar Mensagem';
      btn.disabled = false;
      const { toast } = window;
      if(toast) {
        toast.show('success', `Mensagem publicada no tópico ${topic} com sucesso!`);
      } else {
        alert(`Mensagem publicada no tópico ${topic} com sucesso!`);
      }
      
      // Update KPIs visually
      const kpi = document.getElementById('kpiEventsProcessed');
      if (kpi) {
        let current = parseInt(kpi.textContent.replace(/\./g, ''));
        kpi.textContent = (current + 1).toLocaleString('pt-BR');
      }
    }, 600);
  },

  handleReprocessAll() {
    this.reprocessAllDlqBtn.textContent = 'Reprocessando...';
    this.reprocessAllDlqBtn.disabled = true;
    
    setTimeout(() => {
      this.dlqMessages = []; // Empty the DLQ array
      this.renderDlq();
      this.reprocessAllDlqBtn.textContent = 'Reprocessar Todos';
      this.reprocessAllDlqBtn.disabled = false;
      
      const { toast } = window;
      if(toast) toast.show('success', 'Todas as mensagens foram reenviadas para a fila principal!');
      else alert('Todas as mensagens foram reenviadas para a fila principal!');
    }, 1500);
  }
};
