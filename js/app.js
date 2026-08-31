import { appShell } from './ui/app-shell.js';
import { modal } from './ui/modal.js';
import { dashboardFeature } from './features/dashboard.js';
import { fraudShieldFeature } from './features/fraudShield.js';
import { investmentsFeature } from './features/investments.js';
import { webhooksFeature } from './features/webhooks.js';
import { schedulerFeature } from './features/scheduler.js';
import { complianceFeature } from './features/compliance.js';
import { messagingFeature } from './features/messaging.js';
import { integrationsFeature } from './features/integrations.js';
import { billingFeature } from './features/billing.js';
import { mdmFeature } from './features/mdm.js';

import { employeeAuth } from './features/employeeAuth.js';

document.addEventListener('DOMContentLoaded', () => {
  modal.init();
  appShell.init();
  employeeAuth.init();

  dashboardFeature.init();
  fraudShieldFeature.init();
  investmentsFeature.init();
  webhooksFeature.init();
  schedulerFeature.init();
  complianceFeature.init();
  messagingFeature.init();
  integrationsFeature.init();
  billingFeature.init();
  mdmFeature.init();

  console.log('🏛️ LãoBank Admin Console inicializado com sucesso!');
});
