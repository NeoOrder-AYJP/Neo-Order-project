// Componente de Gerenciamento de Contas (Mesas e Funcionários - Gerente)

import { store, generateUUID } from '../store.js';

export function renderManagerAccounts(container) {
  let subAbaAtiva = 'mesas'; // 'mesas' | 'funcionarios'
  let editandoUsrId = null;

  function render() {
    const usuarios = store.getUsuarios();
    const contasMesas = usuarios.filter(u => u.tipo === 'mesa');
    const contasFuncionarios = usuarios.filter(u => u.tipo === 'funcionario');

    container.innerHTML = `
      <div style="margin-bottom: var(--space-lg);">
        <h2>Gerenciamento de Contas</h2>
        <p class="caption">Gerencie acessos de mesas e credenciais de funcionários</p>
      </div>

      <!-- Sub-navegação -->
      <div class="tab-nav" style="margin-bottom: var(--space-lg);">
        <div class="tab-item ${subAbaAtiva === 'mesas' ? 'active' : ''}" id="subtab-mesas">
          Contas de Mesas (${contasMesas.length})
        </div>
        <div class="tab-item ${subAbaAtiva === 'funcionarios' ? 'active' : ''}" id="subtab-funcionarios">
          Contas de Funcionários (${contasFuncionarios.length})
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-md);">
        <button class="btn btn-primary" id="btn-nova-conta">
          <i class="fa-solid fa-plus"></i> ${subAbaAtiva === 'mesas' ? 'Criar Conta de Mesa' : 'Criar Conta de Funcionário'}
        </button>
      </div>

      <!-- Modal de Conta -->
      <div class="modal-backdrop" id="conta-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="conta-modal-title">Nova Conta</h3>
            <button class="modal-close" id="close-conta-modal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="conta-form">
            <div class="form-group">
              <label class="form-label">${subAbaAtiva === 'mesas' ? 'Nome / Identificação da Mesa' : 'Nome Completo'}</label>
              <input type="text" class="form-control" id="usr-nome" required placeholder="${subAbaAtiva === 'mesas' ? 'Ex: Mesa 06' : 'Ex: João da Silva'}">
            </div>

            <div class="form-group">
              <label class="form-label">Login de Acesso</label>
              <input type="text" class="form-control" id="usr-login" required placeholder="${subAbaAtiva === 'mesas' ? 'Ex: mesa06' : 'Ex: joaosilva'}">
            </div>

            <div class="form-group">
              <label class="form-label">Senha</label>
              <input type="text" class="form-control" id="usr-senha" required placeholder="Senha de acesso">
            </div>

            ${subAbaAtiva === 'funcionarios' ? `
              <div class="form-group">
                <label class="form-label">Perfil / Permissão</label>
                <select class="form-control" id="usr-perfil">
                  <option value="Atendente">Atendente</option>
                  <option value="Gerente">Gerente</option>
                </select>
              </div>
            ` : ''}

            <div class="form-group">
              <label style="display: flex; align-items: center; gap: var(--space-xs); font-size: 14px; cursor: pointer;">
                <input type="checkbox" id="usr-ativo" checked> Conta Ativa
              </label>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--space-md);">
              Salvar Conta
            </button>
          </form>
        </div>
      </div>

      <!-- Tabela de Contas -->
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Identificação / Nome</th>
              <th>Login</th>
              ${subAbaAtiva === 'funcionarios' ? '<th>Perfil</th>' : ''}
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${(subAbaAtiva === 'mesas' ? contasMesas : contasFuncionarios).map(usr => `
              <tr>
                <td style="font-weight: 500;">${usr.nome}</td>
                <td><code>${usr.login}</code></td>
                ${subAbaAtiva === 'funcionarios' ? `<td><span class="badge badge-info">${usr.perfil}</span></td>` : ''}
                <td>
                  <span class="badge ${usr.ativo ? 'badge-disponivel' : 'badge-indisponivel'}">
                    ${usr.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: var(--space-xs);">
                    <button class="btn btn-secondary btn-sm btn-editar-usr" data-id="${usr.id}">
                      <i class="fa-solid fa-pen"></i> Editar
                    </button>
                    <button class="btn ${usr.ativo ? 'btn-danger' : 'btn-primary'} btn-sm btn-toggle-usr" data-id="${usr.id}">
                      ${usr.ativo ? 'Inativar' : 'Reativar'}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const modal = container.querySelector('#conta-modal');
    const form = container.querySelector('#conta-form');

    container.querySelector('#subtab-mesas').addEventListener('click', () => {
      subAbaAtiva = 'mesas';
      render();
    });

    container.querySelector('#subtab-funcionarios').addEventListener('click', () => {
      subAbaAtiva = 'funcionarios';
      render();
    });

    function abrirModal(usr = null) {
      editandoUsrId = usr ? usr.id : null;
      container.querySelector('#conta-modal-title').innerText = usr ? 'Editar Conta' : 'Nova Conta';
      container.querySelector('#usr-nome').value = usr ? usr.nome : '';
      container.querySelector('#usr-login').value = usr ? usr.login : '';
      container.querySelector('#usr-senha').value = usr ? usr.senha : '';
      if (subAbaAtiva === 'funcionarios') {
        const perfSelect = container.querySelector('#usr-perfil');
        if (perfSelect) perfSelect.value = usr ? usr.perfil : 'Atendente';
      }
      container.querySelector('#usr-ativo').checked = usr ? usr.ativo : true;
      modal.classList.add('active');
    }

    container.querySelector('#btn-nova-conta').addEventListener('click', () => abrirModal());
    container.querySelector('#close-conta-modal').addEventListener('click', () => modal.classList.remove('active'));

    container.querySelectorAll('.btn-editar-usr').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const usr = usuarios.find(u => u.id === id);
        if (usr) abrirModal(usr);
      });
    });

    container.querySelectorAll('.btn-toggle-usr').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const usr = usuarios.find(u => u.id === id);
        if (usr) {
          usr.ativo = !usr.ativo;
          store.saveUsuarios(usuarios);
          render();
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = container.querySelector('#usr-nome').value.trim();
      const login = container.querySelector('#usr-login').value.trim();
      const senha = container.querySelector('#usr-senha').value.trim();
      const ativo = container.querySelector('#usr-ativo').checked;
      const perfilSelect = container.querySelector('#usr-perfil');
      const perfil = perfilSelect ? perfilSelect.value : null;

      const todosUsr = store.getUsuarios();

      if (editandoUsrId) {
        const usr = todosUsr.find(u => u.id === editandoUsrId);
        if (usr) {
          usr.nome = nome;
          usr.login = login;
          usr.senha = senha;
          usr.ativo = ativo;
          if (usr.tipo === 'funcionario') usr.perfil = perfil;
        }
      } else {
        todosUsr.push({
          id: generateUUID(),
          tipo: subAbaAtiva === 'mesas' ? 'mesa' : 'funcionario',
          nome,
          login,
          senha,
          perfil,
          ativo,
          criado_em: new Date().toISOString()
        });
      }

      store.saveUsuarios(todosUsr);
      modal.classList.remove('active');
      render();
    });
  }

  render();
}
