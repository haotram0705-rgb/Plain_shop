'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  item?: string;
  address?: string;
};

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('vi-VN').format(price)}đ`;

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

    if (savedCustomer) {
      try {
        setCustomer({ avatar: '', ...(JSON.parse(savedCustomer) as Customer) });
      } catch {
        // ignore
      }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders) as Order[]);
      } catch {
        setOrders([]);
      }
    }
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

    // Also update in registered users list if matching
    try {
      const rawUsers = window.localStorage.getItem('plant_shop_users');
      if (rawUsers) {
        const users = JSON.parse(rawUsers) as Array<Customer & { email: string }>;
        const updated = users.map((u) =>
          u.email.toLowerCase() === customer.email.toLowerCase()
            ? { ...u, name: customer.name, phone: customer.phone, address: customer.address }
            : u
        );
        window.localStorage.setItem('plant_shop_users', JSON.stringify(updated));
      }
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event('plant-shop-auth-updated'));
    setNotice('Đã lưu thông tin tài khoản thành công.');
    window.setTimeout(() => setNotice(''), 2400);
  }

  function logout() {
    window.localStorage.removeItem('plant_shop_authenticated');
    window.localStorage.removeItem('plant_shop_role');
    window.dispatchEvent(new Event('plant-shop-auth-updated'));
    router.push('/dang-nhap');
  }

  return (
    <main className="account-page container">
      <div className="account-heading">
        <div>
          <span className="eyebrow">Plant Shop · Tài khoản</span>
          <h1>
            Xin chào,<br />
            <em>{customer.name || 'bạn yêu cây.'}</em>
          </h1>
          <p>Quản lý thông tin nhận hàng, lịch sử đơn hàng và tài khoản của bạn.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link className="button button-outline" href="/cua-hang">
            Tiếp tục mua sắm
          </Link>
          <button className="button button-outline" type="button" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="account-layout">
        <section className="account-panel">
          <div className="account-panel-heading">
            <div className="account-avatar-large">
              {customer.avatar ? (
                <img src={customer.avatar} alt="Avatar tài khoản" />
              ) : (
                (customer.name || 'K').slice(0, 1).toUpperCase()
              )}
            </div>
            <div>
              <span className="filter-label">Thông tin cá nhân</span>
              <h2>Hồ sơ của bạn</h2>
            </div>
          </div>

          <div className="account-fields">
            <label>
              Họ và tên
              <input
                value={customer.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="Nguyễn Minh Anh"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={customer.email}
                onChange={(event) => update('email', event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Số điện thoại
              <input
                value={customer.phone}
                onChange={(event) => update('phone', event.target.value)}
                placeholder="0909 123 456"
              />
            </label>
            <label>
              Avatar URL (ảnh đại diện)
              <input
                value={customer.avatar || ''}
                onChange={(event) => update('avatar', event.target.value)}
                placeholder="https://..."
              />
            </label>
            <label className="account-address">
              Địa chỉ nhận hàng mặc định
              <textarea
                value={customer.address}
                onChange={(event) => update('address', event.target.value)}
                placeholder="Số nhà, đường, phường/xã, thành phố"
                rows={3}
              />
            </label>
          </div>

          <button className="button button-primary" type="button" onClick={save}>
            Lưu thay đổi hồ sơ
          </button>
        </section>

        <aside className="account-side">
          <div className="account-stat">
            <span>Đơn hàng đã đặt</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="account-stat">
            <span>Tổng chi tiêu</span>
            <strong>
              {formatPrice(orders.reduce((total, order) => total + (order.total || 0), 0))}
            </strong>
          </div>
          <div className="account-stat">
            <span>Tình trạng tài khoản</span>
            <strong style={{ color: '#3d805e' }}>Đã kích hoạt</strong>
          </div>
        </aside>
      </div>

      <section className="account-orders">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Lịch sử giao dịch</span>
            <h2>Đơn hàng của bạn.</h2>
          </div>
          <span className="account-order-count">{orders.length} đơn hàng</span>
        </div>

        {orders.length ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {orders.map((order) => (
              <article className="account-order" key={order.id}>
                <strong>{order.id}</strong>
                <span>{order.date}</span>
                <span style={{ color: 'var(--foreground)', fontSize: '0.74rem' }}>
                  {order.item || 'Sản phẩm cây cảnh & vật tư'}
                </span>
                <span>{formatPrice(order.total)}</span>
                <b>{order.status || 'Chờ xác nhận'}</b>
              </article>
            ))}
          </div>
        ) : (
          <div className="account-empty">
            <p>Bạn chưa có đơn hàng nào.</p>
            <Link className="button button-primary" href="/cua-hang">
              Khám phá cửa hàng ngay →
            </Link>
          </div>
        )}
      </section>

      {notice && <div className="shop-toast" role="status">✦ {notice}</div>}
    </main>
  );
}
