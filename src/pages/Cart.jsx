import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatINR } from '../api';
import { ProductImage } from '../components/ProductCard';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { api('/cart').then(setItems).catch((e) => setError(e.message)); }, []);

  const changeQty = async (item, quantity) => {
    if (quantity < 1) return remove(item);
    try { setItems(await api(`/cart/${item._id}`, { method: 'PUT', body: { quantity } })); }
    catch (e) { setError(e.message); }
  };

  const remove = async (item) => {
    try { setItems(await api(`/cart/${item._id}`, { method: 'DELETE' })); }
    catch (e) { setError(e.message); }
  };

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);

  return (
    <section className="section">
      <span className="eyebrow">APOTHECARY CHECKOUT</span>
      <h2>Your Shopping Cart</h2>
      {error && <p className="notice error">{error}</p>}

      {items.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Shop Our Products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="card-list">
            {items.map((item) => (
              <div className="cart-item card" key={item._id}>
                <div className="cart-thumb"><ProductImage src={item.product?.image} name={item.product?.name} /></div>
                <div className="grow">
                  <span className="eyebrow">{item.product?.category}</span>
                  <h3>{item.product?.name}</h3>
                  <strong>{formatINR(item.product?.price)}</strong>
                </div>
                <div className="qty">
                  <button onClick={() => changeQty(item, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQty(item, item.quantity + 1)} disabled={item.quantity >= (item.product?.stock || 0)}>+</button>
                </div>
                <button className="link-btn danger" onClick={() => remove(item)}>Remove</button>
              </div>
            ))}
          </div>

          <aside className="summary card">
            <h3>Order Summary</h3>
            <div className="row"><span>Subtotal</span><strong>{formatINR(subtotal)}</strong></div>
            <div className="row"><span>Standard Botanical Dispatch</span><strong className="green">FREE</strong></div>
            <div className="total"><span>Total Payable</span><strong>{formatINR(subtotal)}</strong></div>
            <p className="muted small">Inclusive of all applicable GST &amp; eco-duties</p>
            <Link to="/checkout" className="btn-primary full">Proceed to Checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
