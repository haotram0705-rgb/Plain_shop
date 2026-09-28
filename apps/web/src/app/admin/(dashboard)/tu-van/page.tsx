'use client';

import { useEffect, useState } from 'react';

type Consultation = {
  id: string;
  name: string;
  contact: string;
  need: string;
  related: string;
  sourceUrl?: string;
  attachmentUrl?: string;
  createdAt: string;
  status: 'new' | 'processing' | 'completed';
  assignee: string;
};

const staff = ['Chưa phân công', 'Lan Nguyễn (Trưởng nhóm tư vấn)', 'Minh Đức (Kỹ sư cảnh quan)', 'Hoàng Nam (Chăm sóc khách hàng)'];

const sampleConsultations: Consultation[] = [
  {
    id: 'sample-1',
    name: 'Trần Hương Giang',
    contact: '0912 345 678',
    need: 'Chủ đề: Tư vấn chọn cây cho nhà & căn hộ\nNgân sách: 1.000.000đ – 3.000.000đ\nChi tiết: Phòng khách chung cư 30m2 hướng Tây, ban công có nắng chiều gắt, muốn chọn 1 cây lớn lọc khí và 2 chậu nhỏ để kệ tivi.',
    related: 'Cây Bàng Singapore & Trầu Bà Thanh Xuân',
    sourceUrl: '/lien-he',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'new',
    assignee: 'Chưa phân công',
  },
  {
    id: 'sample-2',
    name: 'Lê Quốc Bảo',
    contact: 'baole.arch@gmail.com',
    need: 'Chủ đề: Thiết kế ban công & sân vườn\nThời gian tiện nghe máy: Buổi chiều (13:00 - 17:00)\nNgân sách: 5.000.000đ – 10.000.000đ\nChi tiết: Cần lên phương án phủ xanh ban công dài 4m, có hệ thống tưới nhỏ giọt tự động.',
    related: 'Thiết kế cảnh quan ban công',
    sourceUrl: '/dich-vu',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'processing',
    assignee: 'Minh Đức (Kỹ sư cảnh quan)',
  },
];

