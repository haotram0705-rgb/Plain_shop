'use client';

import { FormEvent, useMemo, useState } from 'react';

interface MediaAsset {
  id: number;
  name: string;
  url: string;
  folder: 'Sản phẩm cây' | 'Chậu & Vật tư' | 'Banner sự kiện' | 'Không gian showroom';
  size: string;
  dimensions: string;
  createdAt: string;
}

const defaultAssets: MediaAsset[] = [
  { id: 1, name: 'monstera-deliciosa-chau-gom.jpg', url: '/assets/images/prod-monstera.jpg', folder: 'Sản phẩm cây', size: '240 KB', dimensions: '800 x 800', createdAt: '2026-09-20' },
  { id: 2, name: 'cay-kim-tien-phong-thuy.jpg', url: '/assets/images/prod-snake-plant.jpg', folder: 'Sản phẩm cây', size: '190 KB', dimensions: '800 x 800', createdAt: '2026-09-18' },
  { id: 3, name: 'bang-singapore-phong-khach.jpg', url: '/assets/images/prod-fiddle-leaf.jpg', folder: 'Sản phẩm cây', size: '310 KB', dimensions: '800 x 800', createdAt: '2026-09-15' },
  { id: 4, name: 'lan-ho-diep-trang-dep.jpg', url: '/assets/images/prod-peace-lily.jpg', folder: 'Sản phẩm cây', size: '280 KB', dimensions: '800 x 800', createdAt: '2026-09-12' },
  { id: 5, name: 'banner-khuyen-mai-thang-9.jpg', url: '/assets/images/banner-home.jpg', folder: 'Banner sự kiện', size: '520 KB', dimensions: '1920 x 720', createdAt: '2026-09-01' },
  { id: 6, name: 'showroom-plant-shop-q10.jpg', url: '/assets/images/about-store.jpg', folder: 'Không gian showroom', size: '440 KB', dimensions: '1200 x 800', createdAt: '2026-08-28' },
];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(() => {
    if (typeof window === 'undefined') return defaultAssets;
    try {
      const saved = window.localStorage.getItem('plant_shop_media_library');
      return saved ? JSON.parse(saved) as MediaAsset[] : defaultAssets;
    } catch {
      return defaultAssets;
    }
  });

  const [selectedFolder, setSelectedFolder] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newFolder, setNewFolder] = useState<MediaAsset['folder']>('Sản phẩm cây');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filtered = useMemo(() => {
    return assets.filter((item) => {
      const matchText = item.name.toLowerCase().includes(query.toLowerCase());
      const matchFolder = selectedFolder === 'Tất cả' || item.folder === selectedFolder;
      return matchText && matchFolder;
    });
  }, [assets, query, selectedFolder]);

  function persist(next: MediaAsset[]) {
    setAssets(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_media_library', JSON.stringify(next));
    }
  }

  function handleAddMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newUrl.trim()) return;

    const newAsset: MediaAsset = {
      id: Date.now(),
      name: newName.trim() || `image-${Date.now().toString().slice(-4)}.jpg`,
      url: newUrl.trim(),
      folder: newFolder,
      size: '180 KB',
      dimensions: '800 x 800',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    persist([newAsset, ...assets]);
    setNewUrl('');
    setNewName('');
    setShowUploadModal(false);
  }

  function copyToClipboard(url: string) {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(''), 2000);
    }
  }

  function deleteAsset(id: number) {
    if (window.confirm('Bạn có chắc muốn xóa tệp này khỏi thư viện?')) {
      persist(assets.filter((a) => a.id !== id));
      if (activeAsset?.id === id) setActiveAsset(null);
    }
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tài nguyên số & Hình ảnh
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Thư viện Media & Tệp tin</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Quản lý kho hình ảnh cây cảnh, banner trang chủ, không gian showroom và chứng chỉ.
          </p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={() => setShowUploadModal(true)}
          style={{ padding: '8px 18px', fontSize: '0.78rem', fontWeight: 600 }}
        >
          ✦ Tải lên hình ảnh mới
        </button>
      </div>

      {copiedUrl && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', fontWeight: 600 }}>
          ✓ Đã sao chép đường dẫn: {copiedUrl}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#fff', border: '1px solid #e0e6dd', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--muted)' }}>🔍</span>
          <input
            type="text"
            placeholder="Tìm tên tệp ảnh..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.78rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['Tất cả', 'Sản phẩm cây', 'Chậu & Vật tư', 'Banner sự kiện', 'Không gian showroom'].map((folder) => (
            <button
              key={folder}
              type="button"
              onClick={() => setSelectedFolder(folder)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedFolder === folder ? 'var(--primary)' : '#f0f3ed',
                color: selectedFolder === folder ? '#fff' : 'var(--muted)',
                fontWeight: selectedFolder === folder ? 700 : 500,
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              {folder}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Images */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveAsset(item)}
            style={{
              background: '#fff',
              border: activeAsset?.id === item.id ? '2px solid var(--accent)' : '1px solid #e0e6dd',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div
              style={{
                height: '160px',
                background: `url(${item.url}) center/cover no-repeat #f7f9f5`,
              }}
            />
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.64rem', color: 'var(--muted)' }}>
                <span>{item.size}</span>
                <span>{item.folder}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer / Modal */}
      {activeAsset && (
        <div
          role="presentation"
          onClick={() => setActiveAsset(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(640px, 100%)',
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ height: '300px', background: `url(${activeAsset.url}) center/contain no-repeat #f5f7f2` }} />
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {activeAsset.folder}
                  </span>
                  <h3 style={{ margin: '4px 0 12px', color: 'var(--primary)', fontSize: '1.2rem', fontFamily: 'Lora, serif' }}>
                    {activeAsset.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveAsset(null)}
                  style={{ border: 'none', background: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--muted)' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#fbfcf9', padding: '12px', borderRadius: '8px', border: '1px solid #edf0eb', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '0.64rem', color: 'var(--muted)', display: 'block' }}>Kích thước</span>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{activeAsset.dimensions}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.64rem', color: 'var(--muted)', display: 'block' }}>Dung lượng</span>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{activeAsset.size}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.64rem', color: 'var(--muted)', display: 'block' }}>Ngày tải lên</span>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{activeAsset.createdAt}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeAsset.url)}
                  className="button button-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.78rem', fontWeight: 600 }}
                >
                  📋 Sao chép đường dẫn ảnh
                </button>
                <button
                  type="button"
                  onClick={() => deleteAsset(activeAsset.id)}
                  style={{ border: '1px solid #d88', background: '#fff', color: '#c44', padding: '10px 16px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Xóa tệp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          role="presentation"
          onClick={() => setShowUploadModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <form
            onSubmit={handleAddMedia}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(480px, 100%)',
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.2rem', fontFamily: 'Lora, serif' }}>
                Thêm tệp hình ảnh mới
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Tên tệp hiển thị
                </label>
                <input
                  type="text"
                  placeholder="monstera-leaf.jpg"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Đường dẫn ảnh (URL hoặc đường dẫn nội bộ) *
                </label>
                <input
                  type="text"
                  placeholder="/assets/images/... hoặc https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Chọn tệp từ máy
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewUrl(URL.createObjectURL(file));
                      if (!newName) setNewName(file.name);
                    }
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed #ccd4c7', background: '#f8faf6', fontSize: '0.72rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Thư mục phân loại
                </label>
                <select
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value as MediaAsset['folder'])}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.75rem' }}
                >
                  <option value="Sản phẩm cây">Sản phẩm cây</option>
                  <option value="Chậu & Vật tư">Chậu & Vật tư</option>
                  <option value="Banner sự kiện">Banner sự kiện</option>
                  <option value="Không gian showroom">Không gian showroom</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="button button-primary" style={{ flex: 1, padding: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                  ✦ Lưu vào thư viện
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="button button-outline"
                  style={{ padding: '10px 16px', fontSize: '0.75rem' }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
