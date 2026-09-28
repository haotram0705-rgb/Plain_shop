'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrderConfirmationPage() {
  const [orderCode, setOrderCode] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setOrderCode(params.get('code') || `PS-${Date.now().toString().slice(-6)}`);
  }, []);

  return (
    <section className="confirmation-page container">
      <div className="confirmation-mark">✓</div>
      <span className="eyebrow">Cảm ơn bạn đã tin chọn Plant Shop</span>
      <h1>
        Đơn hàng đã<br />
        <em>được tiếp nhận.</em>
      </h1>

      {orderCode && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            margin: '18px auto',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '10px 24px',
            boxShadow: '0 4px 14px rgba(51,64,44,0.06)',
          }}
        >
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Mã đơn hàng:</span>
          <strong style={{ color: 'var(--accent)', fontSize: '1.2rem', letterSpacing: '0.04em' }}>
            #{orderCode}
          </strong>
        </div>
      )}

      <p style={{ maxWidth: '520px', margin: '0 auto 28px', lineHeight: '1.7' }}>
        Đội ngũ Plant Shop sẽ sớm liên hệ qua số điện thoại bạn cung cấp để đối chiếu cây thật, xác nhận phí vận chuyển và thời gian giao hàng thuận tiện nhất.
      </p>

      {/* Process Steps */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '750px',
          margin: '0 auto 36px',
          textAlign: 'left',
        }}
      >
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px' }}>
          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
            1. Gọi xác nhận
          </strong>
          <small style={{ color: 'var(--muted)', lineHeight: '1.5', display: 'block' }}>
            Nhân viên kiểm tra tồn kho và gọi xác nhận trong vòng 15 – 30 phút.
          </small>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px' }}>
          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
            2. Đóng gói cẩn thận
          </strong>
          <small style={{ color: 'var(--muted)', lineHeight: '1.5', display: 'block' }}>
            Cố định bầu rễ, che chắn tán lá và tưới đủ ẩm trước khi xuất vườn.
          </small>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px' }}>
          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
            3. Nhận cây & Kiểm tra
          </strong>
          <small style={{ color: 'var(--muted)', lineHeight: '1.5', display: 'block' }}>
            Được kiểm tra cây trực tiếp trước khi thanh toán. Bảo hành 1 đổi 1 trong 7 ngày.
          </small>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link className="button button-primary" href="/tai-khoan">
          Xem đơn hàng trong tài khoản
        </Link>
        <Link className="button button-outline" href="/cua-hang">
          Tiếp tục mua sắm
        </Link>
        <Link className="section-link" href="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
