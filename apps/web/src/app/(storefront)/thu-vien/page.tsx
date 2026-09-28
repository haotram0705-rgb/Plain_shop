 'use client';

import Link from 'next/link';
import { useState } from 'react';

const libraryGroups = [
  { title: 'Góc bàn làm việc', text: 'Cây nhỏ, ánh sáng vừa đủ và những thói quen dễ duy trì.', image: '/assets/images/cat-desk.jpg', tone: 'info-card-green' },
  { title: 'Phòng khách có nhịp thở', text: 'Phối tán lá, chiều cao và chất liệu chậu để tạo điểm nhìn.', image: '/assets/images/cat-indoor.jpg', tone: 'info-card-terra' },
  { title: 'Chăm cây theo mùa', text: 'Nhận biết nhu cầu nước, sáng và dinh dưỡng qua từng mùa.', image: '/assets/images/cat-succulents.jpg', tone: 'info-card-olive' },
];

const careVideos = [
  { title: 'Quy trình đóng hàng', text: 'Cách cố định chậu, bảo vệ tán lá và kiểm tra hộp trước khi rời vườn.', image: '/assets/images/cat-pots.jpg' },
  { title: 'Quy trình giao hàng', text: 'Theo dõi hành trình từ shop đến cửa nhà với cách vận chuyển phù hợp.', image: '/assets/images/cat-outdoor.jpg' },
  { title: 'Quy trình nhận hàng', text: 'Kiểm tra hộp, chậu và tán cây ngay khi nhận để bảo vệ quyền lợi đơn hàng.', image: '/assets/images/cat-services.jpg' },
  { title: 'Trồng hoa vào chậu', text: 'Các bước xử lý rễ, đất, thoát nước và đặt cây sau khi thay chậu.', image: '/assets/images/cat-succulents.jpg' },
];

