import { store } from '../store.js';
import { isAttendant } from '../auth.js';

let audioEnabled = false;

export function renderAttendantView(container) {
  if (!isAttendant()) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto my-12 p-8 bg-surface-container-low rounded-2xl border border-surface-variant text-center flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-5xl text-error">lock</span>
        <h2 class="font-headline-lg text-headline-lg text-on-surface">Acesso Restrito ao Atendimento</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant">Você precisa fazer login como Funcionário (Atendente ou Gerente) para ver este painel.</p>
        <button onclick="window.openStaffLoginModal()" class="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:bg-primary-container transition-all">
          Login de Funcionário
        </button>
      </div>
    `;
    return;
  }

  const pedidos = store.state.pedidos;
  const chamadosPendentes = store.state.chamados.filter(c => c.status === 'Pendente');

  container.innerHTML = `
    <div class="w-full px-margin-mobile lg:px-margin-desktop py-space-lg max-w-7xl mx-auto flex flex-col gap-space-lg">
      <!-- Header with Sound Notification Toggle -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40">
        <div class="flex items-center gap-space-md">
          <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">soup_kitchen</span>
          </div>
          <div>
            <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Painel do Atendente &amp; Cozinha</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Acompanhamento e atualização de pedidos e solicitações em tempo real.</p>
          </div>
        </div>
        <div class="flex items-center gap-space-sm">
          <button id="toggle-audio-btn" class="px-space-md py-space-sm rounded-xl border border-outline font-label-md font-semibold flex items-center gap-2 transition-all ${audioEnabled ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-surface-container-low text-on-surface'}">
            <span class="material-symbols-outlined">${audioEnabled ? 'volume_up' : 'volume_off'}</span>
            <span>${audioEnabled ? 'Notificações Sonoras Ativas' : 'Ativar Notificações Sonoras'}</span>
          </button>
        </div>
      </div>

      <!-- Grid Layout: Orders Panel + Calls Panel -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <!-- Active Orders Column -->
        <div class="lg:col-span-8 flex flex-col gap-space-md">
          <div class="flex items-center justify-between">
            <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">receipt_long</span>
              Pedidos em Andamento (${pedidos.length})
            </h2>
          </div>

          ${pedidos.length === 0 ? `
            <div class="p- space-xl text-center bg-surface-container-lowest rounded-2xl border border-surface-variant/40 py-12">
              <p class="font-body-lg text-on-surface-variant">Nenhum pedido ativo no momento.</p>
            </div>
          ` : `
            <div class="flex flex-col gap-space-md">
              ${pedidos.map(order => `
                <div class="bg-surface-container-lowest rounded-2xl p-space-md border border-surface-variant/40 shadow-sm flex flex-col gap-space-sm">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-variant/30 pb-space-xs gap-2">
                    <div class="flex items-center gap-space-xs">
                      <span class="font-headline-sm text-headline-sm font-bold text-on-surface">${order.mesa_nome}</span>
                      <span class="text-on-surface-variant font-body-sm">• #${order.id.slice(-6)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-label-sm px-3 py-1 rounded-full font-semibold ${
                        order.status === 'Recebido' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        order.status === 'Em preparo' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                        order.status === 'Pronto' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                        order.status === 'Entregue' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        'bg-red-100 text-red-900 border border-red-300'
                      }">${order.status}</span>
                      <span class="font-body-sm text-body-sm text-on-surface-variant">${new Date(order.criado_em).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>

                  <!-- Items list -->
                  <div class="flex flex-col gap-1 py-1">
                    ${order.itens.map(i => `
                      <div class="flex items-center justify-between font-body-md text-on-surface">
                        <span><strong>${i.quantidade}x</strong> ${i.nome}</span>
                        <span class="text-on-surface-variant">R$ ${(i.preco_unitario * i.quantidade).toFixed(2).replace('.', ',')}</span>
                      </div>
                    `).join('')}
                  </div>

                  <div class="flex flex-col sm:flex-row items-center justify-between pt-space-xs border-t border-surface-variant/30 gap-space-sm">
                    <span class="font-title-md font-bold text-primary self-start sm:self-auto">Total: R$ ${order.valor_total.toFixed(2).replace('.', ',')}</span>

                    <!-- Status selector buttons -->
                    <div class="flex items-center gap-1 flex-wrap self-end sm:self-auto">
                      <button class="status-btn px-2.5 py-1 text-xs rounded-lg border hover:bg-surface-container-high transition-all" data-id="${order.id}" data-status="Recebido">Recebido</button>
                      <button class="status-btn px-2.5 py-1 text-xs rounded-lg border hover:bg-surface-container-high transition-all" data-id="${order.id}" data-status="Em preparo">Em preparo</button>
                      <button class="status-btn px-2.5 py-1 text-xs rounded-lg border hover:bg-surface-container-high transition-all" data-id="${order.id}" data-status="Pronto">Pronto</button>
                      <button class="status-btn px-2.5 py-1 text-xs rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-all" data-id="${order.id}" data-status="Entregue">Entregue</button>
                      <button class="status-btn px-2.5 py-1 text-xs rounded-lg bg-red-800 text-white hover:bg-red-900 transition-all" data-id="${order.id}" data-status="Cancelado">Cancelar</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Calls Sidebar Column -->
        <div class="lg:col-span-4 flex flex-col gap-space-md">
          <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
            <div class="flex items-center justify-between pb-space-xs border-b border-surface-variant/30">
              <h2 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-tertiary">notifications</span>
                Chamados (${chamadosPendentes.length})
              </h2>
            </div>

            ${chamadosPendentes.length === 0 ? `
              <p class="font-body-md text-body-md text-on-surface-variant py-6 text-center">Nenhum chamado pendente no momento.</p>
            ` : `
              <div class="flex flex-col gap-space-sm">
                ${chamadosPendentes.map(call => `
                  <div class="p-space-sm rounded-xl bg-tertiary-container/20 border border-tertiary-container/40 flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <span class="font-label-md font-bold text-on-surface">${call.mesa_nome}</span>
                      <span class="font-body-sm text-body-sm text-on-surface-variant">${new Date(call.criado_em).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p class="font-body-md text-body-md text-on-surface italic">"${call.justificativa}"</p>
                    <button class="mark-attended-btn mt-1 w-full py-1.5 rounded-lg bg-tertiary text-on-tertiary font-label-sm font-semibold hover:bg-tertiary/90 transition-all" data-id="${call.id}">
                      Marcar como Atendido
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  // Audio Toggle Button Event Handler
  container.querySelector('#toggle-audio-btn')?.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    window.showToast?.(audioEnabled ? 'Notificações sonoras ativadas.' : 'Notificações sonoras desativadas.', 'info');
    renderAttendantView(container);
  });

  // Status Change Event Handler
  container.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const pedidoId = e.currentTarget.getAttribute('data-id');
      const newStatus = e.currentTarget.getAttribute('data-status');
      await store.updateOrderStatus(pedidoId, newStatus);
      window.showToast?.(`Status do pedido atualizado para: ${newStatus}`, 'success');
      renderAttendantView(container);
    });
  });

  // Mark Call Attended Event Handler
  container.querySelectorAll('.mark-attended-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const callId = e.currentTarget.getAttribute('data-id');
      await store.markChamadoAtendido(callId);
      window.showToast?.('Chamado marcado como atendido!', 'success');
      renderAttendantView(container);
    });
  });
}
