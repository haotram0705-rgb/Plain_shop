'use client';

import { FormEvent, useMemo, useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: 'Cẩm nang chăm sóc' | 'Phong thủy cây xanh' | 'Không gian sống' | 'Xu hướng & Đời sống';
  summary: string;
  content: string;
  author: string;
  views: number;
  status: 'Đã xuất bản' | 'Bản nháp';
  coverImage: string;
  publishedAt: string;
}

const defaultArticles: Article[] = [
  {
    id: 1,
    title: 'Cách chăm sóc Monstera lá xẻ luôn xanh tốt trong phòng máy lạnh',
    slug: 'cach-cham-soc-monstera-trong-phong-may-lanh',
    category: 'Cẩm nang chăm sóc',
    summary: 'Monstera là loại cây nhiệt đới rất được ưa chuộng, nhưng khi đặt trong môi trường máy lạnh khô và kín, bạn cần lưu ý kỹ thuật tưới và phun ẩm.',
    content: '1. Ánh sáng: Đặt cây gần cửa sổ có ánh sáng gián tiếp.\n2. Tưới nước: Chỉ tưới khi lớp đất mặt đã khô khoảng 3-5cm.\n3. Độ ẩm: Thường xuyên phun sương quanh tán lá.',
    author: 'Nguyễn Thanh Tùng',
    views: 1420,
    status: 'Đã xuất bản',
    coverImage: '/assets/images/prod-monstera.jpg',
    publishedAt: '2026-09-20',
  },
  {
    id: 2,
    title: 'Top 5 cây cảnh phong thủy chiêu tài hút lộc cho bàn làm việc 2026',
    slug: 'top-5-cay-phong-thuy-chieu-tai-ban-lam-viec',
    category: 'Phong thủy cây xanh',
    summary: 'Điểm danh các loại cây mang năng lượng tích cực như Kim Tiền, Ngọc Ngân, Kim Ngân, giúp gia chủ hanh thông sự nghiệp và tài lộc.',
    content: 'Cây phong thủy để bàn không chỉ làm đẹp góc làm việc mà còn thanh lọc sóng điện từ phát ra từ máy vi tính.',
    author: 'Lan Nguyễn',
    views: 2890,
    status: 'Đã xuất bản',
    coverImage: '/assets/images/prod-snake-plant.jpg',
    publishedAt: '2026-09-15',
  },
  {
    id: 3,
    title: 'Bí quyết chọn đất và chậu gốm thoát nước tốt tránh úng rễ',
    slug: 'bi-quyet-chon-dat-va-chau-gom-thoat-nuoc',
    category: 'Cẩm nang chăm sóc',
    summary: 'Úng rễ là nguyên nhân hàng đầu khiến cây trồng trong nhà bị vàng lá và chết. Tìm hiểu tỷ lệ pha trộn giá thể perlite, pumice và đất dinh dưỡng.',
    content: 'Một hỗn hợp giá thể chuẩn cần đảm bảo độ tơi xốp, giữ ẩm vừa phải và thoát nước cực nhanh trong vòng 10 giây.',
    author: 'Trần Văn Bảo',
    views: 980,
    status: 'Đã xuất bản',
    coverImage: '/assets/images/prod-fiddle-leaf.jpg',
    publishedAt: '2026-09-10',
  },
  {
    id: 4,
    title: 'Xu hướng thiết kế mảng xanh ban công chung cư hiện đại',
    slug: 'xu-huong-thiet-ke-mang-xanh-ban-cong',
    category: 'Không gian sống',
    summary: 'Biến góc ban công nhỏ hẹp chỉ 2-3m2 thành một khu vườn nhiệt đới thu nhỏ thư giãn sau những giờ làm việc căng thẳng.',
    content: 'Kết hợp kệ gỗ thông nhiều tầng, giàn leo và các chậu cây chịu nắng tốt như Trầu bà lá xẻ, Cọ ta, Hoa nhài.',
    author: 'KTS Lê Hoàng Nam',
    views: 650,
    status: 'Bản nháp',
    coverImage: '/assets/images/prod-peace-lily.jpg',
    publishedAt: '2026-09-25',
  },
];

