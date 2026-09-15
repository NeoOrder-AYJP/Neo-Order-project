import { API_KEY, API_URL } from './config.js';

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      console.warn(`Supabase API request to ${endpoint} failed with status ${res.status}`);
      return null;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : true;
  } catch (err) {
    console.warn(`Supabase network error on ${endpoint}:`, err);
    return null;
  }
}

export const api = {
  get: (table, query = '') => request(`${table}${query ? '?' + query : ''}`),
  post: (table, data) => request(table, { method: 'POST', body: JSON.stringify(data) }),
  patch: (table, query, data) => request(`${table}?${query}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (table, query) => request(`${table}?${query}`, { method: 'DELETE' })
};
