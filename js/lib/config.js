/**
 * Configurações e Dicionários Globais do Integrados Partner Hub (B2B)
 */
export const config = {
  API_BASE_URL: 'http://localhost:8080',

  DEFAULT_TENANTS: [
    {
      id: 'tenant_fintech',
      name: 'Fintech Startup S.A.',
      apiKey: 'fintech-startup-key-12345',
      plan: 'Enterprise Platinum',
      color: '#d4af37',
      badge: 'PROD'
    },
    {
      id: 'tenant_laobank',
      name: 'LãoBank Digital Banking',
      apiKey: 'laobank-digital-key-99999',
      plan: 'Bank Core Multi-Cofre',
      color: '#38bdf8',
      badge: 'CORE'
    },
    {
      id: 'tenant_corporativo',
      name: 'Corporativo Global S.A.',
      apiKey: 'corp-enterprise-key-88888',
      plan: 'White-Label Gateway',
      color: '#a855f7',
      badge: 'ENTERPRISE'
    }
  ],

  WEBHOOK_EVENTS: [
    { id: 'transaction.completed', label: 'Transação Liquidada no Cofre' },
    { id: 'fraud.alert_created', label: 'Alerta Antifraude Disparado' },
    { id: 'loan.contracted', label: 'Empréstimo Formalizado' },
    { id: 'investment.applied', label: 'Aplicação em Renda Fixa' },
    { id: 'url.milestone_reached', label: 'Meta de Cliques Atingida (CDB)' },
    { id: 'transfer.scheduled_executed', label: 'Pix Agendado Executado' }
  ]
};
