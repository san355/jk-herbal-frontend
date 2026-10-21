import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, formatINR } from '../api';

const STEPS = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || 'https://payments.cashfree.com/forms/getaudit';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    api('/orders/mine').then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="section">
      <span className="eyebrow">VERIFIED BOTANICAL MEMBER</span>
      <h2>My Orders</h2>
      <p className="muted">Keep track of your purchases and see the latest status of your herbal remedies.</p>
      {location.state?.placed && <p className="notice">Order {location.state.placed} placed successfully.</p>}
      {error && <p className="notice error">{error}</p>}
      {orders.length === 0 && !error && <p className="muted">You have no orders yet.</p>}

      <div className="card-list">
        {orders.map((o) => {
          const step = Math.max(0, STEPS.indexOf(o.status));
          return (
            <article className="card order-card" key={o._id}>
              <div className="order-head">
                <div>
                  <span className="eyebrow">Placed on {new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                  <h3>Order {o.orderId}</h3>
                  <p className="muted small">{o.paymentMethod} · Payment: {o.paymentStatus} · Total: <strong>{formatINR(o.totalAmount)}</strong></p>
                </div>
                <span className={`pill ${o.status === 'Delivered' ? 'ok' : ''}`}>{o.status}</span>
              </div>

              {o.status !== 'Cancelled' && (
                <div className="timeline">
                  {STEPS.map((s, i) => (
                    <div key={s} className={`step ${i <= step ? 'done' : ''}`}>
                      <span className="dot">{i < step ? '✓' : i + 1}</span>
                      <small>{s}</small>
                    </div>
                  ))}
                </div>
              )}

              <ul className="order-items">
                {o.items.map((it, idx) => (
                  <li key={idx}>
                    <span>{it.productName} × {it.quantity}</span>
                    <strong>{formatINR(it.productPrice * it.quantity)}</strong>
                  </li>
                ))}
              </ul>

              {o.paymentStatus === 'Pending' && o.paymentMethod !== 'Cash on Delivery' && (
                <a className="btn-outline small" href={PAYMENT_URL} target="_blank" rel="noreferrer">Complete Payment</a>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
