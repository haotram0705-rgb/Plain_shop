'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { catalogProducts, formatProductPrice, isInStock, productSlug, shopCategories, StoreProduct } from '@/features/products/catalog';

type StoredCartItem = StoreProduct & { quantity: number };

const usageOptions = ['Bàn làm việc', 'Phòng khách', 'Ban công', 'Quà tặng'];
const careOptions = ['Dễ chăm', 'Cần nhiều sáng'];
const tagOptions = ['Dễ chăm', 'Bán chạy', 'Mới về', 'Quà tặng', 'Nhỏ xinh', 'Thủ công', 'Được yêu thích'];

function getUsage(product: StoreProduct) {
  if (product.category === 'Hoa & quà tặng') return 'Quà tặng';
  if (product.type.includes('văn phòng') || product.type.includes('để bàn')) return 'Bàn làm việc';
  if (product.category === 'Chậu & vật tư') return 'Ban công';
  return 'Phòng khách';
}

function getCare(product: StoreProduct) {
  return product.tag === 'Dễ chăm' || product.tag === 'Nhỏ xinh' || product.tag === 'Phổ biến' || product.tag === 'Thiết yếu' ? 'Dễ chăm' : 'Cần nhiều sáng';
}

function readCart(): StoredCartItem[] {
  return JSON.parse(window.localStorage.getItem('plant_shop_cart') || '[]') as StoredCartItem[];
}

