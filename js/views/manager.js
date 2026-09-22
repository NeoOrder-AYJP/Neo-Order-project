// js/views/manager.js - Manager Full Operations & Analytics Dashboard View
import { store, currentUser, showToast } from '../app.js';

let activeTab = 'analytics';

export function renderManagerView() {
  const container = document.getElementById('view-manager');
  if (!container) return;

  if (!currentUser || currentUser.tipo !== 'funcionario' || currentUser.perfil !== 'gerente') {
    container.innerHTML = `
      <div class="container" style="max-width: 500px; margin-top: 64px; text-align: center;">
        <div class="card">
          <h2>Acesso Exclusivo a Gerentes</h2>
          <p style="color: var(--text-muted); margin-top: 8px;">Você precisa estar autenticado como Gerente para acessar esta área.</p>
          <button onclick="window.navigateTo('landing')" class="btn btn-primary" style="margin-top: 24px;">Ir para Login</button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="container flex flex-col gap-6">

      <!-- Top Bar -->
      <div class="card flex items-center justify-between" style="flex-wrap: wrap; gap: 16px;">
        <div>
          <span class="badge badge-pending">Módulo Administrativo</span>
          <h1 style="font-size: 24px; margin-top: 4px;">Gestão Estratégica & Faturamento</h1>
        </div>

        <div class="flex gap-2">
          <input type="file" id="json-file-input" accept=".json" class="hidden">
          <button id="btn-import-backup" class="btn btn-secondary btn-sm">
            <span class="material-symbols-outlined">upload_file</span>
            <span>Importar JSON</span>
          </button>
          <button id="btn-export-backup" class="btn btn-primary btn-sm">
            <span class="material-symbols-outlined">cloud_download</span>
            <span>Exportar Backup</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex gap-2" style="border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
        <button data-tab="analytics" class="mgr-tab-btn btn btn-sm btn-primary">Faturamento & Indicadores</button>
        <button data-tab="dishes" class="mgr-tab-btn btn btn-sm btn-secondary">Gestão de Cardápio</button>
        <button data-tab="stock" class="mgr-tab-btn btn btn-sm btn-secondary">Estoque de Ingredientes</button>
        <button data-tab="accounts" class="mgr-tab-btn btn btn-sm btn-secondary">Contas de Mesas & Funcionários</button>
      </div>

      <!-- Tab Content -->
      <div id="mgr-tab-content"></div>

    </div>

    <!-- Dish Modal -->
    <div id="modal-dish-form" class="modal-overlay hidden">
      <div class="modal-content">
        <button id="close-modal-dish" class="modal-close">×</button>
        <h3 id="dish-modal-title" style="margin-bottom: 16px;">Cadastrar Novo Prato</h3>
        <form id="form-dish-save">
          <input type="hidden" id="input-dish-id">
          <div class="form-group"><label>Nome</label><input type="text" id="input-dish-nome" required></div>
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group"><label>Preço (R$)</label><input type="number" step="0.01" id="input-dish-preco" required></div>
            <div class="form-group"><label>Categoria</label>
              <select id="input-dish-categoria" required>
                <option value="Pratos Principais">Pratos Principais</option>
                <option value="Peixes & Frutos do Mar">Peixes & Frutos do Mar</option>
                <option value="Massas">Massas</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>Descrição</label><textarea id="input-dish-descricao" rows="2"></textarea></div>
          <div class="form-group"><label>URL da Imagem</label><input type="url" id="input-dish-imagem" required></div>
          <div style="margin-bottom: 16px;"><input type="checkbox" id="input-dish-destaque"> <label for="input-dish-destaque">Destaque na Landing Page</label></div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-bottom: 16px;">
            <label style="color: var(--primary);">Receita (Ingredientes Consumidos)</label>
            <div id="dish-recipe-builder" class="flex flex-col gap-2" style="margin-top: 8px;"></div>
            <button type="button" id="btn-add-recipe-row" class="btn btn-secondary btn-sm" style="margin-top: 8px;">+ Adicionar Ingrediente</button>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Salvar Prato</button>
        </form>
      </div>
    </div>

    <!-- Ingredient Modal -->
    <div id="modal-ing-form" class="modal-overlay hidden">
      <div class="modal-content">
        <button id="close-modal-ing" class="modal-close">×</button>
        <h3 id="ing-modal-title" style="margin-bottom: 16px;">Ingrediente</h3>
        <form id="form-ing-save">
          <input type="hidden" id="input-ing-id">
          <div class="form-group"><label>Nome</label><input type="text" id="input-ing-nome" required></div>
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group"><label>Unidade</label>
              <select id="input-ing-unidade" required>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="un">un</option>
              </select>
            </div>
            <div class="form-group"><label>Quantidade</label><input type="number" step="0.01" id="input-ing-quantidade" required></div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Salvar Ingrediente</button>
        </form>
      </div>
    </div>

    <!-- Account Modal -->
    <div id="modal-user-form" class="modal-overlay hidden">
      <div class="modal-content">
        <button id="close-modal-user" class="modal-close">×</button>
        <h3 style="margin-bottom: 16px;">Criar Conta</h3>
        <form id="form-user-save">
          <div class="form-group"><label>Tipo de Conta</label>
            <select id="input-user-tipo" required>
              <option value="mesa">Mesa (Cliente)</option>
              <option value="funcionario">Funcionário</option>
            </select>
          </div>
          <div class="form-group"><label>Nome de Exibição</label><input type="text" id="input-user-nome" required placeholder="ex: Mesa 06"></div>
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group"><label>Login</label><input type="text" id="input-user-login" required></div>
            <div class="form-group"><label>Senha</label><input type="password" id="input-user-senha" required></div>
          </div>
          <div id="group-user-perfil" class="form-group hidden">
            <label>Perfil de Funcionário</label>
            <select id="input-user-perfil">
              <option value="atendente">Atendente</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Salvar Conta</button>
        </form>
      </div>
    </div>
  `;

  renderManagerTab(activeTab);
  setupManagerEvents();

  // Register real-time auto-sync listener for manager dashboard
  store.subscribe(() => {
    if (document.getElementById('view-manager') && currentUser) {
      renderManagerTab(activeTab);
    }
  });
}

function renderManagerTab(tab) {
  activeTab = tab;
  const content = document.getElementById('mgr-tab-content');
  if (!content) return;

  document.querySelectorAll('.mgr-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-secondary');
    } else {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
    }
  });

  if (tab === 'analytics') renderAnalyticsTab(content);
  else if (tab === 'dishes') renderDishesTab(content);
  else if (tab === 'stock') renderStockTab(content);
  else if (tab === 'accounts') renderAccountsTab(content);
}

