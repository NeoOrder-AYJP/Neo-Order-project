// js/views/client.js - Client Area (Mesa) View
import { store, currentUser, navigateTo, showToast } from '../app.js';

let cart = [];

export function renderClientView() {
  const container = document.getElementById('view-client');
  if (!container) return;

  if (!currentUser || currentUser.tipo !== 'mesa') {
    container.innerHTML = `
      <div class="container" style="max-width: 500px; margin-top: 64px; text-align: center;">
        <div class="card">
          <h2>Acesso Restrito a Mesas</h2>
          <p style="color: var(--text-muted); margin-top: 8px;">Você precisa estar logado com uma conta de mesa para fazer pedidos.</p>
          <button onclick="window.navigateTo('landing')" class="btn btn-primary" style="margin-top: 24px;">Ir para Login de Mesa</button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="container" style="display: flex; flex-direction: column; gap: 32px;">

      <!-- Top Action Bar -->
      <div class="card flex items-center justify-between" style="flex-wrap: wrap; gap: 16px;">
        <div>
          <span class="badge badge-available">Mesa Ativa</span>
          <h1 style="font-size: 24px; margin-top: 4px;">Fazer Pedido — ${currentUser.nome}</h1>
        </div>
        <div class="flex gap-3">
          <button id="btn-chamar-atendente" class="btn btn-secondary">
            <span class="material-symbols-outlined">notifications_active</span>
            <span>Chamar Funcionário</span>
          </button>
          <button id="btn-toggle-cart" class="btn btn-primary">
            <span class="material-symbols-outlined">shopping_cart</span>
            <span>Carrinho (<span id="cart-badge-count">0</span>)</span>
          </button>
        </div>
      </div>

      <!-- Menu Grid & Filter -->
      <div>
        <div class="flex items-center justify-between" style="margin-bottom: 16px;">
          <h2>Selecione os Pratos</h2>
          <div id="client-category-filters" class="flex gap-2">
            <button data-cat="all" class="client-cat-btn btn btn-sm btn-primary">Todos</button>
            <button data-cat="Pratos Principais" class="client-cat-btn btn btn-sm btn-secondary">Pratos Principais</button>
            <button data-cat="Peixes & Frutos do Mar" class="client-cat-btn btn btn-sm btn-secondary">Peixes</button>
            <button data-cat="Massas" class="client-cat-btn btn btn-sm btn-secondary">Massas</button>
          </div>
        </div>

        <div id="client-menu-grid" class="grid grid-cols-4 gap-6"></div>
      </div>

      <!-- History -->
      <div style="border-top: 1px solid var(--border-color); padding-top: 24px;">
        <h2 style="margin-bottom: 16px;">Histórico de Pedidos da ${currentUser.nome}</h2>
        <div id="client-history-list" class="flex flex-col gap-4"></div>
      </div>

    </div>

    <!-- Modal Cart -->
    <div id="modal-cart" class="modal-overlay hidden">
      <div class="modal-content">
        <button id="close-modal-cart" class="modal-close">×</button>
        <h3 style="margin-bottom: 16px;">Seu Carrinho</h3>
        <div id="cart-items-list" style="margin-bottom: 16px;"></div>
        <div class="flex items-center justify-between" style="margin-bottom: 16px; font-weight: 700; font-size: 18px;">
          <span>Total:</span>
          <span id="cart-total-price" style="color: var(--primary);">R$ 0,00</span>
        </div>
        <button id="btn-checkout-order" class="btn btn-primary" style="width: 100%;">Confirmar Pedido</button>
      </div>
    </div>

    <!-- Modal Call Staff -->
    <div id="modal-call-staff" class="modal-overlay hidden">
      <div class="modal-content">
        <button id="close-modal-call" class="modal-close">×</button>
        <h3 style="margin-bottom: 16px;">Chamar Funcionário</h3>
        <form id="form-call-staff">
          <div class="form-group">
            <label>Motivo / Justificativa</label>
            <textarea id="input-call-reason" required rows="3" placeholder="ex: Preciso de copos extras, gelo ou talheres..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Enviar Chamado</button>
        </form>
      </div>
    </div>
  `;

  renderClientMenuGrid('all');
  renderCart();
  renderClientHistory();
  setupClientEvents();
}

function renderClientMenuGrid(category = 'all') {
  const grid = document.getElementById('client-menu-grid');
  if (!grid) return;

  let dishes = store.getDishes().filter(d => d.ativo !== false);
  if (category !== 'all') {
    dishes = dishes.filter(d => d.categoria === category);
  }

  grid.innerHTML = dishes.map(dish => {
    const avail = store.getDishAvailability(dish.id);
    return `
      <div class="card flex flex-col justify-between" style="padding: 0; overflow: hidden;">
        <div>
          <div style="height: 160px; position: relative;">
            <img src="${dish.imagem}" alt="${dish.nome}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 8px; right: 8px;">
              ${avail.available ? `<span class="badge badge-available">${avail.maxQuantity} disp.</span>` : `<span class="badge badge-unavailable">Indisponível</span>`}
            </div>
          </div>
          <div style="padding: 16px;">
            <h4 style="font-size: 16px; font-weight: 600;">${dish.nome}</h4>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">${dish.descricao}</p>
          </div>
        </div>
        <div style="padding: 16px; border-top: 1px solid var(--border-color);" class="flex items-center justify-between">
          <span style="font-weight: 700; color: var(--primary);">R$ ${dish.preco.toFixed(2)}</span>
          <button data-dish-id="${dish.id}" class="btn-add-to-cart btn btn-primary btn-sm" ${!avail.available ? 'disabled style="opacity: 0.5;"' : ''}>+ Adicionar</button>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      addToCart(e.currentTarget.dataset.dishId);
    });
  });
}

function addToCart(dishId) {
  const dish = store.getDishById(dishId);
  const avail = store.getDishAvailability(dishId);

  if (!dish || !avail.available) {
    alert('Prato indisponível no momento.');
    return;
  }

  const existing = cart.find(i => i.prato_id === dishId);
  if (existing) {
    if (existing.quantidade + 1 > avail.maxQuantity) {
      alert(`Estoque máximo atingido (${avail.maxQuantity} disponíveis).`);
      return;
    }
    existing.quantidade += 1;
  } else {
    cart.push({
      prato_id: dish.id,
      nome_prato: dish.nome,
      preco_unitario: dish.preco,
      quantidade: 1
    });
  }

  showToast(`"${dish.nome}" adicionado!`);
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const badge = document.getElementById('cart-badge-count');
  const total = document.getElementById('cart-total-price');

  const totalItems = cart.reduce((a, i) => a + i.quantidade, 0);
  const totalPrice = cart.reduce((a, i) => a + i.preco_unitario * i.quantidade, 0);

  if (badge) badge.textContent = totalItems;
  if (total) total.textContent = `R$ ${totalPrice.toFixed(2)}`;

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 16px;">Carrinho vazio.</p>`;
    return;
  }

  list.innerHTML = cart.map((item, idx) => `
    <div class="flex items-center justify-between" style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
      <div>
        <div style="font-weight: 600;">${item.nome_prato}</div>
        <div style="font-size: 12px; color: var(--text-muted);">R$ ${item.preco_unitario.toFixed(2)} un.</div>
      </div>
      <div class="flex items-center gap-2">
        <button data-index="${idx}" data-action="dec" class="cart-qty-btn btn btn-secondary btn-sm" style="padding: 2px 8px;">-</button>
        <span style="font-weight: 600;">${item.quantidade}</span>
        <button data-index="${idx}" data-action="inc" class="cart-qty-btn btn btn-secondary btn-sm" style="padding: 2px 8px;">+</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      const action = e.currentTarget.dataset.action;
      if (action === 'inc') {
        const item = cart[idx];
        const avail = store.getDishAvailability(item.prato_id);
        if (item.quantidade + 1 > avail.maxQuantity) {
          alert('Estoque máximo atingido.');
          return;
        }
        item.quantidade += 1;
      } else {
        cart[idx].quantidade -= 1;
        if (cart[idx].quantidade <= 0) cart.splice(idx, 1);
      }
      renderCart();
    });
  });
}

function renderClientHistory() {
  const list = document.getElementById('client-history-list');
  if (!list) return;

  const orders = store.getOrders().filter(p => p.mesa_id === currentUser.id);

  if (orders.length === 0) {
    list.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">Nenhum pedido anterior.</p>`;
    return;
  }

  list.innerHTML = orders.map(o => `
    <div class="card">
      <div class="flex items-center justify-between" style="margin-bottom: 8px;">
        <span style="font-weight: 600;">#${o.id}</span>
        <span class="badge badge-pending">${o.status}</span>
      </div>
      <div style="font-size: 14px; margin-bottom: 8px;">
        ${o.itens.map(i => `<div>${i.quantidade}x ${i.nome_prato} (R$ ${(i.preco_unitario * i.quantidade).toFixed(2)})</div>`).join('')}
      </div>
      <div style="font-weight: 700; color: var(--primary);">Total: R$ ${o.valor_total.toFixed(2)}</div>
    </div>
  `).join('');
}

function setupClientEvents() {
  const modalCart = document.getElementById('modal-cart');
  const modalCall = document.getElementById('modal-call-staff');

  document.getElementById('btn-toggle-cart')?.addEventListener('click', () => modalCart?.classList.remove('hidden'));
  document.getElementById('close-modal-cart')?.addEventListener('click', () => modalCart?.classList.add('hidden'));
  document.getElementById('btn-chamar-atendente')?.addEventListener('click', () => modalCall?.classList.remove('hidden'));
  document.getElementById('close-modal-call')?.addEventListener('click', () => modalCall?.classList.add('hidden'));

  document.querySelectorAll('.client-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.client-cat-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      e.currentTarget.classList.add('btn-primary');
      e.currentTarget.classList.remove('btn-secondary');
      renderClientMenuGrid(e.currentTarget.dataset.cat);
    });
  });

  document.getElementById('btn-checkout-order')?.addEventListener('click', () => {
    if (cart.length === 0) return alert('Carrinho vazio.');
    try {
      store.createOrder(currentUser.id, cart);
      cart = [];
      renderCart();
      modalCart?.classList.add('hidden');
      renderClientMenuGrid('all');
      renderClientHistory();
      showToast('Pedido realizado com sucesso!');
    } catch (e) {
      alert(e.message);
    }
  });

  document.getElementById('form-call-staff')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const reason = document.getElementById('input-call-reason').value;
    try {
      store.createCall(currentUser.id, reason);
      modalCall?.classList.add('hidden');
      document.getElementById('input-call-reason').value = '';
      showToast('Chamado enviado!');
    } catch (e) {
      alert(e.message);
    }
  });
}
