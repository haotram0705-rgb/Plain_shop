'use client';

import { FormEvent, useMemo, useState } from 'react';

interface ProjectItem {
  id: number;
  title: string;
  client: string;
  category: 'Văn phòng' | 'Biệt thự sân vườn' | 'Căn hộ chung cư' | 'Nhà hàng & Cafe';
  area: string;
  year: string;
  featuredPlants: string;
  image: string;
  status: 'Đã hoàn thành' | 'Đang thi công';
  description: string;
}

const defaultProjects: ProjectItem[] = [
  {
    id: 1,
    title: 'Mảng xanh thông minh Techcombank Saigon Tower',
    client: 'Ngân hàng Techcombank',
    category: 'Văn phòng',
    area: '350 m²',
    year: '2026',
    featuredPlants: 'Monstera, Kim Tiền, Bàng Singapore, Lưỡi Hổ viền vàng',
    image: '/assets/images/prod-monstera.jpg',
    status: 'Đã hoàn thành',
    description: 'Thi công giàn cây treo trần thông tầng và hệ thống cây lọc khí cho hơn 200 nhân viên làm việc.',
  },
  {
    id: 2,
    title: 'Ốc đảo nhiệt đới Biệt thự Thảo Điền Quận 2',
    client: 'Gia đình anh Tuấn Khang',
    category: 'Biệt thự sân vườn',
    area: '180 m²',
    year: '2025',
    featuredPlants: 'Chuối cảnh nhiệt đới, Dương xỉ cổ đại, Trầu bà lá xẻ',
    image: '/assets/images/prod-fiddle-leaf.jpg',
    status: 'Đã hoàn thành',
    description: 'Thiết kế cảnh quan hồ cá Koi kết hợp cây tầng cao và thảm cỏ xanh mướt quanh biệt thự đơn lập.',
  },
  {
    id: 3,
    title: 'Ban công nhiệt đới Penthouse Sunwah Pearl',
    client: 'Chị Mai Lan',
    category: 'Căn hộ chung cư',
    area: '45 m²',
    year: '2026',
    featuredPlants: 'Trúc bách hợp, Cúc tần Ấn Độ rủ, Hoa nhài',
    image: '/assets/images/prod-peace-lily.jpg',
    status: 'Đã hoàn thành',
    description: 'Góc thư giãn ngắm sông Sài Gòn với sàn gỗ composite ngoài trời và hệ thống tưới hẹn giờ tự động.',
  },
  {
    id: 4,
    title: 'The Green Forest Coffee & Roastery',
    client: 'Công ty Cổ phần F&B Sài Gòn',
    category: 'Nhà hàng & Cafe',
    area: '220 m²',
    year: '2026',
    featuredPlants: 'Cây cọ ta, Trầu bà thanh xuân, Cẩm nhung',
    image: '/assets/images/prod-snake-plant.jpg',
    status: 'Đang thi công',
    description: 'Không gian mở kết hợp giếng trời và cây thân gỗ tán rộng tạo bóng mát tự nhiên.',
  },
];

