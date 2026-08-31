# 🏢 consumerBackOffice — B2B Partner Hub & Sistema Nervoso Central

[![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6%20Modules-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3 Glassmorphism](https://img.shields.io/badge/CSS3-Enterprise%20Dark-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Multi-Tenancy](https://img.shields.io/badge/Multi--Tenancy-Schema--per--Tenant-gold.svg)](https://www.postgresql.org/)
[![Core API](https://img.shields.io/badge/Backend-Integrados%20API-brightgreen.svg)](https://github.com/carlosbearzotti/INTEGRATE_SERVICES_JAVA_API)

O **`consumerBackOffice` (Partner Hub)** é o console corporativo **B2B** que atua como o **Sistema Nervoso Central** da operação, permitindo governança, moderação de risco, integrações com ERP/CRM, gestão de mensageria e faturamento para empresas parceiras e administradores.

---

## 🎯 Casos de Uso & Propósito

- **Parceiros Corporativos & Fintechs**: Gerenciamento de chaves de API, monitoramento de consumo tarifário (Billing), configuração de conectores de ERP (SAP, TOTVS) e parametrização de políticas de segurança.
- **Operadores de Mesa & Compliance**: Moderação de transações suspeitas no Radar Antifraude, auditoria de trilha imutável e execução de solicitações da LGPD (exportação de dossiê cadastral e anonimização de dados).
- **Engenharia & Observabilidade**: Monitoramento do Broker de Eventos, resolução de Dead Letter Queues (DLQ) e inspeção de tráfego HTTP em tempo real.

---

## 🔌 Funcionalidades Consumidas do Backend (`Integrados`)

O Partner Hub consome a API `Integrados` (`http://localhost:8080`) injetando dinamicamente o cabeçalho **`X-API-Key`** para garantir isolamento Multi-Tenant:

### 1. 🏢 Multi-Tenancy & Governança MDM
- **Funcionalidades**:
  - Seletor de Tenant no topo da tela (`Fintech Startup S.A.`, `LãoBank Digital`, `Corporativo Global`).
  - Isolamento de dados em esquemas PostgreSQL dedicados (`tenant_fintech`, `tenant_laobank`).
  - **Whitelist Zero Trust**: Gestão de faixas de IP e CIDR autorizados a consumir os serviços.

### 2. 🔌 Conectores ERP / CRM & Integração B2B
- **Funcionalidades**:
  - Conectores pré-configurados para **SAP S/4HANA**, **TOTVS Protheus**, **Salesforce** e **Omie/Bling**.
  - Ações de Handshake de rede e sincronização em lote (**Bulk API Sync**).
  - **Mapeador Canônico de JSON**: Conversor interativo de estruturas heterogêneas de ERP para o padrão REST do Core Banking.
  - Gestor de Chaves de Acesso B2B (`pk_live_***`) com escopos granulares de permissão.

### 3. 📬 Broker de Eventos & Observabilidade DLQ (Mensageria)
- **Funcionalidades**:
  - KPIs de vazão (Throughput), latência P99 e workers ativos.
  - Visão estrutural dos tópicos corporativos (`integrados.transacoes.v1`, `erp.sync.events`).
  - Painel de **Dead Letter Queue (DLQ)** com reprocessamento manual em massa.
  - Injetor de mensagens JSON para simulação de eventos no broker.

### 4. 🛡️ Fraud Shield & Radar de Geofencing
- **Funcionalidades**:
  - Radar visual em Canvas calculando anomalias espaciais (distância euclidiana/haversine).
  - Fila de moderação para transações retidas com ações de aprovação ou cancelamento.
  - Simulador de teste de risco em tempo real.

### 5. 💳 Faturamento B2B & Gestão de Contratos (Billing)
- **Funcionalidades**:
  - Acompanhamento de cotas de API e cálculo tarifário discriminado por microserviço (Antifraude, Cofre, Webhooks, Custódia).
  - Histórico de faturas com download de extratos e arquivos de remessa bancária **CNAB 240**.

### 6. 🏛️ Compliance LGPD & Trilha de Auditoria
- **Funcionalidades**:
  - Geração e download do Dossiê Completo do Titular (Art. 18, II da LGPD).
  - Execução de Direito ao Esquecimento via anonimização de dados pessoais sensíveis.
  - Visualizador de Audit Trail imutável.

### 7. ⚡ Gateway de Webhooks HMAC & Transferências Agendadas
- **Funcionalidades**:
  - Cadastro de endpoints de callback e disparo de eventos de teste com assinatura `X-Signature` (HMAC-SHA256).
  - Histórico de entregas e payloads despachados.
  - Fila de pagamentos programados executados pelo motor cron `@Scheduled`.

---

## 🏃 Como Executar

A aplicação roda em servidor web estático na porta **3001**:

```bash
# Na pasta consumerBackOffice
npx serve . -l 3001
```
Acesse no navegador: **`http://localhost:3001`**

---

## 👨‍💻 Autor
Desenvolvido por **Carlos Bearzotti**  
GitHub: [@carlosbearzotti](https://github.com/carlosbearzotti)
