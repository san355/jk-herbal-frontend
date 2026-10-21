import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Hair Care', 'Skin Care', 'Herbal Soaps'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [addingId, setAddingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = new URLSearchParams();
    if (category !== 'All') q.set('category', category);
    if (search) q.set('search', search);
    api(`/products?${q}`, { auth: false }).then(setProducts).catch((e) => setMessage(e.message));
  }, [category, search]);

  const addToCart = async (product) => {
    if (!user) return navigate('/login');
    setAddingId(product._id);
    try {
      await api('/cart', { method: 'POST', body: { productId: product._id, quantity: 1 } });
      setMessage(`${product.name} added to cart`);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="section">
      <div className="section-head">
        <span className="eyebrow">SHOP ALL</span>
        <h2>Your Herbal Essentials, All in One Place</h2>
      </div>

      <div className="toolbar">
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setParams(c === 'All' ? {} : { category: c })}>
              {c}
            </button>
          ))}
        </div>
        <input className="search" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {message && <p className="notice">{message}</p>}
      <p className="muted small">Showing {products.length} products</p>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onAdd={addToCart} adding={addingId === p._id} />
        ))}
      </div>
    </section>
  );
}
