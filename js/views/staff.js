// js/views/staff.js - Staff Dashboard View
import { store, currentUser, showToast } from '../app.js';

let audioCtx = null;

function playNotificationSound() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.log('Audio playback error', e);
  }
}

export function renderStaffView() {
  const container = document.getElementById('view-staff');
  if (!container) return;

  if (!currentUser || currentUser.tipo !== 'funcionario') {
    container.innerHTML = `
      <div class="container" style="max-width: 500px; margin-top: 64px; text-align: center;">
        <div class="card">
          <h2>Acesso Restrito a Funcionários</h2>
          <p style="color: var(--text-muted); margin-top: 8px;">Logue com uma conta de atendente ou gerente.</p>
          <button onclick="window.navigateTo('landing')" class="btn btn-primary" style="margin-top: 24px;">Ir para Login</button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="container flex flex-col gap-6">

      <!-- Top Bar -->
      <div class="card flex items-center justify-between">
        <div>
          <span class="badge badge-pending">Painel Operacional</span>
          <h1 style="font-size: 24px; margin-top: 4px;">Atendimento & Pedidos — ${currentUser.nome}</h1>
        </div>
        <button id="btn-enable-audio" class="btn btn-secondary">
          <span class="material-symbols-outlined">volume_up</span>
          <span>Ativar Notificações Sonoras</span>
        </button>
      </div>

      <!-- Queue & Calls Layout -->
      <div class="grid grid-cols-3 gap-6">

        <!-- Active Orders Queue (2 cols) -->
        <div style="grid-column: span 2;" class="flex flex-col gap-4">
          <h2>Pedidos Ativos</h2>
          <div id="staff-orders-queue" class="grid grid-cols-2 gap-4"></div>
        </div>

        <!-- Service Calls (1 col) -->
        <div class="flex flex-col gap-4">
          <h2>Chamados de Mesas</h2>
          <div id="staff-calls-list" class="flex flex-col gap-3"></div>
        </div>

      </div>

    </div>
  `;

  renderOrdersQueue();
  renderCallsList();
  setupStaffEvents();
}

function renderOrdersQueue() {
  const queue = document.getElementById('staff-orders-queue');
  if (!queue) return;

  const orders = store.getOrders();
  if (orders.length === 0) {
    queue.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted);">Nenhum pedido ativo.</p>`;
    return;
  }

  queue.innerHTML = orders.map(o => `
    <div class="card flex flex-col justify-between" style="gap: 12px;">
      <div>
        <div class="flex items-center justify-between" style="margin-bottom: 8px;">
          <strong style="font-size: 16px;">${o.nome_mesa}</strong>
          <span style="font-size: 12px; color: var(--text-muted);">#${o.id}</span>
        </div>
        <div style="font-size: 13px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
          ${o.itens.map(i => `<div>${i.quantidade}x ${i.nome_prato}</div>`).join('')}
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between" style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">
          <span>Total:</span>
          <span>R$ ${o.valor_total.toFixed(2)}</span>
        </div>
        <select data-order-id="${o.id}" class="select-order-status">
          <option value="Recebido" ${o.status === 'Recebido' ? 'selected' : ''}>Recebido</option>
          <option value="Em preparo" ${o.status === 'Em preparo' ? 'selected' : ''}>Em preparo</option>
          <option value="Pronto" ${o.status === 'Pronto' ? 'selected' : ''}>Pronto</option>
          <option value="Entregue" ${o.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
          <option value="Cancelado" ${o.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.select-order-status').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = e.currentTarget.dataset.orderId;
      const status = e.currentTarget.value;
      store.updateOrderStatus(id, status);
      showToast(`Pedido #${id} alterado para "${status}".`);
      renderOrdersQueue();
    });
  });
}

function renderCallsList() {
  const list = document.getElementById('staff-calls-list');
  if (!list) return;

  const calls = store.getCalls();
  if (calls.length === 0) {
    list.innerHTML = `<p style="color: var(--text-muted);">Nenhum chamado.</p>`;
    return;
  }

  list.innerHTML = calls.map(c => `
    <div class="card" style="padding: 16px;">
      <div class="flex items-center justify-between" style="margin-bottom: 6px;">
        <strong>${c.nome_mesa}</strong>
        <span class="badge ${c.status === 'Pendente' ? 'badge-pending' : 'badge-available'}">${c.status}</span>
      </div>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">"${c.justificativa}"</p>
      ${c.status === 'Pendente' ? `
        <button data-call-id="${c.id}" class="btn-attend-call btn btn-primary btn-sm" style="width: 100%;">Marcar Atendido</button>
      ` : ''}
    </div>
  `).join('');

  document.querySelectorAll('.btn-attend-call').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.markCallAttended(e.currentTarget.dataset.callId);
      showToast('Chamado atendido!');
      renderCallsList();
    });
  });
}

function setupStaffEvents() {
  document.getElementById('btn-enable-audio')?.addEventListener('click', () => {
    playNotificationSound();
    showToast('Som ativado!');
  });
}
