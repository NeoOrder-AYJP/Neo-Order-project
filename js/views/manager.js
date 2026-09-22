// js/views/manager.js - Manager Full Operations & Analytics Dashboard
import { store, currentUser, showToast } from '../app.js';

let activeTab = 'analytics'; // 'analytics' | 'dishes' | 'stock' | 'accounts'

export function renderManagerView() {
  const container = document.getElementById('view-manager');
  if (!container) return;

  if (!currentUser || currentUser.tipo !== 'funcionario' || currentUser.perfil !== 'gerente') {
    container.innerHTML = `
      <div class="max-w-md mx-auto my-16 p-8 text-center bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
          <span class="material-symbols-outlined text-3xl">admin_panel_settings</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface">Acesso Exclusivo a Gerentes</h2>
        <p class="text-sm text-on-surface-variant mt-2">Você precisa estar autenticado como Gerente para acessar esta área.</p>
        <button onclick="window.navigateTo('landing')" class="mt-6 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container transition-all">
          Ir para Login
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 md:px-margin-desktop py-8 space-y-8">

      <!-- Top Hero / Navigation Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Módulo Administrativo</span>
            <span class="text-xs text-on-surface-variant">• ${currentUser.nome}</span>
          </div>
          <h1 class="text-2xl font-extrabold text-on-surface mt-1">Gestão Estratégica & Faturamento</h1>
        </div>

        <!-- Backup & Restore Actions (RF-41, RF-42) -->
        <div class="flex flex-wrap items-center gap-3">
          <input type="file" id="json-file-input" accept=".json" class="hidden">
          <button id="btn-import-backup" class="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant font-bold text-xs shadow-sm transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-base">upload_file</span>
            <span>Importar JSON</span>
          </button>
          <button id="btn-export-backup" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-xs shadow-md transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-base">cloud_download</span>
            <span>Exportar Backup</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap gap-2 border-b border-surface-variant pb-2">
        <button data-tab="analytics" class="mgr-tab-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-on-primary shadow-sm flex items-center gap-2">
          <span class="material-symbols-outlined text-base">monitoring</span>
          <span>Faturamento & Indicadores</span>
        </button>
        <button data-tab="dishes" class="mgr-tab-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-base">restaurant_menu</span>
          <span>Gestão de Cardápio</span>
        </button>
        <button data-tab="stock" class="mgr-tab-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-base">inventory_2</span>
          <span>Estoque de Ingredientes</span>
        </button>
        <button data-tab="accounts" class="mgr-tab-btn px-5 py-2.5 rounded-xl text-sm font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-base">group</span>
          <span>Contas de Mesas & Funcionários</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="mgr-tab-content">
        <!-- Rendered dynamically -->
      </div>

    </div>

    <!-- Dish Modal Form -->
    <div id="modal-dish-form" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-variant relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button id="close-modal-dish" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 id="dish-modal-title" class="text-lg font-bold text-on-surface">Cadastrar Novo Prato</h3>

        <form id="form-dish-save" class="space-y-4">
          <input type="hidden" id="input-dish-id">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Nome do Prato</label>
            <input type="text" id="input-dish-nome" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-on-surface-variant mb-1">Preço (R$)</label>
              <input type="number" step="0.01" id="input-dish-preco" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface-variant mb-1">Categoria</label>
              <select id="input-dish-categoria" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
                <option value="Pratos Principais">Pratos Principais</option>
                <option value="Peixes & Frutos do Mar">Peixes & Frutos do Mar</option>
                <option value="Massas">Massas</option>
                <option value="Sobremesas">Sobremesas</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Descrição</label>
            <textarea id="input-dish-descricao" rows="2" class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">URL da Imagem</label>
            <input type="url" id="input-dish-imagem" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="input-dish-destaque" class="w-4 h-4 rounded text-primary">
            <label for="input-dish-destaque" class="text-xs font-bold text-on-surface">Prato em Destaque (Carrossel)</label>
          </div>

          <!-- Recipe Ingredients Section (RF-24) -->
          <div class="border-t border-surface-variant pt-3 space-y-2">
            <label class="block text-xs font-bold text-primary uppercase">Receita (Ingredientes Necessários)</label>
            <div id="dish-recipe-builder" class="space-y-2">
              <!-- Rendered dynamically -->
            </div>
            <button type="button" id="btn-add-recipe-row" class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              + Adicionar Ingrediente à Receita
            </button>
          </div>

          <button type="submit" class="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-md transition-all">
            Salvar Prato
          </button>
        </form>
      </div>
    </div>

    <!-- Ingredient Modal Form -->
    <div id="modal-ing-form" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-variant relative space-y-4">
        <button id="close-modal-ing" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 id="ing-modal-title" class="text-lg font-bold text-on-surface">Cadastrar Ingrediente</h3>

        <form id="form-ing-save" class="space-y-4">
          <input type="hidden" id="input-ing-id">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Nome do Ingrediente</label>
            <input type="text" id="input-ing-nome" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-on-surface-variant mb-1">Unidade de Medida</label>
              <select id="input-ing-unidade" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
                <option value="kg">kg</option>
                <option value="g">g</option>

                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="un">un</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface-variant mb-1">Quantidade em Estoque</label>
              <input type="number" step="0.01" id="input-ing-quantidade" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
            </div>
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-md transition-all">
            Salvar Ingrediente
          </button>
        </form>
      </div>
    </div>

    <!-- User Account Modal Form -->
    <div id="modal-user-form" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-variant relative space-y-4">
        <button id="close-modal-user" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 id="user-modal-title" class="text-lg font-bold text-on-surface">Criar Conta</h3>

        <form id="form-user-save" class="space-y-4">
          <input type="hidden" id="input-user-id">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Tipo de Conta</label>
            <select id="input-user-tipo" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
              <option value="mesa">Mesa (Cliente)</option>
              <option value="funcionario">Funcionário</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Nome de Exibição</label>
            <input type="text" id="input-user-nome" required placeholder="ex: Mesa 06 ou Maria Atendente" class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-on-surface-variant mb-1">Login</label>
              <input type="text" id="input-user-login" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface-variant mb-1">Senha</label>
              <input type="password" id="input-user-senha" required class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
            </div>
          </div>
          <div id="group-user-perfil" class="hidden">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Perfil de Funcionário</label>
            <select id="input-user-perfil" class="w-full px-4 py-2 rounded-xl border border-outline/30 bg-surface text-sm">
              <option value="atendente">Atendente</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-md transition-all">
            Salvar Conta
          </button>
        </form>
      </div>
    </div>
  `;

  renderManagerTab(activeTab);
  setupManagerEvents();
}

function renderManagerTab(tab) {
  activeTab = tab;
  const content = document.getElementById('mgr-tab-content');
  if (!content) return;

  // Update button active styling
  document.querySelectorAll('.mgr-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
    } else {
      btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.add('bg-surface-container', 'text-on-surface-variant');
    }
  });

  if (tab === 'analytics') renderAnalyticsTab(content);
  else if (tab === 'dishes') renderDishesTab(content);
  else if (tab === 'stock') renderStockTab(content);
  else if (tab === 'accounts') renderAccountsTab(content);
}

