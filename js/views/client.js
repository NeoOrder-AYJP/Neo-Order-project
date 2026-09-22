// js/views/client.js - Client Area (Mesa) View
import { store, currentUser, navigateTo, showToast } from '../app.js';

let cart = []; // [{ prato_id, nome_prato, preco_unitario, quantidade }]

export function renderClientView() {
  const container = document.getElementById('view-client');
  if (!container) return;

  if (!currentUser || currentUser.tipo !== 'mesa') {
    container.innerHTML = `
      <div class="max-w-md mx-auto my-16 p-8 text-center bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <span class="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface">Acesso Restrito a Mesas</h2>
        <p class="text-sm text-on-surface-variant mt-2">Você precisa estar logado com uma conta de mesa para fazer pedidos.</p>
        <button onclick="window.navigateTo('landing')" class="mt-6 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container transition-all">
          Ir para Login de Mesa
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 md:px-margin-desktop py-8 space-y-8">

      <!-- Top Client Header & Call Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Mesa Ativa</span>
            <span class="text-xs text-on-surface-variant">• ${currentUser.nome}</span>
          </div>
          <h1 class="text-2xl font-extrabold text-on-surface mt-1">Fazer Pedido & Atendimento</h1>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-chamar-atendente" class="px-4 py-2.5 rounded-xl bg-amber-500 text-amber-950 hover:bg-amber-400 font-bold text-sm shadow-sm transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">notifications_active</span>
            <span>Chamar Funcionário</span>
          </button>

          <button id="btn-toggle-cart" class="relative px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">shopping_cart</span>
            <span>Carrinho</span>
            <span id="cart-badge-count" class="ml-1 px-2 py-0.5 rounded-full bg-white text-primary text-xs font-extrabold">0</span>
          </button>
        </div>
      </div>

      <!-- Menu Grid & Categories -->
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 class="text-xl font-bold text-on-surface">Selecione os Pratos</h2>

          <div id="client-category-filters" class="flex flex-wrap gap-2">
            <button data-cat="all" class="client-cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary shadow-sm">
              Todos
            </button>
            <button data-cat="Pratos Principais" class="client-cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
              Pratos Principais
            </button>
            <button data-cat="Peixes & Frutos do Mar" class="client-cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
              Peixes
            </button>
            <button data-cat="Massas" class="client-cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
              Massas
            </button>
          </div>
        </div>

        <div id="client-menu-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- Order History Section -->
      <div class="space-y-4 pt-6 border-t border-surface-variant">
        <h2 class="text-xl font-bold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">history</span>
          <span>Histórico de Pedidos da ${currentUser.nome}</span>
        </h2>

        <div id="client-history-list" class="space-y-4">
          <!-- Rendered dynamically -->
        </div>
      </div>

    </div>

    <!-- Cart Drawer / Modal -->
    <div id="modal-cart" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex justify-end">
      <div class="bg-surface-container-lowest w-full max-w-md h-full p-6 shadow-2xl border-l border-surface-variant flex flex-col justify-between overflow-y-auto">
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-surface-variant">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">shopping_bag</span>
              <h3 class="text-lg font-bold text-on-surface">Seu Carrinho</h3>
            </div>
            <button id="close-modal-cart" class="text-on-surface-variant hover:text-on-surface">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div id="cart-items-list" class="divide-y divide-surface-variant my-4">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <div class="pt-4 border-t border-surface-variant space-y-4">
          <div class="flex items-center justify-between text-base font-bold">
            <span class="text-on-surface-variant">Total:</span>
            <span id="cart-total-price" class="text-xl text-primary font-extrabold">R$ 0,00</span>
          </div>

          <button id="btn-checkout-order" class="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">check_circle</span>
            <span>Confirmar Pedido</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Call Staff -->
    <div id="modal-call-staff" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-variant relative space-y-4">
        <button id="close-modal-call" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <span class="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-on-surface">Chamar Funcionário</h3>
            <p class="text-xs text-on-surface-variant">Informe o motivo da solicitação para a ${currentUser.nome}</p>
          </div>
        </div>

        <form id="form-call-staff" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Motivo / Justificativa</label>
            <textarea id="input-call-reason" required rows="3" placeholder="ex: Preciso de copos extras, talheres ou ajuda com a conta..." class="w-full px-4 py-2.5 rounded-xl border border-outline/30 bg-surface focus:border-primary focus:outline-none text-sm"></textarea>
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-amber-500 text-amber-950 font-bold text-sm hover:bg-amber-400 shadow-md transition-all">
            Enviar Chamado
          </button>
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
      <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div class="relative h-44 overflow-hidden">
            <img src="${dish.imagem}" alt="${dish.nome}" class="w-full h-full object-cover">
            <div class="absolute top-3 right-3">
              ${avail.available ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 shadow-sm">
                  ${avail.maxQuantity} disp.
                </span>
              ` : `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 shadow-sm">
                  Indisponível
                </span>
              `}
            </div>
          </div>
          <div class="p-4 space-y-1">
            <h4 class="font-bold text-base text-on-surface">${dish.nome}</h4>
            <p class="text-xs text-on-surface-variant line-clamp-2">${dish.descricao}</p>
          </div>
        </div>

        <div class="p-4 pt-0 flex items-center justify-between mt-3">
          <span class="font-extrabold text-base text-primary">R$ ${dish.preco.toFixed(2)}</span>
          <button
            data-dish-id="${dish.id}"
            class="btn-add-to-cart px-3.5 py-2 rounded-xl font-bold text-xs ${avail.available ? 'bg-primary text-on-primary hover:bg-primary-container shadow-sm' : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'}"
            ${!avail.available ? 'disabled' : ''}
          >
            + Adicionar
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dishId = e.currentTarget.dataset.dishId;
      addToCart(dishId);
    });
  });
}