const companyMedia = [
  { title: 'Bài hát Plant Shop', text: 'Những ca khúc được sáng tác và hát bởi những người yêu cây, yêu không gian sống.', image: '/assets/images/cat-desk.jpg', href: 'https://www.youtube.com', external: true },
  { title: 'Video karaoke', text: 'Cùng hát lại những giai điệu xanh trong các buổi gặp gỡ và hoạt động nội bộ.', image: '/assets/images/cat-services.jpg', href: 'https://www.youtube.com', external: true },
  { title: 'Câu chuyện đội ngũ', text: 'Những con người, dự án và hoạt động cộng đồng tạo nên hệ sinh thái Plant Shop.', image: '/assets/images/cat-outdoor.jpg', href: '/doi-tac', external: false },
];
const libraryTabs = ['Tất cả nội dung', 'Đọc & học', 'Dự án & truyền thông', 'Cộng đồng'];
const libraryCounts: Record<string, number> = { 'Tất cả nội dung': libraryGroups.length + careVideos.length + companyMedia.length, 'Đọc & học': libraryGroups.length + careVideos.length, 'Dự án & truyền thông': companyMedia.length, 'Cộng đồng': 1 };

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState(libraryTabs[0]);
  const [search, setSearch] = useState('');
  const showAll = activeTab === libraryTabs[0];
  const searchTerm = search.trim().toLowerCase();
  const visibleGroups = libraryGroups.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(searchTerm));
  const visibleVideos = careVideos.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(searchTerm));
  const visibleMedia = companyMedia.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(searchTerm));
  return (
    <main className="story-landing-page container">
      <nav className="page-breadcrumb" aria-label="Breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><strong>Thư viện & câu chuyện</strong></nav>
      <section className="story-landing-hero">
        <div>
          <span className="eyebrow">Thư viện xanh</span>
          <h1>Cảm hứng cho<br /><em>từng góc nhà.</em></h1>
          <p>Những hình ảnh, ý tưởng phối cây và cách chăm sóc để bạn bắt đầu thật nhẹ nhàng.</p>
          <div className="story-landing-actions">
            <Link className="button button-primary" href="/bai-viet">Xem bài viết</Link>
            <Link className="text-link" href="/cua-hang">Tìm cây phù hợp <span>→</span></Link>
          </div>
        </div>
        <div className="story-landing-image" style={{ backgroundImage: `url('/assets/images/cat-indoor.jpg')` }} />
      </section>

      <div className="library-directory">
      <aside className="mega-sidebar library-sidebar"><span className="filter-label">Thư viện</span><strong>Chọn nhóm nội dung</strong>{libraryTabs.map((tab) => <button className={activeTab === tab ? 'active' : ''} type="button" key={tab} onClick={() => setActiveTab(tab)}><span>{tab} · {libraryCounts[tab]}</span><b>›</b></button>)}<small>Chọn một nhóm để xem nội dung tương ứng.</small></aside>
      <div className="library-results">
      <label className="library-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm bài viết, video, dự án..." /></label>
      {(showAll || activeTab === 'Đọc & học') && <section className="story-landing-grid">
        {visibleGroups.map((item) => (
          <article className={`story-card ${item.tone}`} key={item.title}>
            <div className="story-card-image" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="story-card-content">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>}
      {(showAll || activeTab === 'Đọc & học') && <section className="ecosystem-links"><div><span className="eyebrow">Liên kết hệ sinh thái cây</span><h2>Tìm đúng cây cho đúng hành trình.</h2><p>Các nhóm cây được liên kết theo nhu cầu sử dụng, vật tư và không gian để bạn đi từ cảm hứng đến lựa chọn dễ dàng hơn.</p></div><div className="ecosystem-link-grid"><Link href="/cay-canh">Cây xanh nền tảng →</Link><Link href="/cay-canh">Cây cho văn phòng →</Link><Link href="/cay-canh">Cây mix không gian →</Link><Link href="/chau-vat-tu">Đất, phân & vật tư →</Link><Link href="/dich-vu#thiet-ke-canh-quan">Cây cho cảnh quan →</Link><Link href="/hoa-qua-tang">Cây & hoa quà tặng →</Link></div></section>}
      {(showAll || activeTab === 'Đọc & học') && <section className="care-video-section"><div className="section-heading"><div><span className="eyebrow">Video hướng dẫn</span><h2>Từ vườn đến tay bạn.</h2></div><span className="care-video-note">Bấm xem để hiểu quy trình</span></div><div className="care-video-grid">{visibleVideos.map((video) => <article className="care-video-card" key={video.title} style={{ backgroundImage: `linear-gradient(180deg, rgba(18,55,39,.04), rgba(18,55,39,.82)), url(${video.image})` }}><span className="care-play">▶</span><div><h3>{video.title}</h3><p>{video.text}</p></div></article>)}</div></section>}
      {(showAll || activeTab === 'Dự án & truyền thông') && <section className="delivery-policy"><div><span className="eyebrow">Đóng gói & nhận hàng</span><h2>Kiểm tra kỹ khi nhận.<br /><em>Shop bảo vệ cây cùng bạn.</em></h2></div><div><p><strong>Size hộp hoàn chỉnh:</strong> hộp được chọn theo chiều cao cây, đường kính chậu và khoảng đệm bảo vệ tán lá.</p><p><strong>Nếu cây hư hỏng do lỗi nhà vườn đóng hàng:</strong> Plant Shop sẽ đền cây mới theo chính sách. Quý khách vui lòng quay video mở hộp, kiểm tra cây ngay khi nhận và báo cho công ty sớm để được hỗ trợ nhanh nhất.</p><Link className="button button-primary" href="/lien-he">Báo vấn đề đơn hàng →</Link></div></section>}
      {(showAll || activeTab === 'Dự án & truyền thông' || activeTab === 'Cộng đồng') && <section className="company-media" id="truyen-thong"><div className="company-media-heading"><span className="eyebrow">Truyền thông công ty</span><h2>Một Plant Shop<br /><em>nhiều cách được kể.</em></h2><p>Âm nhạc, video karaoke, hoạt động đội ngũ và những câu chuyện phía sau mỗi mảng xanh.</p></div><div className="company-media-grid">{visibleMedia.map((item) => <article key={item.title}><div className="company-media-art" style={{ backgroundImage: `linear-gradient(135deg, rgba(18,55,39,.12), rgba(18,55,39,.75)), url(${item.image})` }}><span>{item.title === 'Video karaoke' ? '▶' : item.title === 'Bài hát Plant Shop' ? '♫' : '01'}</span></div><h3>{item.title}</h3><p>{item.text}</p>{item.external ? <a href={item.href} target="_blank" rel="noreferrer">Mở nội dung →</a> : <Link href={item.href}>Xem hoạt động →</Link>}</article>)}</div></section>}
      </div></div>
    </main>
  );
}