// Tab 1: Financial Analytics (RF-32 to RF-36, RN-08, RN-09)
function renderAnalyticsTab(container, period = 'Este Mês') {
  const metrics = store.getFinancialMetrics(period);

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Period Selector Filter -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-on-surface">Visão Geral do Faturamento</h2>
        <div class="flex gap-2 bg-surface-container-low p-1 rounded-xl">
          <button data-period="Hoje" class="period-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold ${period === 'Hoje' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">Hoje</button>
          <button data-period="7 Dias" class="period-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold ${period === '7 Dias' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">7 Dias</button>
          <button data-period="Este Mês" class="period-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold ${period === 'Este Mês' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}">Este Mês</button>
        </div>
      </div>

      <!-- Key Performance Indicators Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm space-y-2">
          <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Faturamento Total</span>
          <div class="text-3xl font-extrabold text-primary">R$ ${metrics.totalFaturado.toFixed(2)}</div>
          <p class="text-[11px] text-on-surface-variant">Exclui pedidos cancelados (RN-04)</p>
        </div>

        <div class="p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm space-y-2">
          <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pedidos Concluídos</span>
          <div class="text-3xl font-extrabold text-on-surface">${metrics.qtdPedidos}</div>
          <p class="text-[11px] text-on-surface-variant">Período selecionado: ${metrics.period}</p>
        </div>

        <div class="p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm space-y-2">
          <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ticket Médio</span>
          <div class="text-3xl font-extrabold text-secondary">R$ ${metrics.ticketMedio.toFixed(2)}</div>
          <p class="text-[11px] text-on-surface-variant">Valor médio por pedido</p>
        </div>
      </div>

      <!-- Top Selling Dishes Ranking -->
      <div class="p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm space-y-4">
        <h3 class="text-base font-bold text-on-surface">Pratos Mais Vendidos</h3>
        ${metrics.topDishes.length > 0 ? `
          <div class="divide-y divide-surface-variant/50">
            ${metrics.topDishes.map((item, idx) => `
              <div class="py-3 flex items-center justify-between text-sm">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">${idx + 1}</span>
                  <span class="font-bold text-on-surface">${item.nome}</span>
                </div>
                <span class="font-extrabold text-primary">${item.quantidade} unidades</span>
              </div>
            `).join('')}
          </div>
        ` : `
          <p class="text-xs text-on-surface-variant italic py-4">Nenhuma venda registrada no período selecionado.</p>
        `}
      </div>
    </div>
  `;

  document.querySelectorAll('.period-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const p = e.currentTarget.dataset.period;
      renderAnalyticsTab(container, p);
    });
  });
}

// Tab 2: Dishes CRUD (RF-37 to RF-40)
function renderDishesTab(container) {
  const dishes = store.getDishes();

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-on-surface">Gestão de Pratos do Cardápio</h2>
        <button id="btn-open-add-dish" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-base">add</span>
          <span>Novo Prato</span>
        </button>
      </div>

      <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-container-low text-xs font-bold text-on-surface-variant border-b border-surface-variant">
            <tr>
              <th class="p-4">Prato</th>
              <th class="p-4">Categoria</th>
              <th class="p-4">Preço</th>
              <th class="p-4">Destaque</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant">
            ${dishes.map(d => `
              <tr class="hover:bg-surface-container-lowest/50">
                <td class="p-4 flex items-center gap-3">
                  <img src="${d.imagem}" alt="${d.nome}" class="w-10 h-10 rounded-lg object-cover">
                  <div>
                    <span class="font-bold text-on-surface">${d.nome}</span>
                    <p class="text-xs text-on-surface-variant line-clamp-1">${d.descricao}</p>
                  </div>
                </td>
                <td class="p-4 font-semibold text-xs text-on-surface-variant">${d.categoria}</td>
                <td class="p-4 font-bold text-primary">R$ ${d.preco.toFixed(2)}</td>
                <td class="p-4">
                  ${d.destaque ? `
                    <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Sim</span>
                  ` : `
                    <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">Não</span>
                  `}
                </td>
                <td class="p-4 text-right space-x-2">
                  <button data-dish-id="${d.id}" class="btn-edit-dish px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-variant">
                    Editar
                  </button>
                  <button data-dish-id="${d.id}" class="btn-delete-dish px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold">
                    Excluir
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-open-add-dish')?.addEventListener('click', () => {
    openDishModal();
  });

  document.querySelectorAll('.btn-edit-dish').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dishId = e.currentTarget.dataset.dishId;
      openDishModal(dishId);
    });
  });

  document.querySelectorAll('.btn-delete-dish').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dishId = e.currentTarget.dataset.dishId;
      if (confirm('Tem certeza que deseja excluir este prato?')) {
        store.deleteDish(dishId);
        showToast('Prato excluído com sucesso.');
        renderDishesTab(container);
      }
    });
  });
}

