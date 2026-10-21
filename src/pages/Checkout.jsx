import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, formatINR } from '../api';
import { useAuth } from '../context/AuthContext';

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || 'https://payments.cashfree.com/forms/getaudit';
const PAYMENT_METHODS = [
  { id: 'Instant UPI / Cards', label: 'Instant UPI', sub: 'GPay, PhonePe, Paytm & QR', online: true },
  { id: 'Cash on Delivery', label: 'Cash on Delivery', sub: 'Pay at doorstep upon arrival', online: false },
];

export default function Checkout() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    state: user?.state || '',
  });
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api('/cart').then(setItems).catch((e) => setError(e.message)); }, []);

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // 1. Save delivery details to the user profile
      const profile = await api('/auth/profile', {
        method: 'PUT',
        body: { name: form.name, phone: form.phone, address: form.address, state: form.state },
      });
      updateUser(profile.user);

      // 2. Create the order from the cart (stock is checked and reduced on the server)
      const { order, paymentUrl } = await api('/orders', { method: 'POST', body: { paymentMethod: method } });

      // 3. Open the Cashfree hosted payment form for online payments
      const selected = PAYMENT_METHODS.find((m) => m.id === method);
      if (selected.online) window.open(paymentUrl || PAYMENT_URL, '_blank', 'noopener');

      navigate('/orders', { state: { placed: order.orderId } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <span className="eyebrow">APOTHECARY CHECKOUT</span>
      <h2>Harmonious Order Finalization</h2>
      {error && <p className="notice error">{error}</p>}

      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-main">
          <div className="card">
            <h3>Delivery Information</h3>
            <div className="form-grid">
              <label>Full Name *<input name="name" required value={form.name} onChange={onChange} /></label>
              <label>Mobile Number *<input name="phone" required value={form.phone} onChange={onChange} /></label>
              <label className="span-2">Email Address *<input name="email" type="email" value={form.email} disabled /></label>
              <label className="span-2">House Number, Building &amp; Street *<input name="address" required value={form.address} onChange={onChange} /></label>
              <label>State *<input name="state" required value={form.state} onChange={onChange} /></label>
            </div>
          </div>

          <div className="card">
            <h3>Payment Method</h3>
            <div className="pay-options">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`pay-option ${method === m.id ? 'selected' : ''}`}>
                  <input type="radio" name="payment" checked={method === m.id} onChange={() => setMethod(m.id)} />
                  <strong>{m.label}</strong>
                  <span className="muted small">{m.sub}</span>
                </label>
              ))}
            </div>
            <p className="muted small">Online payments are completed on the secure Cashfree payment page.</p>
          </div>
        </div>

        <aside className="summary card">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div className="row" key={i._id}>
              <span>{i.product?.name} × {i.quantity}</span>
              <strong>{formatINR((i.product?.price || 0) * i.quantity)}</strong>
            </div>
          ))}
          <div className="row"><span>Shipping</span><strong className="green">FREE</strong></div>
          <div className="total"><span>Total Payable</span><strong>{formatINR(subtotal)}</strong></div>
          <button className="btn-primary full" type="submit" disabled={submitting || items.length === 0}>
            {submitting ? 'Placing order…' : `Place Order • ${formatINR(subtotal)}`}
          </button>
        </aside>
      </form>
    </section>
  );
}
