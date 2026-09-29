// Componente do Painel de Pedidos Ativos (Atendentes e Gerentes)

import { store } from '../store.js';

export function renderStaffOrders(container) {
  function render() {
    const pedidos = store.getPedidos();
    const usuarios = store.getUsuarios();
    const pratos = store.getPratos();

    function getMesaNome(mesaId) {
      const u = usuarios.find(usr => usr.id === mesaId);
      return u ? u.nome : 'Mesa Desconhecida';
    }

    function getBadgeClass(status) {
      switch (status) {
        case 'Entregue': return 'badge-disponivel';
        case 'Cancelado': return 'badge-indisponivel';
        case 'Pronto': return 'badge-info';
        default: return 'badge-pendente';
      }
    }

    container.innerHTML = `
      <div style="margin-bottom: var(--space-lg);">
        <h2>Gerenciamento de Pedidos</h2>
        <p class="caption">Acompanhe e atualize em tempo real os pedidos realizados pelas mesas</p>
      </div>

      ${pedidos.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-3xl) var(--space-xl);">
          <i class="fa-solid fa-list-check" style="font-size: 48px; color: var(--color-text-sub); margin-bottom: var(--space-md);"></i>
          <h3>Nenhum pedido no momento</h3>
          <p class="caption">Novos pedidos feitos pelas mesas aparecerão aqui automaticamente.</p>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          ${pedidos.map(pedido => `
            <div class="card" style="border-left: 6px solid ${
              pedido.status === 'Entregue' ? 'var(--color-success)' :
              pedido.status === 'Cancelado' ? 'var(--color-error)' :
              pedido.status === 'Pronto' ? 'var(--color-primary)' : 'var(--color-highlight)'
            };">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-sm);">
                <div>
                  <h3 style="display: flex; align-items: center; gap: var(--space-xs);">
                    <i class="fa-solid fa-chair" style="color: var(--color-primary);"></i>
                    ${getMesaNome(pedido.mesa_id)}
                  </h3>
                  <p class="caption">
                    Pedido #${pedido.id.substring(0, 8)} •
                    ${new Date(pedido.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div style="display: flex; align-items: center; gap: var(--space-md);">
                  <span class="badge ${getBadgeClass(pedido.status)}">
                    ${pedido.status}
                  </span>

                  <div class="form-group" style="margin: 0;">
                    <select class="form-control select-status" data-id="${pedido.id}" style="padding: 6px 12px; font-size: 13px;">
                      <option value="Recebido" ${pedido.status === 'Recebido' ? 'selected' : ''}>Recebido</option>
                      <option value="Em preparo" ${pedido.status === 'Em preparo' ? 'selected' : ''}>Em preparo</option>
                      <option value="Pronto" ${pedido.status === 'Pronto' ? 'selected' : ''}>Pronto</option>
                      <option value="Entregue" ${pedido.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                      <option value="Cancelado" ${pedido.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Itens do Pedido -->
              <div style="background-color: var(--color-bg-light); border-radius: 8px; padding: var(--space-md); margin-bottom: var(--space-md);">
                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                  ${pedido.itens.map(item => {
                    const prato = pratos.find(p => p.id === item.prato_id);
                    return `
                      <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <span><strong>${item.quantidade}x</strong> ${prato ? prato.nome : 'Prato'}</span>
                        <span>R$ ${(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 600;">
                <span class="caption">Valor Total:</span>
                <span style="font-size: 18px; color: var(--color-primary);">R$ ${pedido.valor_total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;

    // Eventos de alteração de status
    container.querySelectorAll('.select-status').forEach(select => {
      select.addEventListener('change', (e) => {
        const pedidoId = e.currentTarget.dataset.id;
        const novoStatus = e.currentTarget.value;
        try {
          store.atualizarStatusPedido(pedidoId, novoStatus);
          render();
        } catch (err) {
          alert('Erro ao atualizar status: ' + err.message);
        }
      });
    });
  }

  render();
}
