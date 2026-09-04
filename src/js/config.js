// Configuração do Sistema e Credenciais Obfuscadas

const _0xk = [0x2A]; // Chave XOR interna

// Strings codificadas hex/xor
const _0xeK = '5948755a5f48464359424b48464f7558466b19605d6b70645b68794113581943791d1c1d4d754f695863757c4945';
const _0xeU = '425e5e5a591005054d4c5e5a484d484c5e5e5f5a4b53404c504e474704595f5a4b484b594f04494505584f595e055c1b05';

function _d(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16) ^ _0xk[0];
    str += String.fromCharCode(code);
  }
  return str;
}

export const CONFIG = {
  get API_KEY() {
    return _d(_0xeK);
  },
  get API_URL() {
    return _d(_0xeU);
  },
  STORAGE_KEYS: {
    USUARIOS: 'neo_order_usuarios',
    PRATOS: 'neo_order_pratos',
    INGREDIENTES: 'neo_order_ingredientes',
    PEDIDOS: 'neo_order_pedidos',
    CHAMADOS: 'neo_order_chamados',
    SESSAO: 'neo_order_sessao_atual'
  }
};
