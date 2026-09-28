'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { catalogProducts, findCatalogProduct, formatProductPrice, isInStock, productSlug, StoreProduct } from '@/features/products/catalog';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<StoreProduct | undefined>(() => findCatalogProduct(params.slug));
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [pot, setPot] = useState('Chậu sứ');
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState(false);
  const [compare, setCompare] = useState(false);
  const related = useMemo(() => catalogProducts.filter((item) => item.category === product?.category && item.name !== product?.name).slice(0, 3), [product]);

  useEffect(() => {
    const savedCatalog = window.localStorage.getItem('plant_shop_products');
    const catalog = savedCatalog ? JSON.parse(savedCatalog) as StoreProduct[] : catalogProducts;
    const current = findCatalogProduct(params.slug, catalog);
    setProduct(current);
    if (current?.sizes?.[0]) setSize(current.sizes[0]);
    const favorites = JSON.parse(window.localStorage.getItem('plant_shop_favorites') || '[]') as string[];
    const compareItems = JSON.parse(window.localStorage.getItem('plant_shop_compare') || '[]') as string[];
    setSaved(Boolean(current && favorites.includes(current.name)));
    setCompare(Boolean(current && compareItems.includes(current.name)));
  }, [params.slug]);

  function toggleSaved() {
    if (!product) return;
    const favorites = JSON.parse(window.localStorage.getItem('plant_shop_favorites') || '[]') as string[];
    const next = favorites.includes(product.name) ? favorites.filter((item) => item !== product.name) : [...favorites, product.name];
    window.localStorage.setItem('plant_shop_favorites', JSON.stringify(next));
    setSaved(next.includes(product.name));
  }

  function toggleCompare() {
    if (!product) return;
    const compareItems = JSON.parse(window.localStorage.getItem('plant_shop_compare') || '[]') as string[];
    const next = compareItems.includes(product.name) ? compareItems.filter((item) => item !== product.name) : [...compareItems, product.name].slice(-3);
    window.localStorage.setItem('plant_shop_compare', JSON.stringify(next));
    setCompare(next.includes(product.name));
    setNotice(next.includes(product.name) ? 'Đã thêm vào danh sách so sánh.' : 'Đã bỏ khỏi danh sách so sánh.');
  }

  function addToCart(goToCart = false) {
    if (!product || !isInStock(product)) return;
    const cart = JSON.parse(window.localStorage.getItem('plant_shop_cart') || '[]') as Array<StoreProduct & { quantity: number; name: string }>;
    const name = `${product.name}${size ? ` · ${size}` : ''} · ${pot}`;
    const existing = cart.find((item) => item.name === name);
    const next = existing ? cart.map((item) => item.name === name ? { ...item, quantity: item.quantity + quantity } : item) : [...cart, { ...product, name, quantity }];
    window.localStorage.setItem('plant_shop_cart', JSON.stringify(next));
    window.dispatchEvent(new Event('plant-shop-cart-updated'));
    if (goToCart) {
      window.location.href = '/gio-hang';
      return;
    }
    setNotice('Đã thêm sản phẩm vào giỏ hàng.');
  }

  if (!product) return <section className="product-page container"><div className="product-not-found"><span className="eyebrow">Plant Shop · Sản phẩm</span><h1>Không tìm thấy sản phẩm.</h1><p>Sản phẩm có thể đã được cập nhật hoặc tạm thời không còn hiển thị.</p><Link className="button button-primary" href="/cua-hang">Quay lại cửa hàng</Link></div></section>;

  return <section className="product-page container"><nav className="page-breadcrumb" aria-label="Breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/cay-canh">Sản phẩm</Link><span>/</span><strong>{product.name}</strong></nav><div className="product-detail-layout"><div className="product-detail-visual"><div className="product-detail-large-image" style={{ backgroundImage: `url(${product.image})` }} /><div className="product-detail-badges"><span>{product.tag}</span>{product.discount && <span>Giảm {product.discount}%</span>}</div></div><div className="product-detail-information"><span className="eyebrow">{product.category} · {product.type}</span><h1>{product.name}</h1><div className="product-detail-rating"><span>★★★★★</span><strong>4.9</strong><small>18 đánh giá</small></div><div className="product-detail-price">{formatProductPrice(product.price)}{product.discount && <small>Giá ưu đãi trong tuần</small>}</div><p className="product-detail-description">Một lựa chọn được Plant Shop tuyển chọn để phù hợp với không gian sống thật, dễ chăm và có hướng dẫn rõ ràng.</p><div className="product-facts"><span><small>SKU</small><strong>{product.sku || 'Đang cập nhật'}</strong></span><span><small>Tồn kho</small><strong>{product.stock === 0 ? 'Hết hàng' : `${product.stock ?? 'Còn nhiều'} ${product.unit || 'sản phẩm'}`}</strong></span><span><small>Kích thước</small><strong>{product.height || 'Theo lựa chọn'}</strong></span><span><small>Chậu đi kèm</small><strong>{product.potSize || 'Tùy chọn'}</strong></span></div>{product.sizes && <label className="product-detail-choice">Kích thước<select value={size} onChange={(event) => setSize(event.target.value)}>{product.sizes.map((item) => <option key={item}>{item}</option>)}</select></label>}<label className="product-detail-choice">Chậu đi kèm<select value={pot} onChange={(event) => setPot(event.target.value)}><option>Chậu sứ</option><option>Chậu nhựa</option><option>Chậu mix</option></select></label><div className="product-detail-quantity"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><strong>{quantity}</strong><button type="button" onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}>+</button></div><div className="product-detail-buttons"><button className="button button-primary" type="button" disabled={!product.stock} onClick={() => addToCart()}>{product.stock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}</button><button className={`button button-outline${saved ? ' is-selected' : ''}`} type="button" onClick={toggleSaved}>{saved ? '♥ Đã lưu' : '♡ Lưu sản phẩm'}</button><button className={`button button-outline${compare ? ' is-selected' : ''}`} type="button" onClick={toggleCompare}>{compare ? 'Đã so sánh' : 'So sánh'}</button></div><Link className="product-consult-link" href={`/lien-he?product=${encodeURIComponent(product.name)}&url=${encodeURIComponent(typeof window === 'undefined' ? '' : window.location.href)}`}>Cần tư vấn về sản phẩm này? →</Link></div></div><div className="product-detail-sections"><section><span className="filter-label">Hướng dẫn chăm sóc</span><h2>Để cây khỏe lâu hơn.</h2><p>{product.careGuide || 'Plant Shop sẽ gửi hướng dẫn chăm sóc phù hợp sau khi bạn chọn sản phẩm.'}</p></section><section><span className="filter-label">Đánh giá khách hàng</span><h2>Những người đã chọn cây.</h2><blockquote>“Cây đẹp, giao hàng cẩn thận và hướng dẫn chăm sóc rất dễ hiểu.”</blockquote><small>Nguyễn Minh Anh · Đã mua hàng</small></section></div>{related.length > 0 && <section className="product-related"><div className="section-heading"><div><span className="eyebrow">Có thể bạn sẽ thích</span><h2>Cùng nhóm sản phẩm.</h2></div><Link className="section-link" href="/cua-hang">Xem cửa hàng →</Link></div><div className="product-related-grid">{related.map((item) => <Link className="product-related-card" href={`/san-pham/${productSlug(item.name)}`} key={item.name}><div style={{ backgroundImage: `url(${item.image})` }} /><strong>{item.name}</strong><span>{formatProductPrice(item.price)}</span></Link>)}</div></section>}{notice && <div className="shop-toast" role="status">✦ {notice}</div>}</section>;
}