const emptyDraft: Omit<Article, 'id' | 'views'> = {
  title: '',
  slug: '',
  category: 'Cẩm nang chăm sóc',
  summary: '',
  content: '',
  author: 'Admin Plant Shop',
  status: 'Đã xuất bản',
  coverImage: '/assets/images/prod-monstera.jpg',
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(() => {
    if (typeof window === 'undefined') return defaultArticles;
    try {
      const saved = window.localStorage.getItem('plant_shop_posts');
      return saved ? JSON.parse(saved) as Article[] : defaultArticles;
    } catch {
      return defaultArticles;
    }
  });

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchText = `${a.title} ${a.summary} ${a.author}`.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'Tất cả' || a.category === categoryFilter;
      const matchStatus = statusFilter === 'Tất cả' || a.status === statusFilter;
      return matchText && matchCat && matchStatus;
    });
  }, [articles, search, categoryFilter, statusFilter]);

  function persist(next: Article[], message: string) {
    setArticles(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_posts', JSON.stringify(next));
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
      log.unshift({ time: new Date().toISOString(), section: 'Bài viết', action: message });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    }
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  }

  function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;

    const slug = draft.slug.trim() || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (editingId === null) {
      const newArticle: Article = {
        ...draft,
        slug,
        id: Date.now(),
        views: 0,
      };
      persist([newArticle, ...articles], `Đã đăng bài viết: ${draft.title}`);
    } else {
      const updated = articles.map((a) => (a.id === editingId ? { ...draft, slug, id: editingId, views: a.views } : a));
      persist(updated, `Đã cập nhật bài viết: ${draft.title}`);
    }

    setDraft(emptyDraft);
    setEditingId(null);
  }

  function startEdit(article: Article) {
    setEditingId(article.id);
    setDraft({
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      content: article.content,
      author: article.author,
      status: article.status,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
    });
  }

  function toggleStatus(id: number) {
    const next = articles.map((a) =>
      a.id === id ? { ...a, status: (a.status === 'Đã xuất bản' ? 'Bản nháp' : 'Đã xuất bản') as Article['status'] } : a
    );
    persist(next, 'Đổi trạng thái bài viết');
  }

  function deleteArticle(id: number) {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      const next = articles.filter((a) => a.id !== id);
      persist(next, 'Xóa bài viết');
    }
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Nội dung & Truyền thông
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Quản lý bài viết & Cẩm nang</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Chia sẻ kiến thức chăm sóc cây, phong thủy và xu hướng không gian sống xanh.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          Tổng số: <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{articles.length}</strong> bài viết
        </div>
      </div>

      {notice && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', fontWeight: 600 }}>
          ✦ {notice}
        </div>
      )}

      {/* Grid Layout: Left Form + Right List */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Editor Form */}
        <form onSubmit={saveArticle} style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '22px', position: 'sticky', top: '110px' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {editingId === null ? 'Viết bài mới' : 'Chỉnh sửa bài viết'}
          </span>
          <h3 style={{ margin: '6px 0 16px', fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
            {editingId === null ? 'Soạn thảo cẩm nang' : 'Cập nhật nội dung'}
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Cách tưới nước cho cây trong nhà..."
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Đường dẫn tĩnh (Slug)
              </label>
              <input
                type="text"
                placeholder="cach-cham-soc-monstera"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Chuyên mục
                </label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as Article['category'] })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
                >
                  <option value="Cẩm nang chăm sóc">Cẩm nang chăm sóc</option>
                  <option value="Phong thủy cây xanh">Phong thủy cây xanh</option>
                  <option value="Không gian sống">Không gian sống</option>
                  <option value="Xu hướng & Đời sống">Xu hướng & Đời sống</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Trạng thái
                </label>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as Article['status'] })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
                >
                  <option value="Đã xuất bản">Đã xuất bản</option>
                  <option value="Bản nháp">Bản nháp</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tác giả
              </label>
              <input
                type="text"
                value={draft.author}
                onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Ảnh đại diện (URL)
              </label>
              <input
                type="text"
                value={draft.coverImage}
                onChange={(e) => setDraft({ ...draft, coverImage: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tóm tắt ngắn gọn
              </label>
              <textarea
                value={draft.summary}
                onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                rows={2}
                placeholder="Đoạn mở đầu giới thiệu bài viết..."
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
                rows={4}
                placeholder="Nội dung bài viết..."
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit" className="button button-primary" style={{ flex: 1, padding: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                {editingId === null ? '✦ Xuất bản bài viết' : '💾 Lưu chỉnh sửa'}
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

        {/* Articles Table & Filter */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', border: '1px solid #e0e6dd', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Tìm tiêu đề bài viết, tác giả..."
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
              <option value="Tất cả">Tất cả danh mục</option>
              <option value="Cẩm nang chăm sóc">Cẩm nang chăm sóc</option>
              <option value="Phong thủy cây xanh">Phong thủy cây xanh</option>
              <option value="Không gian sống">Không gian sống</option>
              <option value="Xu hướng & Đời sống">Xu hướng & Đời sống</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #e0e6dd', background: '#fffdf8', fontSize: '0.72rem' }}
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Đã xuất bản">Đã xuất bản</option>
              <option value="Bản nháp">Bản nháp</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((article) => (
              <article
                key={article.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px minmax(0, 1fr) auto',
                  gap: '16px',
                  background: '#fff',
                  border: '1px solid #e0e6dd',
                  borderRadius: '10px',
                  padding: '16px',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '90px',
                    borderRadius: '8px',
                    background: `url(${article.coverImage}) center/cover no-repeat #f0f3ed`,
                  }}
                />

                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#edf5e9',
                        color: '#2b5e41',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                      }}
                    >
                      {article.category}
                    </span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.66rem' }}>
                      {article.publishedAt} · Bởi {article.author}
                    </span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.66rem' }}>
                      👁 {article.views} lượt xem
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
                    {article.title}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.72rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.summary}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => toggleStatus(article.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: article.status === 'Đã xuất bản' ? '#edf5e9' : '#fff5eb',
                      color: article.status === 'Đã xuất bản' ? '#2d8653' : '#c4683c',
                    }}
                  >
                    {article.status}
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => startEdit(article)}
                      style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Sửa
                    </button>
                    <span style={{ color: '#ccc' }}>·</span>
                    <button
                      type="button"
                      onClick={() => deleteArticle(article.id)}
                      style={{ border: 'none', background: 'none', color: '#c44', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '10px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                Không tìm thấy bài viết nào phù hợp.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
