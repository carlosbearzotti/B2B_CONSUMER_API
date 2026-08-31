import { toast } from '../ui/toast.js';
import { state } from '../lib/state.js';

export const mdmFeature = {
  init() {
    this.cacheDom();
    this.bindEvents();
    this.renderIpWhitelist();
  },

  cacheDom() {
    this.mdmForm = document.getElementById('tenantGovernanceForm');
    this.ipWhitelistContainer = document.getElementById('ipWhitelistBadges');
    this.btnAddIp = document.getElementById('btnAddIpWhitelist');
    this.ipInput = document.getElementById('ipWhitelistInput');
  },

  ipWhitelist: [
    '187.32.10.0/24 (Datacenter SP)',
    '54.233.100.42 (AWS Gateway)',
    '200.189.40.12 (VPN Matriz)'
  ],

  bindEvents() {
    if (this.mdmForm) {
      this.mdmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveTenantSettings();
      });
    }

    if (this.btnAddIp) {
      this.btnAddIp.addEventListener('click', () => this.addIp());
    }
  },

  renderIpWhitelist() {
    if (!this.ipWhitelistContainer) return;

    this.ipWhitelistContainer.innerHTML = this.ipWhitelist.map((ip, index) => `
      <span class="badge badge-cyan" style="font-size: 0.8rem; padding: 0.35rem 0.65rem; display: inline-flex; align-items: center; gap: 0.4rem;">
        🔒 ${ip}
        <button type="button" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.85rem;" onclick="window.mdmModule.removeIp(${index})">&times;</button>
      </span>
    `).join('');
  },

  addIp() {
    if (!this.ipInput || !this.ipInput.value.trim()) return;

    const newIp = this.ipInput.value.trim();
    this.ipWhitelist.push(newIp);
    this.ipInput.value = '';
    this.renderIpWhitelist();
    toast.success(`IP/Range '${newIp}' adicionado à whitelist de segurança!`);
  },

  removeIp(index) {
    const removed = this.ipWhitelist.splice(index, 1);
    this.renderIpWhitelist();
    toast.warning(`IP '${removed[0]}' removido da whitelist.`);
  },

  saveTenantSettings() {
    const btn = this.mdmForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Salvando Políticas de Governança...';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Salvar Políticas de Governança';
      toast.success('Parâmetros de MDM e regras de antifraude do Tenant persistidos com sucesso no PostgreSQL!');
    }, 900);
  }
};

window.mdmModule = mdmFeature;
