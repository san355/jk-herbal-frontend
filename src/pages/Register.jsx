import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', phone: '', email: '', password: '', address: '', state: '', setupKey: '' };

export default function Register() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const path = role === 'admin' ? '/auth/admin/register' : '/auth/register';
      const { setupKey, ...rest } = form;
      const data = await api(path, {
        method: 'POST',
        body: role === 'admin' ? { ...rest, setupKey } : rest,
        auth: false,
      });
      saveSession(data);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="section auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <span className="eyebrow">JOIN THE APOTHECARY</span>
        <h2>Create Account</h2>
        <div className="role-toggle">
          <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>Customer</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
        </div>
        {error && <p className="notice error">{error}</p>}
        <label>Full Name *<input required value={form.name} onChange={set('name')} /></label>
        <label>Mobile Number *<input required value={form.phone} onChange={set('phone')} /></label>
        <label>Email *<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Password * (min 6 characters)<input type="password" minLength={6} required value={form.password} onChange={set('password')} /></label>
        <label>Address<input value={form.address} onChange={set('address')} /></label>
        <label>State<input value={form.state} onChange={set('state')} /></label>
        {role === 'admin' && (
          <label>Admin Setup Key *<input type="password" required value={form.setupKey} onChange={set('setupKey')} /></label>
        )}
        <button className="btn-primary full" disabled={loading}>{loading ? 'Creating…' : `Register as ${role}`}</button>
        <p className="muted small">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}
