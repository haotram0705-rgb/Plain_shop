'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type CartItem = {
  productId?: string;
  sku?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('vi-VN').format(price)}đ`;

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [coordinates, setCoordinates] = useState('');
  const [locationMessage, setLocationMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load cart
    const rawCart = window.localStorage.getItem('plant_shop_cart');
    if (rawCart) {
      try {
        setCart(JSON.parse(rawCart) as CartItem[]);
      } catch {
        setCart([]);
      }
    }

    // Load customer profile or draft from cart page
    const rawCustomer = window.localStorage.getItem('plant_shop_customer');
    if (rawCustomer) {
      try {
        const cust = JSON.parse(rawCustomer) as { name?: string; phone?: string; address?: string };
        if (cust.name) setName(cust.name);
        if (cust.phone) setPhone(cust.phone);
        if (cust.address) setAddress(cust.address);
      } catch {
        // ignore
      }
    }

    // Load cart settings (shipping/payment preference)
    const rawSettings = window.localStorage.getItem('plant_shop_cart_settings');
    if (rawSettings) {
      try {
        const settings = JSON.parse(rawSettings) as { shipping?: string; payment?: string };
        if (settings.shipping && settings.shipping !== 'pending') setShipping(settings.shipping);
        if (settings.payment) setPayment(settings.payment);
      } catch {
        // ignore
      }
    }
  }, []);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }
    setLocationMessage('Đang lấy vị trí hiện tại...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = `${position.coords.latitude.toFixed(6)},${position.coords.longitude.toFixed(6)}`;
        setCoordinates(next);
        setAddress((current) => current || `Vị trí GPS: ${next}`);
        setLocationMessage('Đã lấy vị trí. Bạn có thể mở Google Maps để kiểm tra.');
      },
      () =>
        setLocationMessage('Không lấy được vị trí. Hãy cấp quyền định vị hoặc nhập địa chỉ thủ công.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function openMap() {
    const query = coordinates || address;
    if (query) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shippingFee = shipping === 'standard' ? 30000 : 0;
  const total = subtotal + shippingFee;

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0) {
      setSubmitMessage('Giỏ hàng của bạn đang trống. Vui lòng thêm cây cảnh trước khi đặt hàng.');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('Đang tạo đơn hàng...');

    const orderCode = `PS-${Date.now().toString().slice(-6)}`;
    const fullAddress = `${address.trim()}${coordinates ? ` (GPS: ${coordinates})` : ''}`;
    const itemsDescription = cart.map((i) => `${i.name} × ${i.quantity}`).join(', ');

    // 1. Build and store order locally (Dual storage)
    const newOrder = {
      id: orderCode,
      date: new Date().toLocaleDateString('vi-VN'),
      total,
      status: 'Chờ xác nhận' as const,
      customer: name.trim(),
      phone: phone.trim(),
      address: fullAddress,
      item: itemsDescription,
      payment: payment === 'transfer' ? 'Chuyển khoản' : 'COD',
      history: [
        {
          time: new Date().toLocaleString('vi-VN'),
          status: 'Đã tạo đơn qua website',
        },
      ],
    };

    // Save to customer orders (for Account page)
    try {
      const prevCustomerOrders = JSON.parse(
        window.localStorage.getItem('plant_shop_orders') || '[]'
      ) as typeof newOrder[];
      window.localStorage.setItem(
        'plant_shop_orders',
        JSON.stringify([newOrder, ...prevCustomerOrders])
      );

      // Save to admin orders (for Admin CRM)
      const prevAdminOrders = JSON.parse(
        window.localStorage.getItem('plant_shop_orders_admin') || '[]'
      ) as typeof newOrder[];
      window.localStorage.setItem(
        'plant_shop_orders_admin',
        JSON.stringify([newOrder, ...prevAdminOrders])
      );

      // Save customer profile
      window.localStorage.setItem(
        'plant_shop_customer',
        JSON.stringify({ name: name.trim(), phone: phone.trim(), address: address.trim() })
      );

      // Clear cart
      window.localStorage.removeItem('plant_shop_cart');
      window.dispatchEvent(new Event('plant-shop-cart-updated'));
    } catch {
      // ignore storage write errors
    }

    // 2. If API URL is provided, call backend server
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      try {
        await fetch(`${apiUrl.replace(/\/$/, '')}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerName: name.trim(),
            buyerPhone: phone.trim(),
            recipientName: name.trim(),
            recipientPhone: phone.trim(),
            address: fullAddress,
            note: note.trim() || undefined,
            paymentMethod: payment,
            shippingMethod: shipping,
            shippingFee: shippingFee > 0 ? shippingFee : undefined,
            items: cart.map((item) => ({
              productId: item.productId,
              sku: item.sku,
              name: item.name?.split(' · ')[0],
              quantity: item.quantity,
            })),
          }),
        });
      } catch {
        // Backend failure will not block user - local order is already safely saved
      }
    }

    // Redirect to confirmation page
    router.push(`/xac-nhan-don?code=${encodeURIComponent(orderCode)}`);
  }

  return (
    <section className="checkout-page container">
      <div className="checkout-heading">
        <span className="eyebrow">Plant Shop · Đặt hàng</span>
        <h1>
          Hoàn thiện<br />
          <em>đơn hàng.</em>
        </h1>
        <p>Chọn cách giao, kiểm tra địa chỉ và gửi yêu cầu để Plant Shop gọi xác nhận trước khi giao.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder}>
          <h2>Thông tin giao hàng</h2>

          <label>
            Họ và tên người nhận *
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nguyễn Minh Anh"
              required
            />
          </label>

          <label>
            Số điện thoại nhận hàng *
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              type="tel"
              placeholder="0909 123 456"
              required
            />
          </label>

          <label>
            Địa chỉ nhận hàng *
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố"
              rows={2}
              required
            />
          </label>

          <div className="location-tools">
            <button className="button button-outline" type="button" onClick={useCurrentLocation}>
              ⌖ Dùng vị trí GPS
            </button>
            <button
              className="button button-outline"
              type="button"
              onClick={openMap}
              disabled={!address && !coordinates}
            >
              Mở Google Maps
            </button>
          </div>

          {locationMessage && <small className="location-message">{locationMessage}</small>}

          <label>
            Ghi chú đơn hàng
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Lời nhắn cho shipper (ví dụ: giao giờ hành chính, gọi trước khi tới...)"
              rows={2}
            />
          </label>

          {submitMessage && (
            <p className="form-success" role="status">
              {submitMessage}
            </p>
          )}

          <fieldset>
            <legend>Phương thức vận chuyển</legend>
            <label className="choice">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shipping === 'standard'}
                onChange={() => setShipping('standard')}
              />{' '}
              Tiêu chuẩn nội thành TP.HCM · 30.000đ
            </label>
            <label className="choice">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shipping === 'express'}
                onChange={() => setShipping('express')}
              />{' '}
              Giao nhanh hỏa tốc · xác nhận phí khi gọi
            </label>
          </fieldset>

          <fieldset>
            <legend>Phương thức thanh toán</legend>
            <label className="choice">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={payment === 'cod'}
                onChange={() => setPayment('cod')}
              />{' '}
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="choice">
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={payment === 'transfer'}
                onChange={() => setPayment('transfer')}
              />{' '}
              Chuyển khoản ngân hàng sau khi nhân viên gọi xác nhận
            </label>
          </fieldset>

          <button
            className="button button-primary"
            type="submit"
            disabled={submitting || cart.length === 0}
          >
            {submitting ? 'Đang gửi đơn hàng...' : `Gửi yêu cầu đặt hàng (${formatPrice(total)}) →`}
          </button>
        </form>

        <aside className="checkout-aside">
          <span className="filter-label">Tóm tắt đơn hàng</span>
          <h2>{cart.length} món trong giỏ</h2>

          <div
            style={{
              display: 'grid',
              gap: '10px',
              margin: '16px 0',
              maxHeight: '260px',
              overflowY: 'auto',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              padding: '12px 0',
            }}
          >
            {cart.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.74rem',
                  gap: '8px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <small style={{ display: 'block', opacity: 0.75 }}>
                    {formatPrice(item.price)} × {item.quantity}
                  </small>
                </div>
                <strong>{formatPrice((item.price || 0) * (item.quantity || 1))}</strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: '6px', fontSize: '0.75rem', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tiền hàng:</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Phí vận chuyển:</span>
              <strong>{shippingFee > 0 ? formatPrice(shippingFee) : 'Xác nhận sau'}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '8px',
                fontSize: '0.9rem',
                color: '#f5d27b',
              }}
            >
              <span>Tổng cộng:</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <div className="checkout-map-note">
            ⌖ Plant Shop sẽ liên hệ xác nhận tình trạng cây, đóng gói và thời gian giao trước khi vận chuyển.
          </div>

          <Link href="/gio-hang" style={{ color: '#f5d27b', fontSize: '0.75rem', display: 'inline-block' }}>
            ← Quay lại giỏ hàng để sửa
          </Link>
        </aside>
      </div>
    </section>
  );
}