function renderAnalyticsTab(container, period = 'Este Mês') {
  const metrics = store.getFinancialMetrics(period);
  container.innerHTML = `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h3>Faturamento & Vendas</h3>
        <div class="flex gap-2">
          <button data-period="Hoje" class="period-filter-btn btn btn-sm ${period === 'Hoje' ? 'btn-primary' : 'btn-secondary'}">Hoje</button>
          <button data-period="7 Dias" class="period-filter-btn btn btn-sm ${period === '7 Dias' ? 'btn-primary' : 'btn-secondary'}">7 Dias</button>
          <button data-period="Este Mês" class="period-filter-btn btn btn-sm ${period === 'Este Mês' ? 'btn-primary' : 'btn-secondary'}">Este Mês</button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <div class="card">
          <span style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Faturamento Total</span>
          <div style="font-size: 28px; font-weight: 700; color: var(--primary);">R$ ${metrics.totalFaturado.toFixed(2)}</div>
        </div>
        <div class="card">
          <span style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Pedidos Finalizados</span>
          <div style="font-size: 28px; font-weight: 700;">${metrics.qtdPedidos}</div>
        </div>
        <div class="card">
          <span style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Ticket Médio</span>
          <div style="font-size: 28px; font-weight: 700; color: var(--secondary);">R$ ${metrics.ticketMedio.toFixed(2)}</div>
        </div>
      </div>

      <div class="card">
        <h4 style="margin-bottom: 12px;">Mais Vendidos</h4>
        ${metrics.topDishes.length > 0 ? metrics.topDishes.map((item, i) => `
          <div class="flex items-center justify-between" style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
            <span>${i + 1}. <strong>${item.nome}</strong></span>
            <span style="font-weight: 700; color: var(--primary);">${item.quantidade} un.</span>
          </div>
        `).join('') : '<p style="color: var(--text-muted);">Sem vendas no período.</p>'}
      </div>
    </div>
  `;

  document.querySelectorAll('.period-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => renderAnalyticsTab(container, e.currentTarget.dataset.period));
  });
}

