// Componente do Cardápio Interativo e Carrinho do Cliente (Mesa)

import { store } from '../store.js';

let carrinhoState = []; // Array de { prato, quantidade }

export function getCarrinho() {
  return carrinhoState;
}

export function limparCarrinho() {
  carrinhoState = [];
}

export function renderClientMenu(container, onNavigateToOrders) {
  const pratos = store.getPratos().filter(p => p.ativo);

  function updateView() {
    const totalCarrinho = carrinhoState.reduce((sum, item) => sum + (item.prato.preco * item.quantidade), 0);
    const totalItens = carrinhoState.reduce((sum, item) => sum + item.quantidade, 0);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: var(--space-md);">
        <div>
          <h1>Cardápio da Mesa</h1>
          <p class="caption">Selecione os pratos desejados e confirme seu pedido</p>
        </div>
        <div>
          <button class="btn btn-secondary" id="btn-ver-historico">
            <i class="fa-solid fa-clock-rotate-left"></i> Meus Pedidos
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 340px; gap: var(--space-xl); align-items: start;" class="client-menu-layout">
        <!-- Lista de Pratos -->
        <div class="menu-grid">
          ${pratos.map(prato => {
            const disponivel = store.isPratoDisponivel(prato.id);
            const porcoesDisponiveis = store.getPratoPorcoesDisponiveis(prato.id);
            const itemNoCarrinho = carrinhoState.find(i => i.prato.id === prato.id);
            const qtdNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

            return `
              <div class="card dish-card">
                <img src="${prato.imagem}" alt="${prato.nome}" class="dish-img">
                <div class="dish-body">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-xs); margin-bottom: var(--space-xs);">
                    <h3>${prato.nome}</h3>
                    <span class="badge ${disponivel ? 'badge-disponivel' : 'badge-indisponivel'}">
                      ${disponivel ? `Disponível (${porcoesDisponiveis})` : 'Indisponível'}
                    </span>
                  </div>
                  <p class="metadata" style="margin-bottom: var(--space-md); flex: 1;">${prato.descricao}</p>

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <span class="dish-price">R$ ${prato.preco.toFixed(2).replace('.', ',')}</span>
                    ${disponivel ? `
                      <button class="btn btn-primary btn-add-dish" data-id="${prato.id}" ${qtdNoCarrinho >= porcoesDisponiveis ? 'disabled' : ''}>
                        <i class="fa-solid fa-plus"></i> Adicionar
                      </button>
                    ` : `
                      <button class="btn btn-disabled" disabled>Esgotado</button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Resumo do Carrinho -->
        <div class="card" style="position: sticky; top: calc(var(--nav-height) + var(--space-md));">
          <h3 style="margin-bottom: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-cart-shopping" style="color: var(--color-primary);"></i> Seu Pedido</span>
            <span class="badge badge-info">${totalItens} itens</span>
          </h3>

          ${carrinhoState.length === 0 ? `
            <p class="caption" style="text-align: center; padding: var(--space-xl) 0;">
              Seu carrinho está vazio.<br>Adicione pratos do cardápio para fazer um pedido.
            </p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-lg); max-height: 300px; overflow-y: auto;">
              ${carrinhoState.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: var(--space-sm); border-bottom: 1px solid var(--color-border);">
                  <div style="flex: 1;">
                    <div style="font-weight: 500; font-size: 14px;">${item.prato.nome}</div>
                    <div class="caption">R$ ${item.prato.preco.toFixed(2).replace('.', ',')} un</div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn btn-secondary btn-sm btn-qtd-minus" data-id="${item.prato.id}" style="padding: 4px 8px;">-</button>
                    <span style="font-weight: 600; min-width: 16px; text-align: center;">${item.quantidade}</span>
                    <button class="btn btn-secondary btn-sm btn-qtd-plus" data-id="${item.prato.id}" style="padding: 4px 8px;">+</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="border-top: 2px dashed var(--color-border); padding-top: var(--space-md); margin-bottom: var(--space-lg);">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 600;">
                <span>Total:</span>
                <span style="color: var(--color-primary);">R$ ${totalCarrinho.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button class="btn btn-primary" id="btn-confirmar-pedido" style="width: 100%; padding: 14px;">
              <i class="fa-solid fa-check"></i> Confirmar Pedido
            </button>
          `}
        </div>
      </div>
    `;

    // Eventos
    container.querySelectorAll('.btn-add-dish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pratoId = e.currentTarget.dataset.id;
        const prato = pratos.find(p => p.id === pratoId);
        if (!prato) return;

        const maxPorcoes = store.getPratoPorcoesDisponiveis(pratoId);
        const itemExistente = carrinhoState.find(i => i.prato.id === pratoId);

        if (itemExistente) {
          if (itemExistente.quantidade < maxPorcoes) {
            itemExistente.quantidade += 1;
          }
        } else {
          if (maxPorcoes > 0) {
            carrinhoState.push({ prato, quantidade: 1 });
          }
        }
        updateView();
      });
    });

    container.querySelectorAll('.btn-qtd-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pratoId = e.currentTarget.dataset.id;
        const itemIndex = carrinhoState.findIndex(i => i.prato.id === pratoId);
        if (itemIndex > -1) {
          carrinhoState[itemIndex].quantidade -= 1;
          if (carrinhoState[itemIndex].quantidade <= 0) {
            carrinhoState.splice(itemIndex, 1);
          }
        }
        updateView();
      });
    });

    container.querySelectorAll('.btn-qtd-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pratoId = e.currentTarget.dataset.id;
        const maxPorcoes = store.getPratoPorcoesDisponiveis(pratoId);
        const item = carrinhoState.find(i => i.prato.id === pratoId);
        if (item && item.quantidade < maxPorcoes) {
          item.quantidade += 1;
        }
        updateView();
      });
    });

    const btnHistorico = container.querySelector('#btn-ver-historico');
    if (btnHistorico) {
      btnHistorico.addEventListener('click', onNavigateToOrders);
    }

    const btnConfirmar = container.querySelector('#btn-confirmar-pedido');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => {
        const event = new CustomEvent('confirmar-pedido-solicitado');
        document.dispatchEvent(event);
      });
    }
  }

  updateView();
}
