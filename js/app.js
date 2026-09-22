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
    toastEl.classList.remove('hidden');
    setTimeout(() => {
      toastEl.classList.add('hidden');
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
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
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
      <button onclick="window.navigateTo('landing')" class="btn btn-secondary btn-sm">
        Entrar / Acessar
      </button>
    `;
  } else {
    const roleBadge = currentUser.tipo === 'mesa' ? 'Mesa' : (currentUser.perfil === 'gerente' ? 'Gerente' : 'Atendente');
    sessionInfo.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex flex-col" style="text-align: right;">
          <span style="font-size: 13px; font-weight: 700;">${currentUser.nome}</span>
          <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">${roleBadge}</span>
        </div>
        <button onclick="window.handleLogout()" class="btn btn-secondary btn-sm flex items-center gap-1">
          <span class="material-symbols-outlined" style="font-size: 16px;">logout</span>
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
