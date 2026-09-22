// js/views/staff.js - Staff (Atendente/Cozinha) Dashboard View
import { store, currentUser, showToast } from '../app.js';

let audioCtx = null;

function playNotificationSound() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.log('Audio playback not supported or enabled yet', e);
  }
}

export function renderStaffView() {
  const container = document.getElementById('view-staff');
  if (!container) return;

  if (!currentUser || currentUser.tipo !== 'funcionario') {
    container.innerHTML = `
      <div class="max-w-md mx-auto my-16 p-8 text-center bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
          <span class="material-symbols-outlined text-3xl">badge</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface">Acesso Restrito a Funcionários</h2>
        <p class="text-sm text-on-surface-variant mt-2">Você precisa estar logado com uma conta de funcionário.</p>
        <button onclick="window.navigateTo('landing')" class="mt-6 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container transition-all">
          Ir para Login de Funcionário
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 md:px-margin-desktop py-8 space-y-8">

      <!-- Staff Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">Painel Operacional</span>
            <span class="text-xs text-on-surface-variant">• ${currentUser.nome} (${currentUser.perfil})</span>
          </div>
          <h1 class="text-2xl font-extrabold text-on-surface mt-1">Gestão de Pedidos e Chamados</h1>
        </div>

        <button id="btn-enable-audio" class="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant font-bold text-sm shadow-sm transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-600">volume_up</span>
          <span>Ativar Notificações Sonoras</span>
        </button>
      </div>

      <!-- Main Operational Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Active Orders Column (2 cols wide on LG) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">restaurant</span>
              <span>Pedidos Ativos em Tempo Real</span>
            </h2>
            <span id="active-orders-count" class="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
              0 pedidos
            </span>
          </div>

          <div id="staff-orders-queue" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Calls Column (1 col wide on LG) -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-600">notifications_active</span>
              <span>Chamados de Mesas</span>
            </h2>
            <span id="pending-calls-count" class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              0 pendentes
            </span>
          </div>

          <div id="staff-calls-list" class="space-y-4">
            <!-- Rendered dynamically -->
          </div>
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
  const countEl = document.getElementById('active-orders-count');
  if (!queue) return;

  const orders = store.getOrders();
  if (countEl) countEl.textContent = `${orders.length} pedidos no total`;

  if (orders.length === 0) {
    queue.innerHTML = `<p class="col-span-full text-center text-on-surface-variant py-8">Nenhum pedido cadastrado no momento.</p>`;
    return;
  }

  queue.innerHTML = orders.map(order => `
    <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant p-5 shadow-sm space-y-4 flex flex-col justify-between">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-base text-on-surface">${order.nome_mesa}</span>
          <span class="font-mono text-xs text-on-surface-variant font-semibold">#${order.id}</span>
        </div>

        <div class="space-y-1.5 divide-y divide-surface-variant/40">
          ${order.itens.map(i => `
            <div class="pt-1 flex items-center justify-between text-xs">
              <span class="font-bold text-on-surface">${i.quantidade}x ${i.nome_prato}</span>
              <span class="text-on-surface-variant">R$ ${(i.preco_unitario * i.quantidade).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-surface-variant text-sm font-extrabold">
          <span class="text-on-surface-variant text-xs">Total:</span>
          <span class="text-primary">R$ ${order.valor_total.toFixed(2)}</span>
        </div>
      </div>

      <!-- Status Selector Actions -->
      <div class="space-y-2 pt-2 border-t border-surface-variant">
        <label class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status do Pedido</label>
        <select data-order-id="${order.id}" class="select-order-status w-full px-3 py-2 rounded-xl border border-outline/30 bg-surface font-bold text-xs text-on-surface focus:outline-none focus:border-primary">
          <option value="Recebido" ${order.status === 'Recebido' ? 'selected' : ''}>Recebido</option>
          <option value="Em preparo" ${order.status === 'Em preparo' ? 'selected' : ''}>Em preparo</option>
          <option value="Pronto" ${order.status === 'Pronto' ? 'selected' : ''}>Pronto</option>
          <option value="Entregue" ${order.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
          <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.select-order-status').forEach(select => {
    select.addEventListener('change', (e) => {
      const orderId = e.currentTarget.dataset.orderId;
      const newStatus = e.currentTarget.value;
      store.updateOrderStatus(orderId, newStatus);
      showToast(`Status do pedido #${orderId} alterado para "${newStatus}".`);
      renderOrdersQueue();
    });
  });
}

function renderCallsList() {
  const callsList = document.getElementById('staff-calls-list');
  const countEl = document.getElementById('pending-calls-count');
  if (!callsList) return;

  const calls = store.getCalls();
  const pendingCalls = calls.filter(c => c.status === 'Pendente');

  if (countEl) countEl.textContent = `${pendingCalls.length} pendentes`;

  if (calls.length === 0) {
    callsList.innerHTML = `<p class="text-center text-xs text-on-surface-variant py-8">Nenhum chamado registrado.</p>`;
    return;
  }

  callsList.innerHTML = calls.map(call => `
    <div class="p-4 rounded-2xl border ${call.status === 'Pendente' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-surface-container-lowest border-surface-variant'} shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-on-surface">${call.nome_mesa}</span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${call.status === 'Pendente' ? 'bg-amber-500 text-amber-950' : 'bg-gray-200 text-gray-700'}">
          ${call.status}
        </span>
      </div>

      <p class="text-xs text-on-surface-variant font-medium bg-surface/80 p-2.5 rounded-xl border border-surface-variant/50">
        "${call.justificativa}"
      </p>

      <div class="flex items-center justify-between text-[11px] text-on-surface-variant">
        <span>${new Date(call.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        ${call.status === 'Pendente' ? `
          <button data-call-id="${call.id}" class="btn-attend-call px-3 py-1 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-sm">
            Marcar Atendido
          </button>
        ` : `
          <span class="text-green-700 font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">check_circle</span> Atendido
          </span>
        `}
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-attend-call').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const callId = e.currentTarget.dataset.callId;
      store.markCallAttended(callId);
      showToast('Chamado marcado como atendido!');
      renderCallsList();
    });
  });
}

function setupStaffEvents() {
  document.getElementById('btn-enable-audio')?.addEventListener('click', () => {
    playNotificationSound();
    showToast('Notificações sonoras ativadas!');
  });
}
