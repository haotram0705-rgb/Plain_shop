'use client';

import { FormEvent, useState } from 'react';

type PromotionSlide = { image: string; eyebrow: string; title: string; description: string; cta: string; href: string };
type SiteSettings = { siteName: string; tagline: string; hotline: string; email: string; address: string; footerNote: string; metaTitle: string; metaDescription: string };
type ContactSettings = { zalo: string; whatsapp: string; email: string; hotline: string; facebook: string; tiktok: string; enabled: Record<string, boolean> };
type ThemeSettings = { primaryColor: string; accentColor: string; backgroundColor: string; motion: 'full' | 'soft' | 'off' };
const defaultTheme: ThemeSettings = { primaryColor: '#33402c', accentColor: '#c1704a', backgroundColor: '#f6f1e7', motion: 'full' };
const defaultSettings: SiteSettings = { siteName: 'Plant Shop', tagline: 'cây xanh cho đời sống', hotline: '0909 123 456', email: 'hello@plantshop.vn', address: '24 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh', footerNote: 'Chăm cây. Chăm nhà. Chăm mình.', metaTitle: 'Plant Shop · Cây xanh cho đời sống', metaDescription: 'Cửa hàng cây cảnh, chậu vật tư và dịch vụ chăm sóc cây.' };
const defaultContacts: ContactSettings = { zalo: '0909123456', whatsapp: '84909123456', email: 'hello@plantshop.vn', hotline: '0909123456', facebook: 'https://www.facebook.com', tiktok: 'https://www.tiktok.com', enabled: { zalo: true, whatsapp: true, email: true, hotline: true, facebook: true, tiktok: true } };

const starterSlides: PromotionSlide[] = [
  { image: '/assets/images/hero.jpg', eyebrow: 'Sự kiện tháng 9 · Vườn cây Việt', title: 'Cho trải nghiệm không chỉ là cây cảnh.', description: 'Ưu đãi đến 20% cho cây nội thất và chậu gốm thủ công.', cta: 'Xem ưu đãi', href: '/cua-hang' },
  { image: '/assets/images/cat-indoor.jpg', eyebrow: 'Bộ sưu tập mới · Green corner', title: 'Một góc xanh cho mùa mới.', description: 'Tặng phí phối chậu cho đơn hàng từ 800.000đ.', cta: 'Khám phá bộ sưu tập', href: '/cay-canh' },
];

