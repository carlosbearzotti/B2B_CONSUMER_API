import { toast } from '../ui/toast.js';

export const employeeAuth = {
  API_URL: 'http://localhost:8080',

  init() {
    this.cacheDom();
    this.bindEvents();
    this.checkSession();
  },

  cacheDom() {
    this.loginScreen = document.getElementById('employeeLoginScreen');
    this.appWrapper = document.querySelector('.app-wrapper');
    this.loginForm = document.getElementById('employeeLoginForm');
    this.loginEmailInput = document.getElementById('empLoginEmail');
    this.loginPasswordInput = document.getElementById('empLoginPassword');
    this.loginErrorAlert = document.getElementById('empLoginError');
    this.btnLogin = document.getElementById('btnSubmitEmployeeLogin');
    this.btnQuickAdmin = document.getElementById('btnQuickFillAdmin');
    this.btnQuickManager = document.getElementById('btnQuickFillManager');
    this.nameDisplay = document.getElementById('employeeNameDisplay');
    this.roleBadge = document.getElementById('employeeRoleBadge');
    this.btnLogout = document.getElementById('btnEmployeeLogout');
  },

  bindEvents() {
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    if (this.btnQuickAdmin) {
      this.btnQuickAdmin.addEventListener('click', () => {
        this.loginEmailInput.value = 'admin@laobank.com.br';
        this.loginPasswordInput.value = 'Admin@LaoBank2026!';
      });
    }

    if (this.btnQuickManager) {
      this.btnQuickManager.addEventListener('click', () => {
        this.loginEmailInput.value = 'gerente@laobank.com.br';
        this.loginPasswordInput.value = 'Gerente@LaoBank2026!';
      });
    }

    if (this.btnLogout) {
      this.btnLogout.addEventListener('click', () => {
        this.logout();
      });
    }
  },

  checkSession() {
    const token = localStorage.getItem('laobank_admin_token');
    const name = localStorage.getItem('laobank_admin_name');
    const role = localStorage.getItem('laobank_admin_role');

    if (token && name) {
      this.showApp(name, role);
    } else {
      this.showLogin();
    }
  },

  async handleLogin() {
    const email = this.loginEmailInput.value.trim();
    const password = this.loginPasswordInput.value;

    if (!email || !password) return;

    this.btnLogin.disabled = true;
    this.btnLogin.textContent = 'Autenticando no Core Bancário...';
    if (this.loginErrorAlert) this.loginErrorAlert.style.display = 'none';

    try {
      const res = await fetch(`${this.API_URL}/api/auth/employee-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Credenciais corporativas inválidas ou acesso não autorizado.');
      }

      const data = await res.json();

      // Salva sessão local do colaborador
      localStorage.setItem('laobank_admin_token', data.token);
      localStorage.setItem('laobank_admin_name', data.name);
      localStorage.setItem('laobank_admin_email', data.email);
      localStorage.setItem('laobank_admin_role', data.role || 'ROLE_EMPLOYEE');

      toast.success(`Bem-vindo, ${data.name}! Acesso ao BackOffice LãoBank liberado.`);
      this.showApp(data.name, data.role);
    } catch (err) {
      if (this.loginErrorAlert) {
        this.loginErrorAlert.textContent = '⚠️ ' + err.message;
        this.loginErrorAlert.style.display = 'block';
      }
      toast.error(err.message);
    } finally {
      this.btnLogin.disabled = false;
      this.btnLogin.textContent = 'Acessar Console LãoBank';
    }
  },

  showApp(name, role) {
    if (this.loginScreen) this.loginScreen.style.display = 'none';
    if (this.appWrapper) this.appWrapper.style.display = 'flex';

    if (this.nameDisplay) this.nameDisplay.textContent = name;
    if (this.roleBadge) {
      const roleName = role === 'ROLE_ADMIN' ? 'Administrador' : 'Gerente de Operações';
      this.roleBadge.textContent = roleName;
      this.roleBadge.className = `badge ${role === 'ROLE_ADMIN' ? 'badge-gold' : 'badge-emerald'}`;
    }
  },

  showLogin() {
    if (this.loginScreen) this.loginScreen.style.display = 'flex';
    if (this.appWrapper) this.appWrapper.style.display = 'none';
  },

  logout() {
    localStorage.removeItem('laobank_admin_token');
    localStorage.removeItem('laobank_admin_name');
    localStorage.removeItem('laobank_admin_email');
    localStorage.removeItem('laobank_admin_role');

    toast.info('Sessão administrativa encerrada.');
    this.showLogin();
  }
};
