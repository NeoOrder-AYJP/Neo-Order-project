// Componente de Gerenciamento do Cardápio (CRUD de Pratos para Gerente)

import { store, generateUUID } from '../store.js';

export function renderManagerMenu(container) {
  let editandoPratoId = null;

  function render() {
    const pratos = store.getPratos();
    const ingredientes = store.getIngredientes();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); flex-wrap: wrap; gap: var(--space-md);">
        <div>
          <h2>Gerenciar Cardápio</h2>
          <p class="caption">Cadastre, edite ou remova pratos do cardápio do restaurante</p>
        </div>
        <button class="btn btn-primary" id="btn-novo-prato">
          <i class="fa-solid fa-plus"></i> Novo Prato
        </button>
      </div>

      <!-- Formulário Modal de Prato -->
      <div class="modal-backdrop" id="prato-modal">
        <div class="modal-content" style="max-width: 600px;">
          <div class="modal-header">
            <h3 id="prato-modal-title">Novo Prato</h3>
            <button class="modal-close" id="close-prato-modal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="prato-form">
            <div class="form-group">
              <label class="form-label">Nome do Prato</label>
              <input type="text" class="form-control" id="prato-nome" required>
            </div>

            <div class="form-group">
              <label class="form-label">Descrição</label>
              <textarea class="form-control" id="prato-descricao" style="min-height: 80px;" required></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label">Preço (R$)</label>
                <input type="number" step="0.01" class="form-control" id="prato-preco" required>
              </div>
              <div class="form-group">
                <label class="form-label">URL da Imagem</label>
                <input type="url" class="form-control" id="prato-imagem" required>
              </div>
            </div>

            <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-md);">
              <label style="display: flex; align-items: center; gap: var(--space-xs); font-size: 14px; cursor: pointer;">
                <input type="checkbox" id="prato-destaque"> Prato em Destaque (Slides)
              </label>
              <label style="display: flex; align-items: center; gap: var(--space-xs); font-size: 14px; cursor: pointer;">
                <input type="checkbox" id="prato-ativo" checked> Ativo no Cardápio
              </label>
            </div>

            <div style="margin-bottom: var(--space-md);">
              <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                <span>Ingredientes Necessários por Porção</span>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-add-ing-row">
                  <i class="fa-solid fa-plus"></i> Adicionar Ingrediente
                </button>
              </label>
              <div id="ingredientes-container" style="display: flex; flex-direction: column; gap: var(--space-xs); max-height: 150px; overflow-y: auto;">
                <!-- Linhas de ingredientes injetadas dinamicamente -->
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--space-md);">
              Salvar Prato
            </button>
          </form>
        </div>
      </div>

      <!-- Tabela de Pratos -->
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Prato</th>
              <th>Preço</th>
              <th>Destaque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${pratos.map(prato => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <img src="${prato.imagem}" alt="" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                    <div>
                      <div style="font-weight: 500;">${prato.nome}</div>
                      <div class="caption">${prato.descricao.substring(0, 45)}...</div>
                    </div>
                  </div>
                </td>
                <td style="font-weight: 600;">R$ ${prato.preco.toFixed(2).replace('.', ',')}</td>
                <td>
                  ${prato.destaque ? '<span class="badge badge-info">Sim</span>' : '<span class="caption">Não</span>'}
                </td>
                <td>
                  <span class="badge ${prato.ativo ? 'badge-disponivel' : 'badge-indisponivel'}">
                    ${prato.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: var(--space-xs);">
                    <button class="btn btn-secondary btn-sm btn-editar-prato" data-id="${prato.id}">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir-prato" data-id="${prato.id}">
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

    const modal = container.querySelector('#prato-modal');
    const form = container.querySelector('#prato-form');
    const ingContainer = container.querySelector('#ingredientes-container');

    function createIngRow(selectedIngId = '', qtd = 0.1) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = 'var(--space-xs)';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <select class="form-control select-ing-id" style="flex: 2; padding: 6px 12px; font-size: 13px;">
          <option value="">Selecione o ingrediente</option>
          ${ingredientes.map(i => `<option value="${i.id}" ${i.id === selectedIngId ? 'selected' : ''}>${i.nome} (${i.unidade})</option>`).join('')}
        </select>
        <input type="number" step="0.01" class="form-control input-ing-qtd" value="${qtd}" placeholder="Qtd" style="flex: 1; padding: 6px 12px; font-size: 13px;">
        <button type="button" class="btn btn-danger btn-sm btn-remove-ing-row" style="padding: 6px 10px;"><i class="fa-solid fa-trash"></i></button>
      `;
      row.querySelector('.btn-remove-ing-row').addEventListener('click', () => row.remove());
      ingContainer.appendChild(row);
    }

    container.querySelector('#btn-add-ing-row').addEventListener('click', () => createIngRow());

    function abrirModal(prato = null) {
      editandoPratoId = prato ? prato.id : null;
      container.querySelector('#prato-modal-title').innerText = prato ? 'Editar Prato' : 'Novo Prato';
      container.querySelector('#prato-nome').value = prato ? prato.nome : '';
      container.querySelector('#prato-descricao').value = prato ? prato.descricao : '';
      container.querySelector('#prato-preco').value = prato ? prato.preco : '';
      container.querySelector('#prato-imagem').value = prato ? prato.imagem : '';
      container.querySelector('#prato-destaque').checked = prato ? prato.destaque : false;
      container.querySelector('#prato-ativo').checked = prato ? prato.ativo : true;

      ingContainer.innerHTML = '';
      if (prato && prato.ingredientes) {
        prato.ingredientes.forEach(ing => createIngRow(ing.ingrediente_id, ing.quantidade));
      } else {
        createIngRow();
      }

      modal.classList.add('active');
    }

    container.querySelector('#btn-novo-prato').addEventListener('click', () => abrirModal());
    container.querySelector('#close-prato-modal').addEventListener('click', () => modal.classList.remove('active'));

    container.querySelectorAll('.btn-editar-prato').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const prato = pratos.find(p => p.id === id);
        if (prato) abrirModal(prato);
      });
    });

    container.querySelectorAll('.btn-excluir-prato').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Deseja realmente remover este prato?')) {
          const novosPratos = pratos.filter(p => p.id !== id);
          store.savePratos(novosPratos);
          render();
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = container.querySelector('#prato-nome').value.trim();
      const descricao = container.querySelector('#prato-descricao').value.trim();
      const preco = parseFloat(container.querySelector('#prato-preco').value);
      const imagem = container.querySelector('#prato-imagem').value.trim();
      const destaque = container.querySelector('#prato-destaque').checked;
      const ativo = container.querySelector('#prato-ativo').checked;

      const ingRows = ingContainer.querySelectorAll('div');
      const pratoIngredientes = [];

      ingRows.forEach(row => {
        const ingId = row.querySelector('.select-ing-id').value;
        const qtd = parseFloat(row.querySelector('.input-ing-qtd').value);
        if (ingId && qtd > 0) {
          const ingObj = ingredientes.find(i => i.id === ingId);
          pratoIngredientes.push({
            ingrediente_id: ingId,
            quantidade: qtd,
            unidade: ingObj ? ingObj.unidade : 'kg'
          });
        }
      });

      const todosPratos = store.getPratos();

      if (editandoPratoId) {
        const p = todosPratos.find(pr => pr.id === editandoPratoId);
        if (p) {
          p.nome = nome;
          p.descricao = descricao;
          p.preco = preco;
          p.imagem = imagem;
          p.destaque = destaque;
          p.ativo = ativo;
          p.ingredientes = pratoIngredientes;
        }
      } else {
        todosPratos.push({
          id: generateUUID(),
          nome,
          descricao,
          preco,
          imagem,
          destaque,
          ativo,
          ingredientes: pratoIngredientes
        });
      }

      store.savePratos(todosPratos);
      modal.classList.remove('active');
      render();
    });
  }

  render();
}
