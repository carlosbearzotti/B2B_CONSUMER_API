import { toast } from '../ui/toast.js';
import { state } from '../lib/state.js';

export const integrationsFeature = {
  init() {
    this.cacheDom();
    this.bindEvents();
    this.renderConnectors();
    this.renderApiKeys();
  },

  cacheDom() {
    this.connectorsList = document.getElementById('connectorsList');
    this.apiKeysTableBody = document.getElementById('apiKeysTableBody');
    this.btnGenerateKey = document.getElementById('btnGenerateApiKey');
    this.btnTestMapping = document.getElementById('btnTestFieldMapping');
    this.mappingInput = document.getElementById('mappingInputJson');
    this.mappingOutput = document.getElementById('mappingOutputJson');
  },

  connectors: [
    {
      id: 'sap_s4hana',
      name: 'SAP S/4HANA Enterprise',
      type: 'ERP',
      logo: '🏢',
      status: 'CONNECTED',
      latency: '32ms',
      lastSync: 'Hoje, às 13:42',
      syncScope: 'Contas a Pagar / Receber, Conciliação Diária'
    },
    {
      id: 'totvs_protheus',
      name: 'TOTVS Protheus',
      type: 'ERP',
      logo: '⚡',
      status: 'CONNECTED',
      latency: '48ms',
      lastSync: 'Hoje, às 13:15',
      syncScope: 'Emissão de Boletos, Faturamento Automático'
    },
    {
      id: 'salesforce_crm',
      name: 'Salesforce Financial Services Cloud',
      type: 'CRM',
      logo: '☁️',
      status: 'CONNECTED',
      latency: '65ms',
      lastSync: 'Hoje, às 12:50',
      syncScope: 'Onboarding de Clientes PJ, KYC & Limites de Crédito'
    },
    {
      id: 'omie_erp',
      name: 'Omie / Bling ERP',
      type: 'ERP PME',
      logo: '📦',
      status: 'STANDBY',
      latency: '--',
      lastSync: 'Nunca sincronizado',
      syncScope: 'Importação de Pedidos e Notas Fiscais'
    }
  ],

  apiKeys: [
    {
      id: 'key_live_fintech_prod',
      name: 'Produção - Conector SAP',
      prefix: 'pk_live_89f2****91a',
      scopes: ['transacoes.read', 'transacoes.write', 'webhooks.manage'],
      createdAt: '15/01/2026',
      status: 'ACTIVE'
    },
    {
      id: 'key_live_totvs_sync',
      name: 'Sync Noturno TOTVS',
      prefix: 'pk_live_33b1****55e',
      scopes: ['faturamento.read', 'ted.execute', 'boletos.emit'],
      createdAt: '02/02/2026',
      status: 'ACTIVE'
    },
    {
      id: 'key_test_sandbox_dev',
      name: 'Ambiente de Testes / Sandbox',
      prefix: 'pk_test_77a9****01d',
      scopes: ['all.sandbox'],
      createdAt: '20/08/2026',
      status: 'ACTIVE'
    }
  ],

  bindEvents() {
    if (this.btnGenerateKey) {
      this.btnGenerateKey.addEventListener('click', () => this.generateNewApiKey());
    }

    if (this.btnTestMapping) {
      this.btnTestMapping.addEventListener('click', () => this.testFieldMapping());
    }
  },

  renderConnectors() {
    if (!this.connectorsList) return;

    this.connectorsList.innerHTML = this.connectors.map(c => `
      <div class="hub-card" style="margin-bottom: 1rem; border-left: 4px solid ${c.status === 'CONNECTED' ? 'var(--status-success)' : 'var(--text-muted)'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="font-size: 2rem; background: rgba(255,255,255,0.03); border: 1px solid var(--hub-border-card); border-radius: var(--radius-md); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
              ${c.logo}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin: 0;">${c.name}</h3>
                <span class="badge ${c.status === 'CONNECTED' ? 'badge-emerald' : 'badge-gold'}" style="font-size: 0.7rem;">
                  ${c.status === 'CONNECTED' ? '● Online & Conectado' : '○ Em Espera'}
                </span>
                <span class="badge badge-cyan" style="font-size: 0.7rem;">${c.type}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
                <strong>Escopo:</strong> ${c.syncScope}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                Último Sync: ${c.lastSync} &bull; Latência de Rede: <span style="color: var(--hub-gold-light);">${c.latency}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.integrationsModule.testPing('${c.id}')">
              📡 Testar Handshake
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.integrationsModule.triggerSync('${c.id}')">
              🔄 Sincronizar Agora
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderApiKeys() {
    if (!this.apiKeysTableBody) return;

    this.apiKeysTableBody.innerHTML = this.apiKeys.map(k => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${k.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${k.id}</div>
        </td>
        <td>
          <code style="background: rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px; font-family: var(--font-mono); color: var(--hub-gold-light);">
            ${k.prefix}
          </code>
        </td>
        <td>
          <div style="display: flex; gap: 0.3rem; flex-wrap: wrap;">
            ${k.scopes.map(s => `<span class="badge badge-cyan" style="font-size: 0.65rem;">${s}</span>`).join('')}
          </div>
        </td>
        <td style="font-size: 0.8rem;">${k.createdAt}</td>
        <td><span class="badge badge-emerald">Ativa</span></td>
        <td>
          <button class="btn btn-danger btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="window.integrationsModule.revokeKey('${k.id}')">
            Revogar
          </button>
        </td>
      </tr>
    `).join('');
  },

  testPing(connectorId) {
    const conn = this.connectors.find(c => c.id === connectorId);
    if (!conn) return;

    toast.info(`Iniciando handshake mTLS com ${conn.name}...`);
    setTimeout(() => {
      conn.status = 'CONNECTED';
      conn.latency = `${Math.floor(Math.random() * 30 + 20)}ms`;
      conn.lastSync = 'Agora mesmo';
      this.renderConnectors();
      toast.success(`Handshake 200 OK com ${conn.name}! Latência: ${conn.latency}`);
    }, 800);
  },

  triggerSync(connectorId) {
    const conn = this.connectors.find(c => c.id === connectorId);
    if (!conn) return;

    toast.info(`Disparando lote de sincronização (Bulk API) com ${conn.name}...`);
    setTimeout(() => {
      conn.lastSync = 'Agora mesmo';
      this.renderConnectors();
      toast.success(`Carga sincronizada: 148 registros atualizados no ${conn.name}!`);
    }, 1200);
  },

  generateNewApiKey() {
    const name = prompt('Nome da Nova Chave de Acesso (ex: Conector CRM Novo):', 'Chave API B2B');
    if (!name) return;

    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newKey = {
      id: `key_live_${Date.now()}`,
      name: name,
      prefix: `pk_live_${randomSuffix}****${Math.floor(Math.random()*899+100)}`,
      scopes: ['transacoes.read', 'faturamento.read', 'webhooks.receive'],
      createdAt: 'Hoje',
      status: 'ACTIVE'
    };

    this.apiKeys.unshift(newKey);
    this.renderApiKeys();
    toast.success(`Chave '${name}' gerada com sucesso! Guarde-a em local seguro.`);
  },

  revokeKey(keyId) {
    if (!confirm('Deseja realmente revogar esta Chave de API? Aplicações conectadas perderão acesso imediatamente.')) return;

    this.apiKeys = this.apiKeys.filter(k => k.id !== keyId);
    this.renderApiKeys();
    toast.warning('Chave revogada com sucesso!');
  },

  testFieldMapping() {
    if (!this.mappingInput || !this.mappingOutput) return;

    try {
      const input = JSON.parse(this.mappingInput.value);
      // Transform canonical ERP payload to Integrados Core Banking standard
      const transformed = {
        transactionId: input.nfe_numero || `TX-${Date.now()}`,
        sender: {
          corporateDocument: input.cnpj_emitente || '45.123.456/0001-89',
          businessName: input.razao_social_emit || 'Empresa Parceira B2B'
        },
        recipient: {
          destinationKey: input.chave_pix_favorecido || input.cnpj_destinatario || 'contato@laobank.com.br',
          bankCode: '099'
        },
        financial: {
          amount: parseFloat(input.valor_total_nota || input.valor || 0),
          currency: 'BRL',
          settlementDate: input.data_vencimento || new Date().toISOString().split('T')[0]
        },
        metadata: {
          erpSource: 'SAP_S4HANA_TRANSFORMER',
          checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
      };

      this.mappingOutput.value = JSON.stringify(transformed, null, 2);
      toast.success('Mapeamento e conversão de payload executados com sucesso!');
    } catch (e) {
      toast.error('JSON de entrada inválido: ' + e.message);
    }
  }
};

window.integrationsModule = integrationsFeature;