export default function ShopPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [notice, setNotice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [selectedUses, setSelectedUses] = useState<string[]>([]);
  const [selectedCare, setSelectedCare] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(900000);
  const [catalog, setCatalog] = useState<StoreProduct[]>(catalogProducts);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    setActiveCategory(params.get('category') ?? 'Tất cả');
    const usage = params.get('usage');
    if (usage) setSelectedUses([usage]);
    setFavorites(JSON.parse(window.localStorage.getItem('plant_shop_favorites') || '[]') as string[]);
    setCompareItems(JSON.parse(window.localStorage.getItem('plant_shop_compare') || '[]') as string[]);
    const items = readCart();
    setCartQuantities(Object.fromEntries(items.map((item) => [item.name.split(' · ')[0], item.quantity])));
    const savedCatalog = window.localStorage.getItem('plant_shop_products');
    if (savedCatalog) setCatalog(JSON.parse(savedCatalog) as StoreProduct[]);
    function refreshCatalog(event: StorageEvent) {
      if (event.key === 'plant_shop_products' && event.newValue) setCatalog(JSON.parse(event.newValue) as StoreProduct[]);
    }
    window.addEventListener('storage', refreshCatalog);
    return () => window.removeEventListener('storage', refreshCatalog);
  }, []);

  const filteredProducts = useMemo(() => catalog
    .filter((product) => (activeCategory === 'Tất cả' || product.category === activeCategory)
      && `${product.name} ${product.type} ${product.tag}`.toLowerCase().includes(query.toLowerCase())
      && product.price >= priceMin
      && product.price <= priceMax
      && (!selectedUses.length || selectedUses.includes(getUsage(product)))
      && (!selectedCare.length || selectedCare.includes(getCare(product)))
      && (!selectedTags.length || selectedTags.includes(product.tag)))
    .sort((first, second) => {
      if (sort === 'low') return first.price - second.price;
      if (sort === 'high') return second.price - first.price;
      if (sort === 'sold') return (second.sold ?? 0) - (first.sold ?? 0);
      return 0;
    }), [catalog, activeCategory, query, sort, priceMin, priceMax, selectedUses, selectedCare, selectedTags]);

  const comparedProducts = catalog.filter((product) => compareItems.includes(product.name)).slice(0, 3);

  function toggleFilter(value: string, values: string[], setValues: (next: string[]) => void) {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  function clearFilters() {
    setSelectedUses([]);
    setSelectedCare([]);
    setSelectedTags([]);
    setPriceMin(0);
    setPriceMax(900000);
    setActiveCategory('Tất cả');
    setQuery('');
    setVisibleCount(9);
  }

  function persistCart(next: StoredCartItem[]) {
    window.localStorage.setItem('plant_shop_cart', JSON.stringify(next));
    window.dispatchEvent(new Event('plant-shop-cart-updated'));
    setCartQuantities(Object.fromEntries(next.map((item) => [item.name.split(' · ')[0], item.quantity])));
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  }

  function addToCart(name: string, goToCart = false) {
    const product = catalog.find((item) => item.name === name);
    if (!product) return;
    if (!isInStock(product)) {
      showNotice(`${name} đang hết hàng. Hãy liên hệ để được tư vấn.`);
      return;
    }
    const current = readCart();
    const existing = current.find((item) => item.name === name);
    const next = existing
      ? current.map((item) => item.name === name ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }];
    persistCart(next);
    if (goToCart) router.push('/gio-hang');
    else showNotice(`${name} đã được thêm vào giỏ hàng`);
  }

  function changeCardQuantity(name: string, amount: number) {
    const current = readCart();
    const next = current
      .map((item) => item.name === name ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0);
    persistCart(next);
  }

  function toggleFavorite(name: string) {
    setFavorites((current) => {
      const next = current.includes(name) ? current.filter((item) => item !== name) : [...current, name];
      window.localStorage.setItem('plant_shop_favorites', JSON.stringify(next));
      return next;
    });
  }

  function toggleCompare(name: string) {
    setCompareItems((current) => {
      const next = current.includes(name) ? current.filter((item) => item !== name) : [...current, name].slice(-3);
      window.localStorage.setItem('plant_shop_compare', JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="shop-page">
      <div className="container">
        <div className="shop-hero">
          <div>
            <span className="eyebrow">Plant Shop · Vườn cây tuyển chọn</span>
            <h1>Mang một mảng xanh<br /><em>về nhà.</em></h1>
            <p>Những lựa chọn được chăm chút để ngôi nhà của bạn có thêm nhịp thở.</p>
            <div className="shop-hero-actions"><span>✦ Giao cây tận nơi</span><span>✦ Đổi cây trong 7 ngày</span></div>
          </div>
          <div className="shop-hero-mark">PS<span>EST. 2026</span></div>
        </div>

        <div className="shop-toolbar">
          <div className="shop-tabs">
            {shopCategories.map((category) => (
              <button className={activeCategory === category ? 'active' : ''} type="button" key={category} onClick={() => { setActiveCategory(category); setVisibleCount(9); }}>
                {category}
              </button>
            ))}
          </div>
          <span className="shop-count">{filteredProducts.length} sản phẩm</span>
        </div>

        <div className="shop-content">
          <aside className={`shop-filter${filtersOpen ? ' is-open' : ''}`}>
            <div className="filter-heading"><span className="filter-label">Bộ lọc</span><button type="button" onClick={clearFilters}>Xóa lọc</button></div>
            <strong>Nhu cầu sử dụng</strong>
            {usageOptions.map((usage) => <label key={usage}><input type="checkbox" checked={selectedUses.includes(usage)} onChange={() => toggleFilter(usage, selectedUses, setSelectedUses)} /> {usage}</label>)}
            <strong>Độ chăm sóc</strong>
            {careOptions.map((care) => <label key={care}><input type="checkbox" checked={selectedCare.includes(care)} onChange={() => toggleFilter(care, selectedCare, setSelectedCare)} /> {care}</label>)}
            <strong>Trạng thái</strong>
            {tagOptions.map((tag) => <label key={tag}><input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => toggleFilter(tag, selectedTags, setSelectedTags)} /> {tag}</label>)}
            <div className="price-filter"><strong>Khoảng giá</strong><div className="price-values"><span>{formatProductPrice(priceMin)}</span><span>{formatProductPrice(priceMax)}</span></div><input aria-label="Giá thấp nhất" type="range" min="0" max="900000" step="50000" value={priceMin} onChange={(event) => setPriceMin(Math.min(Number(event.target.value), priceMax - 50000))} /><input aria-label="Giá cao nhất" type="range" min="50000" max="900000" step="50000" value={priceMax} onChange={(event) => setPriceMax(Math.max(Number(event.target.value), priceMin + 50000))} /></div>
            <Link href="/lien-he">Cần tư vấn chọn cây?</Link>
          </aside>

          <div className="shop-products">
            <div className="shop-sort">
              <label className="shop-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm cây, chậu, phụ kiện..." /></label>
              <button className="shop-filter-toggle" type="button" onClick={() => setFiltersOpen((open) => !open)}>{filtersOpen ? 'Ẩn bộ lọc' : 'Bộ lọc'}</button>
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sắp xếp sản phẩm">
                <option value="featured">Được yêu thích</option>
                <option value="sold">Bán chạy</option>
                <option value="low">Giá thấp đến cao</option>
                <option value="high">Giá cao đến thấp</option>
              </select>
            </div>

            {query && <div className="shop-query">Đang tìm: <strong>“{query}”</strong><button type="button" onClick={() => setQuery('')}>Xóa tìm kiếm</button></div>}

            {filteredProducts.length ? (
              <>
                <div className="shop-product-grid">
                  {filteredProducts.slice(0, visibleCount).map((product, index) => (
                    <article className="shop-product-card" style={{ animationDelay: `${index * 70}ms` }} key={product.sku || product.name}>
                      <Link className="shop-product-art" href={`/san-pham/${productSlug(product.name)}`} style={{ backgroundImage: `url(${product.image})` }}>
                        <button className={`shop-favorite${favorites.includes(product.name) ? ' active' : ''}`} type="button" aria-label="Lưu sản phẩm" onClick={(event) => { event.preventDefault(); toggleFavorite(product.name); }}>♡</button>
                        {!isInStock(product) && <span className="shop-stock-badge">Hết hàng</span>}
                        <div className="shop-image-shade" />
                      </Link>
                      <div className="shop-product-info">
                        <div>
                          <h2><Link href={`/san-pham/${productSlug(product.name)}`}>{product.name}</Link></h2>
                          <small>{product.type}</small>
                          <small>{product.sold ?? 0} đã bán · {isInStock(product) ? `Còn ${product.stock ?? 'nhiều'} sản phẩm` : 'Hết hàng'}</small>
                        </div>
                        <strong>{formatProductPrice(product.price)}</strong>
                      </div>
                      <div className="shop-actions">
                        {cartQuantities[product.name] ? (
                          <div className="card-quantity">
                            <button type="button" aria-label="Giảm số lượng" onClick={() => changeCardQuantity(product.name, -1)}>−</button>
                            <strong>{cartQuantities[product.name]}</strong>
                            <button type="button" aria-label="Tăng số lượng" onClick={() => addToCart(product.name)}>+</button>
                          </div>
                        ) : (
                          <>
                            <button className="shop-add" type="button" disabled={!isInStock(product)} onClick={() => addToCart(product.name)}>Thêm vào giỏ <span>+</span></button>
                            <button className="shop-buy" type="button" disabled={!isInStock(product)} onClick={() => addToCart(product.name, true)}>{isInStock(product) ? 'Mua ngay' : 'Hết hàng'} <span>↗</span></button>
                          </>
                        )}
                        <button className={`shop-compare${compareItems.includes(product.name) ? ' active' : ''}`} type="button" onClick={() => toggleCompare(product.name)}>{compareItems.includes(product.name) ? 'Đã so sánh' : 'So sánh'}</button>
                      </div>
                    </article>
                  ))}
                </div>
                {filteredProducts.length > visibleCount && <button className="shop-load-more button button-outline" type="button" onClick={() => setVisibleCount((count) => count + 9)}>Xem thêm sản phẩm</button>}
              </>
            ) : (
              <div className="shop-empty"><span>⌕</span><h2>Chưa tìm thấy góc xanh này.</h2><p>Thử một từ khóa khác hoặc quay lại xem tất cả sản phẩm.</p><button type="button" onClick={clearFilters}>Xem tất cả</button></div>
            )}
          </div>
        </div>

        {comparedProducts.length > 0 && (
          <aside className="compare-tray" aria-label="So sánh sản phẩm">
            <div className="compare-tray-heading">
              <div>
                <span className="filter-label">So sánh tối đa 3 sản phẩm</span>
                <h2>Nhìn nhanh để chọn cây vừa ý.</h2>
              </div>
              <button type="button" onClick={() => { setCompareItems([]); window.localStorage.setItem('plant_shop_compare', '[]'); }}>Xóa tất cả</button>
            </div>
            <div className="compare-grid">
              {comparedProducts.map((product) => (
                <article key={product.name}>
                  <div style={{ backgroundImage: `url(${product.image})` }} />
                  <strong>{product.name}</strong>
                  <small>{product.type} · {getCare(product)}</small>
                  <b>{formatProductPrice(product.price)}</b>
                  <span>{isInStock(product) ? `Còn ${product.stock ?? 'nhiều'}` : 'Hết hàng'}</span>
                  <Link href={`/san-pham/${productSlug(product.name)}`}>Xem chi tiết →</Link>
                </article>
              ))}
            </div>
          </aside>
        )}
      </div>
      {notice && <div className="shop-toast" role="status">✦ {notice}</div>}
    </section>
  );
}
