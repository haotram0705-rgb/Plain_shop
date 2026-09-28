'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type CartItem = {
  name: string;
  type: string;
  price: number;
  quantity: number;
  image: string;
};

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const money = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponNotice, setCouponNotice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
    [items]
  );

  const shippingFee =
    shipping === 'express'
      ? 60000
      : shipping === 'standard'
      ? 30000
      : 0;

  const total = Math.max(0, subtotal - discount + shippingFee);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cart = window.localStorage.getItem('plant_shop_cart');
    const savedCustomer = window.localStorage.getItem('plant_shop_customer');

    if (cart) {
      try {
        setItems(JSON.parse(cart) as CartItem[]);
      } catch {
        setItems([]);
      }
    }

    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer) as Customer);
      } catch {
        // ignore
      }
    }
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_cart', JSON.stringify(next));
      window.dispatchEvent(new Event('plant-shop-cart-updated'));
    }
  }

  function updateQuantity(name: string, amount: number) {
    persist(
      items
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(name: string) {
    persist(items.filter((item) => item.name !== name));
  }

  function updateCustomer(field: keyof Customer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function applyCoupon(customCode?: string) {
    const code = (customCode || coupon).trim().toUpperCase();
    if (code === 'GREEN10') {
      const discountVal = Math.round(subtotal * 0.1);
      setDiscount(discountVal);
      setCoupon('GREEN10');
      setCouponNotice(`Đã áp dụng mã GREEN10: giảm ${money(discountVal)} (10%)`);
    } else if (code) {
      setDiscount(0);
      setCouponNotice('Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
    } else {
      setDiscount(0);
      setCouponNotice('');
    }
  }

  function continueToCheckout() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_customer', JSON.stringify(customer));
      window.localStorage.setItem(
        'plant_shop_cart_settings',
        JSON.stringify({ shipping, payment, coupon, discount })
      );
    }
    router.push('/dat-hang');
  }

  return (
    <section className="cart-page">
      <div className="container">
        <div className="cart-heading">
          <div>
            <span className="eyebrow">Plant Shop · Giỏ hàng</span>
            <h1>
              Những lựa chọn<br />
              <em>của bạn.</em>
            </h1>
          </div>
          <Link href="/cua-hang">← Tiếp tục chọn cây</Link>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span>✦</span>
            <h2>Giỏ hàng đang trống.</h2>
            <p>Hãy chọn một mảng xanh thiên nhiên cho không gian sống của bạn.</p>
            <Link className="button button-primary" href="/cua-hang">
              Khám phá cửa hàng ngay
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-items-head">
                <span>Sản phẩm</span>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Tạm tính</span>
              </div>

              {items.map((item) => (
                <article className="cart-item" key={item.name}>
                  <div className="cart-product">
                    <div
                      className="cart-product-image"
                      style={{
                        backgroundImage: `url(${item.image || '/assets/images/cat-indoor.jpg'})`,
                      }}
                    />
                    <div>
                      <h2>{item.name}</h2>
                      <small>{item.type || 'Cây xanh'}</small>
                      <button type="button" onClick={() => removeItem(item.name)}>
                        Xóa
                      </button>
                    </div>
                  </div>

                  <strong>{money(item.price)}</strong>

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.name, -1)}
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.name, 1)}
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>

                  <strong>{money(item.price * item.quantity)}</strong>
                </article>
              ))}

              {/* Customer Quick Info */}
              <div className="customer-details">
                <div className="customer-details-heading">
                  <span className="filter-label">Thông tin nhận hàng nhanh</span>
                  <small>Thông tin này sẽ được tự động điền tại bước đặt hàng</small>
                </div>
                <div className="customer-fields">
                  <label>
                    Họ và tên
                    <input
                      value={customer.name}
                      onChange={(event) => updateCustomer('name', event.target.value)}
                      placeholder="Nguyễn Minh Anh"
                    />
                  </label>
                  <label>
                    Số điện thoại
                    <input
                      value={customer.phone}
                      onChange={(event) => updateCustomer('phone', event.target.value)}
                      placeholder="0909 123 456"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      value={customer.email}
                      onChange={(event) => updateCustomer('email', event.target.value)}
                      type="email"
                      placeholder="you@example.com (không bắt buộc)"
                    />
                  </label>
                  <label className="customer-address">
                    Địa chỉ giao hàng
                    <input
                      value={customer.address}
                      onChange={(event) => updateCustomer('address', event.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <aside className="cart-summary">
              <span className="filter-label">Kiểm tra đơn hàng</span>
              <h2>Tổng đơn</h2>

              <div className="summary-row">
                <span>Tiền hàng ({items.reduce((s, i) => s + i.quantity, 0)} món)</span>
                <strong>{money(subtotal)}</strong>
              </div>

              <div className="shipping-options">
                <b>Gói vận chuyển</b>
                <label>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping === 'standard'}
                    onChange={() => setShipping('standard')}
                  />{' '}
                  Nội thành TP.HCM · 30.000đ
                </label>
                <label>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping === 'express'}
                    onChange={() => setShipping('express')}
                  />{' '}
                  Hỏa tốc trong ngày · 60.000đ
                </label>
                <label>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping === 'pending'}
                    onChange={() => setShipping('pending')}
                  />{' '}
                  Xác nhận cước sau khi gọi
                </label>
              </div>

              <div className="payment-options">
                <b>Phương thức thanh toán</b>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === 'cod'}
                    onChange={() => setPayment('cod')}
                  />{' '}
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === 'transfer'}
                    onChange={() => setPayment('transfer')}
                  />{' '}
                  Chuyển khoản ngân hàng
                </label>
              </div>

              {/* Coupon Field */}
              <div className="coupon-field">
                <input
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder="Nhập mã giảm giá"
                />
                <button type="button" onClick={() => applyCoupon()}>
                  Áp dụng
                </button>
              </div>

              <div style={{ margin: '-10px 0 14px', fontSize: '0.68rem' }}>
                <span style={{ color: 'var(--muted)' }}>Gợi ý: </span>
                <button
                  type="button"
                  onClick={() => applyCoupon('GREEN10')}
                  style={{
                    background: '#edf5e9',
                    border: '1px dashed var(--accent)',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    borderRadius: '4px',
                    padding: '2px 6px',
                    cursor: 'pointer',
                  }}
                >
                  GREEN10 (-10%)
                </button>
              </div>

              {couponNotice && (
                <small
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    color: discount > 0 ? '#3d805e' : '#d85757',
                    fontWeight: 600,
                    fontSize: '0.68rem',
                  }}
                >
                  {couponNotice}
                </small>
              )}

              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá</span>
                  <strong>-{money(discount)}</strong>
                </div>
              )}

              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <strong>{shippingFee > 0 ? money(shippingFee) : 'Xác nhận sau'}</strong>
              </div>

              <div className="summary-total">
                <span>Tổng thanh toán</span>
                <strong>{money(total)}</strong>
              </div>

              <small className="secure-note">
                ✓ Cây được đóng gói chống sốc và bảo hành 1 đổi 1 trong 7 ngày.
              </small>

              <button
                className="button button-primary checkout-button"
                type="button"
                onClick={continueToCheckout}
              >
                Tiến hành đặt hàng →
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