const emptyDraft: Omit<ProjectItem, 'id'> = {
  title: '',
  client: '',
  category: 'Văn phòng',
  area: '',
  year: '2026',
  featuredPlants: '',
  image: '/assets/images/prod-monstera.jpg',
  status: 'Đã hoàn thành',
  description: '',
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    if (typeof window === 'undefined') return defaultProjects;
    try {
      const saved = window.localStorage.getItem('plant_shop_projects');
      return saved ? JSON.parse(saved) as ProjectItem[] : defaultProjects;
    } catch {
      return defaultProjects;
    }
  });

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchText = `${p.title} ${p.client} ${p.featuredPlants}`.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'Tất cả' || p.category === categoryFilter;
      return matchText && matchCat;
    });
  }, [projects, search, categoryFilter]);

  function persist(next: ProjectItem[], message: string) {
    setProjects(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_projects', JSON.stringify(next));
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
      log.unshift({ time: new Date().toISOString(), section: 'Dự án', action: message });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    }
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;

    if (editingId === null) {
      persist([ { ...draft, id: Date.now() }, ...projects ], `Đã thêm dự án: ${draft.title}`);
    } else {
      const updated = projects.map((p) => (p.id === editingId ? { ...draft, id: editingId } : p));
      persist(updated, `Đã cập nhật dự án: ${draft.title}`);
    }

    setDraft(emptyDraft);
    setEditingId(null);
  }

  function startEdit(project: ProjectItem) {
    setEditingId(project.id);
    setDraft({
      title: project.title,
      client: project.client,
      category: project.category,
      area: project.area,
      year: project.year,
      featuredPlants: project.featuredPlants,
      image: project.image,
      status: project.status,
      description: project.description,
    });
  }

  function deleteProject(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa dự án cảnh quan này?')) {
      persist(projects.filter((p) => p.id !== id), 'Xóa dự án');
    }
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hồ sơ năng lực & Portfolio
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Quản lý dự án cảnh quan</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Tổng hợp các công trình cảnh quan văn phòng, biệt thự, resort và ban công đã thực hiện.
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          Tổng số: <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{projects.length}</strong> dự án
        </div>
      </div>

      {notice && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', fontWeight: 600 }}>
          ✦ {notice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Form Add/Edit */}
        <form onSubmit={saveProject} style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '22px', position: 'sticky', top: '110px' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {editingId === null ? 'Thêm công trình mới' : 'Chỉnh sửa công trình'}
          </span>
          <h3 style={{ margin: '6px 0 16px', fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
            {editingId === null ? 'Hồ sơ dự án' : 'Cập nhật dự án'}
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Tên dự án *
              </label>
              <input
                type="text"
                placeholder="VD: Mảng xanh văn phòng..."
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Khách hàng / Đối tác
                </label>
                <input
                  type="text"
                  placeholder="Tên doanh nghiệp..."
                  value={draft.client}
                  onChange={(e) => setDraft({ ...draft, client: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Phân loại
                </label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as ProjectItem['category'] })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.72rem' }}
                >
                  <option value="Văn phòng">Văn phòng</option>
                  <option value="Biệt thự sân vườn">Biệt thự sân vườn</option>
                  <option value="Căn hộ chung cư">Căn hộ chung cư</option>
                  <option value="Nhà hàng & Cafe">Nhà hàng & Cafe</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Quy mô diện tích
                </label>
                <input
                  type="text"
                  placeholder="VD: 150 m²"
                  value={draft.area}
                  onChange={(e) => setDraft({ ...draft, area: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Năm hoàn thành
                </label>
                <input
                  type="text"
                  value={draft.year}
                  onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Cây chủ đạo sử dụng
              </label>
              <input
                type="text"
                placeholder="Monstera, Bàng Sing, Kim Tiền..."
                value={draft.featuredPlants}
                onChange={(e) => setDraft({ ...draft, featuredPlants: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Ảnh công trình (URL)
              </label>
              <input
                type="text"
                value={draft.image}
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Mô tả giải pháp thi công
              </label>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3}
                placeholder="Chi tiết công trình..."
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit" className="button button-primary" style={{ flex: 1, padding: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                {editingId === null ? '✦ Lưu dự án' : '💾 Lưu chỉnh sửa'}
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

        {/* Projects List */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', border: '1px solid #e0e6dd', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Tìm dự án, khách hàng, chủng loại cây..."
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
              <option value="Tất cả">Tất cả loại hình</option>
              <option value="Văn phòng">Văn phòng</option>
              <option value="Biệt thự sân vườn">Biệt thự sân vườn</option>
              <option value="Căn hộ chung cư">Căn hộ chung cư</option>
              <option value="Nhà hàng & Cafe">Nhà hàng & Cafe</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filtered.map((proj) => (
              <div
                key={proj.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e0e6dd',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    height: '160px',
                    background: `url(${proj.image}) center/cover no-repeat #f0f3ed`,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.92)',
                      color: 'var(--primary)',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                    }}
                  >
                    {proj.category}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: proj.status === 'Đã hoàn thành' ? 'rgba(45, 134, 83, 0.9)' : 'rgba(224, 122, 95, 0.9)',
                      color: '#fff',
                      fontSize: '0.62rem',
                      fontWeight: 600,
                    }}
                  >
                    {proj.status}
                  </span>
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
                      {proj.title}
                    </h4>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '8px' }}>
                      Khách hàng: <strong>{proj.client}</strong> · {proj.area} · Năm {proj.year}
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '0.74rem', color: 'var(--foreground)', lineHeight: 1.5 }}>
                      {proj.description}
                    </p>
                    <div style={{ fontSize: '0.68rem', color: 'var(--accent)', background: '#f8faf6', padding: '6px 10px', borderRadius: '6px' }}>
                      🌿 Cây sử dụng: {proj.featuredPlants}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #edf0eb', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      type="button"
                      onClick={() => startEdit(proj)}
                      style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
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
