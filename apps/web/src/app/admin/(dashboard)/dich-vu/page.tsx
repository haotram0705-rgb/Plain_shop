'use client';

import { FormEvent, useMemo, useState } from 'react';

interface ServiceItem {
  id: number;
  title: string;
  category: 'Cho thuê cây' | 'Thiết kế thi công' | 'Chăm sóc định kỳ' | 'Bác sĩ cây cảnh';
  priceDisplay: string;
  billingCycle: 'Tháng' | 'Lần' | 'm²' | 'Gói';
  shortDesc: string;
  features: string[];
  status: 'Đang cung cấp' | 'Tạm ngưng';
  icon: string;
}

const defaultServices: ServiceItem[] = [
  {
    id: 1,
    title: 'Cho thuê cây cảnh văn phòng & sự kiện',
    category: 'Cho thuê cây',
    priceDisplay: 'Từ 150.000đ',
    billingCycle: 'Tháng',
    shortDesc: 'Giải pháp mảng xanh trọn gói cho công ty, ngân hàng, showroom mà không lo chi phí bảo quản hay cây héo úa.',
    features: ['Miễn phí khảo sát không gian', 'Định kỳ 2 tuần kỹ thuật viên đến chăm sóc', 'Đổi cây mới miễn phí nếu cây suy yếu'],
    status: 'Đang cung cấp',
    icon: '🏢',
  },
  {
    id: 2,
    title: 'Thiết kế & Thi công cảnh quan ban công sân vườn',
    category: 'Thiết kế thi công',
    priceDisplay: 'Từ 1.200.000đ',
    billingCycle: 'm²',
    shortDesc: 'Biến ban công chung cư và sân thượng thành ốc đảo nhiệt đới với giàn leo, sàn gỗ composite và hệ thống tưới tự động.',
    features: ['Bản vẽ 3D phối cảnh trước khi làm', 'Bảo hành cây sống 60 ngày', 'Lắp đặt hệ thống tưới nhỏ giọt thông minh'],
    status: 'Đang cung cấp',
    icon: '🌿',
  },
  {
    id: 3,
    title: 'Chăm sóc & Phục hồi cây cảnh định kỳ tại nhà',
    category: 'Chăm sóc định kỳ',
    priceDisplay: '350.000đ',
    billingCycle: 'Lần',
    shortDesc: 'Dành cho gia chủ bận rộn: kiểm tra sức khỏe cây, cắt tỉa lá úa, bón phân vi sinh và xịt phòng trừ sâu bệnh hữu cơ.',
    features: ['Vệ sinh tán lá sạch bụi mịn', 'Bón phân hữu cơ vi sinh', 'Đo độ ẩm và kiểm tra độ thoát nước rễ'],
    status: 'Đang cung cấp',
    icon: '✂️',
  },
  {
    id: 4,
    title: 'Bác sĩ cây cảnh & Thay đất thay chậu',
    category: 'Bác sĩ cây cảnh',
    priceDisplay: '200.000đ',
    billingCycle: 'Lần',
    shortDesc: 'Cứu chữa các cây bị úng rễ, vàng lá, rệp sáp trắng hoặc rễ bám chặt cần sang chậu mới kích thước lớn hơn.',
    features: ['Sát khuẩn rễ và xử lý thối rễ', 'Đất trộn chuyên dụng giàu perlite', 'Kèm thuốc kích rễ sinh học'],
    status: 'Đang cung cấp',
    icon: '🩺',
  },
];

