import Link from 'next/link';

const partnerGroups = [
  { title: 'Văn phòng & thương hiệu', text: 'Cây xanh, quà tặng và giải pháp chăm sóc định kỳ cho đội ngũ.', image: '/assets/images/cat-indoor.jpg', tone: 'info-card-green' },
  { title: 'Kiến trúc & nội thất', text: 'Phối cây và chậu theo concept, bản vẽ và câu chuyện không gian.', image: '/assets/images/cat-desk.jpg', tone: 'info-card-terra' },
  { title: 'Nhà hàng & cửa hàng', text: 'Tạo điểm chạm xanh để khách nhớ đến thương hiệu lâu hơn.', image: '/assets/images/cat-outdoor.jpg', tone: 'info-card-olive' },
];

export default function PartnersPage() {
  return (
    <main className="story-landing-page container">
      <section className="story-landing-hero">
        <div>
          <span className="eyebrow">Đồng hành cùng Plant Shop</span>
          <h1>Cùng nhau làm<br /><em>thành phố xanh hơn.</em></h1>
          <p>Chúng mình hợp tác với văn phòng, thương hiệu, kiến trúc sư và những người yêu cây để tạo ra không gian đáng sống.</p>
          <div className="story-landing-actions">
            <Link className="button button-primary" href="/lien-he">Trở thành đối tác</Link>
            <Link className="text-link" href="/du-an">Xem dự án <span>→</span></Link>
          </div>
        </div>
        <div className="story-landing-image" style={{ backgroundImage: `url('/assets/images/cat-services.jpg')` }} />
      </section>

      <section className="story-landing-grid">
        {partnerGroups.map((item) => (
          <article className={`story-card ${item.tone}`} key={item.title}>
            <div className="story-card-image" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="story-card-content">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