function addToCart(dishId) {
  const dish = store.getDishById(dishId);
  const avail = store.getDishAvailability(dishId);

  if (!dish || !avail.available) {
    alert('Este prato está indisponível no momento.');
    return;
  }

  const existing = cart.find(item => item.prato_id === dishId);
  const currentQty = existing ? existing.quantidade : 0;

  if (currentQty + 1 > avail.maxQuantity) {
    alert(`Estoque máximo atingido para este prato (${avail.maxQuantity} disponíveis).`);
    return;
  }

  if (existing) {
    existing.quantidade += 1;
  } else {
    cart.push({
      prato_id: dish.id,
      nome_prato: dish.nome,
      preco_unitario: dish.preco,
      quantidade: 1
    });
  }

  showToast(`"${dish.nome}" adicionado ao carrinho!`);
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cart-items-list');
  const cartBadge = document.getElementById('cart-badge-count');
  const cartTotal = document.getElementById('cart-total-price');

  const totalItems = cart.reduce((acc, i) => acc + i.quantidade, 0);
  const totalPrice = cart.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0);

  if (cartBadge) cartBadge.textContent = totalItems;
  if (cartTotal) cartTotal.textContent = `R$ ${totalPrice.toFixed(2)}`;

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-center text-xs text-on-surface-variant py-8">Seu carrinho está vazio.</p>`;
    return;
  }

  cartList.innerHTML = cart.map((item, index) => `
    <div class="py-3 flex items-center justify-between gap-3">
      <div class="flex-1">
        <h5 class="font-bold text-sm text-on-surface">${item.nome_prato}</h5>
        <span class="text-xs text-primary font-semibold">R$ ${item.preco_unitario.toFixed(2)} cada</span>
      </div>
      <div class="flex items-center gap-2">
        <button data-index="${index}" data-action="dec" class="cart-qty-btn w-7 h-7 rounded-lg bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-variant">-</button>
        <span class="font-bold text-sm w-4 text-center">${item.quantidade}</span>
        <button data-index="${index}" data-action="inc" class="cart-qty-btn w-7 h-7 rounded-lg bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-variant">+</button>
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
          alert(`Estoque máximo atingido (${avail.maxQuantity} disponíveis).`);
          return;
        }
        item.quantidade += 1;
      } else if (action === 'dec') {
        cart[idx].quantidade -= 1;
        if (cart[idx].quantidade <= 0) {
          cart.splice(idx, 1);
        }
      }
      renderCart();
    });
  });
}

function renderClientHistory() {
  const historyList = document.getElementById('client-history-list');
  if (!historyList) return;

  const orders = store.getOrders().filter(p => p.mesa_id === currentUser.id);

  if (orders.length === 0) {
    historyList.innerHTML = `<p class="text-sm text-on-surface-variant italic py-4">Nenhum pedido realizado anteriormente.</p>`;
    return;
  }

  historyList.innerHTML = orders.map(order => `
    <div class="p-5 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-mono font-bold text-on-surface-variant">#${order.id}</span>
        <span class="px-2.5 py-1 rounded-full font-bold uppercase ${getStatusBadgeClass(order.status)}">
          ${order.status}
        </span>
      </div>
      <div class="divide-y divide-surface-variant/50">
        ${order.itens.map(i => `
          <div class="py-1.5 flex justify-between text-sm">
            <span>${i.quantidade}x ${i.nome_prato}</span>
            <span class="font-semibold">R$ ${(i.preco_unitario * i.quantidade).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div class="pt-2 flex justify-between items-center text-sm font-bold border-t border-surface-variant">
        <span class="text-on-surface-variant">Total:</span>
        <span class="text-primary text-base">R$ ${order.valor_total.toFixed(2)}</span>
      </div>
    </div>
  `).join('');
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Recebido': return 'bg-blue-100 text-blue-800';
    case 'Em preparo': return 'bg-amber-100 text-amber-800';
    case 'Pronto': return 'bg-emerald-100 text-emerald-800';
    case 'Entregue': return 'bg-green-100 text-green-800';
    case 'Cancelado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function setupClientEvents() {
  const modalCart = document.getElementById('modal-cart');
  const modalCall = document.getElementById('modal-call-staff');

  document.getElementById('btn-toggle-cart')?.addEventListener('click', () => {
    modalCart?.classList.remove('hidden');
  });

  document.getElementById('close-modal-cart')?.addEventListener('click', () => {
    modalCart?.classList.add('hidden');
  });

  document.getElementById('btn-chamar-atendente')?.addEventListener('click', () => {
    modalCall?.classList.remove('hidden');
  });

  document.getElementById('close-modal-call')?.addEventListener('click', () => {
    modalCall?.classList.add('hidden');
  });

  // Client Filter Buttons
  document.querySelectorAll('.client-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.client-cat-btn').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      e.currentTarget.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      e.currentTarget.classList.remove('bg-surface-container', 'text-on-surface-variant');

      const cat = e.currentTarget.dataset.cat;
      renderClientMenuGrid(cat);
    });
  });

  // Confirm Order Submit
  document.getElementById('btn-checkout-order')?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    try {
      store.createOrder(currentUser.id, cart);
      cart = [];
      renderCart();
      modalCart?.classList.add('hidden');
      renderClientMenuGrid('all');
      renderClientHistory();
      showToast('Pedido realizado com sucesso! Aguarde o preparo.');
    } catch (e) {
      alert(e.message);
    }
  });

  // Call Staff Submit
  document.getElementById('form-call-staff')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const reason = document.getElementById('input-call-reason').value;
    try {
      store.createCall(currentUser.id, reason);
      modalCall?.classList.add('hidden');
      document.getElementById('input-call-reason').value = '';
      showToast('Chamado enviado ao atendimento!');
    } catch (e) {
      alert(e.message);
    }
  });
}
