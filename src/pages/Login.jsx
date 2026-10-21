import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: { ...form, role }, auth: false });
      saveSession(data);
      navigate(data.user.role === 'admin' ? '/admin' : location.state?.from || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h2>Login</h2>
        <div className="role-toggle">
          <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>Customer</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
        </div>
        {error && <p className="notice error">{error}</p>}
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="btn-primary full" disabled={loading}>{loading ? 'Logging in…' : `Login as ${role}`}</button>
        <p className="muted small">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}
