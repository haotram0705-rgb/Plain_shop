import Link from 'next/link';
import { PromotionCarousel } from '@/components/layout/PromotionCarousel';
import { catalogProducts, formatProductPrice, productSlug } from '@/features/products/catalog';

const featured = catalogProducts.filter((product) => product.category === 'Cây cảnh').slice(0, 3);

export default function StorefrontHomePage() {
  return (
    <>
      <PromotionCarousel />
      <section className="home-discovery"><div className="container home-discovery-inner"><div className="home-discovery-copy"><span className="eyebrow">Bắt đầu từ nhu cầu của bạn</span><h2>Chọn nhanh một<br /><em>góc xanh phù hợp.</em></h2><Link className="text-link" href="/cua-hang">Xem toàn bộ cửa hàng <span>→</span></Link></div><div className="home-discovery-links"><Link className="discovery-desk" href="/cua-hang?usage=Bàn%20làm%20việc">Bàn làm việc <span>→</span></Link><Link className="discovery-living" href="/cua-hang?usage=Phòng%20khách">Phòng khách <span>→</span></Link><Link className="discovery-gift" href="/cua-hang?usage=Quà%20tặng">Quà tặng xanh <span>→</span></Link></div></div></section>
      <section className="trust-strip"><div className="container trust-grid"><span><b>01</b> Tư vấn tận tâm</span><span><b>02</b> Cây khỏe, rõ nguồn</span><span><b>03</b> Giao hàng cẩn thận</span><span><b>04</b> Đổi cây trong 7 ngày</span></div></section>
      <section className="catalog-section container">
        <div className="section-heading"><div><span className="eyebrow">Chọn theo nhu cầu</span><h2>Một góc xanh cho mỗi câu chuyện.</h2></div><Link className="section-link" href="/cua-hang">Xem tất cả →</Link></div>
        <div className="category-grid"><Link className="category-card category-card-image" href="/cay-canh" style={{ backgroundImage: "linear-gradient(180deg, rgba(16,50,34,.08), rgba(16,50,34,.82)), url('/assets/images/cat-indoor.jpg')" }}><span>Cây cảnh</span><small>Cho nhà thêm sức sống</small><strong>↗</strong></Link><Link className="category-card category-card-image" href="/chau-vat-tu" style={{ backgroundImage: "linear-gradient(180deg, rgba(16,50,34,.08), rgba(16,50,34,.82)), url('/assets/images/cat-pots.jpg')" }}><span>Chậu & vật tư</span><small>Nâng niu từng mầm xanh</small><strong>↗</strong></Link><Link className="category-card category-card-image" href="/hoa-qua-tang" style={{ backgroundImage: "linear-gradient(180deg, rgba(16,50,34,.08), rgba(16,50,34,.82)), url('/assets/images/cat-services.jpg')" }}><span>Hoa & quà tặng</span><small>Gửi một điều thật đẹp</small><strong>↗</strong></Link></div>
      </section>
      <section className="featured-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Được yêu thích tuần này</span><h2>Những lựa chọn xanh.</h2></div><Link className="section-link" href="/cua-hang">Vào cửa hàng →</Link></div><div className="product-grid">{featured.map((product) => <ProductCard key={product.sku || product.name} href={`/san-pham/${productSlug(product.name)}`} image={product.image} name={product.name} price={formatProductPrice(product.price)} tag={product.tag} />)}</div></div></section>
      <section className="story-section container"><div className="story-image" style={{ backgroundImage: "linear-gradient(135deg, rgba(18,55,39,.12), rgba(18,55,39,.6)), url('/assets/images/cat-desk.jpg')" }}><span>GÓC XANH<br /><strong>01</strong></span><i className="story-orbit story-orbit-one" /><i className="story-orbit story-orbit-two" /></div><div className="story-copy"><span className="eyebrow">Về Plant Shop</span><h2>Cây xanh cho<br /><em>đời sống đẹp hơn.</em></h2><p>Chọn cây dễ sống, phối chậu vừa vặn, chăm sóc cùng bạn mỗi ngày.</p><Link className="button button-outline" href="/gioi-thieu">Về chúng mình →</Link></div></section>
    </>
  );
}

function ProductCard({ href, image, name, price, tag }: { href: string; image: string; name: string; price: string; tag: string }) {
  return <Link className="product-card" href={href}><div className="product-visual product-photo" style={{ backgroundImage: `url(${image})` }}><span>{tag}</span></div><div className="product-info"><div><h3>{name}</h3><small>Cây nội thất · Chậu gốm</small></div><strong>{price}</strong><span className="product-card-link">Xem sản phẩm →</span></div></Link>;
}
