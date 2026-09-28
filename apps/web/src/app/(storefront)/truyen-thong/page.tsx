import Link from 'next/link';

const mediaGroups = [
  { title: 'Dự án nổi bật', text: 'Những không gian đã được thay đổi bằng một mảng xanh vừa đủ.', image: '/assets/images/hero.jpg', tone: 'info-card-green' },
  { title: 'Tin tức Plant Shop', text: 'Cập nhật bộ sưu tập, sự kiện và các hoạt động mới nhất.', image: '/assets/images/cat-services.jpg', tone: 'info-card-terra' },
  { title: 'Cùng lan tỏa', text: 'Một góc xanh nhỏ cũng có thể tạo ra thay đổi lớn.', image: '/assets/images/cat-outdoor.jpg', tone: 'info-card-olive' },
];

export default function MediaPage() {
  return (
    <main className="story-landing-page container">
      <section className="story-landing-hero">
        <div>
          <span className="eyebrow">Plant Shop trên truyền thông</span>
          <h1>Những câu chuyện<br /><em>xanh được kể lại.</em></h1>
          <p>Theo dõi các dự án, hoạt động cộng đồng và những khoảnh khắc Plant Shop đồng hành cùng khách hàng.</p>
          <div className="story-landing-actions">
            <Link className="button button-primary" href="/bai-viet">Đọc bài viết</Link>
            <Link className="text-link" href="/du-an">Xem dự án <span>→</span></Link>
          </div>
        </div>
        <div className="story-landing-image" style={{ backgroundImage: `url('/assets/images/cat-outdoor.jpg')` }} />
      </section>

      <section className="story-landing-grid">
        {mediaGroups.map((item) => (
          <article className={`story-card ${item.tone}`} key={item.title}>
            <div className="story-card-image" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="story-card-content">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="company-media"><div className="company-media-heading"><span className="eyebrow">06 · Truyền thông công ty</span><h2>Một Plant Shop<br /><em>nhiều cách được kể.</em></h2><p>Truyền thông là nơi Plant Shop chia sẻ dự án, văn hóa đội ngũ, cảm hứng sống xanh và những câu chuyện phía sau mỗi mảng cây.</p></div><div className="company-media-grid"><article><div className="company-media-art company-media-song"><span>♫</span></div><h3>Bài hát Plant Shop</h3><p>Những ca khúc được sáng tác và hát bởi những người yêu cây, yêu không gian sống.</p><a href="https://www.youtube.com" target="_blank" rel="noreferrer">Nghe trên YouTube →</a></article><article><div className="company-media-art company-media-karaoke"><span>▶</span></div><h3>Video karaoke</h3><p>Cùng hát lại những giai điệu xanh trong các buổi gặp gỡ và hoạt động nội bộ.</p><a href="https://www.youtube.com" target="_blank" rel="noreferrer">Xem video karaoke →</a></article><article><div className="company-media-art company-media-story"><span>01</span></div><h3>Câu chuyện đội ngũ</h3><p>Những con người, dự án và hoạt động cộng đồng tạo nên hệ sinh thái Plant Shop.</p><Link href="/doi-tac">Xem hoạt động →</Link></article></div></section>
    </main>
  );
}
