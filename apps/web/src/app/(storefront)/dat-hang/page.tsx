'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function CheckoutPage() {
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

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }
    setLocationMessage('Đang lấy vị trí hiện tại...');
    navigator.geolocation.getCurrentPosition((position) => {
      const next = `${position.coords.latitude.toFixed(6)},${position.coords.longitude.toFixed(6)}`;
      setCoordinates(next);
      setAddress((current) => current || `Vị trí GPS: ${next}`);
      setLocationMessage('Đã lấy vị trí. Bạn có thể mở Google Maps để kiểm tra.');
    }, () => setLocationMessage('Không lấy được vị trí. Hãy cấp quyền định vị hoặc nhập địa chỉ thủ công.'), { enableHighAccuracy: true, timeout: 10000 });
  }

  function openMap() {
    const query = coordinates || address;
    if (query) window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitMessage('Đang kiểm tra giá và tồn kho...');
    const cart = JSON.parse(window.localStorage.getItem('plant_shop_cart') || '[]') as Array<{ productId?: string; sku?: string; name?: string; quantity: number }>;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ buyerName: name, buyerPhone: phone, recipientName: name, recipientPhone: phone, address: `${address}${coordinates ? ` (GPS: ${coordinates})` : ''}`, note, paymentMethod: payment, shippingMethod: shipping, shippingFee: shipping === 'standard' ? 30000 : undefined, items: cart.map((item) => ({ productId: item.productId, sku: item.sku, name: item.name?.split(' · ')[0], quantity: item.quantity })) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Không thể tạo đơn hàng.');
      window.localStorage.setItem('plant_shop_customer', JSON.stringify({ name, phone, address }));
      window.localStorage.setItem('plant_shop_order_location', JSON.stringify({ address, coordinates, shipping, payment, note }));
      window.localStorage.removeItem('plant_shop_cart');
      window.location.href = `/xac-nhan-don?code=${encodeURIComponent(result.code)}`;
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : 'Không thể kết nối máy chủ.');
      setSubmitting(false);
    }
  }

  return <section className="checkout-page container"><div className="checkout-heading"><span className="eyebrow">Plant Shop · Đặt hàng</span><h1>Hoàn thiện<br /><em>đơn hàng.</em></h1><p>Chọn cách giao, kiểm tra địa chỉ và gửi yêu cầu để Plant Shop gọi xác nhận.</p></div><div className="checkout-layout"><form className="checkout-form" onSubmit={submitOrder}><h2>Thông tin giao hàng</h2><label>Họ và tên<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nguyễn Minh Anh" required /></label><label>Số điện thoại<input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="0909 123 456" required /></label><label>Địa chỉ nhận hàng<textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Số nhà, đường, phường/xã, thành phố" required /></label><div className="location-tools"><button className="button button-outline" type="button" onClick={useCurrentLocation}>⌖ Dùng vị trí GPS</button><button className="button button-outline" type="button" onClick={openMap} disabled={!address && !coordinates}>Mở Google Maps</button></div>{locationMessage && <small className="location-message">{locationMessage}</small>}<label>Ghi chú đơn hàng<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Lời nhắn cho Plant Shop (không bắt buộc)" /></label>{(submitMessage || submitting) && <p className="form-success" role="status">{submitting ? submitMessage || 'Đang gửi đơn hàng...' : submitMessage}</p>}<fieldset><legend>Vận chuyển</legend><label className="choice"><input type="radio" name="shipping" value="standard" checked={shipping === 'standard'} onChange={() => setShipping('standard')} /> Nội thành · 30.000đ</label><label className="choice"><input type="radio" name="shipping" value="express" checked={shipping === 'express'} onChange={() => setShipping('express')} /> Giao nhanh · xác nhận sau</label></fieldset><fieldset><legend>Thanh toán</legend><label className="choice"><input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} /> Thanh toán khi nhận hàng</label><label className="choice"><input type="radio" name="payment" value="transfer" checked={payment === 'transfer'} onChange={() => setPayment('transfer')} /> Chuyển khoản sau khi xác nhận</label></fieldset><button className="button button-primary" type="submit">Gửi yêu cầu đặt hàng →</button></form><aside className="checkout-aside"><span className="filter-label">Bước tiếp theo</span><h2>Plant Shop sẽ gọi xác nhận.</h2><p>Chúng mình kiểm tra cây, phí giao hàng và thời gian giao trước khi chốt đơn với bạn.</p><div className="checkout-map-note">⌖ Địa chỉ sẽ được đối chiếu trên Google Maps khi xác nhận.</div><Link href="/gio-hang">← Quay lại giỏ hàng</Link></aside></div></section>;
}
