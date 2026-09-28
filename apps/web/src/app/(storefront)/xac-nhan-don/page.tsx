import Link from 'next/link';

export default function OrderConfirmationPage() { return <section className="confirmation-page container"><div className="confirmation-mark">✦</div><span className="eyebrow">Cảm ơn bạn đã tin chọn</span><h1>Đơn hàng đã<br /><em>được tiếp nhận.</em></h1><p>Plant Shop sẽ liên hệ để xác nhận thông tin giao hàng và thời gian phù hợp nhất với bạn.</p><div className="confirmation-actions"><Link className="button button-primary" href="/cua-hang">Tiếp tục khám phá</Link><Link className="section-link" href="/">Về trang chủ</Link></div></section>; }
