import { store } from '../store.js';
import { getSession, isTableClient } from '../auth.js';

let cart = [];

export function renderCustomerView(container) {
  const session = getSession();

  if (!isTableClient()) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto my-12 p-8 bg-surface-container-low rounded-2xl border border-surface-variant text-center flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-5xl text-primary">table_restaurant</span>
        <h2 class="font-headline-lg text-headline-lg text-on-surface">Acesso Restrito à Mesa</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant">Você precisa se autenticar com uma conta de mesa válida para fazer pedidos.</p>
        <button onclick="window.openTableLoginModal()" class="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:bg-primary-container transition-all">
          Fazer Login de Mesa
        </button>
      </div>
    `;
    return;
  }

  const dishes = store.state.pratos.filter(p => p.ativo);
  const myOrders = store.state.pedidos.filter(p => p.mesa_id === session.id);

  const calculateCartTotal = () => cart.reduce((sum, item) => sum + (item.dish.preco * item.quantidade), 0);

  container.innerHTML = `
    <div class="w-full px-margin-mobile lg:px-margin-desktop py-space-lg max-w-7xl mx-auto flex flex-col gap-space-lg">
      <!-- Table Header & Call Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40">
        <div class="flex items-center gap-space-md">
          <div class="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">table_restaurant</span>
          </div>
          <div class="flex flex-col">
            <h1 class="font-headline-md text-headline-md text-on-surface font-bold">${session.nome}</h1>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Sessão ativa • Pedidos direto para a cozinha</span>
          </div>
        </div>
        <div class="flex items-center gap-space-sm">
          <button id="call-staff-btn" class="px-space-md py-space-sm rounded-xl bg-tertiary-container text-on-tertiary-container font-label-md font-semibold hover:bg-tertiary/20 flex items-center gap-2 transition-all">
            <span class="material-symbols-outlined">notifications_active</span>
            Chamar Funcionário
          </button>
        </div>
      </div>

      <!-- Main Layout: Menu + Cart Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <!-- Menu Column -->
        <div class="lg:col-span-8 flex flex-col gap-space-md">
          <h2 class="font-headline-sm text-headline-sm text-on-surface">Escolha seus Pratos</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            ${dishes.map(dish => {
              const avail = store.getDishAvailability(dish);
              return `
                <div class="flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-space-md border border-surface-variant/50 shadow-sm ${!avail.disponivel ? 'opacity-60' : ''}">
                  <div class="flex flex-col gap-space-xs">
                    <div class="relative w-full h-40 rounded-xl overflow-hidden mb-space-xs bg-surface-container-high">
                      <img src="${dish.imagem_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}" alt="${dish.nome}" class="w-full h-full object-cover">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${avail.disponivel ? 'bg-emerald-700 text-white' : 'bg-red-800 text-white'} shadow-sm">
                        ${avail.disponivel ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <h3 class="font-title-md text-title-md text-on-surface font-semibold">${dish.nome}</h3>
                      <span>${dish.emoji || '🍽️'}</span>
                    </div>
                    <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${dish.descricao}</p>
                  </div>
                  <div class="pt-space-md flex items-center justify-between border-t border-surface-variant/30 mt-space-sm">
                    <span class="font-title-md text-title-md text-primary font-bold">R$ ${dish.preco.toFixed(2).replace('.', ',')}</span>
                    ${avail.disponivel ? `
                      <button class="add-to-cart-btn px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-label-md font-medium hover:bg-primary-container transition-all" data-id="${dish.id}">
                        + Adicionar
                      </button>
                    ` : `
                      <span class="font-label-sm text-label-sm text-error bg-error-container/50 px-2 py-1 rounded">Esgotado</span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div class="lg:col-span-4 flex flex-col gap-space-md">
          <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 sticky top-24">
            <div class="flex items-center justify-between pb-space-sm border-b border-surface-variant/30">
              <div class="flex items-center gap-space-xs">
                <span class="material-symbols-outlined text-primary">shopping_cart</span>
                <h2 class="font-headline-sm text-headline-sm text-on-surface">Seu Carrinho</h2>
              </div>
              <span id="cart-count" class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm font-bold">0 itens</span>
            </div>

            <div id="cart-items-list" class="flex flex-col gap-space-sm py-space-md min-h-[120px] max-h-[320px] overflow-y-auto">
              <span class="text-on-surface-variant text-center font-body-md py-6">Seu carrinho está vazio.</span>
            </div>

            <div class="border-t border-surface-variant/30 pt-space-md flex flex-col gap-space-md">
              <div class="flex items-center justify-between font-title-md text-title-md font-bold text-on-surface">
                <span>Total:</span>
                <span id="cart-total-text" class="text-primary">R$ 0,00</span>
              </div>
              <button id="checkout-btn" disabled class="w-full py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-container transition-all">
                Confirmar e Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order History Section -->
      <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
        <div class="flex items-center gap-space-xs pb-space-xs border-b border-surface-variant/30">
          <span class="material-symbols-outlined text-primary">history</span>
          <h2 class="font-headline-sm text-headline-sm text-on-surface">Histórico de Pedidos da Mesa</h2>
        </div>
        ${myOrders.length === 0 ? `
          <p class="font-body-md text-body-md text-on-surface-variant">Nenhum pedido realizado nesta mesa até o momento.</p>
        ` : `
          <div class="flex flex-col gap-space-sm">
            ${myOrders.map(order => `
              <div class="p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-sm border border-surface-variant/30">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-space-xs">
                    <span class="font-label-md font-bold text-on-surface">Pedido #${order.id.slice(-6)}</span>
                    <span class="font-label-sm px-2 py-0.5 rounded-full ${
                      order.status === 'Entregue' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Cancelado' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }">${order.status}</span>
                  </div>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">${new Date(order.criado_em).toLocaleString('pt-BR')}</span>
                  <div class="font-body-sm text-body-sm text-on-surface mt-1">
                    ${order.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}
                  </div>
                </div>
                <div class="font-headline-sm font-bold text-primary self-end md:self-auto">
                  R$ ${order.valor_total.toFixed(2).replace('.', ',')}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>

    <!-- Call Staff Modal -->
    <div id="call-staff-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden">
      <div class="bg-surface-container-lowest p-space-lg rounded-2xl max-w-md w-full shadow-2xl border border-surface-variant/40 mx-4">
        <div class="flex items-center justify-between pb-space-md border-b border-surface-variant/30">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-tertiary">notifications_active</span>
            <h2 class="font-headline-sm text-headline-sm text-on-surface">Chamar Funcionário</h2>
          </div>
          <button id="close-call-modal" class="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="call-staff-form" class="flex flex-col gap-space-md pt-space-md">
          <div class="flex flex-col gap-space-xs">
            <label class="font-label-md text-label-md text-on-surface font-semibold">Justificativa / Solicitação</label>
            <textarea id="call-justification" required rows="3" placeholder="Ex: Preciso de guardanapos, conta, etc." class="w-full px-space-md py-space-sm rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-on-surface"></textarea>
          </div>
          <button type="submit" class="w-full py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold shadow-md hover:bg-primary-container transition-all">
            Enviar Chamado
          </button>
        </form>
      </div>
    </div>
  `;

  // UI Event Handlers
  const updateCartUI = () => {
    const listEl = container.querySelector('#cart-items-list');
    const totalEl = container.querySelector('#cart-total-text');
    const countEl = container.querySelector('#cart-count');
    const checkoutBtn = container.querySelector('#checkout-btn');

    const total = calculateCartTotal();
    const count = cart.reduce((c, i) => c + i.quantidade, 0);

    if (countEl) countEl.textContent = `${count} itens`;
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    if (!listEl) return;
    if (cart.length === 0) {
      listEl.innerHTML = `<span class="text-on-surface-variant text-center font-body-md py-6">Seu carrinho está vazio.</span>`;
      return;
    }

    listEl.innerHTML = cart.map((item, idx) => `
      <div class="flex items-center justify-between p-space-xs bg-surface-container-low rounded-xl border border-surface-variant/30">
        <div class="flex flex-col">
          <span class="font-label-md font-semibold text-on-surface">${item.dish.nome}</span>
          <span class="font-body-sm text-body-sm text-primary">R$ ${(item.dish.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="cart-minus-btn w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-bold" data-index="${idx}">-</button>
          <span class="font-label-md font-bold px-1">${item.quantidade}</span>
          <button class="cart-plus-btn w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-bold" data-index="${idx}">+</button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.cart-minus-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.currentTarget.getAttribute('data-index'));
        if (cart[i].quantidade > 1) {
          cart[i].quantidade--;
        } else {
          cart.splice(i, 1);
        }
        updateCartUI();
      });
    });

    listEl.querySelectorAll('.cart-plus-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.currentTarget.getAttribute('data-index'));
        const avail = store.getDishAvailability(cart[i].dish);
        if (cart[i].quantidade < avail.porcoes) {
          cart[i].quantidade++;
        } else {
          window.showToast?.('Estoque insuficiente para adicionar mais unidades.', 'warning');
        }
        updateCartUI();
      });
    });
  };

  // Add dish to cart button
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dishId = e.currentTarget.getAttribute('data-id');
      const dish = store.state.pratos.find(p => p.id === dishId);
      if (!dish) return;

      const existingIndex = cart.findIndex(c => c.dish.id === dishId);
      const avail = store.getDishAvailability(dish);

      if (existingIndex !== -1) {
        if (cart[existingIndex].quantidade < avail.porcoes) {
          cart[existingIndex].quantidade++;
        } else {
          window.showToast?.('Estoque máximo atingido para este prato.', 'warning');
        }
      } else {
        cart.push({ dish, quantidade: 1 });
      }
      updateCartUI();
    });
  });

  // Checkout order submission
  container.querySelector('#checkout-btn')?.addEventListener('click', async () => {
    if (cart.length === 0) return;

    const orderItens = cart.map(item => ({
      prato_id: item.dish.id,
      nome: item.dish.nome,
      quantidade: item.quantidade,
      preco_unitario: item.dish.preco
    }));

    const valor_total = calculateCartTotal();

    await store.addPedido({
      mesa_id: session.id,
      mesa_nome: session.nome,
      itens: orderItens,
      valor_total: valor_total
    });

    cart = [];
    window.showToast?.('Pedido realizado e enviado à cozinha com sucesso!', 'success');
    renderCustomerView(container);
  });

  // Call Staff Modal Controls
  const callModal = container.querySelector('#call-staff-modal');
  container.querySelector('#call-staff-btn')?.addEventListener('click', () => {
    callModal.classList.remove('hidden');
  });
  container.querySelector('#close-call-modal')?.addEventListener('click', () => {
    callModal.classList.add('hidden');
  });
  container.querySelector('#call-staff-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const just = container.querySelector('#call-justification').value.trim();
    if (just) {
      await store.addChamado(session.id, session.nome, just);
      callModal.classList.add('hidden');
      window.showToast?.('Funcionário chamado! Aguarde o atendimento.', 'success');
    }
  });
}
