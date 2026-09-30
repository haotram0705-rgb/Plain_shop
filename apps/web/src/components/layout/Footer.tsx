import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">Plant Shop</div>
          <p>Một góc xanh được chăm chút cho ngôi nhà và nhịp sống của bạn.</p>
        </div>
        <div>
          <span className="footer-label">Khám phá</span>
          <Link href="/cua-hang">Cửa hàng</Link>
          <Link href="/dich-vu">Dịch vụ</Link>
          <Link href="/lien-he">Liên hệ & Tư vấn</Link>
        </div>
        <div>
          <span className="footer-label">Ghé thăm</span>
          <p>24 Nguyễn Thị Minh Khai<br />Quận 1, TP. Hồ Chí Minh</p>
          <a
            className="footer-map-link"
            href="https://www.google.com/maps/search/?api=1&query=24+Nguyen+Thi+Minh+Khai+Quan+1+TP+Ho+Chi+Minh"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#f5d27b', fontSize: '0.68rem', display: 'inline-block', marginTop: '4px' }}
          >
            Chỉ đường Maps ↗
          </a>
        </div>
        <div>
          <span className="footer-label">Kết nối</span>
          <p>Thứ 2 - Chủ nhật<br />08:00 - 20:00</p>
          <a
            href="tel:0909123456"
            style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.74rem', display: 'inline-block', marginTop: '4px' }}
          >
            Hotline: 0909 123 456
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        © 2026 Plant Shop <span>Chăm cây. Chăm nhà. Chăm mình.</span>
      </div>
    </footer>
  );
}
