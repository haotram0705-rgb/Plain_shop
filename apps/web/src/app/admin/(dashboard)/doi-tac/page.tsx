'use client';

import { FormEvent, useMemo, useState } from 'react';

interface PartnerItem {
  id: number;
  name: string;
  category: 'Nhà vườn cây giống' | 'Chậu gốm & Vật tư' | 'Vận chuyển & Logistics' | 'Khách hàng B2B';
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  discountRate: string;
  status: 'Đang hợp tác' | 'Tạm ngưng';
  note: string;
}

const defaultPartners: PartnerItem[] = [
  {
    id: 1,
    name: 'Vườn Ươm Cây Giống Sa Đéc',
    category: 'Nhà vườn cây giống',
    contactPerson: 'Bác Ba Cảnh',
    phone: '0913 456 789',
    email: 'vuonuomsadec@gmail.com',
    address: 'Làng hoa Sa Đéc, Đồng Tháp',
    discountRate: 'Chiết khấu 30% sỉ',
    status: 'Đang hợp tác',
    note: 'Cung cấp Monstera, Kim Tiền, Cây Cảnh lá đột biến số lượng lớn hàng tuần.',
  },
  {
    id: 2,
    name: 'Xưởng Gốm Mộc Bát Tràng & Bình Dương',
    category: 'Chậu gốm & Vật tư',
    contactPerson: 'Anh Trần Hùng',
    phone: '0908 123 456',
    email: 'gombattrang.order@gmail.com',
    address: 'Lò gốm Lái Thiêu, Bình Dương',
    discountRate: 'Chiết khấu 25%',
    status: 'Đang hợp tác',
    note: 'Gia công chậu đất nung, chậu men mát mộc độc quyền theo thiết kế Plant Shop.',
  },
  {
    id: 3,
    name: 'Ahamove & Giao Hàng Tiết Kiệm (GHTK)',
    category: 'Vận chuyển & Logistics',
    contactPerson: 'Bộ phận Hỗ trợ Đối tác Doanh nghiệp',
    phone: '1900 545411',
    email: 'support@ahamove.com',
    address: 'Toàn quốc',
    discountRate: 'Giá doanh nghiệp VIP 2',
    status: 'Đang hợp tác',
    note: 'Giao nhanh hỏa tốc 2h cây to bằng xe bán tải, xe ba gác có che chắn an toàn rễ.',
  },
  {
    id: 4,
    name: 'Công ty Công nghệ Alpha Software Việt Nam',
    category: 'Khách hàng B2B',
    contactPerson: 'Chị Mai Anh (HR Manager)',
    phone: '0977 889 900',
    email: 'maianh@alphasoftware.vn',
    address: 'Tầng 12, Bitexco Financial Tower, Q.1, TP.HCM',
    discountRate: 'Hợp đồng thuê cây 12 tháng',
    status: 'Đang hợp tác',
    note: 'Hợp đồng thuê 45 chậu cây văn phòng và bảo dưỡng 2 tuần/lần.',
  },
];

