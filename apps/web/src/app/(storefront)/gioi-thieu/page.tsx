import Link from 'next/link';

const storyPillars = [
  { title: 'Chọn cây có chủ đích', text: 'Mỗi cây được chọn theo ánh sáng, diện tích, thói quen chăm sóc và nhịp sống thật của bạn.', image: '/assets/images/cat-indoor.jpg', tone: 'info-card-green' },
  { title: 'Chăm sóc dài lâu', text: 'Từ lịch tưới, thay chậu đến xử lý lá vàng, chúng mình hướng dẫn để cây khỏe sau ngày nhận hàng.', image: '/assets/images/prod-pothos.jpg', tone: 'info-card-terra' },
  { title: 'Sống xanh vừa đủ', text: 'Không cần một khu vườn lớn. Một góc nhỏ đúng cây, đúng chậu cũng đủ làm dịu một ngày.', image: '/assets/images/cat-desk.jpg', tone: 'info-card-olive' },
];

export default function AboutPage() {
  return (
    <main className="story-landing-page container">
      <section className="story-landing-hero">
        <div>
          <span className="eyebrow">Câu chuyện Plant Shop</span>
          <h1>Một mảng xanh cho<br /><em>một đời sống đẹp.</em></h1>
          <p>Plant Shop bắt đầu từ tình yêu với những góc nhà có cây xanh, và lớn lên bằng sự chăm chút dành cho từng khách hàng.</p>
          <div className="story-landing-actions">
            <Link className="button button-primary" href="/cua-hang">Ghé cửa hàng</Link>
            <Link className="text-link" href="/bai-viet">Xem bài viết <span>→</span></Link>
          </div>
        </div>
        <div className="story-landing-image" style={{ backgroundImage: `url('/assets/images/hero.jpg')` }} />
      </section>

      <section className="story-landing-grid">
        {storyPillars.map((item) => (
          <article className={`story-card ${item.tone}`} key={item.title}>
            <div className="story-card-image" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="story-card-content">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="about-process"><div className="about-process-heading"><span className="eyebrow">Cách Plant Shop đồng hành</span><h2>Một quy trình nhỏ,<br /><em>một trải nghiệm đủ đầy.</em></h2></div><div className="about-process-steps"><article className="process-needs"><strong>01</strong><h3>Nghe nhu cầu</h3><p>Diện tích, ánh sáng, ngân sách và thời gian bạn có thể dành cho cây.</p></article><article className="process-pair"><strong>02</strong><h3>Chọn & phối</h3><p>Đề xuất cây, chậu và cách đặt phù hợp với không gian thật của bạn.</p></article><article className="process-care"><strong>03</strong><h3>Giao & hướng dẫn</h3><p>Đóng gói cẩn thận, hướng dẫn chăm cây và đồng hành sau khi giao.</p></article></div></section>
      <section className="about-standards"><div className="about-standards-heading"><div className="about-standards-image" /><span className="eyebrow">Tiêu chuẩn Plant Shop</span><h2>Không chỉ chọn cây đẹp.<br /><em>Chọn cây sống được.</em></h2><p>Mỗi gợi ý đều bắt đầu từ điều kiện thật của không gian và khả năng chăm sóc của bạn.</p></div><div className="about-standard-list"><article><span>01</span><div><h3>Ánh sáng đúng</h3><p>Phân loại cây theo sáng mạnh, sáng tán xạ và góc ít sáng để cây thích nghi tốt hơn.</p></div></article><article><span>02</span><div><h3>Chậu vừa vặn</h3><p>Ưu tiên thoát nước, kích thước rễ và chất liệu phù hợp thay vì chỉ chọn theo vẻ ngoài.</p></div></article><article><span>03</span><div><h3>Hướng dẫn rõ ràng</h3><p>Từ ngày tưới, vị trí đặt đến dấu hiệu cần thay chậu, mọi thông tin đều dễ thực hiện.</p></div></article></div></section><section className="about-cta"><div><span className="eyebrow">Bắt đầu từ góc nhỏ nhất</span><h2>Bạn đang tìm cây cho<br /><em>một không gian cụ thể?</em></h2></div><Link className="button button-primary" href="/lien-he">Nhận tư vấn riêng →</Link></section>
    </main>
  );
}
