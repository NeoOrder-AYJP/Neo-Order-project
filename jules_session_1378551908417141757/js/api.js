// js/api.js — Integração com o Banco Supabase do Neokirk (credenciais ofuscadas, segredo da resenha)

// Decodifica as credenciais guardadas em Base64 — tche tcheee, nada em texto puro
function decodeCred(b64) {
  if (typeof atob === 'function') {
    return atob(b64);
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64').toString('utf-8');
  }
  return b64;
}

// Credenciais ofuscadas em Base64
const _B_URL = 'aHR0cHM6Ly92aHJwcHRxcXpvbHR1enZqaWlxbi5zdXBhYmFzZS5jby9yZXN0L3Yx';
const _B_KEY = 'c2JfcHVibGlzaGFibGVfREJZbnUtZnVHc1JXLXZWajhtYktnUV9wQkFUM21ORA==';

export const getApiUrl = () => decodeCred(_B_URL);
export const getApiKey = () => decodeCred(_B_KEY);

// Monta os cabeçalhos com a chave da resenha
function getHeaders() {
  const key = getApiKey();
  return {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`
  };
}

// Busca a tabela inteira no Supabase — bora Bill buscar os dados!
export async function fetchTable(table) {
  try {
    const url = `${getApiUrl()}/${table}?select=*`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Sync Neokirk] Eitcha! Erro ao buscar ${table}:`, err.message);
    return null;
  }
}

// Insere uma linha nova na tabela
export async function insertRow(table, rowData) {
  try {
    const url = `${getApiUrl()}/${table}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(rowData)
    });
    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Sync Neokirk] Eitcha! Erro ao inserir em ${table}:`, err.message);
    return null;
  }
}

// Atualiza uma linha existente
export async function updateRow(table, matchField, matchVal, rowData) {
  try {
    const url = `${getApiUrl()}/${table}?${matchField}=eq.${encodeURIComponent(matchVal)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(rowData)
    });
    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Sync Neokirk] La ele! Erro ao atualizar ${table}:`, err.message);
    return null;
  }
}

// Remove uma linha da tabela
export async function deleteRow(table, matchField, matchVal) {
  try {
    const url = `${getApiUrl()}/${table}?${matchField}=eq.${encodeURIComponent(matchVal)}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
    }
    return true;
  } catch (err) {
    console.warn(`[Sync Neokirk] Tche tcheee! Erro ao deletar de ${table}:`, err.message);
    return false;
  }
}
