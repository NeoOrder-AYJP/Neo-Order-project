// Cliente de API REST para integração com o Backend Supabase / Data Service

import { CONFIG } from './config.js';

export class ApiService {
  static getHeaders(extraHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      'apikey': CONFIG.API_KEY,
      'Authorization': `Bearer ${CONFIG.API_KEY}`,
      ...extraHeaders
    };
  }

  static async fetchTable(endpoint, options = {}) {
    try {
      const url = `${CONFIG.API_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: this.getHeaders(options.headers),
        ...options
      });
      if (!response.ok) {
        throw new Error(`Erro na requisição da API: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Operação com API remota não concluída ou em fallback local:', error.message);
      return null;
    }
  }

  static async syncData(table, data) {
    return await this.fetchTable(table, {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(data)
    });
  }
}