const emptyDraft: Omit<PartnerItem, 'id'> = {
  name: '',
  category: 'Nhà vườn cây giống',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  discountRate: '',
  status: 'Đang hợp tác',
  note: '',
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>(() => {
    if (typeof window === 'undefined') return defaultPartners;
    try {
      const saved = window.localStorage.getItem('plant_shop_partners');
      return saved ? JSON.parse(saved) as PartnerItem[] : defaultPartners;
    } catch {
      return defaultPartners;
    }
  });

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      const matchText = `${p.name} ${p.contactPerson} ${p.phone} ${p.email} ${p.address}`.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'Tất cả' || p.category === categoryFilter;
      return matchText && matchCat;
    });
  }, [partners, search, categoryFilter]);

  function persist(next: PartnerItem[], message: string) {
    setPartners(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_partners', JSON.stringify(next));
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
      log.unshift({ time: new Date().toISOString(), section: 'Đối tác', action: message });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    }
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  }

  function savePartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) return;

    if (editingId === null) {
      persist([ { ...draft, id: Date.now() }, ...partners ], `Đã thêm đối tác: ${draft.name}`);
    } else {
      const updated = partners.map((p) => (p.id === editingId ? { ...draft, id: editingId } : p));
      persist(updated, `Đã cập nhật đối tác: ${draft.name}`);
    }

    setDraft(emptyDraft);
    setEditingId(null);
  }

  function startEdit(partner: PartnerItem) {
    setEditingId(partner.id);
    setDraft({
      name: partner.name,
      category: partner.category,
      contactPerson: partner.contactPerson,
      phone: partner.phone,
      email: partner.email,
      address: partner.address,
      discountRate: partner.discountRate,
      status: partner.status,
      note: partner.note,
    });
  }

  function toggleStatus(id: number) {
    const next = partners.map((p) =>
      p.id === id ? { ...p, status: (p.status === 'Đang hợp tác' ? 'Tạm ngưng' : 'Đang hợp tác') as PartnerItem['status'] } : p
    );
    persist(next, 'Đổi trạng thái đối tác');
  }

  function deletePartner(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa đối tác này?')) {
      persist(partners.filter((p) => p.id !== id), 'Xóa đối tác');
    }
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hệ sinh thái & Liên kết B2B
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Quản lý đối tác & Nhà cung ứng</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Kết nối nhà vườn cây giống, xưởng gốm sứ, đơn vị vận chuyển và khách hàng doanh nghiệp.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          Tổng cộng: <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{partners.length}</strong> đơn vị đối tác
        </div>
      </div>

      {notice && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', fontWeight: 600 }}>
          ✦ {notice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Form Add/Edit */}
        <form onSubmit={savePartner} style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '22px', position: 'sticky', top: '110px' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {editingId === null ? 'Hồ sơ đối tác mới' : 'Chỉnh sửa đối tác'}
          </span>
          <h3 style={{ margin: '6px 0 16px', fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
            {editingId === null ? 'Thêm đối tác' : 'Cập nhật đối tác'}
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tên công ty / Đơn vị *
              </label>
              <input
                type="text"
                placeholder="VD: Vườn ươm Sa Đéc..."
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Phân loại đối tác
              </label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as PartnerItem['category'] })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
              >
                <option value="Nhà vườn cây giống">Nhà vườn cây giống</option>
                <option value="Chậu gốm & Vật tư">Chậu gốm & Vật tư</option>
                <option value="Vận chuyển & Logistics">Vận chuyển & Logistics</option>
                <option value="Khách hàng B2B">Khách hàng B2B</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Người đại diện
                </label>
                <input
                  type="text"
                  placeholder="Họ và tên..."
                  value={draft.contactPerson}
                  onChange={(e) => setDraft({ ...draft, contactPerson: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="0912..."
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Email liên hệ
                </label>
                <input
                  type="email"
                  placeholder="partner@..."
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Chính sách / Chiết khấu
                </label>
                <input
                  type="text"
                  placeholder="VD: Chiết khấu 25%"
                  value={draft.discountRate}
                  onChange={(e) => setDraft({ ...draft, discountRate: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Địa chỉ trụ sở / Kho
              </label>
              <input
                type="text"
                placeholder="Tỉnh/Thành phố..."
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Ghi chú nội dung hợp tác
              </label>
              <textarea
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                rows={3}
                placeholder="Năng lực cung ứng, tần suất nhập hàng..."
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit" className="button button-primary" style={{ flex: 1, padding: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                {editingId === null ? '✦ Thêm đối tác' : '💾 Lưu chỉnh sửa'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setDraft(emptyDraft); }}
                  className="button button-outline"
                  style={{ padding: '10px 14px', fontSize: '0.75rem' }}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Partners Table */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', border: '1px solid #e0e6dd', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Tìm tên đối tác, người liên hệ, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.78rem' }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #e0e6dd', background: '#fffdf8', fontSize: '0.72rem' }}
            >
              <option value="Tất cả">Tất cả phân loại</option>
              <option value="Nhà vườn cây giống">Nhà vườn cây giống</option>
              <option value="Chậu gốm & Vật tư">Chậu gốm & Vật tư</option>
              <option value="Vận chuyển & Logistics">Vận chuyển & Logistics</option>
              <option value="Khách hàng B2B">Khách hàng B2B</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((partner) => (
              <div
                key={partner.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e0e6dd',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: '#edf5e9',
                        color: '#2b5e41',
                        fontSize: '0.66rem',
                        fontWeight: 600,
                      }}
                    >
                      {partner.category}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
                      {partner.name}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.72rem', color: 'var(--muted)', margin: '8px 0' }}>
                    <span>👤 Đại diện: <strong style={{ color: 'var(--primary)' }}>{partner.contactPerson}</strong></span>
                    <span>📞 Điện thoại: <a href={`tel:${partner.phone}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{partner.phone}</a></span>
                    {partner.email && <span>✉️ Email: {partner.email}</span>}
                    <span>📍 Địa chỉ: {partner.address}</span>
                  </div>

                  {partner.discountRate && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>
                      🏷️ {partner.discountRate}
                    </div>
                  )}

                  {partner.note && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--foreground)', background: '#fbfcf9', padding: '8px 12px', borderRadius: '6px', border: '1px solid #edf0eb' }}>
                      {partner.note}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', minWidth: '120px' }}>
                  <button
                    type="button"
                    onClick={() => toggleStatus(partner.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.66rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: partner.status === 'Đang hợp tác' ? '#edf5e9' : '#fff5eb',
                      color: partner.status === 'Đang hợp tác' ? '#2d8653' : '#c4683c',
                    }}
                  >
                    {partner.status}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => startEdit(partner)}
                      style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Sửa
                    </button>
                    <span style={{ color: '#ccc' }}>·</span>
                    <button
                      type="button"
                      onClick={() => deletePartner(partner.id)}
                      style={{ border: 'none', background: 'none', color: '#c44', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
