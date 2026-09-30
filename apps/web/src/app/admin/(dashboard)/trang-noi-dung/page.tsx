'use client';

import { FormEvent, useMemo, useState } from 'react';

interface StaticPage {
  id: number;
  title: string;
  slug: string;
  location: 'Chân trang (Footer)' | 'Thanh điều hướng (Header)' | 'Cả hai';
  excerpt: string;
  content: string;
  status: 'Hiển thị' | 'Tạm ẩn';
  updatedAt: string;
}

const defaultPages: StaticPage[] = [
  {
    id: 1,
    title: 'Về chúng tôi · Câu chuyện Plant Shop',
    slug: 've-chung-toi',
    location: 'Cả hai',
    excerpt: 'Hành trình 5 năm đưa mảng xanh thiên nhiên vào từng căn hộ và góc làm việc của người Việt hiện đại.',
    content: 'Plant Shop được thành lập với niềm tin rằng không gian sống xanh giúp con người cân bằng cảm xúc, giảm căng thẳng và làm việc hiệu quả hơn. Chúng tôi tuyển chọn từng cây cảnh từ các nhà vườn truyền thống Sa Đéc và Đà Lạt, chăm sóc kỹ lưỡng trước khi bàn giao đến tay quý khách.',
    status: 'Hiển thị',
    updatedAt: '2026-09-22',
  },
  {
    id: 2,
    title: 'Chính sách bảo hành cây 1 đổi 1 trong 30 ngày',
    slug: 'chinh-sach-bao-hanh',
    location: 'Chân trang (Footer)',
    excerpt: 'Cam kết cây sống khỏe mạnh, đổi mới hoàn toàn miễn phí nếu cây bị suy yếu hoặc chết do lỗi kỹ thuật chăm sóc từ vườn.',
    content: '1. Thời gian áp dụng: 30 ngày kể từ ngày nhận cây.\n2. Điều kiện: Khách hàng làm theo hướng dẫn tưới nước và ánh sáng của kỹ thuật viên Plant Shop.\n3. Hỗ trợ: Đổi ngay cây mới cùng chủng loại hoặc hoàn tiền 100%.',
    status: 'Hiển thị',
    updatedAt: '2026-09-18',
  },
  {
    id: 3,
    title: 'Chính sách vận chuyển & Đóng gói an toàn',
    slug: 'chinh-sach-van-chuyen',
    location: 'Chân trang (Footer)',
    excerpt: 'Quy trình đóng thùng xốp, bọc bầu rễ và giao nhanh 2h bằng xe chuyên dụng giữ cây nguyên vẹn không gãy lá.',
    content: 'Chúng tôi hiểu rằng vận chuyển cây cảnh đòi hỏi sự nâng niu tuyệt đối. Toàn bộ chậu cây được cố định chống rung lắc và kiểm tra độ ẩm trước khi xuất kho.',
    status: 'Hiển thị',
    updatedAt: '2026-09-15',
  },
  {
    id: 4,
    title: 'Hướng dẫn thanh toán quét mã VietQR',
    slug: 'huong-dan-thanh-toan',
    location: 'Chân trang (Footer)',
    excerpt: 'Thanh toán siêu tốc 3 giây với VietQR tự động điền số tiền và nội dung đơn hàng, không lo nhập sai.',
    content: 'Chỉ cần mở bất kỳ ứng dụng ngân hàng nào (Vietcombank, MB, Techcombank, Momo...), chọn Quét QR và xác nhận chuyển khoản. Hệ thống Plant Shop tự động kích hoạt đơn hàng trong 10 giây.',
    status: 'Hiển thị',
    updatedAt: '2026-09-10',
  },
];

const emptyDraft: Omit<StaticPage, 'id' | 'updatedAt'> = {
  title: '',
  slug: '',
  location: 'Chân trang (Footer)',
  excerpt: '',
  content: '',
  status: 'Hiển thị',
};

