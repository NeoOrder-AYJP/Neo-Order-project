// Componente de Gerenciamento do Estoque (Gerente)

import { store, generateUUID } from '../store.js';

export function renderManagerStock(container) {
  let editandoIngId = null;

  function render() {
    const ingredientes = store.getIngredientes();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); flex-wrap: wrap; gap: var(--space-md);">
        <div>
          <h2>Controle de Estoque</h2>
          <p class="caption">Gerencie a quantidade e reposição de ingredientes</p>
        </div>
        <button class="btn btn-primary" id="btn-novo-ingrediente">
          <i class="fa-solid fa-plus"></i> Adicionar Ingrediente
        </button>
      </div>

      <!-- Modal de Ingrediente -->
      <div class="modal-backdrop" id="ingrediente-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="ing-modal-title">Adicionar Ingrediente</h3>
            <button class="modal-close" id="close-ing-modal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="ingrediente-form">
            <div class="form-group">
              <label class="form-label">Nome do Ingrediente</label>
              <input type="text" class="form-control" id="ing-nome" required placeholder="Ex: Feijão Preto, Laranja, Pão">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label">Unidade de Medida</label>
                <select class="form-control" id="ing-unidade">
                  <option value="kg">kg (Quilograma)</option>
                  <option value="g">g (Grama)</option>
                  <option value="l">l (Litro)</option>
                  <option value="ml">ml (Mililitro)</option>
                  <option value="un">un (Unidade)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Quantidade Inicial / Atual</label>
                <input type="number" step="0.01" class="form-control" id="ing-quantidade" required>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--space-md);">
              Salvar Ingrediente
            </button>
          </form>
        </div>
      </div>

      <!-- Tabela de Estoque -->
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Unidade</th>
              <th>Quantidade em Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${ingredientes.map(ing => `
              <tr>
                <td style="font-weight: 500;">${ing.nome}</td>
                <td>${ing.unidade}</td>
                <td style="font-weight: 600;">${ing.quantidade} ${ing.unidade}</td>
                <td>
                  ${ing.quantidade <= 2 ?
                    '<span class="badge badge-indisponivel">Estoque Baixo</span>' :
                    '<span class="badge badge-disponivel">Normal</span>'}
                </td>
                <td>
                  <div style="display: flex; gap: var(--space-xs);">
                    <button class="btn btn-secondary btn-sm btn-editar-ing" data-id="${ing.id}">
                      <i class="fa-solid fa-pen"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir-ing" data-id="${ing.id}">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const modal = container.querySelector('#ingrediente-modal');
    const form = container.querySelector('#ingrediente-form');

    function abrirModal(ing = null) {
      editandoIngId = ing ? ing.id : null;
      container.querySelector('#ing-modal-title').innerText = ing ? 'Editar Ingrediente' : 'Adicionar Ingrediente';
      container.querySelector('#ing-nome').value = ing ? ing.nome : '';
      container.querySelector('#ing-unidade').value = ing ? ing.unidade : 'kg';
      container.querySelector('#ing-quantidade').value = ing ? ing.quantidade : 10;
      modal.classList.add('active');
    }

    container.querySelector('#btn-novo-ingrediente').addEventListener('click', () => abrirModal());
    container.querySelector('#close-ing-modal').addEventListener('click', () => modal.classList.remove('active'));

    container.querySelectorAll('.btn-editar-ing').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const ing = ingredientes.find(i => i.id === id);
        if (ing) abrirModal(ing);
      });
    });

    container.querySelectorAll('.btn-excluir-ing').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Deseja excluir este ingrediente do estoque?')) {
          const novosIng = ingredientes.filter(i => i.id !== id);
          store.saveIngredientes(novosIng);
          render();
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = container.querySelector('#ing-nome').value.trim();
      const unidade = container.querySelector('#ing-unidade').value;
      const quantidade = parseFloat(container.querySelector('#ing-quantidade').value);

      const todosIng = store.getIngredientes();

      if (editandoIngId) {
        const ing = todosIng.find(i => i.id === editandoIngId);
        if (ing) {
          ing.nome = nome;
          ing.unidade = unidade;
          ing.quantidade = quantidade;
        }
      } else {
        todosIng.push({
          id: generateUUID(),
          nome,
          unidade,
          quantidade
        });
      }

      store.saveIngredientes(todosIng);
      modal.classList.remove('active');
      render();
    });
  }

  render();
}
