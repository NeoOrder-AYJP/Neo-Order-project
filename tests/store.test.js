// Suíte de Testes Automatizados para a Camada de Dados e Lógica do Sistema

import assert from 'node:assert';
import { store } from '../src/js/store.js';
import { CONFIG } from '../src/js/config.js';
import { authManager } from '../src/js/auth.js';

console.log('🚀 Iniciando testes do sistema...');

// 1. Teste da Obfustação de Credenciais
console.log('Testando obfustação de credenciais...');
assert(typeof CONFIG.API_KEY === 'string' && CONFIG.API_KEY.startsWith('sb_publishable_'), 'Chave API deve ser decodificada dinamicamente');
assert(typeof CONFIG.API_URL === 'string' && CONFIG.API_URL.includes('supabase.co'), 'URL da API deve ser decodificada dinamicamente');
console.log('  ✅ Credenciais decodificadas com sucesso.');

// 2. Teste do Estado Inicial e Carga de Dados
console.log('Testando carga inicial de dados...');
const usuarios = store.getUsuarios();
const pratos = store.getPratos();
const ingredientes = store.getIngredientes();

assert(usuarios.length >= 7, 'Deve conter pelo menos 7 usuários padrão');
assert(pratos.length >= 4, 'Deve conter pelo menos 4 pratos padrão');
assert(ingredientes.length >= 9, 'Deve conter pelo menos 9 ingredientes padrão');
console.log('  ✅ Estado inicial verificado.');

// 3. Teste de Autenticação
console.log('Testando autenticação e perfis...');
const userMesa = authManager.loginMesa('mesa01', '123');
assert.strictEqual(userMesa.login, 'mesa01');
assert.strictEqual(authManager.isMesa(), true);

authManager.logout();
assert.strictEqual(authManager.isLoggedIn(), false);

const userGerente = authManager.loginFuncionario('gerente', '123');
assert.strictEqual(userGerente.perfil, 'Gerente');
assert.strictEqual(authManager.isGerente(), true);
authManager.logout();
console.log('  ✅ Fluxo de autenticação testado com sucesso.');

// 4. Teste de Disponibilidade de Prato e Débito de Estoque ao Fazer Pedido
console.log('Testando pedido e baixa de estoque...');
const feijoada = pratos.find(p => p.id === 'prato-feijoada');
const ingFeijaoAntes = store.getIngredientes().find(i => i.id === 'ing-feijao').quantidade;

assert.strictEqual(store.isPratoDisponivel(feijoada.id), true, 'Feijoada deve estar disponível inicialmente');

// Criar pedido para mesa 01 (2 porções de feijoada -> consome 2 * 0.3kg = 0.6kg de feijão)
const novoPedido = store.fazerPedido('usr-mesa01', [
  { prato_id: feijoada.id, quantidade: 2, preco_unitario: feijoada.preco }
]);

assert.strictEqual(novoPedido.valor_total, 45.90 * 2, 'Valor total deve ser calculado corretamente');
assert.strictEqual(novoPedido.status, 'Recebido', 'Status inicial deve ser Recebido');

const ingFeijaoDepois = store.getIngredientes().find(i => i.id === 'ing-feijao').quantidade;
assert.strictEqual(ingFeijaoDepois, ingFeijaoAntes - 0.6, 'Estoque de feijão deve ter reduzido 0.6kg');
console.log('  ✅ Baixa no estoque efetuada com sucesso.');

// 5. Teste de Cancelamento de Pedido e Estorno no Estoque
console.log('Testando cancelamento e estorno de estoque...');
store.atualizarStatusPedido(novoPedido.id, 'Cancelado');
const ingFeijaoEstornado = store.getIngredientes().find(i => i.id === 'ing-feijao').quantidade;
assert.strictEqual(ingFeijaoEstornado, ingFeijaoAntes, 'Estoque de feijão deve ter sido estornado ao cancelar pedido');
console.log('  ✅ Estorno de estoque verificado com sucesso.');

// 6. Teste de Chamado de Funcionário
console.log('Testando chamados de mesas...');
const chamado = store.criarChamado('usr-mesa01', 'Preciso de água gelada');
assert.strictEqual(chamado.status, 'Pendente');

store.atenderChamado(chamado.id);
const chamadoAtendido = store.getChamados().find(c => c.id === chamado.id);
assert.strictEqual(chamadoAtendido.status, 'Atendido');
console.log('  ✅ Chamado criado e atendido com sucesso.');

// 7. Teste de Exportação e Importação de JSON
console.log('Testando backup JSON...');
const backupJson = store.exportarDadosJSON();
assert(backupJson.includes('usr-gerente'), 'O backup deve conter os usuários cadastrados');
const importResult = store.importarDadosJSON(backupJson);
assert.strictEqual(importResult, true, 'Importação deve ser bem-sucedida');
console.log('  ✅ Exportação e importação de backup finalizadas com sucesso.');

console.log('\n🎉 Todos os testes passaram sem erros!');
