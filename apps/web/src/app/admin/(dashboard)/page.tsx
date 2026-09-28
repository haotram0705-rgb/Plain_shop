'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Product = { name: string; stock: number; sold: number; price: number; status: string };
type Order = { id: string; date: string; total: number; status: string; customer: string; item: string };
type Change = { time: string; section: string; action: string };
const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
const productsFallback: Product[] = [{ name: 'Monstera Deliciosa', stock: 18, sold: 42, price: 450000, status: 'Đang bán' }, { name: 'Cây Kim Tiền', stock: 12, sold: 31, price: 320000, status: 'Đang bán' }, { name: 'Bàng Singapore', stock: 5, sold: 18, price: 680000, status: 'Đang bán' }, { name: 'Lan Hồ Điệp trắng', stock: 0, sold: 27, price: 890000, status: 'Tạm ẩn' }];
const ordersFallback: Order[] = [{ id: 'PS-240921', date: '21/09/2026', total: 1350000, status: 'Chờ xác nhận', customer: 'Nguyễn Minh Anh', item: 'Monstera Deliciosa × 2' }, { id: 'PS-240920', date: '20/09/2026', total: 890000, status: 'Đang giao', customer: 'Trần Hoàng Nam', item: 'Lan Hồ Điệp trắng' }, { id: 'PS-240919', date: '19/09/2026', total: 580000, status: 'Hoàn tất', customer: 'Lê Ngọc Mai', item: 'Chậu gốm men rạn' }];

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>(productsFallback);
  const [orders, setOrders] = useState<Order[]>(ordersFallback);
  const [changes, setChanges] = useState<Change[]>([]);

  useEffect(() => {
    const savedProducts = window.localStorage.getItem('plant_shop_products');
    const savedOrders = window.localStorage.getItem('plant_shop_orders_admin');
    const savedChanges = window.localStorage.getItem('plant_shop_change_log');
    if (savedProducts) setProducts(JSON.parse(savedProducts) as Product[]);
    if (savedOrders) setOrders(JSON.parse(savedOrders) as Order[]);
    if (savedChanges) setChanges(JSON.parse(savedChanges) as Change[]);
  }, []);

  const revenue = useMemo(() => orders.filter((order) => order.status !== 'Đã hủy').reduce((sum, order) => sum + order.total, 0), [orders]);
  const pending = orders.filter((order) => order.status === 'Chờ xác nhận').length;
  const shipping = orders.filter((order) => order.status === 'Đang giao').length;
  const complete = orders.filter((order) => order.status === 'Hoàn tất').length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const orderTotal = Math.max(orders.length, 1);

  return <div className="dashboard-page"><div className="dashboard-intro"><div><span className="eyebrow">Tổng quan cửa hàng</span><h2>Hôm nay cửa hàng thế nào?</h2><p className="dashboard-subtitle">Theo dõi nhanh doanh thu, đơn hàng và tình trạng kho trong một màn hình.</p></div><Link className="button button-primary" href="/admin/san-pham">+ Tạo sản phẩm</Link></div><div className="metric-grid"><Metric label="Doanh thu ghi nhận" value={money(revenue)} change={`${orders.length} đơn`} tone="green" ring="82" /><Metric label="Chờ xác nhận" value={String(pending)} change="Cần xử lý" tone="orange" ring={String(Math.round((pending / orderTotal) * 100))} /><Metric label="Tổng tồn kho" value={String(totalStock)} change={`${lowStock} sắp hết`} tone="blue" ring="68" /><Metric label="Hết hàng" value={String(outOfStock)} change="Cần nhập thêm" tone="rose" ring={outOfStock ? '24' : '4'} /></div><div className="dashboard-grid"><section className="dashboard-panel sales-panel"><div className="panel-heading"><div><span className="eyebrow">Hiệu suất</span><h3>Doanh thu theo tuần</h3></div><Link href="/admin/bao-cao">Xem báo cáo →</Link></div><div className="dashboard-summary-chart"><div className="chart-bars"><i style={{ height: '38%' }} /><i style={{ height: '52%' }} /><i style={{ height: '46%' }} /><i style={{ height: '68%' }} /><i style={{ height: '58%' }} /><i style={{ height: '76%' }} /><i style={{ height: '64%' }} /><i style={{ height: '88%' }} /><i style={{ height: '72%' }} /><i style={{ height: '94%' }} /></div></div><div className="chart-labels"><span>Tuần 1</span><span>Tuần 2</span><span>Tuần 3</span><span>Tuần 4</span></div></section><section className="dashboard-panel distribution-panel"><div className="panel-heading"><div><span className="eyebrow">Phân bổ</span><h3>Trạng thái đơn hàng</h3></div></div><div className="donut-wrap"><div className="donut-chart" style={{ background: `conic-gradient(#c1704a 0 ${pending / orderTotal * 100}%, #67888b ${pending / orderTotal * 100}% ${(pending + shipping) / orderTotal * 100}%, #7c8863 ${(pending + shipping) / orderTotal * 100}% 100%)` }}><strong>{orders.length}</strong><span>đơn</span></div><div className="donut-legend"><Legend color="pending" label="Chờ xác nhận" value={pending} /><Legend color="shipping" label="Đang giao" value={shipping} /><Legend color="complete" label="Hoàn tất" value={complete} /></div></div></section></div><div className="dashboard-bottom-grid"><section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">Vận hành</span><h3>Đơn hàng gần đây</h3></div><Link href="/admin/don-hang">Xem tất cả →</Link></div><div className="dashboard-order-list">{orders.slice(0, 4).map((order) => <div className="dashboard-order-row" key={order.id}><strong>{order.id}</strong><div><b>{order.customer}</b><small>{order.item}</small></div><span>{money(order.total)}</span><em className={order.status === 'Hoàn tất' ? 'complete' : order.status === 'Đang giao' ? 'shipping' : 'pending'}>{order.status}</em></div>)}</div></section><section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">Kho hàng</span><h3>Cần chú ý</h3></div><Link href="/admin/kho-hang">Mở kho →</Link></div><div className="dashboard-alert-list">{products.filter((product) => product.stock <= 5).map((product) => <div key={product.name}><span className="status-dot pending" /><div><b>{product.name}</b><small>{product.stock === 0 ? 'Đã hết hàng' : `Còn ${product.stock} sản phẩm`}</small></div></div>)}{products.every((product) => product.stock > 5) && <p>Kho hàng đang ổn định.</p>}</div></section></div>{changes.length > 0 && <section className="dashboard-change-log"><span className="eyebrow">Lịch sử thao tác</span><span>{changes.length} thay đổi gần đây được lưu trong POS.</span><Link href="/admin/cau-hinh">Xem cấu hình →</Link></section>}</div>;
}

function Metric({ label, value, change, tone, ring }: { label: string; value: string; change: string; tone: string; ring: string }) { return <div className={`metric-card ${tone}`}><div className="metric-ring" style={{ background: `conic-gradient(currentColor ${ring}%, rgba(255,255,255,.18) 0)` }}><span>{ring}%</span></div><div><span>{label}</span><strong>{value}</strong><small>↗ {change}</small></div><i>✦</i></div>; }
function Legend({ color, label, value }: { color: string; label: string; value: number }) { return <div className="donut-legend-row"><span className={`legend-dot ${color}`} /><span>{label}</span><strong>{value}</strong></div>; }
