// Módulo e Modal de Chamada de Funcionário (Cliente / Mesa)

import { store } from '../store.js';
import { authManager } from '../auth.js';

export function setupCallStaffModal() {
  const modal = document.getElementById('call-staff-modal');
  const closeBtn = document.getElementById('close-call-modal');
  const form = document.getElementById('call-staff-form');
  const floatingBtn = document.getElementById('floating-call-btn');

  function updateFloatingBtnVisibility() {
    if (authManager.isLoggedIn() && authManager.isMesa()) {
      floatingBtn.style.display = 'flex';
    } else {
      floatingBtn.style.display = 'none';
    }
  }

  updateFloatingBtnVisibility();
  store.subscribe(updateFloatingBtnVisibility);

  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      if (modal) modal.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentUser = authManager.getCurrentUser();
      if (!currentUser || !authManager.isMesa()) {
        alert('Você precisa estar logado com uma conta de mesa para chamar um funcionário.');
        return;
      }

      const reasonInput = document.getElementById('call-reason');
      const justificativa = reasonInput ? reasonInput.value.trim() : '';

      if (!justificativa) return;

      try {
        store.criarChamado(currentUser.id, justificativa);
        alert('Sua solicitação foi enviada aos funcionários!');
        if (reasonInput) reasonInput.value = '';
        if (modal) modal.classList.remove('active');
      } catch (err) {
        alert('Erro ao chamar funcionário: ' + err.message);
      }
    });
  }
}
