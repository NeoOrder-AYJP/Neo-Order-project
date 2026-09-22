// js/api.js - Obfuscated Supabase Database Client Integration

function decodeCred(b64) {
  if (typeof atob === 'function') {
    return atob(b64);
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64').toString('utf-8');
  }
  return b64;
}

// Base64 obfuscated credentials
const _B_URL = 'aHR0cHM6Ly92aHJwcHRxcXpvbHR1enZqaWlxbi5zdXBhYmFzZS5jby9yZXN0L3Yx';
const _B_KEY = 'c2JfcHVibGlzaGFibGVfREJZbnUtZnVHc1JXLXZWajhtYktnUV9wQkFUM21ORA==';

export const getApiUrl = () => decodeCred(_B_URL);
export const getApiKey = () => decodeCred(_B_KEY);

function getHeaders() {
  const key = getApiKey();
  return {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`
  };
}

export async function fetchTable(table) {
  try {
    const url = `${getApiUrl()}/${table}?select=*`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Supabase Sync] Error fetching ${table}:`, err.message);
    return null;
  }
}

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
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Supabase Sync] Error inserting into ${table}:`, err.message);
    return null;
  }
}

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
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Supabase Sync] Error updating ${table}:`, err.message);
    return null;
  }
}

export async function deleteRow(table, matchField, matchVal) {
  try {
    const url = `${getApiUrl()}/${table}?${matchField}=eq.${encodeURIComponent(matchVal)}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return true;
  } catch (err) {
    console.warn(`[Supabase Sync] Error deleting from ${table}:`, err.message);
    return false;
  }
}