function renderDishesTab(container) {
  const dishes = store.getDishes();
  container.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3>Pratos do Cardápio</h3>
        <button id="btn-open-add-dish" class="btn btn-primary btn-sm">+ Novo Prato</button>
      </div>
      <div class="card" style="padding: 0; overflow: hidden;">
        <table>
          <thead>
            <tr>
              <th>Prato</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Destaque</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${dishes.map(d => `
              <tr>
                <td><strong>${d.nome}</strong></td>
                <td>${d.categoria}</td>
                <td style="color: var(--primary); font-weight: 700;">R$ ${d.preco.toFixed(2)}</td>
                <td>${d.destaque ? 'Sim' : 'Não'}</td>
                <td style="text-align: right;">
                  <button data-dish-id="${d.id}" class="btn-edit-dish btn btn-secondary btn-sm">Editar</button>
                  <button data-dish-id="${d.id}" class="btn-delete-dish btn btn-danger btn-sm">Excluir</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-open-add-dish')?.addEventListener('click', () => openDishModal());
  document.querySelectorAll('.btn-edit-dish').forEach(btn => btn.addEventListener('click', (e) => openDishModal(e.currentTarget.dataset.dishId)));
  document.querySelectorAll('.btn-delete-dish').forEach(btn => btn.addEventListener('click', (e) => {
    if (confirm('Excluir este prato?')) {
      store.deleteDish(e.currentTarget.dataset.dishId);
      showToast('Prato excluído!');
      renderDishesTab(container);
    }
  }));
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

    if (dish.ingredientes) dish.ingredientes.forEach(req => addRecipeRow(req.ingrediente_id, req.quantidade));
  } else {
    title.textContent = 'Novo Prato';
    form.reset();
    document.getElementById('input-dish-id').value = '';
    addRecipeRow();
  }

  modal.classList.remove('hidden');
}

function addRecipeRow(ingId = '', qty = 0.1) {
  const builder = document.getElementById('dish-recipe-builder');
  if (!builder) return;

  const ingredients = store.getIngredients();
  const div = document.createElement('div');
  div.className = 'flex items-center gap-2';
  div.innerHTML = `
    <select class="recipe-ing-id flex-1">
      <option value="">Ingrediente...</option>
      ${ingredients.map(i => `<option value="${i.id}" ${i.id === ingId ? 'selected' : ''}>${i.nome} (${i.unidade})</option>`).join('')}
    </select>
    <input type="number" step="0.01" value="${qty}" class="recipe-ing-qty" style="width: 100px;">
    <button type="button" class="btn-remove-recipe-row btn btn-danger btn-sm">X</button>
  `;

  div.querySelector('.btn-remove-recipe-row').addEventListener('click', () => div.remove());
  builder.appendChild(div);
}

function renderStockTab(container) {
  const ingredients = store.getIngredients();
  container.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3>Estoque de Ingredientes</h3>
        <button id="btn-open-add-ing" class="btn btn-primary btn-sm">+ Novo Ingrediente</button>
      </div>
      <div class="card" style="padding: 0; overflow: hidden;">
        <table>
          <thead>
            <tr><th>Ingrediente</th><th>Unidade</th><th>Quantidade</th><th style="text-align: right;">Ações</th></tr>
          </thead>
          <tbody>
            ${ingredients.map(i => `
              <tr>
                <td><strong>${i.nome}</strong></td>
                <td>${i.unidade}</td>
                <td style="font-weight: 700;">${i.quantidade} ${i.unidade}</td>
                <td style="text-align: right;">
                  <button data-ing-id="${i.id}" class="btn-edit-ing-qty btn btn-secondary btn-sm">Editar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-open-add-ing')?.addEventListener('click', () => openIngModal());
  document.querySelectorAll('.btn-edit-ing-qty').forEach(btn => btn.addEventListener('click', (e) => openIngModal(e.currentTarget.dataset.ingId)));
}

function openIngModal(ingId = null) {
  const modal = document.getElementById('modal-ing-form');
  const form = document.getElementById('form-ing-save');
  if (!modal || !form) return;

  if (ingId) {
    const ing = store.getIngredientById(ingId);
    if (!ing) return;
    document.getElementById('input-ing-id').value = ing.id;
    document.getElementById('input-ing-nome').value = ing.nome;
    document.getElementById('input-ing-unidade').value = ing.unidade;
    document.getElementById('input-ing-quantidade').value = ing.quantidade;
  } else {
    form.reset();
    document.getElementById('input-ing-id').value = '';
  }

  modal.classList.remove('hidden');
}

function renderAccountsTab(container) {
  const users = store.getUsers();
  container.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3>Contas de Usuários</h3>
        <button id="btn-open-add-user" class="btn btn-primary btn-sm">+ Criar Conta</button>
      </div>
      <div class="card" style="padding: 0; overflow: hidden;">
        <table>
          <thead>
            <tr><th>Nome</th><th>Tipo</th><th>Login</th><th>Status</th><th style="text-align: right;">Ações</th></tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${u.nome}</strong></td>
                <td>${u.tipo === 'mesa' ? 'Mesa' : `Funcionário (${u.perfil})`}</td>
                <td><code>${u.login}</code></td>
                <td>${u.ativo !== false ? '<span class="badge badge-available">Ativo</span>' : '<span class="badge badge-unavailable">Inativo</span>'}</td>
                <td style="text-align: right;">
                  <button data-user-id="${u.id}" class="btn-toggle-user-active btn btn-secondary btn-sm">${u.ativo !== false ? 'Inativar' : 'Reativar'}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-open-add-user')?.addEventListener('click', () => {
    const modal = document.getElementById('modal-user-form');
    document.getElementById('form-user-save')?.reset();
    modal?.classList.remove('hidden');
  });

  document.querySelectorAll('.btn-toggle-user-active').forEach(btn => {
    btn.addEventListener('click', (e) => {
      store.toggleUserActive(e.currentTarget.dataset.userId);
      showToast('Status alterado!');
      renderAccountsTab(container);
    });
  });
}

