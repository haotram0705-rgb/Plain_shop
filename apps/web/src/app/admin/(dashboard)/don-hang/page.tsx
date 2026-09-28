'use client';

import { useMemo, useState } from 'react';

type OrderStatus = 'Chờ xác nhận' | 'Đang đóng gói' | 'Đang giao' | 'Hoàn tất' | 'Đã hủy';
type Order = { id: string; date: string; total: number; status: OrderStatus; customer: string; phone: string; address: string; item: string; payment: string; history: { time: string; status: string }[] };
const fallback: Order[] = [
  { id: 'PS-240921', date: '21/09/2026', total: 1350000, status: 'Chờ xác nhận', customer: 'Nguyễn Minh Anh', phone: '0909 123 456', address: 'Quận 1, TP. Hồ Chí Minh', item: 'Monstera Deliciosa × 2', payment: 'COD', history: [{ time: '21/09/2026 09:20', status: 'Đã tạo đơn' }] },
  { id: 'PS-240920', date: '20/09/2026', total: 890000, status: 'Đang giao', customer: 'Trần Hoàng Nam', phone: '0908 222 333', address: 'Quận 3, TP. Hồ Chí Minh', item: 'Lan Hồ Điệp trắng', payment: 'Chuyển khoản', history: [{ time: '20/09/2026 15:10', status: 'Đang giao' }, { time: '20/09/2026 10:00', status: 'Đã đóng gói' }] },
  { id: 'PS-240919', date: '19/09/2026', total: 580000, status: 'Hoàn tất', customer: 'Lê Ngọc Mai', phone: '0907 444 555', address: 'Bình Thạnh, TP. Hồ Chí Minh', item: 'Chậu gốm men rạn', payment: 'COD', history: [{ time: '20/09/2026 11:20', status: 'Hoàn tất' }] },
];
const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
const statuses: OrderStatus[] = ['Chờ xác nhận', 'Đang đóng gói', 'Đang giao', 'Hoàn tất', 'Đã hủy'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => { if (typeof window === 'undefined') return fallback; const saved = window.localStorage.getItem('plant_shop_orders_admin'); return saved ? JSON.parse(saved) as Order[] : fallback; });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Tất cả');
  const [selected, setSelected] = useState<Order | null>(null);
  const filtered = useMemo(() => orders.filter((order) => (status === 'Tất cả' || order.status === status) && `${order.id} ${order.customer} ${order.item}`.toLowerCase().includes(query.toLowerCase())), [orders, query, status]);

  function updateStatus(id: string, nextStatus: OrderStatus) {
    const next = orders.map((order) => order.id === id ? { ...order, status: nextStatus, history: [{ time: new Date().toLocaleString('vi-VN'), status: nextStatus }, ...order.history] } : order);
    setOrders(next);
    window.localStorage.setItem('plant_shop_orders_admin', JSON.stringify(next));
    setSelected((current) => current?.id === id ? next.find((order) => order.id === id) || null : current);
  }

  function printInvoice(order: Order) { const printWindow = window.open('', '_blank', 'width=760,height=700'); if (!printWindow) return; printWindow.document.write(`<html><head><title>Hóa đơn ${order.id}</title><style>body{font-family:Arial;padding:40px;color:#33402c}h1{font-family:Georgia}table{width:100%;border-collapse:collapse;margin-top:24px}td{padding:12px;border-bottom:1px solid #ddd}strong{font-size:20px}</style></head><body><h1>Plant Shop</h1><p>Hóa đơn ${order.id} · ${order.date}</p><table><tr><td>Khách hàng</td><td>${order.customer}</td></tr><tr><td>Sản phẩm</td><td>${order.item}</td></tr><tr><td>Địa chỉ</td><td>${order.address}</td></tr><tr><td>Thanh toán</td><td>${order.payment}</td></tr><tr><td>Tổng cộng</td><td><strong>${money(order.total)}</strong></td></tr></table></body></html>`); printWindow.document.close(); printWindow.print(); }

  return <div className="admin-crud-page"><div className="admin-page-title"><div><span className="eyebrow">Vận hành · Bán hàng</span><h2>Quản lý đơn hàng</h2><p>Tiếp nhận, đóng gói, giao hàng và lưu lịch sử xử lý từng đơn.</p></div><span className="admin-record-count">{orders.length} đơn hàng</span></div><section className="admin-crud-list"><div className="admin-list-toolbar"><label className="admin-inline-search">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, khách hàng..." /></label><select className="admin-order-filter" value={status} onChange={(event) => setStatus(event.target.value)}><option>Tất cả</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>{filtered.map((order) => <article className="admin-order-row" key={order.id}><strong>{order.id}</strong><div><h3>{order.customer}</h3><small>{order.item} · {order.date}</small></div><b>{money(order.total)}</b><select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select><button className="admin-order-view" type="button" onClick={() => setSelected(order)}>Xem chi tiết</button></article>)}{filtered.length === 0 && <div className="admin-empty-state">Không tìm thấy đơn hàng.</div>}</section>{selected && <div className="order-detail-backdrop" role="presentation" onClick={() => setSelected(null)}><article className="order-detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="product-modal-close" type="button" onClick={() => setSelected(null)}>×</button><div className="order-detail-heading"><span className="filter-label">Chi tiết đơn hàng</span><h2>{selected.id}</h2><p>{selected.customer} · {selected.phone}</p></div><div className="order-detail-grid"><span>Sản phẩm<strong>{selected.item}</strong></span><span>Địa chỉ<strong>{selected.address}</strong></span><span>Thanh toán<strong>{selected.payment}</strong></span><span>Tổng cộng<strong>{money(selected.total)}</strong></span></div><div className="order-timeline"><b>Lịch sử xử lý</b>{selected.history.map((item, index) => <div key={`${item.time}-${index}`}><span /> <p><strong>{item.status}</strong><small>{item.time}</small></p></div>)}</div><button className="button button-primary" type="button" onClick={() => printInvoice(selected)}>In hóa đơn</button></article></div>}</div>;
}
