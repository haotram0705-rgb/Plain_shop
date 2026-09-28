'use client';

import { useMemo, useState } from 'react';

type ReportPeriod = 'today' | 'week' | 'month' | 'year';

interface OrderItem {
  id: number;
  product: string;
  customer: string;
  total: number;
  channel: 'POS - Bán tại quầy' | 'Website' | 'Hotline / Zalo';
  paymentMethod: 'Tiền mặt' | 'VietQR' | 'Thẻ POS' | 'COD';
  status: 'Hoàn tất' | 'Đang xử lý' | 'Đã giao' | 'Đã hủy';
  time: string;
}

const fallbackOrders: OrderItem[] = [
  { id: 101, product: 'Monstera Deliciosa (x2), Chậu gốm mộc (x2)', customer: 'Khách lẻ tại quầy', total: 1260000, channel: 'POS - Bán tại quầy', paymentMethod: 'VietQR', status: 'Hoàn tất', time: 'Hôm nay, 14:30' },
  { id: 102, product: 'Bàng Singapore (x1), Đất vi sinh (x2)', customer: 'Trần Minh Đức', total: 780000, channel: 'Website', paymentMethod: 'COD', status: 'Đang xử lý', time: 'Hôm nay, 11:15' },
  { id: 103, product: 'Cây Kim Tiền (x3), Bình tưới inox', customer: 'Lê Hoàng Yến', total: 1150000, channel: 'POS - Bán tại quầy', paymentMethod: 'Tiền mặt', status: 'Hoàn tất', time: 'Hôm nay, 10:05' },
  { id: 104, product: 'Lan Hồ Điệp trắng (x2)', customer: 'Nguyễn Văn Tuấn', total: 1780000, channel: 'Hotline / Zalo', paymentMethod: 'VietQR', status: 'Đã giao', time: 'Hôm qua, 16:45' },
  { id: 105, product: 'Sen đá mix (x5), Phân bón trùn quế', customer: 'Khách lẻ tại quầy', total: 320000, channel: 'POS - Bán tại quầy', paymentMethod: 'Tiền mặt', status: 'Hoàn tất', time: 'Hôm qua, 09:20' },
  { id: 106, product: 'Monstera Deliciosa (x1)', customer: 'Phạm Thị Hằng', total: 450000, channel: 'Website', paymentMethod: 'VietQR', status: 'Hoàn tất', time: '2 ngày trước' },
  { id: 107, product: 'Dịch vụ setup cây văn phòng trọn gói', customer: 'Công ty Alpha Tech', total: 5800000, channel: 'Hotline / Zalo', paymentMethod: 'VietQR', status: 'Hoàn tất', time: '3 ngày trước' },
];

const topProducts = [
  { rank: 1, name: 'Monstera Deliciosa', sku: 'PS-CAY-001', sold: 48, revenue: 21600000, change: '+18%' },
  { rank: 2, name: 'Cây Kim Tiền', sku: 'PS-CAY-002', sold: 39, revenue: 12480000, change: '+12%' },
  { rank: 3, name: 'Bàng Singapore', sku: 'PS-CAY-003', sold: 22, revenue: 14960000, change: '+5%' },
  { rank: 4, name: 'Lan Hồ Điệp Trắng', sku: 'PS-HOA-001', sold: 27, revenue: 24030000, change: '+25%' },
  { rank: 5, name: 'Chậu gốm men mộc đục', sku: 'PS-VT-004', sold: 64, revenue: 9600000, change: '+30%' },
];

const money = (val: number) => `${new Intl.NumberFormat('vi-VN').format(val)}đ`;

interface StoredOrderItem {
  name?: string;
  quantity?: number;
}

interface StoredOrder {
  id?: number;
  items?: StoredOrderItem[];
  product?: string;
  customer?: string;
  shipping?: { name?: string };
  total?: number;
  totalPrice?: number;
  channel?: string;
  cashier?: string;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
  time?: string;
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [channelFilter, setChannelFilter] = useState('all');

