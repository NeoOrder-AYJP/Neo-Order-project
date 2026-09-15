import { Router } from './router.js';
import { store } from './store.js';
import { getSession, logout, isManager, isAttendant, isTableClient } from './auth.js';
import { renderLandingPage } from './views/landing.js';
import { renderAuthModals } from './views/authModals.js';
import { renderCustomerView } from './views/customer.js';
import { renderAttendantView } from './views/attendant.js';
import { renderManagerView } from './views/manager.js';

// Toast Notification Helper
window.showToast = (message, type = 'success') => {
  const toast = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
};

// Header User State Updates
function updateHeaderUI() {
  const session = getSession();
  const userHeaderInfo = document.getElementById('user-header-info');

  if (!userHeaderInfo) return;

  if (session) {
    userHeaderInfo.innerHTML = `
      <div class="flex items-center gap-space-xs bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-variant/40">
        <span class="material-symbols-outlined text-primary">account_circle</span>
        <div class="flex flex-col text-left">
          <span class="font-label-md font-bold text-on-surface leading-tight">${session.nome}</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant capitalize">${session.perfil || 'Mesa Cliente'}</span>
        </div>
        <button id="logout-btn" class="ml-2 text-xs text-error font-bold hover:underline">Sair</button>
      </div>
    `;
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      logout();
      window.location.hash = '#inicio-cardapio';
    });
  } else {
    userHeaderInfo.innerHTML = `
      <button onclick="window.openTableLoginModal()" class="px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all">
        Login Mesa
      </button>
      <button onclick="window.openStaffLoginModal()" class="px-space-md py-space-xs rounded-xl border border-outline text-on-surface font-label-md font-semibold hover:bg-surface-container-high transition-all">
        Equipe
      </button>
    `;
  }
}

// App Initialization
function initApp() {
  const appRoot = document.getElementById('app-root');
  const modalsContainer = document.getElementById('modals-container');

  if (!appRoot || !modalsContainer) return;

  // Render Modals Once
  renderAuthModals(modalsContainer);

  // Initialize Router
  const routes = {
    'inicio-cardapio': () => renderLandingPage(appRoot),
    'mesa-cliente': () => renderCustomerView(appRoot),
    'painel-atendente': () => renderAttendantView(appRoot),
    'gestao-faturamento': () => renderManagerView(appRoot)
  };

  const router = new Router(routes, 'inicio-cardapio');
  router.init();

  // Listen to auth and store changes
  window.addEventListener('auth_change', () => {
    updateHeaderUI();
    router.handleRoute();
  });

  store.subscribe(() => {
    updateHeaderUI();
    router.handleRoute();
  });

  updateHeaderUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
