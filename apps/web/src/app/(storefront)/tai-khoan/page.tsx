'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Customer = { name: string; email: string; phone: string; address: string; avatar?: string };

type Order = { id: string; date: string; total: number; status: string };

const formatPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)}đ`;

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '', address: '', avatar: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (window.localStorage.getItem('plant_shop_authenticated') !== 'true') {
      router.replace('/dang-nhap?next=/tai-khoan');
      return;
    }
    if (window.localStorage.getItem('plant_shop_role') === 'admin') {
      router.replace('/admin/giao-dien');
      return;
    }
    const savedCustomer = window.localStorage.getItem('plant_shop_customer');
    const savedOrders = window.localStorage.getItem('plant_shop_orders');
    if (savedCustomer) setCustomer({ avatar: '', ...(JSON.parse(savedCustomer) as Customer) });
    if (savedOrders) setOrders(JSON.parse(savedOrders) as Order[]);
  }, [router]);

  function update(field: keyof Customer, value: string) {
    setCustomer((current) => {
      const next = { ...current, [field]: value };
      window.localStorage.setItem('plant_shop_customer', JSON.stringify(next));
      return next;
    });
  }

  function save() {
    window.localStorage.setItem('plant_shop_customer', JSON.stringify(customer));
    setNotice('Đã lưu thông tin tài khoản.');
    window.setTimeout(() => setNotice(''), 2200);
  }

  return <main className="account-page container"><div className="account-heading"><div><span className="eyebrow">Plant Shop · Tài khoản</span><h1>Xin chào,<br /><em>{customer.name || 'bạn yêu cây.'}</em></h1><p>Quản lý thông tin nhận hàng, thanh toán và lịch sử mua sắm của bạn.</p></div><Link className="button button-outline" href="/cua-hang">Tiếp tục mua sắm</Link></div><div className="account-layout"><section className="account-panel"><div className="account-panel-heading"><div className="account-avatar-large">{customer.avatar ? <img src={customer.avatar} alt="Avatar tài khoản" /> : (customer.name || 'K').slice(0, 1).toUpperCase()}</div><div><span className="filter-label">Thông tin cá nhân</span><h2>Hồ sơ của bạn</h2></div></div><div className="account-fields"><label>Họ và tên<input value={customer.name} onChange={(event) => update('name', event.target.value)} /></label><label>Email<input type="email" value={customer.email} onChange={(event) => update('email', event.target.value)} /></label><label>Số điện thoại<input value={customer.phone} onChange={(event) => update('phone', event.target.value)} placeholder="0909 123 456" /></label><label>Avatar URL<input value={customer.avatar || ''} onChange={(event) => update('avatar', event.target.value)} placeholder="https://..." /></label><label className="account-address">Địa chỉ giao hàng<textarea value={customer.address} onChange={(event) => update('address', event.target.value)} placeholder="Nhập địa chỉ nhận hàng" /></label></div><button className="button button-primary" type="button" onClick={save}>Lưu thay đổi</button></section><aside className="account-side"><div className="account-stat"><span>Đơn hàng đã đặt</span><strong>{orders.length}</strong></div><div className="account-stat"><span>Tổng chi tiêu</span><strong>{formatPrice(orders.reduce((total, order) => total + order.total, 0))}</strong></div><div className="account-stat"><span>Thanh toán mặc định</span><strong>COD</strong></div></aside></div><section className="account-orders"><div className="section-heading"><div><span className="eyebrow">Lịch sử</span><h2>Đơn hàng của bạn.</h2></div><span className="account-order-count">{orders.length} đơn hàng</span></div>{orders.length ? orders.map((order) => <article className="account-order" key={order.id}><strong>{order.id}</strong><span>{order.date}</span><span>{formatPrice(order.total)}</span><b>{order.status}</b></article>) : <div className="account-empty"><p>Bạn chưa có đơn hàng nào.</p><Link href="/cua-hang">Khám phá cửa hàng →</Link></div>}</section>{notice && <div className="shop-toast" role="status">✦ {notice}</div>}</main>;
}
