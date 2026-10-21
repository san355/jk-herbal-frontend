// Small fetch wrapper used by every page. Sends the JWT stored after login.
const BASE = import.meta.env.VITE_API_URL || '/api';

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
