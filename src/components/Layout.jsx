import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role === 'admin') {
      setCartCount(0);
      return;
    }
    api('/cart')
      .then((items) => setCartCount(items.reduce((s, i) => s + i.quantity, 0)))
      .catch(() => setCartCount(0));
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="topbar">
        <span>Discover your everyday herbal essentials.</span>
        <span className="promo">COMPLIMENTARY ELIXIR ON ₹65+</span>
      </div>

      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <div className="logo">BA</div>
            <div>
              <strong>Botanical Apothecary</strong>
              <small>NATURAL HAIR &amp; SKINCARE</small>
            </div>
          </Link>

          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop">Shop All</NavLink>
            <NavLink to="/shop?category=Hair%20Care">Hair Care</NavLink>
            <NavLink to="/shop?category=Skin%20Care">Skin Care</NavLink>
            <NavLink to="/shop?category=Herbal%20Soaps">Herbal Soaps</NavLink>
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <NavLink to="/admin">Admin</NavLink>
                ) : (
                  <NavLink to="/orders">My Orders</NavLink>
                )}
                <span className="user-chip">{user.name.split(' ')[0]}</span>
                <button className="link-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register" className="btn-small">Register</NavLink>
              </>
            )}
            {user?.role !== 'admin' && (
              <Link to="/cart" className="cart-btn" aria-label="Cart">
                🛒
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h4>Botanical Apothecary</h4>
            <p>
              Elevated botanical formulations honoring herbal tradition with clinical integrity. Cold-pressed roots,
              sustainably harvested botanicals, and zero synthetic fillers.
            </p>
          </div>
          <div>
            <h5>Curated Care</h5>
            <ul>
              <li>Hair Restorative Oils</li>
              <li>Botanical Serums</li>
              <li>Artisanal Soaps</li>
              <li>Seasonal Harvest Sets</li>
            </ul>
          </div>
          <div>
            <h5>Customer Care</h5>
            <ul>
              <li><Link to="/orders">My Orders</Link></li>
              <li>Track Order</li>
              <li>Frequently Asked Questions</li>
              <li>Shipping &amp; Return Policy</li>
            </ul>
          </div>
          <div>
            <h5>Apothecary Concierge</h5>
            <ul>
              <li>+1 (800) 246-HERB</li>
              <li>WhatsApp: +1 (800) 246-4372</li>
              <li>concierge@botanicalapothecary.com</li>
              <li>Mon - Sat: 9am - 7pm EST</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Botanical Apothecary. All rights reserved.</span>
          <span>GMP Certified · Wildcrafted Clean · Cruelty-Free</span>
        </div>
      </footer>

      <a className="chat-fab" href="https://wa.me/18002464372" target="_blank" rel="noreferrer">Chat with Us</a>
    </>
  );
}
