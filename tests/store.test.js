import assert from 'assert';
import { store } from '../src/store.js';
import { API_KEY, API_URL } from '../src/config.js';

async function runTests() {
  console.log('--- Starting Neo Order Project Tests ---');

  // Test 1: Config Obfuscation
  assert.strictEqual(API_KEY, 'sb_publishable_DBYnu-fuGsRW-vVj8mbKgQ_pBAT3mND', 'API key should match expected key when decoded.');
  assert.strictEqual(API_URL, 'https://vhrpptqqzoltuzvjiiqn.supabase.co/rest/v1/', 'API URL should match expected URL when decoded.');
  console.log('✓ Test 1 Passed: Obfuscated configuration decoded correctly.');

  // Test 2: Initial Store State
  assert.ok(store.state.pratos.length >= 4, 'Initial dishes should be populated.');
  assert.ok(store.state.ingredientes.length >= 10, 'Initial ingredients should be populated.');
  assert.ok(store.state.mesas.length >= 3, 'Initial tables should be populated.');
  console.log('✓ Test 2 Passed: Initial store state loaded correctly.');

  // Test 3: Dish Availability Calculation (RN-02)
  const feijoada = store.state.pratos.find(p => p.nome === 'Feijoada Completa');
  const availBefore = store.getDishAvailability(feijoada);
  assert.strictEqual(availBefore.disponivel, true, 'Feijoada should be available initially.');

  const escondidinho = store.state.pratos.find(p => p.nome === 'Escondidinho de Carne Seca');
  // Mandioca stock is 0.5kg, recipe requires 0.4kg per portion -> exactly 1 portion
  const availEscondidinho = store.getDishAvailability(escondidinho);
  assert.strictEqual(availEscondidinho.porcoes, 1, 'Escondidinho should have exactly 1 portion available.');
  console.log('✓ Test 3 Passed: Dish availability calculated correctly.');

  // Test 4: Stock Deduction on Order Creation (RN-03)
  const mandiocaBefore = store.state.ingredientes.find(i => i.nome === 'Mandioca').quantidade;
  await store.addPedido({
    mesa_id: 'mesa-05',
    mesa_nome: 'Mesa 05',
    itens: [
      { prato_id: escondidinho.id, nome: escondidinho.nome, quantidade: 1, preco_unitario: escondidinho.preco }
    ],
    valor_total: escondidinho.preco
  });

  const mandiocaAfter = store.state.ingredientes.find(i => i.nome === 'Mandioca').quantidade;
  assert.strictEqual(mandiocaAfter, mandiocaBefore - 0.4, 'Mandioca stock should be debited by 0.4kg.');

  const availEscondidinhoAfter = store.getDishAvailability(escondidinho);
  assert.strictEqual(availEscondidinhoAfter.disponivel, false, 'Escondidinho should now be unavailable due to depleted Mandioca stock.');
  console.log('✓ Test 4 Passed: Ingredient stock debited and dish marked unavailable automatically.');

  // Test 5: Restock on Order Cancellation (RN-04)
  const createdOrder = store.state.pedidos[0];
  await store.updateOrderStatus(createdOrder.id, 'Cancelado');

  const mandiocaRestocked = store.state.ingredientes.find(i => i.nome === 'Mandioca').quantidade;
  assert.strictEqual(mandiocaRestocked, mandiocaBefore, 'Mandioca stock should be restored upon order cancellation.');
  assert.strictEqual(store.getDishAvailability(escondidinho).disponivel, true, 'Escondidinho should be available again after cancellation.');
  console.log('✓ Test 5 Passed: Stock restored correctly upon order cancellation.');

  // Test 6: Backup Export / Import (RF-41, RF-42)
  const exportedJSON = store.exportJSON();
  assert.ok(exportedJSON.includes('Feijoada Completa'), 'Exported JSON should contain dish data.');

  const importSuccess = store.importJSON(exportedJSON);
  assert.strictEqual(importSuccess, true, 'Import JSON should return true on valid payload.');
  console.log('✓ Test 6 Passed: JSON export and import verified.');

  console.log('\nAll unit tests passed successfully!');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
