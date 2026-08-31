import { appShell } from './ui/app-shell.js';
import { modal } from './ui/modal.js';
import { dashboardFeature } from './features/dashboard.js';
import { fraudShieldFeature } from './features/fraudShield.js';
import { investmentsFeature } from './features/investments.js';
import { webhooksFeature } from './features/webhooks.js';
import { schedulerFeature } from './features/scheduler.js';
import { complianceFeature } from './features/compliance.js';

document.addEventListener('DOMContentLoaded', () => {
  modal.init();
  appShell.init();

  dashboardFeature.init();
  fraudShieldFeature.init();
  investmentsFeature.init();
  webhooksFeature.init();
  schedulerFeature.init();
  complianceFeature.init();

  console.log('🚀 Integrados Partner Hub (B2B Admin Console) inicializado!');
});
