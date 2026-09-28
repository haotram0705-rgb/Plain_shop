'use client';

import { FormEvent, useState } from 'react';

interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
  gaMeasurementId: string;
  facebookPixelId: string;
  googleSiteVerification: string;
  robotsTxt: string;
}

const defaultSeo: SeoConfig = {
  metaTitle: 'Plant Shop - Cây Cảnh Văn Phòng, Cây Phong Thủy & Không Gian Xanh Cao Cấp',
  metaDescription: 'Chuyên cung cấp cây cảnh trong nhà, cây văn phòng lọc không khí, chậu gốm mộc và dịch vụ thiết kế cảnh quan ban công uy tín tại TP.HCM. Bảo hành 1 đổi 1 trong 30 ngày.',
  keywords: 'cây cảnh văn phòng, monstera lá xẻ, cây kim tiền, chậu gốm mộc, thiết kế cảnh quan ban công, thuê cây xanh',
  ogImage: '/assets/images/banner-home.jpg',
  canonicalUrl: 'https://plantshop.vn',
  gaMeasurementId: 'G-PLANT8888',
  facebookPixelId: '10293847562019',
  googleSiteVerification: 'google-site-verification=PLANTSHOP_VIETNAM_VERIFY',
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /admin/*\nSitemap: https://plantshop.vn/sitemap.xml',
};

const monitoredKeywords = [
  { keyword: 'Cây Monstera lá xẻ đẹp', rank: '#2 Google', volume: '14,500', trend: '▲ +2' },
  { keyword: 'Cây phong thủy để bàn', rank: '#4 Google', volume: '22,000', trend: '▲ +1' },
  { keyword: 'Cho thuê cây văn phòng HCM', rank: '#1 Google', volume: '8,200', trend: '― 0' },
  { keyword: 'Chậu gốm mộc trồng cây', rank: '#3 Google', volume: '6,400', trend: '▲ +3' },
  { keyword: 'Bàng Singapore phòng khách', rank: '#5 Google', volume: '11,000', trend: '▼ -1' },
];

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoConfig>(() => {
    if (typeof window === 'undefined') return defaultSeo;
    try {
      const saved = window.localStorage.getItem('plant_shop_seo_config');
      return saved ? { ...defaultSeo, ...JSON.parse(saved) } : defaultSeo;
    } catch {
      return defaultSeo;
    }
  });

  const [notice, setNotice] = useState('');

  function saveSeo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('plant_shop_seo_config', JSON.stringify(seo));
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]') as Array<{ time: string; section: string; action: string }>;
      log.unshift({ time: new Date().toISOString(), section: 'SEO', action: 'Cập nhật cấu hình SEO & Meta tags' });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    }
    setNotice('Đã lưu cấu hình SEO và các mã theo dõi thành công!');
    setTimeout(() => setNotice(''), 3000);
  }

  return (
    <div className="admin-crud-page" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tối ưu hóa tìm kiếm & Meta tags
          </span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '4px 0' }}>Cấu hình SEO & Google Analytics</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
            Tối ưu thẻ tiêu đề, mô tả hiển thị trên Google Search, Facebook OpenGraph và cấu hình mã đo lường.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '6px 12px', background: '#edf5e9', color: '#2b5e41', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
            ✓ Sitemap: /sitemap.xml (Hoạt động)
          </span>
        </div>
      </div>

      {notice && (
        <div style={{ background: '#edf5e9', border: '1px solid #b8dab0', color: '#2b5e41', padding: '10px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', fontWeight: 600 }}>
          ✦ {notice}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '24px', alignItems: 'start' }}>
        {/* Left: SEO Inputs Form */}
        <form onSubmit={saveSeo} style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'Lora, serif' }}>
            Thông tin Meta Tags chuẩn SEO
          </h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)' }}>
                  Tiêu đề trang chủ (Meta Title) *
                </label>
                <small style={{ color: seo.metaTitle.length > 60 ? '#c44' : 'var(--muted)', fontSize: '0.66rem' }}>
                  {seo.metaTitle.length}/60 ký tự (Khuyến nghị 50-60)
                </small>
              </div>
              <input
                type="text"
                value={seo.metaTitle}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)' }}>
                  Mô tả trang chủ (Meta Description) *
                </label>
                <small style={{ color: seo.metaDescription.length > 160 ? '#c44' : 'var(--muted)', fontSize: '0.66rem' }}>
                  {seo.metaDescription.length}/160 ký tự (Khuyến nghị 140-160)
                </small>
              </div>
              <textarea
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Từ khóa chính (Meta Keywords, phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={seo.keywords}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Đường dẫn chuẩn (Canonical URL)
                </label>
                <input
                  type="text"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Ảnh chia sẻ mạng xã hội (OG:Image)
                </label>
                <input
                  type="text"
                  value={seo.ogImage}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #edf0eb', margin: '8px 0' }} />

            <h4 style={{ margin: '0', fontSize: '1rem', color: 'var(--primary)' }}>Mã theo dõi & Tích hợp tiếp thị</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Google Analytics 4 (GA4 ID)
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXX"
                  value={seo.gaMeasurementId}
                  onChange={(e) => setSeo({ ...seo, gaMeasurementId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="102938..."
                  value={seo.facebookPixelId}
                  onChange={(e) => setSeo({ ...seo, facebookPixelId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Xác minh Google Search Console
              </label>
              <input
                type="text"
                placeholder="google-site-verification=..."
                value={seo.googleSiteVerification}
                onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#fffdf8', fontSize: '0.78rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Nội dung robots.txt
              </label>
              <textarea
                value={seo.robotsTxt}
                onChange={(e) => setSeo({ ...seo, robotsTxt: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccd4c7', background: '#f5f7f2', fontFamily: 'monospace', fontSize: '0.72rem' }}
              />
            </div>

            <button type="submit" className="button button-primary" style={{ padding: '11px', fontSize: '0.8rem', fontWeight: 600, marginTop: '8px' }}>
              💾 Lưu cấu hình SEO & Analytics
            </button>
          </div>
        </form>

        {/* Right: Live SERP & Social Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Google SERP Preview */}
          <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '20px' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Xem trước kết quả tìm kiếm Google
            </span>

            <div style={{ marginTop: '12px', background: '#fff', border: '1px solid #e8eaed', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: '#202124', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#2b5e41', display: 'inline-block' }} />
                <span>plantshop.vn</span>
                <span style={{ color: '#5f6368' }}>› home</span>
              </div>
              <h4 style={{ margin: '0 0 6px', color: '#1a0dab', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.3, cursor: 'pointer' }}>
                {seo.metaTitle || 'Plant Shop - Cây Cảnh & Không Gian Xanh'}
              </h4>
              <p style={{ margin: 0, color: '#4d5156', fontSize: '0.75rem', lineHeight: 1.5 }}>
                {seo.metaDescription || 'Chuyên cung cấp cây cảnh trong nhà và cây văn phòng lọc không khí cao cấp.'}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '20px' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Xem trước chia sẻ Facebook / Zalo
            </span>

            <div style={{ marginTop: '12px', border: '1px solid #e0e6dd', borderRadius: '8px', overflow: 'hidden', background: '#f0f2f5' }}>
              <div
                style={{
                  height: '140px',
                  background: `url(${seo.ogImage}) center/cover no-repeat #e0e6dd`,
                }}
              />
              <div style={{ padding: '12px', background: '#fff' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>PLANTSHOP.VN</div>
                <strong style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'block', margin: '2px 0' }}>
                  {seo.metaTitle}
                </strong>
                <small style={{ fontSize: '0.7rem', color: 'var(--muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {seo.metaDescription}
                </small>
              </div>
            </div>
          </div>

          {/* Keyword Tracker Table */}
          <div style={{ background: '#fff', border: '1px solid #e0e6dd', borderRadius: '10px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--primary)' }}>Thứ hạng từ khóa mục tiêu</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {monitoredKeywords.map((kw, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', paddingBottom: '8px', borderBottom: '1px solid #f0f3ed' }}>
                  <div>
                    <strong style={{ color: 'var(--primary)', display: 'block' }}>{kw.keyword}</strong>
                    <small style={{ color: 'var(--muted)' }}>Lượng tìm kiếm: {kw.volume}/tháng</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#2b5e41', fontWeight: 700, display: 'block' }}>{kw.rank}</span>
                    <span style={{ fontSize: '0.65rem', color: kw.trend.includes('▲') ? '#2d8653' : 'var(--muted)', fontWeight: 600 }}>{kw.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
