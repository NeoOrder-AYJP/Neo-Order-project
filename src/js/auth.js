// Módulo de Autenticação e Gestão de Sessão

import { CONFIG } from './config.js';
import { store } from './store.js';

class AuthManager {
  constructor() {
    this.currentUser = this.getSession();
  }

  getStorageItem(key) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return this._mockStorage ? this._mockStorage[key] : null;
  }

  setStorageItem(key, value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      if (!this._mockStorage) this._mockStorage = {};
      this._mockStorage[key] = value;
    }
  }

  removeStorageItem(key) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      if (this._mockStorage) delete this._mockStorage[key];
    }
  }

  getSession() {
    try {
      const data = this.getStorageItem(CONFIG.STORAGE_KEYS.SESSAO);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setSession(user) {
    this.currentUser = user;
    if (user) {
      this.setStorageItem(CONFIG.STORAGE_KEYS.SESSAO, JSON.stringify(user));
    } else {
      this.removeStorageItem(CONFIG.STORAGE_KEYS.SESSAO);
    }
    store.notify();
  }

  loginMesa(login, senha) {
    const usuarios = store.getUsuarios();
    const user = usuarios.find(u => u.tipo === 'mesa' && u.login.toLowerCase() === login.trim().toLowerCase() && u.ativo);
    if (!user || user.senha !== senha) {
      throw new Error('Identificador da mesa ou senha incorretos.');
    }
    this.setSession(user);
    return user;
  }

  loginFuncionario(login, senha) {
    const usuarios = store.getUsuarios();
    const user = usuarios.find(u => u.tipo === 'funcionario' && u.login.toLowerCase() === login.trim().toLowerCase() && u.ativo);
    if (!user || user.senha !== senha) {
      throw new Error('Usuário ou senha de funcionário incorretos.');
    }
    this.setSession(user);
    return user;
  }

  logout() {
    this.setSession(null);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  isMesa() {
    return this.currentUser && this.currentUser.tipo === 'mesa';
  }

  isFuncionario() {
    return this.currentUser && this.currentUser.tipo === 'funcionario';
  }

  isGerente() {
    return this.currentUser && this.currentUser.tipo === 'funcionario' && this.currentUser.perfil === 'Gerente';
  }

  isAtendente() {
    return this.currentUser && this.currentUser.tipo === 'funcionario' && (this.currentUser.perfil === 'Atendente' || this.currentUser.perfil === 'Gerente');
  }
}

export const authManager = new AuthManager();