  const orders = useMemo(() => {
    if (typeof window === 'undefined') return fallbackOrders;
    try {
      const stored = window.localStorage.getItem('plant_shop_orders_admin');
      if (stored) {
        const parsed = JSON.parse(stored) as StoredOrder[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: StoredOrder, idx: number) => ({
            id: item.id || idx + 200,
            product: Array.isArray(item.items)
              ? item.items.map((i: StoredOrderItem) => `${i.name || 'Cây cảnh'} (x${i.quantity || 1})`).join(', ')
              : (item.product || 'Sản phẩm cây cảnh'),
            customer: item.customer || item.shipping?.name || 'Khách vãng lai',
            total: item.total || item.totalPrice || 0,
            channel: (item.channel || (item.cashier ? 'POS - Bán tại quầy' : 'Website')) as OrderItem['channel'],
            paymentMethod: (item.paymentMethod || 'Tiền mặt') as OrderItem['paymentMethod'],
            status: (item.status === 'Hoàn tất' || item.status === 'completed' ? 'Hoàn tất' : 'Đang xử lý') as OrderItem['status'],
            time: item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : (item.time || 'Gần đây'),
          }));
        }
      }
    } catch {
      // fallback
    }
    return fallbackOrders;
  }, []);

  const filteredOrders = useMemo(() => {
    if (channelFilter === 'all') return orders;
    return orders.filter((o) => o.channel.toLowerCase().includes(channelFilter.toLowerCase()));
  }, [orders, channelFilter]);

  // Aggregate totals
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.status !== 'Đã hủy' ? o.total : 0), 0), [orders]);
  const posRevenue = useMemo(() => orders.filter((o) => o.channel.includes('POS')).reduce((sum, o) => sum + o.total, 0), [orders]);
  const onlineRevenue = useMemo(() => orders.filter((o) => !o.channel.includes('POS')).reduce((sum, o) => sum + o.total, 0), [orders]);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const completedRate = orders.length > 0 ? Math.round((orders.filter((o) => o.status === 'Hoàn tất' || o.status === 'Đã giao').length / orders.length) * 100) : 100;

  const posCount = orders.filter((o) => o.channel.includes('POS')).length;
  const onlineCount = orders.length - posCount;

  function exportReport() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Mã đơn,Khách hàng,Kênh bán,Phương thức,Tổng tiền,Thời gian,Trạng thái']
        .concat(orders.map((o) => `${o.id},"${o.customer}","${o.channel}","${o.paymentMethod}",${o.total},"${o.time}","${o.status}"`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bao_cao_doanh_thu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Phân tích & Kinh doanh
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Báo cáo doanh thu & POS</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Tổng hợp dữ liệu bán hàng trực tiếp tại quầy POS và đơn đặt hàng qua website.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#f0f3ed', padding: '3px', borderRadius: '8px', border: '1px solid #e0e6dd' }}>
            <button
              type="button"
              onClick={() => setPeriod('today')}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '6px',
                background: period === 'today' ? '#fff' : 'transparent',
                color: period === 'today' ? 'var(--primary)' : 'var(--muted)',
                fontWeight: period === 'today' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: period === 'today' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setPeriod('week')}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '6px',
                background: period === 'week' ? '#fff' : 'transparent',
                color: period === 'week' ? 'var(--primary)' : 'var(--muted)',
                fontWeight: period === 'week' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: period === 'week' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              7 ngày
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '6px',
                background: period === 'month' ? '#fff' : 'transparent',
                color: period === 'month' ? 'var(--primary)' : 'var(--muted)',
                fontWeight: period === 'month' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: period === 'month' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Tháng này
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '6px',
                background: period === 'year' ? '#fff' : 'transparent',
                color: period === 'year' ? 'var(--primary)' : 'var(--muted)',
                fontWeight: period === 'year' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: period === 'year' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Năm nay
            </button>
          </div>

          <button
            type="button"
            className="button button-outline"
            onClick={exportReport}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.75rem', fontWeight: 600 }}
          >
            📥 Xuất file Excel (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Tổng doanh thu
          </span>
          <div style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: 700, margin: '8px 0 4px', fontFamily: 'Lora, serif' }}>
            {money(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#2d8653', fontWeight: 600 }}>
            ▲ +16.8% so với kỳ trước
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Doanh thu Quầy POS
          </span>
          <div style={{ fontSize: '1.8rem', color: '#2b5e41', fontWeight: 700, margin: '8px 0 4px', fontFamily: 'Lora, serif' }}>
            {money(posRevenue)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
            {posCount} hóa đơn thu tại quầy
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Doanh thu Online Store
          </span>
          <div style={{ fontSize: '1.8rem', color: '#c4683c', fontWeight: 700, margin: '8px 0 4px', fontFamily: 'Lora, serif' }}>
            {money(onlineRevenue)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
            {onlineCount} đơn đặt hàng giao tận nơi
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Giá trị trung bình đơn (AOV)
          </span>
          <div style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: 700, margin: '8px 0 4px', fontFamily: 'Lora, serif' }}>
            {money(avgOrderValue)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#2d8653', fontWeight: 600 }}>
            Tỷ lệ hoàn tất đơn: {completedRate}%
          </div>
        </div>
      </div>

      {/* Visual Chart / Proportion Bar */}
      <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Tỷ trọng doanh thu theo kênh bán</h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Tổng hợp {orders.length} giao dịch</span>
        </div>

        <div style={{ height: '18px', width: '100%', display: 'flex', borderRadius: '9px', overflow: 'hidden', background: '#f0f0f0', marginBottom: '14px' }}>
          <div
            style={{
              width: `${totalRevenue > 0 ? (posRevenue / totalRevenue) * 100 : 50}%`,
              background: '#2b5e41',
              transition: 'width 0.3s ease',
            }}
            title="Quầy POS"
          />
          <div
            style={{
              width: `${totalRevenue > 0 ? (onlineRevenue / totalRevenue) * 100 : 50}%`,
              background: '#e07a5f',
              transition: 'width 0.3s ease',
            }}
            title="Online & Hotline"
          />
        </div>

        <div style={{ display: 'flex', gap: '28px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2b5e41' }} />
            <span>
              <strong>Quầy POS (Bán trực tiếp)</strong>: {money(posRevenue)} (
              {totalRevenue > 0 ? Math.round((posRevenue / totalRevenue) * 100) : 0}%)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e07a5f' }} />
            <span>
              <strong>Website & Hotline</strong>: {money(onlineRevenue)} (
              {totalRevenue > 0 ? Math.round((onlineRevenue / totalRevenue) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Top Products & Order Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px minmax(0, 1fr)', gap: '20px' }}>
        {/* Top 5 Products */}
        <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: 'var(--primary)' }}>Top sản phẩm bán chạy</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topProducts.map((p) => (
              <div
                key={p.sku}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #edf0eb',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: p.rank === 1 ? '#e07a5f' : p.rank === 2 ? '#2b5e41' : '#f0f3ed',
                      color: p.rank <= 2 ? '#fff' : 'var(--primary)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}
                  >
                    {p.rank}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'block' }}>{p.name}</strong>
                    <small style={{ color: 'var(--muted)', fontSize: '0.68rem' }}>{p.sku} · Đã bán: {p.sold}</small>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'block' }}>{money(p.revenue)}</strong>
                  <span style={{ fontSize: '0.66rem', color: '#2d8653', fontWeight: 600 }}>{p.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Giao dịch doanh thu gần nhất</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.72rem', borderRadius: '6px', border: '1px solid #e0e6dd', background: '#fffdf8' }}
              >
                <option value="all">Tất cả kênh</option>
                <option value="POS">Quầy POS</option>
                <option value="Website">Website</option>
                <option value="Hotline">Hotline / Zalo</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.74rem' }}>
              <thead>
                <tr style={{ background: '#f7f9f5', color: 'var(--muted)', borderBottom: '1px solid #e0e6dd' }}>
                  <th style={{ padding: '10px 12px' }}>Đơn hàng</th>
                  <th style={{ padding: '10px 12px' }}>Khách hàng</th>
                  <th style={{ padding: '10px 12px' }}>Kênh bán</th>
                  <th style={{ padding: '10px 12px' }}>Thanh toán</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Số tiền</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 8).map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #edf0eb' }}>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: 'var(--primary)' }}>#{order.id}</strong>
                      <div style={{ color: 'var(--muted)', fontSize: '0.66rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.product}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 500 }}>
                      {order.customer}
                      <div style={{ color: 'var(--muted)', fontSize: '0.64rem' }}>{order.time}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          background: order.channel.includes('POS') ? '#edf5e9' : '#fff5eb',
                          color: order.channel.includes('POS') ? '#2b5e41' : '#c4683c',
                        }}
                      >
                        {order.channel}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--muted)' }}>{order.paymentMethod}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
                      {money(order.total)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          background: order.status === 'Hoàn tất' || order.status === 'Đã giao' ? '#edf5e9' : '#fef9e7',
                          color: order.status === 'Hoàn tất' || order.status === 'Đã giao' ? '#2d8653' : '#b77a28',
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
