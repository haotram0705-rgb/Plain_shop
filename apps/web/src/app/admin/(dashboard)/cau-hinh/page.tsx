'use client';

import { FormEvent, useState } from 'react';

interface SystemConfig {
  storeName: string;
  storeSlogan: string;
  hotline: string;
  email: string;
  address: string;
  workingHours: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  bankQrNote: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  estimatedDelivery: string;
  posTerminalName: string;
  receiptPaperSize: '80mm' | '58mm';
  receiptFooterNote: string;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  soundAlerts: boolean;
}

const defaultConfig: SystemConfig = {
  storeName: 'Plant Shop - Cây Cảnh & Không Gian Xanh',
  storeSlogan: 'Kiến tạo không gian xanh thuần khiết cho ngôi nhà của bạn',
  hotline: '1900 8888',
  email: 'support@plantshop.vn',
  address: '268 Lý Thường Kiệt, Phường 14, Quận 10, TP. Hồ Chí Minh',
  workingHours: '08:00 - 21:00 (Thứ 2 - Chủ Nhật)',
  bankName: 'Vietcombank (Ngân hàng Ngoại Thương)',
  bankAccount: '1029 3847 56',
  bankHolder: 'CONG TY TNHH PLANT SHOP VIET NAM',
  bankQrNote: 'PLANT [MaDonHang] [SoDienThoai]',
  standardShippingFee: 30000,
  freeShippingThreshold: 500000,
  estimatedDelivery: 'Giao nhanh 2 - 4h nội thành HCM · 1 - 2 ngày toàn quốc',
  posTerminalName: 'Quầy thu ngân 01 - Showroom Q.10',
  receiptPaperSize: '80mm',
  receiptFooterNote: 'Cảm ơn quý khách đã mua sắm tại Plant Shop! Bảo hành cây 1 đổi 1 trong 30 ngày.',
  maintenanceMode: false,
  allowGuestCheckout: true,
  soundAlerts: true,
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SystemConfig>(() => {
    if (typeof window === 'undefined') return defaultConfig;
    try {
      const saved = window.localStorage.getItem('plant_shop_system_config');
      return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'banking' | 'shipping' | 'pos' | 'system'>('general');
  const [notice, setNotice] = useState('');

  function saveConfig(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_system_config', JSON.stringify(config));
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
      log.unshift({ time: new Date().toISOString(), section: 'Cấu hình', action: 'Cập nhật thiết lập hệ thống' });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    }
    setNotice('Đã lưu cấu hình hệ thống thành công!');
    setTimeout(() => setNotice(''), 3000);
  }

  function resetToDefault() {
    if (window.confirm('Khôi phục cấu hình hệ thống về mặc định ban đầu?')) {
      setConfig(defaultConfig);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('plant_shop_system_config', JSON.stringify(defaultConfig));
      }
      setNotice('Đã khôi phục thiết lập mặc định.');
      setTimeout(() => setNotice(''), 3000);
    }
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hệ thống · Quản trị
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Cấu hình hệ thống</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Quản lý thông tin cửa hàng, cổng VietQR, vận chuyển, quầy POS và bảo trì.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToDefault}
          style={{
            border: '1px solid #d88',
            background: '#fff',
            color: '#c44',
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Khôi phục mặc định
        </button>
      </div>

      {notice && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
          ✦ {notice}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e0e6dd', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'general' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'general' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'general' ? 700 : 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          🌿 Thông tin cửa hàng
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('banking')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'banking' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'banking' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'banking' ? 700 : 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          💳 Tài khoản & VietQR
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'shipping' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'shipping' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'shipping' ? 700 : 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          🚚 Vận chuyển & Giao hàng
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pos')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'pos' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'pos' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'pos' ? 700 : 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          ⚡ Quầy POS & Hóa đơn
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('system')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'system' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'system' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'system' ? 700 : 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          ⚙️ Vận hành hệ thống
        </button>
      </div>

      <form onSubmit={saveConfig} style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '12px', padding: '28px' }}>
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gap: '18px' }}>
            <h3 style={{ margin: '0 0 10px', color: 'var(--primary)', fontSize: '1.15rem' }}>Thông tin liên hệ & Thương hiệu</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Tên thương hiệu / Cửa hàng
                </label>
                <input
                  type="text"
                  value={config.storeName}
                  onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Slogan hiển thị
                </label>
                <input
                  type="text"
                  value={config.storeSlogan}
                  onChange={(e) => setConfig({ ...config, storeSlogan: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Hotline bán hàng & CSKH
                </label>
                <input
                  type="text"
                  value={config.hotline}
                  onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Email tiếp nhận đơn
                </label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                Địa chỉ showroom chính & vườn ươm
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                Khung giờ hoạt động
              </label>
              <input
                type="text"
                value={config.workingHours}
                onChange={(e) => setConfig({ ...config, workingHours: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Banking */}
        {activeTab === 'banking' && (
          <div style={{ display: 'grid', gap: '18px' }}>
            <h3 style={{ margin: '0 0 10px', color: 'var(--primary)', fontSize: '1.15rem' }}>Tài khoản ngân hàng & VietQR nhận thanh toán</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Ngân hàng thụ hưởng
                </label>
                <input
                  type="text"
                  value={config.bankName}
                  onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Số tài khoản nhận tiền
                </label>
                <input
                  type="text"
                  value={config.bankAccount}
                  onChange={(e) => setConfig({ ...config, bankAccount: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Tên chủ tài khoản (In hoa không dấu)
                </label>
                <input
                  type="text"
                  value={config.bankHolder}
                  onChange={(e) => setConfig({ ...config, bankHolder: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Cú pháp nội dung chuyển khoản gợi ý
                </label>
                <input
                  type="text"
                  value={config.bankQrNote}
                  onChange={(e) => setConfig({ ...config, bankQrNote: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div style={{ background: '#f5f7f2', border: '1px dashed #2b5e41', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '2rem' }}>📱</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', lineHeight: 1.5 }}>
                Thông tin này sẽ được đồng bộ trực tiếp lên mã QR động ở trang <strong>Thanh toán Storefront</strong> và máy bán hàng <strong>POS Quầy thu ngân</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Shipping */}
        {activeTab === 'shipping' && (
          <div style={{ display: 'grid', gap: '18px' }}>
            <h3 style={{ margin: '0 0 10px', color: 'var(--primary)', fontSize: '1.15rem' }}>Biểu phí và thời gian giao hàng</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Phí ship cố định (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={config.standardShippingFee}
                  onChange={(e) => setConfig({ ...config, standardShippingFee: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
                <small style={{ color: 'var(--muted)', fontSize: '0.66rem' }}>Áp dụng cho đơn chưa đủ điều kiện miễn phí ship</small>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Ngưỡng miễn phí vận chuyển (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={config.freeShippingThreshold}
                  onChange={(e) => setConfig({ ...config, freeShippingThreshold: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
                <small style={{ color: 'var(--muted)', fontSize: '0.66rem' }}>Đơn hàng đạt giá trị này sẽ tự động giảm phí ship về 0đ</small>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                Thông điệp cam kết thời gian giao cây
              </label>
              <input
                type="text"
                value={config.estimatedDelivery}
                onChange={(e) => setConfig({ ...config, estimatedDelivery: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
              />
            </div>
          </div>
        )}

        {/* Tab 4: POS */}
        {activeTab === 'pos' && (
          <div style={{ display: 'grid', gap: '18px' }}>
            <h3 style={{ margin: '0 0 10px', color: 'var(--primary)', fontSize: '1.15rem' }}>Thiết lập máy in & Quầy thu ngân POS</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Tên quầy thu ngân mặc định
                </label>
                <input
                  type="text"
                  value={config.posTerminalName}
                  onChange={(e) => setConfig({ ...config, posTerminalName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                  Khổ giấy in hóa đơn nhiệt
                </label>
                <select
                  value={config.receiptPaperSize}
                  onChange={(e) => setConfig({ ...config, receiptPaperSize: e.target.value as '80mm' | '58mm' })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                >
                  <option value="80mm">Khổ K80 (80mm - Tiêu chuẩn siêu thị / showroom)</option>
                  <option value="58mm">Khổ K57 / K58 (58mm - Máy in mini cầm tay)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}>
                Lời chúc / Ghi chú chân hóa đơn in ra
              </label>
              <textarea
                value={config.receiptFooterNote}
                onChange={(e) => setConfig({ ...config, receiptFooterNote: e.target.value })}
                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
              />
            </div>
          </div>
        )}

        {/* Tab 5: System */}
        {activeTab === 'system' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            <h3 style={{ margin: '0 0 10px', color: 'var(--primary)', fontSize: '1.15rem' }}>Vận hành & Trải nghiệm khách hàng</h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#fbfcf9', border: '1px solid #e0e6dd', borderRadius: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'block' }}>Chế độ bảo trì hệ thống</strong>
                <small style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Tạm dừng đón khách trên storefront để nâng cấp máy chủ.</small>
              </div>
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#fbfcf9', border: '1px solid #e0e6dd', borderRadius: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'block' }}>Cho phép thanh toán nhanh không cần đăng nhập</strong>
                <small style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Khách mua lẻ có thể nhập địa chỉ và đặt hàng ngay (Guest Checkout).</small>
              </div>
              <input
                type="checkbox"
                checked={config.allowGuestCheckout}
                onChange={(e) => setConfig({ ...config, allowGuestCheckout: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#fbfcf9', border: '1px solid #e0e6dd', borderRadius: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'block' }}>Phát chuông thông báo đơn hàng mới</strong>
                <small style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Phát âm thanh thông báo trên màn hình POS khi có đơn online hoặc khách tư vấn.</small>
              </div>
              <input
                type="checkbox"
                checked={config.soundAlerts}
                onChange={(e) => setConfig({ ...config, soundAlerts: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>
        )}

        <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #edf0eb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="button button-primary" style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 600 }}>
            💾 Lưu cấu hình
          </button>
        </div>
      </form>
    </div>
  );
}
