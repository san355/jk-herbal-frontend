import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Herbal Cleansing Shampoo',
    desc: 'Infused with shikakai, amla, and reetha',
    price: 199,
    category: 'Hair Care',
    tag: 'Bestseller',
    rating: 4.8,
    reviews: 312,
    stock: 24,
    image: '/images/shampoo.png'
  },
  {
    id: 'p2',
    name: 'Neem Purifying Herbal Soap',
    desc: 'Cold-pressed pure neem leaf oil for daily clarity',
    price: 99,
    category: 'Herbal Soaps',
    tag: 'Cold Pressed',
    rating: 4.7,
    reviews: 188,
    stock: 3,
    image: '/images/neem-soap.png'
  },
  {
    id: 'p3',
    name: 'Amla & Hibiscus Hair Oil',
    desc: 'Traditional sesame base infused with amla and hibiscus',
    price: 249,
    category: 'Hair Care',
    tag: 'Ayurvedic',
    rating: 4.9,
    reviews: 401,
    stock: 18,
    image: '/images/hair-oil.png'
  },
  {
    id: 'p4',
    name: 'Aloe Vera Soothing Gel',
    desc: '99% pure inner leaf juice for soothing skin',
    price: 179,
    category: 'Skin Care',
    tag: 'Hydrating',
    rating: 4.6,
    reviews: 146,
    stock: 2,
    image: '/images/aloe-gel.png'
  }
];
const categories = [
  { name: 'Hair Care', text: 'Discover shampoos, oils, and other essentials for your regular haircare routine.', image: '/images/category-haircare.png' },
  { name: 'Skin Care', text: 'Explore products designed to fit effortlessly into your daily skincare routine.', image: '/images/category-skincare.png' },
  { name: 'Herbal Soaps', text: 'Make everyday bathing a little more special with our artisanal soap collection.', image: '/images/tulsi-bar.png' },
  { name: 'Special Offers', text: 'Discover current offers and bundled sets on selected products from our collection.', image: '/images/category-offers.png' }
];


const reviews = [
  { name: 'Ananya Sharma', product: 'Herbal Cleansing Shampoo', text: 'Gentle on my scalp, lovely natural scent, and zero artificial stiffness. After two weeks my hair feels naturally soft and cleaner than ever.' },
  { name: 'Kavita Iyer', product: 'Neem Herbal Soap', text: 'Leaves skin refreshed without drying it out in our humid climate. You can genuinely smell real crushed neem leaves.' },
  { name: 'Rohit Verma', product: 'Amla & Hibiscus Hair Oil', text: 'Nourishing and surprisingly non-greasy. Noticeably less breakage and brilliant shine.' },
];

const faqs = [
  ['Are Botanical Apothecary products suitable for sensitive skin?', 'Our formulations use gentle botanicals. If you have a skin condition, patch-test first and consult your doctor.'],
  ['How can I track my order once placed?', 'Open My Orders after logging in to see live batch preparation and dispatch status.'],
  ['What is your return & replacement policy?', 'Contact our concierge within 7 days of delivery for returns or replacements on damaged items.'],
  ['How are the herbal ingredients sourced and extracted?', 'Botanicals are wildcrafted or sustainably harvested and cold-pressed in small batches.'],
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(PRODUCTS);
  }, []);

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
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">SEASONAL HARVEST · Fresh Cold-Pressed Neem &amp; Amla Batch</span>
          <h1>Bring the Goodness of Herbs to Your Daily Routine</h1>
          <p className="lead">
            Discover herbal-inspired shampoos, soaps, hair oils, and skincare essentials made for your everyday
            self-care routine. Cold-infused botanical extracts honoring timeless apothecary rituals.
          </p>
          <div className="hero-cta">
            <Link to="/shop" className="btn-primary">Shop Our Products</Link>
            <Link to="/shop" className="btn-outline">Explore Our Collection</Link>
          </div>
          <div className="hero-badges">
            <span>100% Ayurvedic Formula</span>
            <span>Cruelty-free &amp; paraben free</span>
          </div>
        </div>
        <div className="hero-visual"><div className="img-placeholder big"><img src='/images/hero_.png'></img></div></div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Find Your Everyday Essentials</h2>
          <p className="muted">Explore products for your haircare, skincare, and daily bathing routine crafted with botanical distillations.</p>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.name} to={`/shop?category=${encodeURIComponent(c.name)}`} className="category-card">
              <span className="eyebrow">{c.tag}</span>
              <h3>{c.name}</h3>
              <img src={c.image} alt={c.name} />
              <p className="muted">{c.text}</p>
              <span className="link-text">Shop {c.name} →</span>
            </Link>
          ))}
          <Link to="/shop" className="category-card">
            <span className="eyebrow">CURATED BUNDLES</span>
            <h3>Special Offers</h3>
            <p className="muted">Discover current offers and bundled sets on selected products.</p>
            <span className="link-text">View Offers →</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head row">
          <div>
            <h2>Your Herbal Essentials, All in One Place</h2>
            <p className="muted">Carefully formulated with natural actives, balanced for gentle, reliable results every day.</p>
          </div>
          <Link to="/shop" className="link-text">View complete catalogue →</Link>
        </div>
        {message && <p className="notice">{message}</p>}
        <div className="product-grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addToCart} adding={addingId === p._id} />
          ))}
        </div>
        {products.length === 0 && <p className="muted">Products will appear here once the backend is running and seeded.</p>}
      </section>

      <section className="section tinted">
        <h2>A Little Love from Our Customers</h2>
        <div className="review-grid">
          {reviews.map((r) => (
            <blockquote key={r.name} className="review-card">
              <p>“{r.text}”</p>
              <footer><strong>{r.name}</strong><span className="muted small">Reviewed: {r.product} · Verified</span></footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="faq-wrap">
          <span className="eyebrow">HELP &amp; ADVICE</span>
          <h2>Frequently Asked Questions</h2>
          {faqs.map(([q, a]) => (
            <details key={q} className="faq">
              <summary>{q}</summary>
              <p className="muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="newsletter">
          <span className="eyebrow">APOTHECARY DISPATCH</span>
          <h2>Stay in the Loop</h2>
          <p className="muted">Receive seasonal harvest announcements, herbal self-care rituals, and exclusive introductory offers directly to your inbox.</p>
          {subscribed ? (
            <p className="notice">Thank you for subscribing!</p>
          ) : (
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}>
              <input type="email" required placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn-primary" type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
