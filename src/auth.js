// Auth module managing session and user permissions
const AUTH_STORAGE_KEY = 'neo_order_auth_session';

export function getSession() {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function setSession(sessionData) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
  window.dispatchEvent(new CustomEvent('auth_change', { detail: sessionData }));
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('auth_change', { detail: null }));
}

export function isManager() {
  const s = getSession();
  return s && s.tipo === 'funcionario' && s.perfil === 'Gerente';
}

export function isAttendant() {
  const s = getSession();
  return s && s.tipo === 'funcionario' && (s.perfil === 'Atendente' || s.perfil === 'Gerente');
}

export function isTableClient() {
  const s = getSession();
  return s && s.tipo === 'mesa';
}