function openDishModal(dishId = null) {
  const modal = document.getElementById('modal-dish-form');
  const title = document.getElementById('dish-modal-title');
  const form = document.getElementById('form-dish-save');
  const recipeBuilder = document.getElementById('dish-recipe-builder');

  if (!modal || !form || !recipeBuilder) return;

  recipeBuilder.innerHTML = '';

  if (dishId) {
    const dish = store.getDishById(dishId);
    if (!dish) return;
    title.textContent = 'Editar Prato';
    document.getElementById('input-dish-id').value = dish.id;
    document.getElementById('input-dish-nome').value = dish.nome;
    document.getElementById('input-dish-preco').value = dish.preco;
    document.getElementById('input-dish-categoria').value = dish.categoria;
    document.getElementById('input-dish-descricao').value = dish.descricao;
    document.getElementById('input-dish-imagem').value = dish.imagem;
    document.getElementById('input-dish-destaque').checked = dish.destaque;

    if (dish.ingredientes && dish.ingredientes.length > 0) {
      dish.ingredientes.forEach(req => addRecipeRow(req.ingrediente_id, req.quantidade));
    } else {
      addRecipeRow();
    }
  } else {
    title.textContent = 'Cadastrar Novo Prato';
    form.reset();
    document.getElementById('input-dish-id').value = '';
    addRecipeRow();
  }

  modal.classList.remove('hidden');
}