export default function AdminStaticPagesPage() {
  const [pages, setPages] = useState<StaticPage[]>(() => {
    if (typeof window === 'undefined') return defaultPages;
    try {
      const saved = window.localStorage.getItem('plant_shop_static_pages');
      return saved ? JSON.parse(saved) as StaticPage[] : defaultPages;
    } catch {
      return defaultPages;
    }
  });

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    return pages.filter((p) => `${p.title} ${p.slug} ${p.excerpt}`.toLowerCase().includes(search.toLowerCase()));
  }, [pages, search]);

  function persist(next: StaticPage[], message: string) {
    setPages(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_static_pages', JSON.stringify(next));
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
      log.unshift({ time: new Date().toISOString(), section: 'Trang nội dung', action: message });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    }
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  }

  function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;

    const slug = draft.slug.trim() || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const today = new Date().toISOString().slice(0, 10);

    if (editingId === null) {
      persist([ { ...draft, slug, id: Date.now(), updatedAt: today }, ...pages ], `Đã tạo trang: ${draft.title}`);
    } else {
      const updated = pages.map((p) => (p.id === editingId ? { ...draft, slug, id: editingId, updatedAt: today } : p));
      persist(updated, `Đã cập nhật trang: ${draft.title}`);
    }

    setDraft(emptyDraft);
    setEditingId(null);
  }

  function startEdit(page: StaticPage) {
    setEditingId(page.id);
    setDraft({
      title: page.title,
      slug: page.slug,
      location: page.location,
      excerpt: page.excerpt,
      content: page.content,
      status: page.status,
    });
  }

  function toggleStatus(id: number) {
    const next = pages.map((p) =>
      p.id === id ? { ...p, status: (p.status === 'Hiển thị' ? 'Tạm ẩn' : 'Hiển thị') as StaticPage['status'] } : p
    );
    persist(next, 'Đổi trạng thái trang nội dung');
  }

  function deletePage(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa trang nội dung này?')) {
      persist(pages.filter((p) => p.id !== id), 'Xóa trang nội dung');
    }
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CMS Trang tĩnh & Chính sách
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Quản lý trang nội dung tĩnh</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Biên tập các trang giới thiệu, điều khoản, chính sách bảo hành và hướng dẫn mua hàng.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          Tổng cộng: <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{pages.length}</strong> trang chính sách
        </div>
      </div>

      {notice && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', fontWeight: 600 }}>
          ✦ {notice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '380px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Form Add/Edit */}
        <form onSubmit={savePage} style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '22px', position: 'sticky', top: '110px' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {editingId === null ? 'Tạo trang mới' : 'Chỉnh sửa trang'}
          </span>
          <h3 style={{ margin: '6px 0 16px', fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
            {editingId === null ? 'Soạn thảo trang' : 'Cập nhật nội dung'}
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tiêu đề trang *
              </label>
              <input
                type="text"
                placeholder="VD: Chính sách bảo hành cây cảnh..."
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Đường dẫn tĩnh (Slug URL)
              </label>
              <input
                type="text"
                placeholder="chinh-sach-bao-hanh"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Vị trí liên kết
                </label>
                <select
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value as StaticPage['location'] })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
                >
                  <option value="Chân trang (Footer)">Chân trang (Footer)</option>
                  <option value="Thanh điều hướng (Header)">Thanh điều hướng (Header)</option>
                  <option value="Cả hai">Cả hai</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Trạng thái
                </label>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as StaticPage['status'] })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
                >
                  <option value="Hiển thị">Hiển thị</option>
                  <option value="Tạm ẩn">Tạm ẩn</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tóm tắt giới thiệu
              </label>
              <textarea
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                rows={2}
                placeholder="Mô tả ngắn hiển thị dưới tiêu đề..."
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Nội dung chi tiết
              </label>
              <textarea
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                rows={6}
                placeholder="Soạn thảo các điều khoản hoặc nội dung trang..."
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit" className="button button-primary" style={{ flex: 1, padding: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                {editingId === null ? '✦ Xuất bản trang' : '💾 Lưu chỉnh sửa'}
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

        {/* Pages Table */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', border: '1px solid #e0e6dd', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm trang nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.78rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((page) => (
              <div
                key={page.id}
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
                      {page.location}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
                      {page.title}
                    </h4>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginBottom: '8px' }}>
                    🔗 /{page.slug} · <span style={{ color: 'var(--muted)' }}>Cập nhật: {page.updatedAt}</span>
                  </div>

                  <p style={{ margin: '0 0 10px', fontSize: '0.74rem', color: 'var(--foreground)', lineHeight: 1.5 }}>
                    {page.excerpt}
                  </p>

                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', background: '#fafbf8', padding: '8px 12px', borderRadius: '6px', border: '1px solid #edf0eb', whiteSpace: 'pre-line', maxHeight: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {page.content}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', minWidth: '110px' }}>
                  <button
                    type="button"
                    onClick={() => toggleStatus(page.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.66rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: page.status === 'Hiển thị' ? '#edf5e9' : '#fff5eb',
                      color: page.status === 'Hiển thị' ? '#2d8653' : '#c4683c',
                    }}
                  >
                    {page.status}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => startEdit(page)}
                      style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Sửa
                    </button>
                    <span style={{ color: '#ccc' }}>·</span>
                    <button
                      type="button"
                      onClick={() => deletePage(page.id)}
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

