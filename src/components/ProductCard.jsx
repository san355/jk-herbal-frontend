import { useState } from 'react';
import { formatINR } from '../api';

// Shows the Figma product photo from /public/images. Falls back to a botanical placeholder if the file is missing.
export function ProductImage({ src, name }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="img-placeholder">{name?.charAt(0) || '🌿'}</div>;
  return <img src={src} alt={name} onError={() => setFailed(true)} />;
}

export default function ProductCard({ product, onAdd, adding }) {
  return (
    <article className="product-card">
      <div className="product-img">
        <img src={product.image} alt={product.name} />
      </div>
      <span className="eyebrow">{product.category}</span>
      <h3>{product.name}</h3>
      <p className="muted small">
        {product.count > 1 ? `Pack of ${product.count}` : 'Single unit'} · {product.stock > 0 ? 'In Stock' : 'Out of stock'}
      </p>
      <div className="product-foot">
        <strong>{formatINR(product.price)}</strong>
        <button className="btn-primary small" disabled={product.stock < 1 || adding} onClick={() => onAdd(product)}>
          {adding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
