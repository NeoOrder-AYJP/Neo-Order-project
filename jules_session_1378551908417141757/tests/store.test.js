// tests/store.test.js — Bateria de testes da resenha do Neokirk, bora Bill validar tudo!
import assert from 'assert';
import { Store } from '../js/store.js';
import { getApiUrl, getApiKey } from '../js/api.js';

// Mock do localStorage pra rodar no Node — tche tcheee, gambiarras bem feitas funcionam!
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  clear() {
    this.store = {};
  }
}

async function runTests() {
  console.log('Rodando os testes unitários do Store da resenha 67...');

  // Teste 0: Credenciais da API ofuscadas
  assert.strictEqual(getApiUrl(), 'https://vhrpptqqzoltuzvjiiqn.supabase.co/rest/v1', 'URL da API decodificada certinho');
  assert.strictEqual(getApiKey(), 'sb_publishable_DBYnu-fuGsRW-vVj8mbKgQ_pBAT3mND', 'Chave da API decodificada certinho');
  console.log('✔ Teste 0 passou: Ofuscação das credenciais da API — tche tcheee!');

  // Teste 1: Inicialização e dados seed
  const mockStorage = new LocalStorageMock();
  const store = new Store(mockStorage);

  assert.strictEqual(store.getUsers().length >= 4, true, 'Usuários seed carregados');
  assert.strictEqual(store.getIngredients().length >= 6, true, 'Ingredientes seed carregados');
  assert.strictEqual(store.getDishes().length >= 4, true, 'Pratos seed carregados');
  console.log('✔ Teste 1 passou: Inicialização e dados seed da resenha — bora Bill!');

  // Teste 2: Autenticação
  const gerente = store.authenticate('gerente', '123');
  assert.notStrictEqual(gerente, null, 'Gerente autenticado');
  assert.strictEqual(gerente.perfil, 'gerente');

  const invalidAuth = store.authenticate('gerente', 'senhaerrada');
  assert.strictEqual(invalidAuth, null, 'Senha errada foi barrada, la ele não entra!');
  console.log('✔ Teste 2 passou: Autenticação — la ele tentou e não passou!');

  // Teste 3: Cálculo de disponibilidade do prato (RN-02)
  const feijoadaAvail = store.getDishAvailability('prato_feijoada');
  assert.strictEqual(feijoadaAvail.available, true, 'Feijoada tá disponível no começo');
  // feijao: 15kg / 0.3kg = 50, arroz: 20kg / 0.2kg = 100 -> mínimo = 50
  assert.strictEqual(feijoadaAvail.maxQuantity, 50, 'Quantidade máxima da feijoada é 50');
  console.log('✔ Teste 3 passou: Cálculo de disponibilidade — eitcha, conta certa!');

  // Teste 4: Criação de pedido & abatimento do estoque (RF-17, RN-03)
  const feijaoIngBefore = store.getIngredientById('ing_feijao').quantidade; // 15
  const arrozIngBefore = store.getIngredientById('ing_arroz').quantidade; // 20

  const newOrder = store.createOrder('usr_mesa05', [
    { prato_id: 'prato_feijoada', nome_prato: 'Feijoada', quantidade: 10, preco_unitario: 68.90 }
  ]);

  assert.strictEqual(newOrder.status, 'Recebido', 'Pedido criado com status Recebido');
  assert.strictEqual(newOrder.valor_total, 689.00, 'Total do pedido calculado certinho');

  const feijaoIngAfter = store.getIngredientById('ing_feijao').quantidade; // 15 - (0.3*10) = 12
  const arrozIngAfter = store.getIngredientById('ing_arroz').quantidade; // 20 - (0.2*10) = 18

  assert.strictEqual(feijaoIngAfter, 12.0, 'Estoque de feijão abatido');
  assert.strictEqual(arrozIngAfter, 18.0, 'Estoque de arroz abatido');
  console.log('✔ Teste 4 passou: Pedido criado e estoque abatido — tche tcheee!');

  // Teste 5: Cancelamento do pedido & estorno do estoque (RN-04)
  store.updateOrderStatus(newOrder.id, 'Cancelado');

  const feijaoIngRefunded = store.getIngredientById('ing_feijao').quantidade;
  const arrozIngRefunded = store.getIngredientById('ing_arroz').quantidade;

  assert.strictEqual(feijaoIngRefunded, 15.0, 'Feijão estornado no cancelamento');
  assert.strictEqual(arrozIngRefunded, 20.0, 'Arroz estornado no cancelamento');
  console.log('✔ Teste 5 passou: Cancelamento com estorno — la ele desistiu e tudo voltou!');

  // Teste 6: Processamento de pagamento & atualização do status do pedido
  const orderForPayment = store.createOrder('usr_mesa01', [
    { prato_id: 'prato_massa', nome_prato: 'Fettuccine com Cogumelos', quantidade: 2, preco_unitario: 54.00 }
  ]);
  const unpaidTotal = store.getTableUnpaidTotal('usr_mesa01');
  assert.strictEqual(unpaidTotal, 108.00, 'Total pendente da mesa calculado certinho');

  const paymentObj = store.processPayment('usr_mesa01', 'PIX');
  assert.strictEqual(paymentObj.status, 'Aprovado', 'Pagamento aprovado, eitcha!');
  assert.strictEqual(paymentObj.valor, 108.00, 'Valor do pagamento bateu com o total');
  assert.strictEqual(store.getTableUnpaidTotal('usr_mesa01'), 0, 'Saldo pendente zerou após o pagamento');
  assert.strictEqual(store.getOrderById(orderForPayment.id).status, 'Pago', 'Pedido marcado como Pago');
  console.log('✔ Teste 6 passou: Pagamento processado — bora Bill, din din na conta 67!');

  // Teste 7: Análise financeira (RF-32, RF-34, RN-08, RN-09)
  const metrics = store.getFinancialMetrics('Este Mês');
  assert.strictEqual(typeof metrics.totalFaturado, 'number');
  assert.strictEqual(typeof metrics.ticketMedio, 'number');
  console.log('✔ Teste 7 passou: Análise financeira da resenha — tche tcheee!');

  // Teste 8: Exportar & Importar JSON (RF-41, RF-42)
  const jsonExport = store.exportData();
  assert.strictEqual(typeof jsonExport, 'string');

  const newStorage = new LocalStorageMock();
  const store2 = new Store(newStorage);
  store2.importData(jsonExport);
  assert.strictEqual(store2.getUsers().length, store.getUsers().length);
  console.log('✔ Teste 8 passou: Exportação & importação de backup — bora Bill!');

  store.stopAutoSync();
  store2.stopAutoSync();

  console.log('Todos os testes do Store passaram com sucesso! Eitcha, a resenha 67 tá garantida, tche tcheee!');
}

runTests().catch(err => {
  console.error('Eitcha! Teste quebrou, la ele fez alguma coisa errada:', err);
  process.exit(1);
});
