import Link from 'next/link';
import { catalogProducts, formatProductPrice, productSlug } from '@/features/products/catalog';

const featureGroups = [
  { title: 'Cây nội thất', text: 'Tạo điểm nhấn xanh cho phòng khách, văn phòng và góc nghỉ.', image: '/assets/images/cat-indoor.jpg', tone: 'tone-green' },
  { title: 'Cây văn phòng', text: 'Những mảng xanh bền dáng cho bàn làm việc và không gian chung.', image: '/assets/images/cat-desk.jpg', tone: 'tone-olive' },
  { title: 'Cây bụi nhỏ trang trí', text: 'Nhỏ gọn, dễ chăm và phù hợp cho kệ, bàn và góc hẹp.', image: '/assets/images/cat-succulents.jpg', tone: 'tone-sand' },
  { title: 'Cây mix văn phòng', text: 'Phối nhiều tầng lá để không gian làm việc có thêm nhịp thở.', image: '/assets/images/prod-snake-plant.jpg', tone: 'tone-terra' },
  { title: 'Cây mix quà biếu', text: 'Những phối cây chỉn chu cho sinh nhật, khai trương và lời cảm ơn.', image: '/assets/images/prod-pothos.jpg', tone: 'tone-green' },
  { title: 'Cây Bonsai', text: 'Dáng cây cô đọng, giàu tính thưởng lãm cho góc nhà có cá tính.', image: '/assets/images/cat-outdoor.jpg', tone: 'tone-olive' },
];

const careHighlights = [
  'Ánh sáng phù hợp với từng loại lá',
  'Tưới đúng lịch, tránh úng rễ',
  'Chậu và đất phù hợp với từng cây',
  'Bộ phận hỗ trợ từ Plant Shop',
];

const groupFilters: Record<string, string> = { 'Cây nội thất': 'Phòng khách', 'Cây văn phòng': 'Bàn làm việc', 'Cây bụi nhỏ trang trí': 'Bàn làm việc', 'Cây mix văn phòng': 'Bàn làm việc', 'Cây mix quà biếu': 'Quà tặng', 'Cây Bonsai': 'Phòng khách' };

export default function PlantsPage() {
  return (
    <main className="plants-page container">
      <nav className="page-breadcrumb" aria-label="Breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><strong>Sản phẩm</strong><span>/</span><strong>Cây cảnh</strong></nav>
      <section className="plants-hero">
        <div className="plants-hero-copy">
          <span className="eyebrow">Vườn cây Plant Shop</span>
          <h1>Mỗi góc nhà<br /><em>đều có thể xanh hơn.</em></h1>
          <p>Chúng mình chọn những cây cảnh khỏe, dễ chăm và hợp với không gian sống thực tế của bạn — từ bàn làm việc, phòng khách đến sân vườn và ban công.</p>
          <div className="plants-hero-actions">
            <Link className="button button-primary" href="/cua-hang">Khám phá cây cảnh</Link>
            <Link className="text-link" href="/bai-viet">Xem hướng dẫn chăm cây <span>→</span></Link>
          </div>
        </div>
        <div className="plants-hero-visual" aria-label="Danh mục cây cảnh">
          <div className="plants-glow" />
          <img alt="Cây cảnh trong không gian nhà" src="/assets/images/hero.jpg" />
        </div>
      </section>

      <section className="plants-highlights">
        {careHighlights.map((item, index) => (
          <div key={item} className="plants-highlight-item">
            <span>0{index + 1}</span>
            <p>{item}</p>
          </div>
        ))}
      </section>

      <section className="plants-groups">
        <div className="plants-section-heading">
          <div>
            <span className="eyebrow">Bộ sưu tập</span>
            <h2>Chọn cây theo không gian của bạn.</h2>
          </div>
          <Link className="section-link" href="/cua-hang?category=Cây%20cảnh">Xem tất cả →</Link>
        </div>
        <div className="plants-grid">
          {featureGroups.map((group) => (
            <article className={`plant-group ${group.tone}`} key={group.title}>
              <div className="plant-group-image" style={{ backgroundImage: `url(${group.image})` }} />
              <div className="plant-group-content">
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <Link href={`/cua-hang?usage=${encodeURIComponent(groupFilters[group.title] || 'Phòng khách')}`}>Xem chi tiết →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="plants-featured">
        <div className="plants-section-heading">
          <div>
            <span className="eyebrow">Cây đang có tại vườn</span>
            <h2>Chọn một cây để xem chi tiết.</h2>
          </div>
          <Link className="section-link" href="/cua-hang?category=Cây%20cảnh">Xem cửa hàng →</Link>
        </div>
        <div className="plants-featured-grid">
          {catalogProducts.filter((product) => product.category === 'Cây cảnh').slice(0, 4).map((product) => (
            <Link className="plants-featured-card" href={`/san-pham/${productSlug(product.name)}`} key={product.sku || product.name}>
              <div style={{ backgroundImage: `url(${product.image})` }} />
              <strong>{product.name}</strong>
              <small>{product.tag} · {formatProductPrice(product.price)}</small>
            </Link>
          ))}
        </div>
      </section>
      <section className="garden-library"><div><span className="eyebrow">Album vườn cây</span><h2>Đi qua nơi những mầm xanh bắt đầu.</h2><p>Hình ảnh vườn cây, quy trình chọn cây và những video ngắn từ Plant Shop.</p><Link className="button button-primary" href="/thu-vien">Xem album & video →</Link></div><div className="garden-library-image" style={{ backgroundImage: "linear-gradient(140deg, rgba(18,55,39,.08), rgba(18,55,39,.7)), url('/assets/images/hero.jpg')" }}><span>▶</span><strong>Video vườn cây</strong></div></section>
    </main>
  );
}
