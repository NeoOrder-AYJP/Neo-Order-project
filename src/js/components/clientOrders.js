// Componente do Histórico de Pedidos da Mesa

import { store } from '../store.js';
import { authManager } from '../auth.js';

export function renderClientOrders(container, onBackToMenu) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) return;

  const todosPedidos = store.getPedidos();
  const meusPedidos = todosPedidos.filter(p => p.mesa_id === currentUser.id);
  const pratos = store.getPratos();

  function getBadgeStatusClass(status) {
    switch (status) {
      case 'Entregue': return 'badge-disponivel';
      case 'Cancelado': return 'badge-indisponivel';
      case 'Pronto': return 'badge-info';
      default: return 'badge-pendente';
    }
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: var(--space-md);">
      <div>
        <h1>Meus Pedidos (${currentUser.nome})</h1>
        <p class="caption">Acompanhe o status e histórico dos seus pedidos</p>
      </div>
      <div>
        <button class="btn btn-primary" id="btn-voltar-cardapio">
          <i class="fa-solid fa-utensils"></i> Voltar ao Cardápio
        </button>
      </div>
    </div>

    ${meusPedidos.length === 0 ? `
      <div class="card" style="text-align: center; padding: var(--space-3xl) var(--space-xl);">
        <i class="fa-solid fa-receipt" style="font-size: 48px; color: var(--color-text-sub); margin-bottom: var(--space-md);"></i>
        <h2>Nenhum pedido realizado ainda</h2>
        <p class="caption" style="margin-bottom: var(--space-lg);">Você ainda não possui pedidos registrados para esta mesa.</p>
        <button class="btn btn-primary" id="btn-fazer-primeiro-pedido">
          Fazer um Pedido Agora
        </button>
      </div>
    ` : `
      <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
        ${meusPedidos.map(pedido => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--color-border); flex-wrap: wrap; gap: var(--space-sm);">
              <div>
                <span style="font-weight: 600; font-size: 16px;">Pedido #${pedido.id.substring(0, 8)}</span>
                <span class="caption" style="margin-left: var(--space-sm);">
                  ${new Date(pedido.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <span class="badge ${getBadgeStatusClass(pedido.status)}">
                Status: ${pedido.status}
              </span>
            </div>

            <div style="display: flex; flex-direction: column; gap: var(--space-xs); margin-bottom: var(--space-md);">
              ${pedido.itens.map(item => {
                const prato = pratos.find(p => p.id === item.prato_id);
                return `
                  <div style="display: flex; justify-content: space-between; font-size: 15px;">
                    <span>${item.quantidade}x ${prato ? prato.nome : 'Prato'}</span>
                    <span>R$ ${(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}</span>
                  </div>
                `;
              }).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: var(--space-sm); font-weight: 600;">
              <span>Total do Pedido:</span>
              <span style="color: var(--color-primary); font-size: 18px;">R$ ${pedido.valor_total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;

  const btnVoltar = container.querySelector('#btn-voltar-cardapio');
  if (btnVoltar) btnVoltar.addEventListener('click', onBackToMenu);

  const btnPrimeiro = container.querySelector('#btn-fazer-primeiro-pedido');
  if (btnPrimeiro) btnPrimeiro.addEventListener('click', onBackToMenu);
}
