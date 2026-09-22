// tests/store.test.js
import assert from 'assert';
import { Store } from '../js/store.js';
import { getApiUrl, getApiKey } from '../js/api.js';

// Mock localStorage for Node environment
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
  console.log('Running Store unit tests...');

  // Test 0: API Obfuscation Credentials
  assert.strictEqual(getApiUrl(), 'https://vhrpptqqzoltuzvjiiqn.supabase.co/rest/v1', 'API URL decoded correctly');
  assert.strictEqual(getApiKey(), 'sb_publishable_DBYnu-fuGsRW-vVj8mbKgQ_pBAT3mND', 'API Key decoded correctly');
  console.log('✔ Test 0 passed: API Credential Obfuscation');

  // Test 1: Initialization and Seed Data
  const mockStorage = new LocalStorageMock();
  const store = new Store(mockStorage);

  assert.strictEqual(store.getUsers().length >= 4, true, 'Seed users loaded');
  assert.strictEqual(store.getIngredients().length >= 6, true, 'Seed ingredients loaded');
  assert.strictEqual(store.getDishes().length >= 4, true, 'Seed dishes loaded');
  console.log('✔ Test 1 passed: Initialization and seed data');

  // Test 2: Authentication
  const gerente = store.authenticate('gerente', '123');
  assert.notStrictEqual(gerente, null, 'Gerente authenticated');
  assert.strictEqual(gerente.perfil, 'gerente');

  const invalidAuth = store.authenticate('gerente', 'wrongpass');
  assert.strictEqual(invalidAuth, null, 'Invalid password rejected');
  console.log('✔ Test 2 passed: Authentication');

  // Test 3: Dish Availability Calculation (RN-02)
  const feijoadaAvail = store.getDishAvailability('prato_feijoada');
  assert.strictEqual(feijoadaAvail.available, true, 'Feijoada is available initially');
  // feijao: 15kg / 0.3kg = 50, arroz: 20kg / 0.2kg = 100 -> min = 50
  assert.strictEqual(feijoadaAvail.maxQuantity, 50, 'Feijoada max quantity is 50');
  console.log('✔ Test 3 passed: Dish availability calculation');

  // Test 4: Order Creation & Stock Deduction (RF-17, RN-03)
  const feijaoIngBefore = store.getIngredientById('ing_feijao').quantidade; // 15
  const arrozIngBefore = store.getIngredientById('ing_arroz').quantidade; // 20

  const newOrder = store.createOrder('usr_mesa05', [
    { prato_id: 'prato_feijoada', nome_prato: 'Feijoada', quantidade: 10, preco_unitario: 68.90 }
  ]);

  assert.strictEqual(newOrder.status, 'Recebido', 'Order created with status Recebido');
  assert.strictEqual(newOrder.valor_total, 689.00, 'Order total calculated');

  const feijaoIngAfter = store.getIngredientById('ing_feijao').quantidade; // 15 - (0.3*10) = 12
  const arrozIngAfter = store.getIngredientById('ing_arroz').quantidade; // 20 - (0.2*10) = 18

  assert.strictEqual(feijaoIngAfter, 12.0, 'Feijão stock deducted');
  assert.strictEqual(arrozIngAfter, 18.0, 'Arroz stock deducted');
  console.log('✔ Test 4 passed: Order creation & stock deduction');

  // Test 5: Order Cancellation & Stock Refund (RN-04)
  store.updateOrderStatus(newOrder.id, 'Cancelado');

  const feijaoIngRefunded = store.getIngredientById('ing_feijao').quantidade;
  const arrozIngRefunded = store.getIngredientById('ing_arroz').quantidade;

  assert.strictEqual(feijaoIngRefunded, 15.0, 'Feijão stock refunded on cancellation');
  assert.strictEqual(arrozIngRefunded, 20.0, 'Arroz stock refunded on cancellation');
  console.log('✔ Test 5 passed: Order cancellation & stock refund');

  // Test 6: Payment Processing & Order Status Update
  const orderForPayment = store.createOrder('usr_mesa01', [
    { prato_id: 'prato_massa', nome_prato: 'Fettuccine com Cogumelos', quantidade: 2, preco_unitario: 54.00 }
  ]);
  const unpaidTotal = store.getTableUnpaidTotal('usr_mesa01');
  assert.strictEqual(unpaidTotal, 108.00, 'Table unpaid total calculated accurately');

  const paymentObj = store.processPayment('usr_mesa01', 'PIX');
  assert.strictEqual(paymentObj.status, 'Aprovado', 'Payment processed as Aprovado');
  assert.strictEqual(paymentObj.valor, 108.00, 'Payment amount matched order total');
  assert.strictEqual(store.getTableUnpaidTotal('usr_mesa01'), 0, 'Table unpaid balance cleared to 0 after payment');
  assert.strictEqual(store.getOrderById(orderForPayment.id).status, 'Pago', 'Order status changed to Pago');
  console.log('✔ Test 6 passed: Payment processing & status update');

  // Test 7: Financial Analytics (RF-32, RF-34, RN-08, RN-09)
  const metrics = store.getFinancialMetrics('Este Mês');
  assert.strictEqual(typeof metrics.totalFaturado, 'number');
  assert.strictEqual(typeof metrics.ticketMedio, 'number');
  console.log('✔ Test 7 passed: Financial Analytics');

  // Test 8: Export & Import JSON (RF-41, RF-42)
  const jsonExport = store.exportData();
  assert.strictEqual(typeof jsonExport, 'string');

  const newStorage = new LocalStorageMock();
  const store2 = new Store(newStorage);
  store2.importData(jsonExport);
  assert.strictEqual(store2.getUsers().length, store.getUsers().length);
  console.log('✔ Test 8 passed: Export & Import JSON');

  store.stopAutoSync();
  store2.stopAutoSync();

  console.log('All Store unit tests passed successfully!');
}

runTests().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
