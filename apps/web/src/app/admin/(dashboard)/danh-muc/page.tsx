'use client';

import { FormEvent, useMemo, useState } from 'react';

type Category = { id: number; name: string; slug: string; description: string; products: number; status: 'Hiển thị' | 'Ẩn' };

const starterCategories: Category[] = [
  { id: 1, name: 'Cây cảnh', slug: 'cay-canh', description: 'Cây nội thất, cây văn phòng và cây để bàn.', products: 48, status: 'Hiển thị' },
  { id: 2, name: 'Chậu và vật tư', slug: 'chau-vat-tu', description: 'Chậu cây, đất trồng, phân bón và dụng cụ.', products: 32, status: 'Hiển thị' },
  { id: 3, name: 'Hoa và quà tặng', slug: 'hoa-qua-tang', description: 'Hoa, cây quà tặng và các mẫu gửi điều tử tế.', products: 18, status: 'Hiển thị' },
  { id: 4, name: 'Dịch vụ chăm cây', slug: 'dich-vu', description: 'Tư vấn, chăm sóc và thi công không gian xanh.', products: 8, status: 'Ẩn' },
];

const emptyDraft = { name: '', slug: '', description: '', products: 0, status: 'Hiển thị' as Category['status'] };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === 'undefined') return starterCategories;
    const saved = window.localStorage.getItem('plant_shop_categories');
    return saved ? JSON.parse(saved) as Category[] : starterCategories;
  });
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  const visibleCategories = useMemo(() => categories.filter((category) => `${category.name} ${category.slug}`.toLowerCase().includes(query.toLowerCase())), [categories, query]);

  function persist(next: Category[]) {
    setCategories(next);
    window.localStorage.setItem('plant_shop_categories', JSON.stringify(next));
    const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
    log.unshift({ time: new Date().toISOString(), section: 'Danh mục', action: 'Cập nhật phân loại' });
    window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.slug.trim()) return;
    const next = editingId === null
      ? [...categories, { ...draft, id: Date.now() }]
      : categories.map((category) => category.id === editingId ? { ...draft, id: editingId } : category);
    persist(next);
    setDraft(emptyDraft);
    setEditingId(null);
    setNotice(editingId === null ? 'Đã thêm danh mục.' : 'Đã cập nhật danh mục.');
    window.setTimeout(() => setNotice(''), 2200);
  }

  function edit(category: Category) {
    setEditingId(category.id);
    setDraft({ name: category.name, slug: category.slug, description: category.description, products: category.products, status: category.status });
  }

  function remove(id: number) {
    if (!window.confirm('Xóa danh mục này?')) return;
    persist(categories.filter((category) => category.id !== id));
  }

  function toggleStatus(id: number) {
    persist(categories.map((category) => category.id === id ? { ...category, status: category.status === 'Hiển thị' ? 'Ẩn' : 'Hiển thị' } : category));
  }

  return <div className="admin-crud-page"><div className="admin-page-title"><div><span className="eyebrow">Nội dung cửa hàng</span><h2>Quản lý danh mục</h2><p>Phân loại sản phẩm để storefront, bộ lọc và mega menu luôn đồng bộ.</p></div><span className="admin-record-count">{categories.length} danh mục</span></div><div className="admin-crud-layout"><form className="admin-crud-form" onSubmit={submit}><span className="filter-label">{editingId === null ? 'Danh mục mới' : 'Đang chỉnh sửa'}</span><h3>{editingId === null ? 'Thêm danh mục' : 'Cập nhật danh mục'}</h3><label>Tên danh mục<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ví dụ: Cây cảnh" required /></label><label>Slug URL<input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="cay-canh" required /></label><label>Mô tả<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Mô tả ngắn cho khách hàng" /></label><div className="admin-form-row"><label>Số sản phẩm<input type="number" min="0" value={draft.products} onChange={(event) => setDraft({ ...draft, products: Number(event.target.value) })} /></label><label>Trạng thái<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Category['status'] })}><option>Hiển thị</option><option>Ẩn</option></select></label></div><div className="admin-form-actions"><button className="button button-primary" type="submit">{editingId === null ? 'Thêm danh mục' : 'Lưu thay đổi'}</button>{editingId !== null && <button className="button button-outline" type="button" onClick={() => { setEditingId(null); setDraft(emptyDraft); }}>Hủy</button>}</div></form><section className="admin-crud-list"><div className="admin-list-toolbar"><label className="admin-inline-search">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm danh mục..." /></label><span>{visibleCategories.length} kết quả</span></div>{visibleCategories.map((category) => <article className="admin-category-row" key={category.id}><div className="admin-category-index">0{category.id}</div><div className="admin-category-copy"><div><h3>{category.name}</h3><small>/{category.slug}</small></div><p>{category.description}</p></div><span className="admin-category-products">{category.products}<small>sản phẩm</small></span><button className={`admin-status ${category.status === 'Hiển thị' ? 'is-visible' : ''}`} type="button" onClick={() => toggleStatus(category.id)}>{category.status}</button><div className="admin-row-actions"><button type="button" onClick={() => edit(category)}>Sửa</button><button type="button" onClick={() => remove(category.id)}>Xóa</button></div></article>)}{visibleCategories.length === 0 && <div className="admin-empty-state">Không tìm thấy danh mục phù hợp.</div>}</section></div>{notice && <div className="admin-save-notice">✦ {notice}</div>}</div>;
}
