// Componente de Backup e Restauração de Dados (JSON - Gerente)

import { store } from '../store.js';

export function renderManagerBackup(container) {
  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <h2>Backup e Restauração de Dados</h2>
      <p class="caption">Exporte ou importe as informações completas do sistema em formato JSON</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl);">
      <!-- Exportação -->
      <div class="card">
        <h3 style="margin-bottom: var(--space-md);"><i class="fa-solid fa-file-export" style="color: var(--color-primary);"></i> Exportar Backup</h3>
        <p class="caption" style="margin-bottom: var(--space-lg);">
          Gere um arquivo JSON contendo todos os pedidos, produtos, estoque, chamados e contas cadastradas.
        </p>
        <button class="btn btn-primary" id="btn-exportar-json" style="width: 100%;">
          <i class="fa-solid fa-download"></i> Baixar Arquivo JSON
        </button>
      </div>

      <!-- Importação -->
      <div class="card">
        <h3 style="margin-bottom: var(--space-md);"><i class="fa-solid fa-file-import" style="color: var(--color-primary);"></i> Importar Backup</h3>
        <p class="caption" style="margin-bottom: var(--space-lg);">
          Restaure os dados do sistema a partir de um arquivo JSON previamente exportado.
        </p>
        <div class="form-group">
          <input type="file" id="file-import-json" accept=".json" class="form-control">
        </div>
        <button class="btn btn-secondary" id="btn-importar-json" style="width: 100%;">
          <i class="fa-solid fa-upload"></i> Restaurar Dados
        </button>
      </div>
    </div>
  `;

  // Lógica de Exportação
  container.querySelector('#btn-exportar-json').addEventListener('click', () => {
    try {
      const dataStr = store.exportarDadosJSON();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sabor_gestao_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Erro ao exportar dados: ' + e.message);
    }
  });

  // Lógica de Importação
  container.querySelector('#btn-importar-json').addEventListener('click', () => {
    const fileInput = container.querySelector('#file-import-json');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Selecione um arquivo JSON de backup.');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        store.importarDadosJSON(e.target.result);
        alert('Dados restaurados com sucesso!');
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  });
}