const emptyDraft: Omit<ServiceItem, 'id'> = {
  title: '',
  category: 'Cho thuê cây',
  priceDisplay: '',
  billingCycle: 'Tháng',
  shortDesc: '',
  features: [''],
  status: 'Đang cung cấp',
  icon: '🌱',
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    if (typeof window === 'undefined') return defaultServices;
    try {
      const saved = window.localStorage.getItem('plant_shop_services');
      return saved ? JSON.parse(saved) as ServiceItem[] : defaultServices;
    } catch {
      return defaultServices;
    }
  });

  const [draft, setDraft] = useState(emptyDraft);
  const [featureInputs, setFeatureInputs] = useState<string[]>(['', '', '']);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    return services.filter((s) => `${s.title} ${s.category} ${s.shortDesc}`.toLowerCase().includes(query.toLowerCase()));
  }, [services, query]);

  function persist(next: ServiceItem[], message: string) {
    setServices(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_services', JSON.stringify(next));
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
      log.unshift({ time: new Date().toISOString(), section: 'Dịch vụ', action: message });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    }
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  }

  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;

    const cleanFeatures = featureInputs.filter((f) => f.trim().length > 0);

    if (editingId === null) {
      const newService: ServiceItem = {
        ...draft,
        features: cleanFeatures.length > 0 ? cleanFeatures : ['Chăm sóc tận tâm', 'Bảo hành cây xanh'],
        id: Date.now(),
      };
      persist([...services, newService], `Đã thêm dịch vụ: ${draft.title}`);
    } else {
      const updated = services.map((s) => (s.id === editingId ? { ...draft, features: cleanFeatures, id: editingId } : s));
      persist(updated, `Đã cập nhật dịch vụ: ${draft.title}`);
    }

    setDraft(emptyDraft);
    setFeatureInputs(['', '', '']);
    setEditingId(null);
  }

  function startEdit(service: ServiceItem) {
    setEditingId(service.id);
    setDraft({
      title: service.title,
      category: service.category,
      priceDisplay: service.priceDisplay,
      billingCycle: service.billingCycle,
      shortDesc: service.shortDesc,
      features: service.features,
      status: service.status,
      icon: service.icon,
    });
    setFeatureInputs(service.features.length > 0 ? [...service.features] : ['', '', '']);
  }

  function toggleStatus(id: number) {
    const next = services.map((s) =>
      s.id === id ? { ...s, status: (s.status === 'Đang cung cấp' ? 'Tạm ngưng' : 'Đang cung cấp') as ServiceItem['status'] } : s
    );
    persist(next, 'Thay đổi trạng thái dịch vụ');
  }

  function deleteService(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
      const next = services.filter((s) => s.id !== id);
      persist(next, 'Xóa dịch vụ');
    }
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Giải pháp & Dịch vụ B2B / B2C
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Quản lý dịch vụ cây cảnh</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Quản lý các gói cho thuê cây văn phòng, thi công cảnh quan và chăm sóc cây tận nơi.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          Đang kích hoạt: <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{services.filter((s) => s.status === 'Đang cung cấp').length}</strong>/{services.length} gói dịch vụ
        </div>
      </div>

      {notice && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', fontWeight: 600 }}>
          ✦ {notice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Form Add/Edit */}
        <form onSubmit={saveService} style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '22px', position: 'sticky', top: '110px' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {editingId === null ? 'Gói dịch vụ mới' : 'Chỉnh sửa gói'}
          </span>
          <h3 style={{ margin: '6px 0 16px', fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
            {editingId === null ? 'Thêm dịch vụ' : 'Cập nhật dịch vụ'}
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tên dịch vụ *
              </label>
              <input
                type="text"
                placeholder="VD: Cho thuê cây văn phòng..."
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Phân loại
                </label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as ServiceItem['category'] })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
                >
                  <option value="Cho thuê cây">Cho thuê cây</option>
                  <option value="Thiết kế thi công">Thiết kế thi công</option>
                  <option value="Chăm sóc định kỳ">Chăm sóc định kỳ</option>
                  <option value="Bác sĩ cây cảnh">Bác sĩ cây cảnh</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Icon biểu trưng
                </label>
                <input
                  type="text"
                  value={draft.icon}
                  onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Giá tham khảo
                </label>
                <input
                  type="text"
                  placeholder="Từ 150.000đ"
                  value={draft.priceDisplay}
                  onChange={(e) => setDraft({ ...draft, priceDisplay: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Chu kỳ tính
                </label>
                <select
                  value={draft.billingCycle}
                  onChange={(e) => setDraft({ ...draft, billingCycle: e.target.value as ServiceItem['billingCycle'] })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
                >
                  <option value="Tháng">/ Tháng</option>
                  <option value="Lần">/ Lần</option>
                  <option value="m²">/ m²</option>
                  <option value="Gói">/ Gói trọn gói</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Mô tả giải pháp
              </label>
              <textarea
                value={draft.shortDesc}
                onChange={(e) => setDraft({ ...draft, shortDesc: e.target.value })}
                rows={3}
                placeholder="Giới thiệu lợi ích dịch vụ..."
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Các quyền lợi chính (3 ý)
              </label>
              {featureInputs.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Quyền lợi ${idx + 1}...`}
                  value={val}
                  onChange={(e) => {
                    const next = [...featureInputs];
                    next[idx] = e.target.value;
                    setFeatureInputs(next);
                  }}
                  style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem', marginBottom: '6px' }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit" className="button button-primary" style={{ flex: 1, padding: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                {editingId === null ? '✦ Tạo gói dịch vụ' : '💾 Lưu dịch vụ'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setDraft(emptyDraft); setFeatureInputs(['', '', '']); }}
                  className="button button-outline"
                  style={{ padding: '10px 14px', fontSize: '0.75rem' }}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Services List */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', border: '1px solid #e0e6dd', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm gói dịch vụ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.78rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {filtered.map((service) => (
              <div
                key={service.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e0e6dd',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.6rem', padding: '8px', background: '#f5f7f2', borderRadius: '8px' }}>
                        {service.icon}
                      </span>
                      <div>
                        <span style={{ fontSize: '0.66rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                          {service.category}
                        </span>
                        <h4 style={{ margin: '2px 0 0', fontSize: '1.05rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
                          {service.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleStatus(service.id)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '0.64rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: service.status === 'Đang cung cấp' ? '#edf5e9' : '#fff5eb',
                        color: service.status === 'Đang cung cấp' ? '#2d8653' : '#c4683c',
                      }}
                    >
                      {service.status}
                    </button>
                  </div>

                  <div style={{ margin: '8px 0 14px', fontSize: '1.25rem', color: 'var(--accent)', fontWeight: 700 }}>
                    {service.priceDisplay} <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 400 }}>/{service.billingCycle}</span>
                  </div>

                  <p style={{ margin: '0 0 14px', fontSize: '0.74rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    {service.shortDesc}
                  </p>

                  <div style={{ borderTop: '1px solid #f0f3ed', paddingTop: '12px', marginBottom: '16px' }}>
                    {service.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '6px' }}>
                        <span style={{ color: '#2d8653', fontWeight: 700 }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #edf0eb', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => startEdit(service)}
                    style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteService(service.id)}
                    style={{ border: 'none', background: 'none', color: '#c44', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