export default function AdminAppearancePage() {
  const [slides, setSlides] = useState<PromotionSlide[]>(() => {
    if (typeof window === 'undefined') return starterSlides;
    const saved = window.localStorage.getItem('plant_shop_promotions');
    return saved ? JSON.parse(saved) as PromotionSlide[] : starterSlides;
  });
  const [logo, setLogo] = useState(() => typeof window === 'undefined' ? '' : window.localStorage.getItem('plant_shop_logo') || '');
  const [draft, setDraft] = useState<PromotionSlide>({ image: '', eyebrow: 'Sự kiện mới · Plant Shop', title: '', description: '', cta: 'Khám phá ngay', href: '/cua-hang' });
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState<SiteSettings>(() => { if (typeof window === 'undefined') return defaultSettings; const saved = window.localStorage.getItem('plant_shop_site_settings'); return saved ? JSON.parse(saved) as SiteSettings : defaultSettings; });
  const [contacts, setContacts] = useState<ContactSettings>(() => { if (typeof window === 'undefined') return defaultContacts; const saved = window.localStorage.getItem('plant_shop_contact_settings'); return saved ? JSON.parse(saved) as ContactSettings : defaultContacts; });
  const [theme, setTheme] = useState<ThemeSettings>(() => { if (typeof window === 'undefined') return defaultTheme; const saved = window.localStorage.getItem('plant_shop_theme'); return saved ? JSON.parse(saved) as ThemeSettings : defaultTheme; });

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  }

  function saveSlides(nextSlides: PromotionSlide[]) {
    setSlides(nextSlides);
    window.localStorage.setItem('plant_shop_promotions', JSON.stringify(nextSlides));
    notify('Đã cập nhật banner trang chủ.');
  }

  function saveLogo() {
    window.localStorage.setItem('plant_shop_logo', logo.trim());
    notify('Đã cập nhật logo storefront.');
  }

  function updateSetting(field: keyof SiteSettings, value: string) { setSettings((current) => ({ ...current, [field]: value })); }
  function saveSettings() { window.localStorage.setItem('plant_shop_site_settings', JSON.stringify(settings)); notify('Đã lưu cấu hình storefront.'); }
  function saveContacts() { window.localStorage.setItem('plant_shop_contact_settings', JSON.stringify(contacts)); notify('Đã lưu cấu hình kênh liên hệ.'); }
  function resetSettings() { setSettings(defaultSettings); window.localStorage.setItem('plant_shop_site_settings', JSON.stringify(defaultSettings)); notify('Đã khôi phục cấu hình mặc định.'); }
  function saveTheme() { window.localStorage.setItem('plant_shop_theme', JSON.stringify(theme)); window.dispatchEvent(new Event('plant-shop-theme-updated')); notify('Đã cập nhật màu và hiệu ứng giao diện.'); }
  function resetTheme() { setTheme(defaultTheme); window.localStorage.setItem('plant_shop_theme', JSON.stringify(defaultTheme)); window.dispatchEvent(new Event('plant-shop-theme-updated')); notify('Đã khôi phục theme mặc định.'); }

  function addSlide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.image || !draft.title || !draft.description) return;
    saveSlides([...slides, draft]);
    setDraft({ image: '', eyebrow: 'Sự kiện mới · Plant Shop', title: '', description: '', cta: 'Khám phá ngay', href: '/cua-hang' });
  }

  function updateDraft(field: keyof PromotionSlide, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="admin-appearance-page">
      <div className="admin-page-title"><div><span className="eyebrow">Trang chủ · Thương hiệu</span><h2>Quản lý hình ảnh và logo</h2><p>Logo được dùng tại vòng tròn trung tâm của màn đăng nhập và đăng ký.</p></div><button className="button button-primary" type="button" onClick={() => saveSlides(starterSlides)}>Khôi phục banner</button></div>
      <section className="admin-logo-settings"><div><span className="filter-label">Logo storefront</span><h3>Logo hiển thị trên auth</h3><p>Nhập URL ảnh logo PNG, JPG hoặc đường dẫn trong public.</p></div><div className="admin-logo-editor"><input value={logo} onChange={(event) => setLogo(event.target.value)} placeholder="/assets/images/logo.png hoặc https://..." /><button className="button button-primary" type="button" onClick={saveLogo}>Lưu logo</button></div></section>
      <section className="admin-settings-panel"><div className="admin-settings-heading"><div><span className="filter-label">Thông tin vận hành</span><h3>Thương hiệu, liên hệ và SEO</h3><p>Các trường này là nguồn nội dung chuẩn cho header, footer và kết quả tìm kiếm.</p></div><div className="admin-settings-actions"><button className="button button-outline" type="button" onClick={resetSettings}>Khôi phục</button><button className="button button-primary" type="button" onClick={saveSettings}>Lưu cấu hình</button></div></div><div className="admin-settings-grid"><label>Tên thương hiệu<input value={settings.siteName} onChange={(event) => updateSetting('siteName', event.target.value)} /></label><label>Tagline<input value={settings.tagline} onChange={(event) => updateSetting('tagline', event.target.value)} /></label><label>Hotline<input value={settings.hotline} onChange={(event) => updateSetting('hotline', event.target.value)} /></label><label>Email<input value={settings.email} onChange={(event) => updateSetting('email', event.target.value)} /></label><label className="admin-settings-wide">Địa chỉ<input value={settings.address} onChange={(event) => updateSetting('address', event.target.value)} /></label><label className="admin-settings-wide">Thông điệp footer<input value={settings.footerNote} onChange={(event) => updateSetting('footerNote', event.target.value)} /></label><label>SEO title<input value={settings.metaTitle} onChange={(event) => updateSetting('metaTitle', event.target.value)} /></label><label>SEO description<textarea value={settings.metaDescription} onChange={(event) => updateSetting('metaDescription', event.target.value)} /></label></div></section>
      <section className="admin-settings-panel"><div className="admin-settings-heading"><div><span className="filter-label">Kênh hỗ trợ</span><h3>Zalo, WhatsApp, email và hotline</h3><p>Tắt kênh không có người trực. Email chỉ mở ứng dụng thư với tiêu đề tham chiếu.</p></div><button className="button button-primary" type="button" onClick={saveContacts}>Lưu kênh liên hệ</button></div><div className="admin-settings-grid"><label>Zalo<input value={contacts.zalo} onChange={(event) => setContacts({ ...contacts, zalo: event.target.value })} /></label><label>WhatsApp<input value={contacts.whatsapp} onChange={(event) => setContacts({ ...contacts, whatsapp: event.target.value })} /></label><label>Email<input value={contacts.email} onChange={(event) => setContacts({ ...contacts, email: event.target.value })} type="email" /></label><label>Hotline<input value={contacts.hotline} onChange={(event) => setContacts({ ...contacts, hotline: event.target.value })} /></label><label>Facebook<input value={contacts.facebook} onChange={(event) => setContacts({ ...contacts, facebook: event.target.value })} /></label><label>TikTok<input value={contacts.tiktok} onChange={(event) => setContacts({ ...contacts, tiktok: event.target.value })} /></label></div><div className="contact-toggle-grid">{(['zalo', 'whatsapp', 'email', 'hotline', 'facebook', 'tiktok'] as const).map((channel) => <label key={channel}><input type="checkbox" checked={contacts.enabled[channel]} onChange={(event) => setContacts({ ...contacts, enabled: { ...contacts.enabled, [channel]: event.target.checked } })} /> Hiện {channel}</label>)}</div></section>
      <section className="admin-settings-panel theme-settings-panel"><div className="admin-settings-heading"><div><span className="filter-label">Visual system</span><h3>Màu sắc và hiệu ứng giao diện</h3><p>Thay đổi palette và mức chuyển động cho storefront.</p></div><div className="admin-settings-actions"><button className="button button-outline" type="button" onClick={resetTheme}>Khôi phục</button><button className="button button-primary" type="button" onClick={saveTheme}>Áp dụng giao diện</button></div></div><div className="theme-controls"><label>Màu chủ đạo<div className="color-control"><input type="color" value={theme.primaryColor} onChange={(event) => setTheme({ ...theme, primaryColor: event.target.value })} /><code>{theme.primaryColor}</code></div></label><label>Màu nhấn<div className="color-control"><input type="color" value={theme.accentColor} onChange={(event) => setTheme({ ...theme, accentColor: event.target.value })} /><code>{theme.accentColor}</code></div></label><label>Màu nền<div className="color-control"><input type="color" value={theme.backgroundColor} onChange={(event) => setTheme({ ...theme, backgroundColor: event.target.value })} /><code>{theme.backgroundColor}</code></div></label><label>Mức hiệu ứng<select value={theme.motion} onChange={(event) => setTheme({ ...theme, motion: event.target.value as ThemeSettings['motion'] })}><option value="full">Đầy đủ</option><option value="soft">Nhẹ</option><option value="off">Tắt chuyển động</option></select></label></div></section>
      <div className="admin-appearance-grid">
        <form className="admin-banner-form" onSubmit={addSlide}><span className="filter-label">Banner mới</span><h3>Thêm ảnh lên trang chủ</h3><label>URL hình ảnh<input value={draft.image} onChange={(event) => updateDraft('image', event.target.value)} placeholder="https://..." required /></label><label>Nhãn sự kiện<input value={draft.eyebrow} onChange={(event) => updateDraft('eyebrow', event.target.value)} required /></label><label>Tiêu đề<input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="Một góc xanh cho mùa mới." required /></label><label>Mô tả<textarea value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} placeholder="Mô tả ngắn cho chương trình..." required /></label><div className="admin-banner-fields"><label>Nút CTA<input value={draft.cta} onChange={(event) => updateDraft('cta', event.target.value)} required /></label><label>Đường dẫn<input value={draft.href} onChange={(event) => updateDraft('href', event.target.value)} required /></label></div><button className="button button-primary" type="submit">+ Thêm banner</button></form>
        <section className="admin-banner-list"><div className="admin-list-heading"><div><span className="filter-label">Đang hiển thị</span><h3>{slides.length} banner tự động chuyển</h3></div><small>Đổi slide mỗi 5 giây</small></div>{slides.map((slide, index) => <article className="admin-banner-card" key={`${slide.image}-${index}`}><div className="admin-banner-preview" style={{ backgroundImage: `url(${slide.image})` }}><span>0{index + 1}</span></div><div className="admin-banner-copy"><strong>{slide.title}</strong><small>{slide.eyebrow}</small><button type="button" onClick={() => saveSlides(slides.filter((_, slideIndex) => slideIndex !== index))}>Xóa banner</button></div></article>)}</section>
      </div>
      {notice && <div className="admin-save-notice">✦ {notice}</div>}
    </div>
  );
}