function addRecipeRow(ingId = '', qty = 0.1) {
  const recipeBuilder = document.getElementById('dish-recipe-builder');
  if (!recipeBuilder) return;

  const ingredients = store.getIngredients();
  const rowId = 'recipe_row_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

  const div = document.createElement('div');
  div.id = rowId;
  div.className = 'flex items-center gap-2';
  div.innerHTML = `
    <select class="recipe-ing-id flex-1 px-3 py-1.5 rounded-lg border border-outline/30 bg-surface text-xs">
      <option value="">Selecione o ingrediente...</option>
      ${ingredients.map(i => `
        <option value="${i.id}" ${i.id === ingId ? 'selected' : ''}>${i.nome} (${i.unidade})</option>
      `).join('')}
    </select>
    <input type="number" step="0.01" value="${qty}" class="recipe-ing-qty w-24 px-3 py-1.5 rounded-lg border border-outline/30 bg-surface text-xs" placeholder="Qtd">
    <button type="button" class="btn-remove-recipe-row text-red-600 hover:text-red-800 text-xs font-bold">X</button>
  `;

  div.querySelector('.btn-remove-recipe-row').addEventListener('click', () => {
    div.remove();
  });

  recipeBuilder.appendChild(div);
}

// Tab 3: Stock CRUD (RF-21 to RF-23)
function renderStockTab(container) {
  const ingredients = store.getIngredients();

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-on-surface">Controle de Estoque de Ingredientes</h2>
        <button id="btn-open-add-ing" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-base">add</span>
          <span>Novo Ingrediente</span>
        </button>
      </div>

      <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-container-low text-xs font-bold text-on-surface-variant border-b border-surface-variant">
            <tr>
              <th class="p-4">Ingrediente</th>
              <th class="p-4">Unidade</th>
              <th class="p-4">Quantidade Atual</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant">
            ${ingredients.map(ing => `
              <tr class="hover:bg-surface-container-lowest/50">
                <td class="p-4 font-bold text-on-surface">${ing.nome}</td>
                <td class="p-4 text-xs text-on-surface-variant font-semibold uppercase">${ing.unidade}</td>
                <td class="p-4">
                  <span class="font-extrabold ${ing.quantidade < 2 ? 'text-red-600' : 'text-on-surface'}">
                    ${ing.quantidade} ${ing.unidade}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <button data-ing-id="${ing.id}" class="btn-edit-ing-qty px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-variant">
                    Ajustar Estoque
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-open-add-ing')?.addEventListener('click', () => {
    openIngModal();
  });

  document.querySelectorAll('.btn-edit-ing-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ingId = e.currentTarget.dataset.ingId;
      openIngModal(ingId);
    });
  });
}

function openIngModal(ingId = null) {
  const modal = document.getElementById('modal-ing-form');
  const title = document.getElementById('ing-modal-title');
  const form = document.getElementById('form-ing-save');

  if (!modal || !form) return;

  if (ingId) {
    const ing = store.getIngredientById(ingId);
    if (!ing) return;
    title.textContent = 'Ajustar Ingrediente';
    document.getElementById('input-ing-id').value = ing.id;
    document.getElementById('input-ing-nome').value = ing.nome;
    document.getElementById('input-ing-unidade').value = ing.unidade;
    document.getElementById('input-ing-quantidade').value = ing.quantidade;
  } else {
    title.textContent = 'Novo Ingrediente';
    form.reset();
    document.getElementById('input-ing-id').value = '';
  }

  modal.classList.remove('hidden');
}

// Tab 4: Accounts Management (RF-10, RF-11)
function renderAccountsTab(container) {
  const users = store.getUsers();

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-on-surface">Gerenciamento de Contas</h2>
        <button id="btn-open-add-user" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-base">person_add</span>
          <span>Criar Conta</span>
        </button>
      </div>

      <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-container-low text-xs font-bold text-on-surface-variant border-b border-surface-variant">
            <tr>
              <th class="p-4">Nome / Mesa</th>
              <th class="p-4">Tipo</th>
              <th class="p-4">Login</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant">
            ${users.map(u => `
              <tr class="hover:bg-surface-container-lowest/50">
                <td class="p-4 font-bold text-on-surface">${u.nome}</td>
                <td class="p-4 text-xs font-semibold uppercase text-on-surface-variant">
                  ${u.tipo === 'mesa' ? 'Mesa (Cliente)' : `Funcionário (${u.perfil})`}
                </td>
                <td class="p-4 font-mono text-xs">${u.login}</td>
                <td class="p-4">
                  ${u.ativo !== false ? `
                    <span class="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">Ativo</span>
                  ` : `
                    <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">Inativo</span>
                  `}
                </td>
                <td class="p-4 text-right space-x-2">
                  <button data-user-id="${u.id}" class="btn-toggle-user-active px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container">
                    ${u.ativo !== false ? 'Inativar' : 'Reativar'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-open-add-user')?.addEventListener('click', () => {
    openUserModal();
  });

  document.querySelectorAll('.btn-toggle-user-active').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = e.currentTarget.dataset.userId;
      store.toggleUserActive(userId);
      showToast('Status da conta alterado com sucesso.');
      renderAccountsTab(container);
    });
  });
}

