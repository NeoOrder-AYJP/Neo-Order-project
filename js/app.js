// js/app.js - Router and Global Application Controller
import { Store } from './store.js';
import { renderLandingView } from './views/landing.js';
import { renderClientView } from './views/client.js';
import { renderStaffView } from './views/staff.js';
import { renderManagerView } from './views/manager.js';

export const store = new Store();
export let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
  updateSessionHeader();
}

export function showToast(message) {
  const toastEl = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');
  if (toastEl && toastText) {
    toastText.textContent = message;
    toastEl.classList.remove('translate-y-20', 'opacity-0');
    toastEl.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toastEl.classList.remove('translate-y-0', 'opacity-100');
      toastEl.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
  }
}

export function navigateTo(viewName) {
  const views = ['landing', 'client', 'staff', 'manager'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewName) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Update navbar button highlight
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.path === viewName) {
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-high');
    } else {
      btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.add('text-on-surface-variant', 'hover:bg-surface-container-high');
    }
  });

  // Render view content
  if (viewName === 'landing') renderLandingView();
  else if (viewName === 'client') renderClientView();
  else if (viewName === 'staff') renderStaffView();
  else if (viewName === 'manager') renderManagerView();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function updateSessionHeader() {
  const sessionInfo = document.getElementById('user-session-info');
  if (!sessionInfo) return;

  if (!currentUser) {
    sessionInfo.innerHTML = `
      <button onclick="window.navigateTo('landing')" class="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-semibold">
        Entrar / Acessar
      </button>
    `;
  } else {
    const roleBadge = currentUser.tipo === 'mesa' ? 'Mesa' : (currentUser.perfil === 'gerente' ? 'Gerente' : 'Atendente');
    sessionInfo.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex flex-col text-right">
          <span class="text-xs font-bold text-on-surface">${currentUser.nome}</span>
          <span class="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">${roleBadge}</span>
        </div>
        <button onclick="window.handleLogout()" class="px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-all text-xs font-medium flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">logout</span>
          <span>Sair</span>
        </button>
      </div>
    `;
  }
}

window.navigateTo = navigateTo;
window.handleLogout = function() {
  setCurrentUser(null);
  showToast('Sessão encerrada com sucesso.');
  navigateTo('landing');
};

document.addEventListener('DOMContentLoaded', () => {
  // Add listeners for nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const path = e.currentTarget.dataset.path;
      navigateTo(path);
    });
  });

  const logo = document.getElementById('brand-logo');
  if (logo) {
    logo.addEventListener('click', () => navigateTo('landing'));
  }

  updateSessionHeader();
  navigateTo('landing');
});
