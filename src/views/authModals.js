import { store } from '../store.js';
import { setSession } from '../auth.js';

export function renderAuthModals(container) {
  container.innerHTML = `
    <!-- Table Login Modal -->
    <div id="table-login-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden">
      <div class="bg-surface-container-lowest p-space-lg rounded-2xl max-w-md w-full shadow-2xl border border-surface-variant/40 mx-4">
        <div class="flex items-center justify-between pb-space-md border-b border-surface-variant/30">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary">table_restaurant</span>
            <h2 class="font-headline-sm text-headline-sm text-on-surface">Login de Mesa</h2>
          </div>
          <button id="close-table-modal" class="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="table-login-form" class="flex flex-col gap-space-md pt-space-md">
          <div class="flex flex-col gap-space-xs">
            <label class="font-label-md text-label-md text-on-surface font-semibold">Identificador da Mesa / Login</label>
            <input type="text" id="table-login-input" required placeholder="Ex: mesa05" class="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-on-surface">
          </div>
          <div class="flex flex-col gap-space-xs">
            <label class="font-label-md text-label-md text-on-surface font-semibold">Senha da Mesa</label>
            <input type="password" id="table-password-input" required placeholder="••••••••" class="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-on-surface">
          </div>
          <div id="table-login-error" class="text-error font-body-sm text-body-sm hidden"></div>
          <button type="submit" class="w-full py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold shadow-md hover:bg-primary-container transition-all">
            Entrar na Mesa
          </button>
        </form>
      </div>
    </div>

    <!-- Staff Login Modal -->
    <div id="staff-login-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden">
      <div class="bg-surface-container-lowest p-space-lg rounded-2xl max-w-md w-full shadow-2xl border border-surface-variant/40 mx-4">
        <div class="flex items-center justify-between pb-space-md border-b border-surface-variant/30">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary">badge</span>
            <h2 class="font-headline-sm text-headline-sm text-on-surface">Área do Funcionário</h2>
          </div>
          <button id="close-staff-modal" class="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="staff-login-form" class="flex flex-col gap-space-md pt-space-md">
          <div class="flex flex-col gap-space-xs">
            <label class="font-label-md text-label-md text-on-surface font-semibold">Usuário de Acesso</label>
            <input type="text" id="staff-login-input" required placeholder="Ex: gerente / atendente" class="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-on-surface">
          </div>
          <div class="flex flex-col gap-space-xs">
            <label class="font-label-md text-label-md text-on-surface font-semibold">Senha</label>
            <input type="password" id="staff-password-input" required placeholder="••••••••" class="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-on-surface">
          </div>
          <div id="staff-login-error" class="text-error font-body-sm text-body-sm hidden"></div>
          <button type="submit" class="w-full py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold shadow-md hover:bg-primary-container transition-all">
            Acessar Painel
          </button>
        </form>
      </div>
    </div>
  `;

  // Global helper functions
  window.openTableLoginModal = () => {
    document.getElementById('table-login-modal').classList.remove('hidden');
  };
  window.closeTableLoginModal = () => {
    document.getElementById('table-login-modal').classList.add('hidden');
    document.getElementById('table-login-error').classList.add('hidden');
  };
  window.openStaffLoginModal = () => {
    document.getElementById('staff-login-modal').classList.remove('hidden');
  };
  window.closeStaffLoginModal = () => {
    document.getElementById('staff-login-modal').classList.add('hidden');
    document.getElementById('staff-login-error').classList.add('hidden');
  };

  document.getElementById('close-table-modal')?.addEventListener('click', window.closeTableLoginModal);
  document.getElementById('close-staff-modal')?.addEventListener('click', window.closeStaffLoginModal);

  // Table Login submit handler
  document.getElementById('table-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('table-login-input').value.trim();
    const pass = document.getElementById('table-password-input').value.trim();
    const errorEl = document.getElementById('table-login-error');

    const table = store.state.mesas.find(m => m.login === login && m.senha === pass && m.ativo);
    if (table) {
      setSession({
        tipo: 'mesa',
        id: table.id,
        nome: table.nome,
        login: table.login
      });
      window.closeTableLoginModal();
      window.location.hash = '#mesa-cliente';
    } else {
      errorEl.textContent = 'Mesa ou senha inválida, ou conta inativa.';
      errorEl.classList.remove('hidden');
    }
  });

  // Staff Login submit handler
  document.getElementById('staff-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('staff-login-input').value.trim();
    const pass = document.getElementById('staff-password-input').value.trim();
    const errorEl = document.getElementById('staff-login-error');

    const func = store.state.funcionarios.find(f => f.login === login && f.senha === pass && f.ativo);
    if (func) {
      setSession({
        tipo: 'funcionario',
        id: func.id,
        nome: func.nome,
        login: func.login,
        perfil: func.perfil
      });
      window.closeStaffLoginModal();
      if (func.perfil === 'Gerente') {
        window.location.hash = '#gestao-faturamento';
      } else {
        window.location.hash = '#painel-atendente';
      }
    } else {
      errorEl.textContent = 'Usuário ou senha de funcionário inválida.';
      errorEl.classList.remove('hidden');
    }
  });
}