function openUserModal() {
  const modal = document.getElementById('modal-user-form');
  const form = document.getElementById('form-user-save');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('input-user-id').value = '';
  modal.classList.remove('hidden');
}

function setupManagerEvents() {
  // Tab Switchers
  document.querySelectorAll('.mgr-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      renderManagerTab(tab);
    });
  });

  // Modal Closers
  document.getElementById('close-modal-dish')?.addEventListener('click', () => {
    document.getElementById('modal-dish-form')?.classList.add('hidden');
  });

  document.getElementById('close-modal-ing')?.addEventListener('click', () => {
    document.getElementById('modal-ing-form')?.classList.add('hidden');
  });

  document.getElementById('close-modal-user')?.addEventListener('click', () => {
    document.getElementById('modal-user-form')?.classList.add('hidden');
  });

  document.getElementById('btn-add-recipe-row')?.addEventListener('click', () => {
    addRecipeRow();
  });

  // Save Dish Submit
  document.getElementById('form-dish-save')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('input-dish-id').value;
    const nome = document.getElementById('input-dish-nome').value;
    const preco = parseFloat(document.getElementById('input-dish-preco').value);
    const categoria = document.getElementById('input-dish-categoria').value;
    const descricao = document.getElementById('input-dish-descricao').value;
    const imagem = document.getElementById('input-dish-imagem').value;
    const destaque = document.getElementById('input-dish-destaque').checked;

    const recipeRows = document.querySelectorAll('#dish-recipe-builder > div');
    const ingredientes = [];
    recipeRows.forEach(row => {
      const ingId = row.querySelector('.recipe-ing-id').value;
      const qty = parseFloat(row.querySelector('.recipe-ing-qty').value);
      if (ingId && qty > 0) {
        ingredientes.push({ ingrediente_id: ingId, quantidade: qty, unidade: 'kg' });
      }
    });

    store.saveDish({
      id: id || undefined,
      nome,
      preco,
      categoria,
      descricao,
      imagem,
      destaque,
      ativo: true,
      ingredientes
    });

    document.getElementById('modal-dish-form')?.classList.add('hidden');
    showToast('Prato salvo com sucesso!');
    renderManagerTab('dishes');
  });

  // Save Ingredient Submit
  document.getElementById('form-ing-save')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('input-ing-id').value;
    const nome = document.getElementById('input-ing-nome').value;
    const unidade = document.getElementById('input-ing-unidade').value;
    const quantidade = parseFloat(document.getElementById('input-ing-quantidade').value);

    store.saveIngredient({
      id: id || undefined,
      nome,
      unidade,
      quantidade
    });

    document.getElementById('modal-ing-form')?.classList.add('hidden');
    showToast('Ingrediente salvo com sucesso!');
    renderManagerTab('stock');
  });

  // User Account Type Toggle
  document.getElementById('input-user-tipo')?.addEventListener('change', (e) => {
    const perfilGroup = document.getElementById('group-user-perfil');
    if (e.target.value === 'funcionario') {
      perfilGroup?.classList.remove('hidden');
    } else {
      perfilGroup?.classList.add('hidden');
    }
  });

  // Save User Submit
  document.getElementById('form-user-save')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = document.getElementById('input-user-tipo').value;
    const nome = document.getElementById('input-user-nome').value;
    const login = document.getElementById('input-user-login').value;
    const senha = document.getElementById('input-user-senha').value;
    const perfil = tipo === 'funcionario' ? document.getElementById('input-user-perfil').value : null;

    store.saveUser({
      tipo,
      nome,
      login,
      senha,
      perfil,
      ativo: true
    });

    document.getElementById('modal-user-form')?.classList.add('hidden');
    showToast('Conta criada com sucesso!');
    renderManagerTab('accounts');
  });

  // Export JSON Backup (RF-41)
  document.getElementById('btn-export-backup')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(store.exportData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_restaurante_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON exportado com sucesso!');
  });

  // Import JSON Backup (RF-42)
  const fileInput = document.getElementById('json-file-input');
  document.getElementById('btn-import-backup')?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        store.importData(event.target.result);
        showToast('Dados importados e sistema restaurado com sucesso!');
        renderManagerTab(activeTab);
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  });
}
