import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><div className="footer-brand">Plant Shop</div><p>Một góc xanh được chăm chút cho ngôi nhà và nhịp sống của bạn.</p></div>
        <div><span className="footer-label">Khám phá</span><Link href="/cua-hang">Cửa hàng</Link><Link href="/dich-vu">Dịch vụ</Link></div>
        <div><span className="footer-label">Ghé thăm</span><p>24 Nguyễn Thị Minh Khai<br />Quận 1, TP. Hồ Chí Minh</p></div>
        <div><span className="footer-label">Kết nối</span><p>Thứ 2 - Chủ nhật<br />08:00 - 20:00</p></div>
      </div>
      <div className="container footer-bottom">© 2026 Plant Shop <span>Chăm cây. Chăm nhà. Chăm mình.</span></div>
    </footer>
  );
}