function setupManagerEvents() {
  document.querySelectorAll('.mgr-tab-btn').forEach(btn => btn.addEventListener('click', (e) => renderManagerTab(e.currentTarget.dataset.tab)));

  document.getElementById('close-modal-dish')?.addEventListener('click', () => document.getElementById('modal-dish-form')?.classList.add('hidden'));
  document.getElementById('close-modal-ing')?.addEventListener('click', () => document.getElementById('modal-ing-form')?.classList.add('hidden'));
  document.getElementById('close-modal-user')?.addEventListener('click', () => document.getElementById('modal-user-form')?.classList.add('hidden'));

  document.getElementById('btn-add-recipe-row')?.addEventListener('click', () => addRecipeRow());

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
      if (ingId && qty > 0) ingredientes.push({ ingrediente_id: ingId, quantidade: qty, unidade: 'kg' });
    });

    store.saveDish({ id: id || undefined, nome, preco, categoria, descricao, imagem, destaque, ativo: true, ingredientes });
    document.getElementById('modal-dish-form')?.classList.add('hidden');
    showToast('Prato salvo com sucesso!');
    renderManagerTab('dishes');
  });

  document.getElementById('form-ing-save')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('input-ing-id').value;
    const nome = document.getElementById('input-ing-nome').value;
    const unidade = document.getElementById('input-ing-unidade').value;
    const quantidade = parseFloat(document.getElementById('input-ing-quantidade').value);

    store.saveIngredient({ id: id || undefined, nome, unidade, quantidade });
    document.getElementById('modal-ing-form')?.classList.add('hidden');
    showToast('Ingrediente salvo!');
    renderManagerTab('stock');
  });

  document.getElementById('input-user-tipo')?.addEventListener('change', (e) => {
    const group = document.getElementById('group-user-perfil');
    if (e.target.value === 'funcionario') group?.classList.remove('hidden');
    else group?.classList.add('hidden');
  });

  document.getElementById('form-user-save')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = document.getElementById('input-user-tipo').value;
    const nome = document.getElementById('input-user-nome').value;
    const login = document.getElementById('input-user-login').value;
    const senha = document.getElementById('input-user-senha').value;
    const perfil = tipo === 'funcionario' ? document.getElementById('input-user-perfil').value : null;

    store.saveUser({ tipo, nome, login, senha, perfil, ativo: true });
    document.getElementById('modal-user-form')?.classList.add('hidden');
    showToast('Conta criada!');
    renderManagerTab('accounts');
  });

  document.getElementById('btn-export-backup')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(store.exportData());
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    showToast('Backup JSON exportado!');
  });

  const fileInput = document.getElementById('json-file-input');
  document.getElementById('btn-import-backup')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        store.importData(ev.target.result);
        showToast('Dados restaurados!');
        renderManagerTab(activeTab);
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  });
}
