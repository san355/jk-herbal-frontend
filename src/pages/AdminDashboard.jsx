import { useEffect, useState } from 'react';
import { api, formatINR } from '../api';

const ORDER_STATUSES = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const emptyProduct = { name: '', price: '', count: 1, stock: '', category: 'Hair Care', image: '' };

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [error, setError] = useState('');

  const loadAll = () => {
    api('/admin/dashboard').then(setStats).catch((e) => setError(e.message));
    api('/orders').then(setOrders).catch((e) => setError(e.message));
    api('/products', { auth: false }).then(setProducts).catch((e) => setError(e.message));
    api('/admin/customers').then(setCustomers).catch((e) => setError(e.message));
  };
  useEffect(loadAll, []);

  const run = (fn) => async (...args) => {
    try { await fn(...args); loadAll(); }
    catch (e) { setError(e.message); }
  };

  const updateStatus = run((id, status) => api(`/orders/${id}/status`, { method: 'PUT', body: { status } }));
  const updatePayment = run((id, paymentStatus) => api(`/orders/${id}/payment`, { method: 'PUT', body: { paymentStatus } }));
  const updateStock = run((p, stock) => api(`/products/${p._id}`, { method: 'PUT', body: { stock: Number(stock) } }));
  const deleteProduct = run((id) => api(`/products/${id}`, { method: 'DELETE' }));

  const addProduct = async (e) => {
    e.preventDefault();
    await run(() => api('/products', {
      method: 'POST',
      body: { ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock), count: Number(newProduct.count) },
    }))();
    setNewProduct(emptyProduct);
  };

  return (
    <section className="section">
      <span className="eyebrow">ADMIN SUITE · OPERATIONS</span>
      <h2>Executive Dispatch &amp; Inventory</h2>
      {error && <p className="notice error">{error}</p>}

      <div className="chips">
        {['overview', 'orders', 'products', 'customers'].map((t) => (
          <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="stat-grid">
          <div className="card"><span className="eyebrow">Revenue (paid)</span><strong className="big-num">{formatINR(stats.revenue)}</strong></div>
          <div className="card"><span className="eyebrow">Orders</span><strong className="big-num">{stats.orders}</strong></div>
          <div className="card"><span className="eyebrow">Products</span><strong className="big-num">{stats.products}</strong></div>
          <div className="card"><span className="eyebrow">Customers</span><strong className="big-num">{stats.customers}</strong></div>
          <div className="card wide">
            <span className="eyebrow">Low stock alerts (≤ 10 units)</span>
            {stats.lowStock.length === 0 ? <p className="muted">All SKUs above threshold.</p> : (
              <ul>{stats.lowStock.map((p) => <li key={p._id}>{p.name} — {p.stock} left</li>)}</ul>
            )}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderId}<div className="muted small">{new Date(o.createdAt).toLocaleString('en-IN')}</div></td>
                  <td>{o.user?.name}<div className="muted small">{o.user?.phone}</div></td>
                  <td>{o.items.map((i) => `${i.quantity}× ${i.productName}`).join(', ')}</td>
                  <td>{formatINR(o.totalAmount)}</td>
                  <td>
                    <select value={o.paymentStatus} onChange={(e) => updatePayment(o._id, e.target.value)}>
                      <option>Pending</option><option>Paid</option><option>Failed</option>
                    </select>
                  </td>
                  <td>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                      {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <>
          <form className="card add-product" onSubmit={addProduct}>
            <h3>Add New Product</h3>
            <div className="form-grid">
              <label>Name<input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} /></label>
              <label>Price (₹)<input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} /></label>
              <label>Count (units per pack)<input type="number" min="1" value={newProduct.count} onChange={(e) => setNewProduct({ ...newProduct, count: e.target.value })} /></label>
              <label>Stock<input type="number" min="0" required value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} /></label>
              <label>Category<input required value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} /></label>
              <label>Image path<input placeholder="/images/shampoo.png" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} /></label>
            </div>
            <button className="btn-primary">Add Product</button>
          </form>
          <div className="table-wrap card">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Count</th><th>Stock</th><th></th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{formatINR(p.price)}</td>
                    <td>{p.count}</td>
                    <td>
                      <input className="stock-input" type="number" defaultValue={p.stock}
                        onBlur={(e) => e.target.value !== String(p.stock) && updateStock(p, e.target.value)} />
                    </td>
                    <td><button className="link-btn danger" onClick={() => window.confirm('Delete this product?') && deleteProduct(p._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'customers' && (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>State</th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{c.address}</td><td>{c.state}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
