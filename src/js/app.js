// Ponto de Entrada Principal da Aplicação JS

import { store } from './store.js';
import { authManager } from './auth.js';
import { renderLandingPage } from './components/landing.js';
import { renderClientMenu, getCarrinho, limparCarrinho } from './components/clientMenu.js';
import { renderClientOrders } from './components/clientOrders.js';
import { setupCallStaffModal } from './components/callStaff.js';
import { renderStaffOrders } from './components/staffOrders.js';
import { renderStaffCalls } from './components/staffCalls.js';
import { renderManagerMenu } from './components/managerMenu.js';
import { renderManagerStock } from './components/managerStock.js';
import { renderManagerAccounts } from './components/managerAccounts.js';
import { renderManagerBilling } from './components/managerBilling.js';
import { renderManagerBackup } from './components/managerBackup.js';

let currentView = 'landing'; // 'landing' | 'clientMenu' | 'clientOrders' | 'staffDashboard'
let activeStaffTab = 'orders'; // 'orders' | 'calls' | 'menu' | 'stock' | 'accounts' | 'billing' | 'backup'

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const navActions = document.getElementById('nav-actions');
  const loginModal = document.getElementById('login-modal');
  const closeLoginModal = document.getElementById('close-login-modal');
  const loginModalBody = document.getElementById('login-modal-body');
  const loginModalTitle = document.getElementById('login-modal-title');
  const brandLogo = document.getElementById('brand-logo');

  setupCallStaffModal();

  function updateNavbar() {
    const currentUser = authManager.getCurrentUser();
    if (!currentUser) {
      navActions.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="nav-btn-cliente">
          <i class="fa-solid fa-utensils"></i> Login Mesa
        </button>
        <button class="btn btn-primary btn-sm" id="nav-btn-funcionario">
          <i class="fa-solid fa-user-gear"></i> Área do Funcionário
        </button>
      `;
      document.getElementById('nav-btn-cliente').addEventListener('click', () => abrirModalLogin('mesa'));
      document.getElementById('nav-btn-funcionario').addEventListener('click', () => abrirModalLogin('funcionario'));
    } else {
      navActions.innerHTML = `
        <div class="nav-user-info">
          <i class="fa-solid ${currentUser.tipo === 'mesa' ? 'fa-chair' : 'fa-user-tie'}"></i>
          <span>${currentUser.nome} ${currentUser.perfil ? `(${currentUser.perfil})` : ''}</span>
        </div>
        <button class="btn btn-secondary btn-sm" id="nav-btn-logout">
          <i class="fa-solid fa-right-from-bracket"></i> Sair
        </button>
      `;
      document.getElementById('nav-btn-logout').addEventListener('click', () => {
        authManager.logout();
        currentView = 'landing';
        renderApp();
      });
    }
  }

  function abrirModalLogin(tipo) {
    loginModalTitle.innerText = tipo === 'mesa' ? 'Acesso da Mesa' : 'Acesso de Funcionário';
    loginModalBody.innerHTML = `
      <form id="login-form">
        <div class="form-group">
          <label class="form-label">${tipo === 'mesa' ? 'Identificador da Mesa' : 'Usuário'}</label>
          <input type="text" class="form-control" id="login-input" placeholder="${tipo === 'mesa' ? 'Ex: mesa01' : 'Ex: gerente'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Senha</label>
          <input type="password" class="form-control" id="senha-input" placeholder="Sua senha" required>
        </div>
        <div id="login-error" style="color: var(--color-error); font-size: 14px; margin-bottom: var(--space-md); display: none;"></div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
      </form>
    `;

    loginModal.classList.add('active');

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const loginVal = document.getElementById('login-input').value;
      const senhaVal = document.getElementById('senha-input').value;
      const errorDiv = document.getElementById('login-error');

      try {
        if (tipo === 'mesa') {
          authManager.loginMesa(loginVal, senhaVal);
          currentView = 'clientMenu';
        } else {
          authManager.loginFuncionario(loginVal, senhaVal);
          currentView = 'staffDashboard';
        }
        loginModal.classList.remove('active');
        renderApp();
      } catch (err) {
        errorDiv.innerText = err.message;
        errorDiv.style.display = 'block';
      }
    });
  }

  closeLoginModal.addEventListener('click', () => {
    loginModal.classList.remove('active');
  });

  brandLogo.addEventListener('click', () => {
    if (!authManager.isLoggedIn()) {
      currentView = 'landing';
    } else if (authManager.isMesa()) {
      currentView = 'clientMenu';
    } else {
      currentView = 'staffDashboard';
    }
    renderApp();
  });

  document.addEventListener('confirmar-pedido-solicitado', () => {
    const currentUser = authManager.getCurrentUser();
    if (!currentUser || !authManager.isMesa()) return;

    const carrinho = getCarrinho();
    if (carrinho.length === 0) return;

    const itensPedido = carrinho.map(i => ({
      prato_id: i.prato.id,
      quantidade: i.quantidade,
      preco_unitario: i.prato.preco
    }));

    try {
      store.fazerPedido(currentUser.id, itensPedido);
      limparCarrinho();
      alert('Seu pedido foi realizado com sucesso!');
      currentView = 'clientOrders';
      renderApp();
    } catch (err) {
      alert('Erro ao realizar pedido: ' + err.message);
    }
  });

  function renderApp() {
    updateNavbar();

    const currentUser = authManager.getCurrentUser();

    if (!currentUser && currentView !== 'landing') {
      currentView = 'landing';
    }

    if (currentView === 'landing') {
      renderLandingPage(mainContent, (tipo) => abrirModalLogin(tipo));
    } else if (currentView === 'clientMenu') {
      renderClientMenu(mainContent, () => {
        currentView = 'clientOrders';
        renderApp();
      });
    } else if (currentView === 'clientOrders') {
      renderClientOrders(mainContent, () => {
        currentView = 'clientMenu';
        renderApp();
      });
    } else if (currentView === 'staffDashboard') {
      const isGerente = authManager.isGerente();

      mainContent.innerHTML = `
        <div class="tab-nav">
          <div class="tab-item ${activeStaffTab === 'orders' ? 'active' : ''}" id="tab-orders">
            <i class="fa-solid fa-list-check"></i> Pedidos Ativos
          </div>
          <div class="tab-item ${activeStaffTab === 'calls' ? 'active' : ''}" id="tab-calls">
            <i class="fa-solid fa-bell"></i> Chamados
          </div>
          ${isGerente ? `
            <div class="tab-item ${activeStaffTab === 'menu' ? 'active' : ''}" id="tab-menu">
              <i class="fa-solid fa-book-open"></i> Cardápio
            </div>
            <div class="tab-item ${activeStaffTab === 'stock' ? 'active' : ''}" id="tab-stock">
              <i class="fa-solid fa-boxes-stacked"></i> Estoque
            </div>
            <div class="tab-item ${activeStaffTab === 'accounts' ? 'active' : ''}" id="tab-accounts">
              <i class="fa-solid fa-users"></i> Contas
            </div>
            <div class="tab-item ${activeStaffTab === 'billing' ? 'active' : ''}" id="tab-billing">
              <i class="fa-solid fa-chart-line"></i> Faturamento
            </div>
            <div class="tab-item ${activeStaffTab === 'backup' ? 'active' : ''}" id="tab-backup">
              <i class="fa-solid fa-database"></i> Backup
            </div>
          ` : ''}
        </div>
        <div id="staff-tab-content"></div>
      `;

      const tabContent = document.getElementById('staff-tab-content');

      function switchStaffTab(tab) {
        activeStaffTab = tab;
        renderApp();
      }

      document.getElementById('tab-orders').addEventListener('click', () => switchStaffTab('orders'));
      document.getElementById('tab-calls').addEventListener('click', () => switchStaffTab('calls'));

      if (isGerente) {
        document.getElementById('tab-menu').addEventListener('click', () => switchStaffTab('menu'));
        document.getElementById('tab-stock').addEventListener('click', () => switchStaffTab('stock'));
        document.getElementById('tab-accounts').addEventListener('click', () => switchStaffTab('accounts'));
        document.getElementById('tab-billing').addEventListener('click', () => switchStaffTab('billing'));
        document.getElementById('tab-backup').addEventListener('click', () => switchStaffTab('backup'));
      }

      if (activeStaffTab === 'orders') renderStaffOrders(tabContent);
      else if (activeStaffTab === 'calls') renderStaffCalls(tabContent);
      else if (activeStaffTab === 'menu' && isGerente) renderManagerMenu(tabContent);
      else if (activeStaffTab === 'stock' && isGerente) renderManagerStock(tabContent);
      else if (activeStaffTab === 'accounts' && isGerente) renderManagerAccounts(tabContent);
      else if (activeStaffTab === 'billing' && isGerente) renderManagerBilling(tabContent);
      else if (activeStaffTab === 'backup' && isGerente) renderManagerBackup(tabContent);
      else renderStaffOrders(tabContent);
    }
  }

  store.subscribe(() => {
    // Re-renderizar app em mudanças globais de store se necessário
  });

  renderApp();
});
