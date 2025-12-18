const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options);
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    const msg = body?.message || `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

export async function apiRegister({ name, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
}

export async function apiLogin({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

export async function apiMe() {
  return request('/auth/me', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function apiListApplications() {
  return request('/applications', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function apiCreateApplication({ titulo, empresa, status }) {
  return request('/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ titulo, empresa, status })
  });
}

export async function apiUpdateStatus(id, status) {
  return request(`/applications/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ status })
  });
}

export async function apiDeleteApplication(id) {
  return request(`/applications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