export default function AdminConsultationsPage() {
  const [requests, setRequests] = useState<Consultation[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'processing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('plant_shop_consultations');
    if (raw) {
      try {
        setRequests(JSON.parse(raw) as Consultation[]);
      } catch {
        setRequests([]);
      }
    } else {
      // populate initial samples if first time
      setRequests(sampleConsultations);
      window.localStorage.setItem('plant_shop_consultations', JSON.stringify(sampleConsultations));
    }
  }, []);

  function save(next: Consultation[]) {
    setRequests(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_consultations', JSON.stringify(next));
    }
  }

  function updateField(id: string, field: 'status' | 'assignee', value: string) {
    save(
      requests.map((r) =>
        r.id === id ? ({ ...r, [field]: value } as Consultation) : r
      )
    );
  }

  function deleteRequest(id: string) {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu tư vấn này?')) {
      save(requests.filter((r) => r.id !== id));
    }
  }

  function addSampleData() {
    save([...sampleConsultations, ...requests]);
  }

  const filtered = requests.filter((r) => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.contact.toLowerCase().includes(q) ||
      (r.related && r.related.toLowerCase().includes(q)) ||
      (r.need && r.need.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const newCount = requests.filter((r) => r.status === 'new').length;
  const processingCount = requests.filter((r) => r.status === 'processing').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;

  return (
    <div className="admin-consultations">
      <div className="admin-page-title">
        <div>
          <span className="eyebrow">CRM · Yêu cầu khách hàng</span>
          <h2>Quản lý tư vấn & liên hệ</h2>
          <p>Tiếp nhận, phân công và xử lý các biểu mẫu khách hàng gửi từ trang liên hệ.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <strong style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
            {newCount} yêu cầu mới
          </strong>
          {requests.length === 0 && (
            <button className="button button-outline" type="button" onClick={addSampleData}>
              + Tạo dữ liệu mẫu
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`topic-chip ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({requests.length})
          </button>
          <button
            type="button"
            className={`topic-chip ${filterStatus === 'new' ? 'active' : ''}`}
            onClick={() => setFilterStatus('new')}
          >
            Mới ({newCount})
          </button>
          <button
            type="button"
            className={`topic-chip ${filterStatus === 'processing' ? 'active' : ''}`}
            onClick={() => setFilterStatus('processing')}
          >
            Đang xử lý ({processingCount})
          </button>
          <button
            type="button"
            className={`topic-chip ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Hoàn tất ({completedCount})
          </button>
        </div>

        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '7px 10px',
              fontSize: '0.75rem',
            }}
          />
        </div>
      </div>

      <section className="admin-table-panel">
        {filtered.length === 0 ? (
          <div className="admin-empty-state" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <span style={{ fontSize: '2rem', color: 'var(--accent)' }}>✦</span>
            <h3>Không tìm thấy yêu cầu tư vấn nào</h3>
            <p>Biểu mẫu gửi từ trang liên hệ hoặc storefront sẽ xuất hiện tại đây.</p>
            {requests.length === 0 && (
              <button
                className="button button-primary"
                type="button"
                onClick={addSampleData}
                style={{ marginTop: '12px' }}
              >
                Tải dữ liệu tư vấn mẫu
              </button>
            )}
          </div>
        ) : (
          <div className="consultation-list">
            {filtered.map((request) => {
              const phoneMatch = request.contact.match(/\d{9,11}/);
              const phone = phoneMatch ? phoneMatch[0] : '';

              return (
                <article
                  className="consultation-row"
                  key={request.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 280px',
                    gap: '20px',
                    borderBottom: '1px solid var(--border)',
                    padding: '20px 0',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span className={`status-pill status-${request.status}`}>
                        {request.status === 'new'
                          ? 'Mới'
                          : request.status === 'processing'
                          ? 'Đang xử lý'
                          : 'Hoàn tất'}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
                        {request.name}
                      </strong>
                      <small style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>
                        {request.contact}
                      </small>
                    </div>

                    <p style={{ margin: '4px 0', fontWeight: 600, color: 'var(--accent)', fontSize: '0.8rem' }}>
                      Quan tâm: {request.related || 'Tư vấn chung'}
                    </p>

                    <div
                      style={{
                        margin: '8px 0',
                        color: 'var(--foreground)',
                        fontSize: '0.78rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                        background: '#fcfbf8',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #edf0eb',
                      }}
                    >
                      {request.need}
                    </div>

                    {request.attachmentUrl && (
                      <div style={{ marginTop: '8px' }}>
                        <a
                          href={request.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--accent)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          📷 Xem ảnh không gian đính kèm ↗
                        </a>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '14px', marginTop: '10px', fontSize: '0.72rem' }}>
                      {phone && (
                        <>
                          <a
                            href={`tel:${phone}`}
                            style={{ color: 'var(--primary)', fontWeight: 600 }}
                          >
                            ☎ Gọi {phone}
                          </a>
                          <a
                            href={`https://zalo.me/${phone}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#0068ff', fontWeight: 600 }}
                          >
                            Chat Zalo ↗
                          </a>
                        </>
                      )}
                      {request.sourceUrl && (
                        <a
                          href={request.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--muted)' }}
                        >
                          Nguồn gửi: {request.sourceUrl} ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div
                    className="consultation-controls"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      background: '#f9faf7',
                      padding: '14px',
                      borderRadius: '6px',
                    }}
                  >
                    <label style={{ display: 'grid', gap: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                      Trạng thái
                      <select
                        value={request.status}
                        onChange={(event) =>
                          updateField(request.id, 'status', event.target.value)
                        }
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border)' }}
                      >
                        <option value="new">Mới</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="completed">Hoàn tất</option>
                      </select>
                    </label>

                    <label style={{ display: 'grid', gap: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                      Phân công nhân sự
                      <select
                        value={request.assignee || staff[0]}
                        onChange={(event) =>
                          updateField(request.id, 'assignee', event.target.value)
                        }
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border)' }}
                      >
                        {staff.map((person) => (
                          <option key={person} value={person}>
                            {person}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <small style={{ color: 'var(--muted)', fontSize: '0.66rem' }}>
                        {new Date(request.createdAt).toLocaleString('vi-VN')}
                      </small>
                      <button
                        type="button"
                        onClick={() => deleteRequest(request.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#d85757',
                          cursor: 'pointer',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
