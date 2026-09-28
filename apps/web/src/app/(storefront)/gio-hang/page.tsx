'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type CartItem = { name: string; type: string; price: number; quantity: number; image: string };
type Customer = { name: string; email: string; phone: string; address: string };
const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState('pending');
  const [payment, setPayment] = useState('cod');
  const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '', address: '' });
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shippingFee = shipping === 'express' ? 100000 : shipping === 'standard' ? 150000 : shipping === 'fastest' ? 200000 : null;
  const total = subtotal - discount + (shippingFee || 0);

  useEffect(() => {
    const cart = window.localStorage.getItem('plant_shop_cart');
    const savedCustomer = window.localStorage.getItem('plant_shop_customer');
    if (cart) setItems(JSON.parse(cart) as CartItem[]);
    if (savedCustomer) setCustomer(JSON.parse(savedCustomer) as Customer);
  }, []);

  function persist(next: CartItem[]) { setItems(next); window.localStorage.setItem('plant_shop_cart', JSON.stringify(next)); window.dispatchEvent(new Event('plant-shop-cart-updated')); }
  function updateQuantity(name: string, amount: number) { persist(items.map((item) => item.name === name ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)); }
  function removeItem(name: string) { persist(items.filter((item) => item.name !== name)); }
  function updateCustomer(field: keyof Customer, value: string) { setCustomer((current) => ({ ...current, [field]: value })); }
  function applyCoupon() { setDiscount(coupon.trim().toUpperCase() === 'GREEN10' ? Math.min(Math.round(subtotal * .1), subtotal) : 0); }
  function continueToCheckout() { window.localStorage.setItem('plant_shop_customer', JSON.stringify(customer)); window.location.href = '/dat-hang'; }

  return <section className="cart-page"><div className="container"><div className="cart-heading"><div><span className="eyebrow">Plant Shop · Giỏ hàng</span><h1>Những lựa chọn<br /><em>của bạn.</em></h1></div><Link href="/cua-hang">← Tiếp tục chọn cây</Link></div>{items.length === 0 ? <div className="cart-empty"><span>✦</span><h2>Giỏ hàng đang trống.</h2><p>Hãy chọn một mảng xanh để bắt đầu.</p><Link className="button button-primary" href="/cua-hang">Đến cửa hàng</Link></div> : <div className="cart-layout"><div className="cart-items"><div className="cart-items-head"><span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Tạm tính</span></div>{items.map((item) => <article className="cart-item" key={item.name}><div className="cart-product"><div className="cart-product-image" style={{ backgroundImage: `url(${item.image})` }} /><div><h2>{item.name}</h2><small>{item.type}</small><button type="button" onClick={() => removeItem(item.name)}>Xóa</button></div></div><strong>{money(item.price)}</strong><div className="quantity-control"><button type="button" onClick={() => updateQuantity(item.name, -1)} aria-label="Giảm số lượng">−</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.name, 1)} aria-label="Tăng số lượng">+</button></div><strong>{money(item.price * item.quantity)}</strong></article>)}<div className="customer-details"><div className="customer-details-heading"><span className="filter-label">Thông tin người nhận</span><small>Không cần tài khoản để đặt hàng</small></div><div className="customer-fields"><label>Họ và tên<input value={customer.name} onChange={(event) => updateCustomer('name', event.target.value)} required placeholder="Nguyễn Minh Anh" /></label><label>Số điện thoại<input value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value)} required placeholder="0909 123 456" /></label><label>Email<input value={customer.email} onChange={(event) => updateCustomer('email', event.target.value)} type="email" placeholder="Không bắt buộc" /></label><label className="customer-address">Địa chỉ giao hàng<input value={customer.address} onChange={(event) => updateCustomer('address', event.target.value)} required placeholder="Số nhà, đường, phường/xã, thành phố" /></label></div></div></div><aside className="cart-summary"><span className="filter-label">Kiểm tra đơn</span><h2>Thanh toán</h2><div className="summary-row"><span>Tiền hàng</span><strong>{money(subtotal)}</strong></div><div className="shipping-options"><b>Giao hàng</b><label><input type="radio" name="shipping" checked={shipping === 'pending'} onChange={() => setShipping('pending')} /> Cần xác nhận phí giao</label><label><input type="radio" name="shipping" checked={shipping === 'express'} onChange={() => setShipping('express')} /> Hỏa tốc · 100.000đ</label><label><input type="radio" name="shipping" checked={shipping === 'standard'} onChange={() => setShipping('standard')} /> Bình thường · 150.000đ</label><label><input type="radio" name="shipping" checked={shipping === 'fastest'} onChange={() => setShipping('fastest')} /> Nhanh nhất · 200.000đ</label></div><div className="payment-options"><b>Thanh toán</b><label><input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} /> Thu khi giao hàng</label><label><input type="radio" name="payment" checked={payment === 'transfer'} onChange={() => setPayment('transfer')} /> Chuyển khoản sau khi xác nhận</label></div><div className="coupon-field"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Mã giảm giá" /><button type="button" onClick={applyCoupon}>Áp dụng</button></div>{discount > 0 && <div className="summary-row discount"><span>Giảm giá</span><strong>-{money(discount)}</strong></div>}<div className="summary-total"><span>Tạm tính cuối</span><strong>{money(total)}</strong></div><small className="secure-note">{shippingFee === null ? 'Phí giao sẽ được shop xác nhận trước khi chốt đơn.' : 'Phí giao đang tính theo gói bạn chọn.'}</small><button className="button button-primary checkout-button" type="button" onClick={continueToCheckout}>Tiếp tục đặt hàng →</button></aside></div>}</div></section>;
}
