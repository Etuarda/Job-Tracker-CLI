export function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.hash = '#/login';
    throw new Error('Not authenticated');
  }
}
