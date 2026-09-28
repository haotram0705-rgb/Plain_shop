'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type ChannelConfig = {
  zalo: string;
  whatsapp: string;
  email: string;
  hotline: string;
  facebook: string;
  tiktok: string;
  enabled: {
    zalo: boolean;
    whatsapp: boolean;
    email: boolean;
    hotline: boolean;
    facebook: boolean;
    tiktok: boolean;
  };
};

type StoreSettings = {
  siteName: string;
  tagline: string;
  hotline: string;
  email: string;
  address: string;
  footerNote: string;
};

const defaultChannels: ChannelConfig = {
  zalo: '0909123456',
  whatsapp: '84909123456',
  email: 'hello@plantshop.vn',
  hotline: '0909 123 456',
  facebook: 'https://www.facebook.com',
  tiktok: 'https://www.tiktok.com',
  enabled: { zalo: true, whatsapp: true, email: true, hotline: true, facebook: true, tiktok: true },
};

const defaultStore: StoreSettings = {
  siteName: 'Plant Shop',
  tagline: 'cây xanh cho đời sống',
  hotline: '0909 123 456',
  email: 'hello@plantshop.vn',
  address: '24 Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
  footerNote: 'Chăm cây. Chăm nhà. Chăm mình.',
};

const topics = [
  'Tư vấn chọn cây cho nhà & căn hộ',
  'Thiết kế ban công & sân vườn',
  'Cây văn phòng & sự kiện',
  'Bảo dưỡng, chăm sóc & thay chậu',
  'Quà tặng đối tác & sự kiện',
  'Hỗ trợ đơn hàng & Khiếu nại',
];

const budgetRanges = [
  'Dưới 1.000.000đ',
  '1.000.000đ – 3.000.000đ',
  '3.000.000đ – 10.000.000đ',
  'Trên 10.000.000đ',
  'Tư vấn theo ngân sách tối ưu',
];

const timeSlots = [
  'Bất kỳ lúc nào',
  'Buổi sáng (08:00 - 12:00)',
  'Buổi chiều (13:00 - 17:00)',
  'Buổi tối (18:00 - 20:00)',
];

const faqItems = [
  {
    q: 'Plant Shop có nhận khảo sát tận nơi không?',
    a: 'Có. Đối với các yêu cầu thiết kế ban công, sân vườn hoặc cây xanh văn phòng tại TP.HCM, đội ngũ kỹ thuật của Plant Shop sẽ đến khảo sát ánh sáng, hướng gió và đo đạc không gian hoàn toàn miễn phí.',
  },
  {
    q: 'Chính sách bảo hành và đổi trả cây như thế nào?',
    a: 'Mọi cây xanh mua tại Plant Shop đều được áp dụng chính sách 1 đổi 1 trong vòng 7 ngày nếu có dấu hiệu suy yếu do lỗi vườn ươm hoặc tổn hại do vận chuyển. Chúng mình đồng hành hướng dẫn chăm sóc trọn đời.',
  },
  {
    q: 'Tôi chưa từng chăm cây cảnh, liệu có khó nuôi không?',
    a: 'Bạn hoàn toàn yên tâm. Plant Shop sẽ tư vấn những giống cây dễ sống, chịu bóng râm tốt và phù hợp với thói quen sinh hoạt của bạn. Mỗi chậu cây khi bàn giao đều có hướng dẫn tưới và chăm sóc chi tiết.',
  },
  {
    q: 'Thời gian phản hồi yêu cầu tư vấn là bao lâu?',
    a: 'Đội ngũ tư vấn sẽ liên hệ qua điện thoại hoặc Zalo trong vòng 15 – 30 phút trong khung giờ 08:00 – 20:00 hàng ngày. Yêu cầu gửi sau 20:00 sẽ được xử lý vào 08:00 sáng hôm sau.',
  },
];

type FormData = {
  name: string;
  contact: string;
  topic: string;
  related: string;
  budget: string;
  preferredTime: string;
  need: string;
};

export default function ContactPage() {
  const [channels, setChannels] = useState<ChannelConfig>(defaultChannels);
  const [store, setStore] = useState<StoreSettings>(defaultStore);
  const [sourceUrl, setSourceUrl] = useState('');
  const [product, setProduct] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [form, setForm] = useState<FormData>({
    name: '',
    contact: '',
    topic: topics[0],
    related: '',
    budget: '',
    preferredTime: timeSlots[0],
    need: '',
  });

  const [imageName, setImageName] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load saved contact settings
    const savedContacts = window.localStorage.getItem('plant_shop_contact_settings');
    if (savedContacts) {
      try {
        setChannels({ ...defaultChannels, ...JSON.parse(savedContacts) });
      } catch {
        // use default
      }
    }

    // Load saved site settings
    const savedSite = window.localStorage.getItem('plant_shop_site_settings');
    if (savedSite) {
      try {
        setStore({ ...defaultStore, ...JSON.parse(savedSite) });
      } catch {
        // use default
      }
    }

    const params = new URLSearchParams(window.location.search);
    setSourceUrl(params.get('url') || window.location.href);
    const prod = params.get('product') || '';
    setProduct(prod);
    if (prod) {
      setForm((current) => ({
        ...current,
        related: prod,
        topic: 'Tư vấn chọn cây cho nhà & căn hộ',
      }));
    }
  }, []);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleImageChange(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setNotice({ type: 'error', message: 'Ảnh vượt quá dung lượng tối đa 10MB.' });
      return;
    }
    setImageName(file.name);
    setUploadedUrl(URL.createObjectURL(file));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const data = new FormData();
      data.append('file', file);
      fetch(`${apiUrl.replace(/\/$/, '')}/media/public-upload`, {
        method: 'POST',
        body: data,
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((payload: { url?: string } | null) => {
          if (payload?.url) {
            setUploadedUrl(new URL(payload.url, apiUrl).href);
          }
        })
        .catch(() => {
          // fallback to client preview
        });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    const requestCode = `PS-TV${Date.now().toString().slice(-6)}`;
    const fullNeed = [
      `Chủ đề: ${form.topic}`,
      form.preferredTime && `Thời gian tiện nghe máy: ${form.preferredTime}`,
      form.budget && `Ngân sách dự kiến: ${form.budget}`,
      form.need.trim() ? `Chi tiết: ${form.need.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const relatedItem = form.related.trim() || form.topic || product || 'Tư vấn chung';

    // 1. Always save locally to plant_shop_consultations for immediate admin viewing & offline support
    try {
      const newRecord = {
        id: `tv-${Date.now()}`,
        name: form.name.trim(),
        contact: form.contact.trim(),
        need: fullNeed,
        related: relatedItem,
        sourceUrl,
        attachmentUrl: uploadedUrl.startsWith('http') ? uploadedUrl : undefined,
        createdAt: new Date().toISOString(),
        status: 'new' as const,
        assignee: 'Chưa phân công',
      };
      const existing = JSON.parse(window.localStorage.getItem('plant_shop_consultations') || '[]') as typeof newRecord[];
      window.localStorage.setItem('plant_shop_consultations', JSON.stringify([newRecord, ...existing]));
    } catch {
      // ignore storage error
    }

    // 2. If API URL is provided, push to server database
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      try {
        await fetch(`${apiUrl.replace(/\/$/, '')}/consultations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            contact: form.contact.trim(),
            need: fullNeed,
            related: relatedItem,
            sourceUrl,
            attachmentUrl: uploadedUrl.startsWith('http') ? uploadedUrl : undefined,
          }),
        });
      } catch {
        // Local record is already safe
      }
    }

    setIsSubmitting(false);
    setSubmittedCode(requestCode);
    setNotice({
      type: 'success',
      message: 'Plant Shop đã nhận thông tin và sẽ liên hệ hỗ trợ bạn sớm nhất!',
    });
  }

  function resetForm() {
    setSubmittedCode(null);
    setForm({
      name: '',
      contact: '',
      topic: topics[0],
      related: '',
      budget: '',
      preferredTime: timeSlots[0],
      need: '',
    });
    setImageName('');
    setUploadedUrl('');
    setNotice(null);
  }

  const emailSubject = encodeURIComponent(`Tư vấn Plant Shop${product ? ` · ${product}` : ''}`);
  const hotlineClean = (channels.hotline || store.hotline || '0909123456').replace(/\s+/g, '');
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address || '24 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh')}`;

  return (
    <main className="contact-page container">
      {/* Breadcrumb */}
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>/</span>
        <strong>Liên hệ & Tư vấn</strong>
      </nav>

      {/* Hero Header */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="eyebrow">Plant Shop · Kết nối & Đồng hành</span>
          <h1>
            Cùng tạo một<br />
            <em>góc xanh bình yên.</em>
          </h1>
          <p>
            Dù bạn đang tìm một chậu cây để bàn, cần phối cây cho căn hộ, hay lên phương án cảnh quan ban công & sân vườn – Plant Shop luôn sẵn sàng lắng nghe và tư vấn tận tâm.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <div className="contact-layout">
        {/* Left Column: Direct channels & Showroom */}
        <aside className="contact-info-panel">
          <div className="contact-panel-card">
            <span className="filter-label">Kênh kết nối trực tiếp</span>
            <h2>Trò chuyện với chúng mình</h2>
            <p className="contact-panel-desc">
              Phản hồi nhanh trong 15 phút. Bạn có thể gửi ảnh không gian trực tiếp qua Zalo hoặc gọi hotline để được tư vấn ngay.
            </p>

            <div className="contact-channel-list">
              {channels.enabled.hotline && (
                <a className="contact-channel-item hotline-item" href={`tel:${hotlineClean}`}>
                  <div className="channel-icon">☎</div>
                  <div className="channel-meta">
                    <strong>Hotline tư vấn</strong>
                    <span>{channels.hotline || store.hotline}</span>
                    <small>08:00 – 20:00 (Hàng ngày)</small>
                  </div>
                  <span className="channel-arrow">→</span>
                </a>
              )}

              {channels.enabled.zalo && (
                <a
                  className="contact-channel-item zalo-item"
                  href={`https://zalo.me/${channels.zalo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="channel-icon">Zalo</div>
                  <div className="channel-meta">
                    <strong>Zalo CSKH & Gửi ảnh</strong>
                    <span>{channels.zalo}</span>
                    <small>Tư vấn chọn cây & báo giá 1-1</small>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>
              )}

              {channels.enabled.email && (
                <a
                  className="contact-channel-item email-item"
                  href={`mailto:${channels.email || store.email}?subject=${emailSubject}`}
                >
                  <div className="channel-icon">✉</div>
                  <div className="channel-meta">
                    <strong>Email liên hệ & Hợp tác</strong>
                    <span>{channels.email || store.email}</span>
                    <small>Báo giá doanh nghiệp, sự kiện</small>
                  </div>
                  <span className="channel-arrow">→</span>
                </a>
              )}

              {channels.enabled.whatsapp && (
                <a
                  className="contact-channel-item whatsapp-item"
                  href={`https://wa.me/${channels.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="channel-icon">WA</div>
                  <div className="channel-meta">
                    <strong>WhatsApp Support</strong>
                    <span>+{channels.whatsapp}</span>
                    <small>Hỗ trợ khách hàng quốc tế</small>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="contact-social-row">
              <span>Theo dõi góc xanh:</span>
              <div className="social-links">
                {channels.enabled.facebook && (
                  <a href={channels.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                    Facebook
                  </a>
                )}
                {channels.enabled.tiktok && (
                  <a href={channels.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                    TikTok
                  </a>
                )}
                <Link href="/bai-viet">Cẩm nang cây xanh</Link>
              </div>
            </div>
          </div>

          {/* Showroom & Map Card */}
          <div className="contact-panel-card store-card">
            <span className="filter-label">Ghé thăm trực tiếp</span>
            <h3>Showroom Plant Shop</h3>
            <div className="store-meta-grid">
              <div>
                <strong>Địa chỉ</strong>
                <p>{store.address}</p>
              </div>
              <div>
                <strong>Thời gian đón khách</strong>
                <p>Thứ 2 – Chủ nhật: 08:00 – 20:00<br />(Mở cửa cả ngày lễ)</p>
              </div>
            </div>

            <div className="store-amenities">
              <span>✓ Có chỗ đỗ ô tô & xe máy</span>
              <span>✓ Hơn 100+ loài cây trưng bày</span>
              <span>✓ Trải nghiệm phối chậu tại chỗ</span>
            </div>

            <div className="store-map-actions">
              <a
                className="button button-primary button-full"
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                ⌖ Mở Google Maps chỉ đường →
              </a>
            </div>
          </div>
        </aside>

        {/* Right Column: Interactive Consultation Form */}
        <section className="contact-form-section">
          <div className="consultation-form-card">
            {submittedCode ? (
              <div className="form-success-card">
                <div className="success-icon-badge">✓</div>
                <span className="eyebrow">Gửi thông tin thành công</span>
                <h2>Plant Shop đã nhận yêu cầu của bạn!</h2>
                <div className="request-code-box">
                  <span>Mã tiếp nhận tư vấn:</span>
                  <strong>{submittedCode}</strong>
                </div>
                <p>
                  Cảm ơn bạn <strong>{form.name}</strong>. Chúng mình sẽ liên hệ lại qua{' '}
                  <strong>{form.contact}</strong> trong vòng 15 – 30 phút theo khung giờ{' '}
                  <em>{form.preferredTime.toLowerCase()}</em>.
                </p>
                <div className="success-actions">
                  <a className="button button-primary" href={`https://zalo.me/${channels.zalo}`} target="_blank" rel="noreferrer">
                    Nhắn Zalo ngay để nhận ảnh mẫu →
                  </a>
                  <button className="button button-outline" type="button" onClick={resetForm}>
                    Gửi thêm yêu cầu khác
                  </button>
                  <Link className="button button-outline" href="/cua-hang">
                    Tiếp tục xem sản phẩm
                  </Link>
                </div>
              </div>
            ) : (
              <form className="consultation-form" onSubmit={submit}>
                <div className="form-header">
                  <span className="filter-label">Biểu mẫu tư vấn trực tuyến</span>
                  <h2>Để lại thông tin cho chúng mình</h2>
                  <p>
                    Vui lòng cung cấp một số thông tin cơ bản để kỹ thuật viên chuẩn bị phương án tốt nhất trước khi liên hệ lại.
                  </p>
                </div>

                {product && (
                  <div className="product-context-badge">
                    <span>Đang quan tâm:</span>
                    <strong>{product}</strong>
                  </div>
                )}

                {/* Topic Selector */}
                <div className="form-group">
                  <label className="form-label">Chủ đề bạn đang quan tâm</label>
                  <div className="topic-chip-grid">
                    {topics.map((t) => (
                      <button
                        type="button"
                        key={t}
                        className={`topic-chip ${form.topic === t ? 'active' : ''}`}
                        onClick={() => updateField('topic', t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row-two">
                  <label className="form-group">
                    <span className="form-label">Họ và tên *</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      required
                      placeholder="Ví dụ: Nguyễn Minh Anh"
                    />
                  </label>

                  <label className="form-group">
                    <span className="form-label">Số điện thoại hoặc Zalo *</span>
                    <input
                      type="text"
                      value={form.contact}
                      onChange={(e) => updateField('contact', e.target.value)}
                      required
                      placeholder="0909 123 456 hoặc email"
                    />
                  </label>
                </div>

                <div className="form-row-two">
                  <label className="form-group">
                    <span className="form-label">Sản phẩm hoặc vị trí quan tâm</span>
                    <input
                      type="text"
                      value={form.related}
                      onChange={(e) => updateField('related', e.target.value)}
                      placeholder={product || 'Ví dụ: Cây Kim Tiền, Ban công chung cư 6m2...'}
                    />
                  </label>

                  <label className="form-group">
                    <span className="form-label">Ngân sách dự kiến</span>
                    <select
                      value={form.budget}
                      onChange={(e) => updateField('budget', e.target.value)}
                    >
                      <option value="">Chọn khoảng ngân sách</option>
                      {budgetRanges.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="form-group">
                  <span className="form-label">Khung giờ tiện nghe máy hoặc nhận tin</span>
                  <select
                    value={form.preferredTime}
                    onChange={(e) => updateField('preferredTime', e.target.value)}
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </label>

                {/* Upload Room / Plant Photo */}
                <div className="form-group photo-upload-group">
                  <span className="form-label">Đính kèm ảnh không gian hoặc cây hiện tại (nếu có)</span>
                  <label className="photo-upload-zone">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageChange(file);
                      }}
                    />
                    <div className="upload-prompt">
                      <span>📷 {imageName ? imageName : 'Tải lên hình ảnh (JPG, PNG, WEBP tối đa 10MB)'}</span>
                      <small>Ảnh thực tế giúp chúng mình tư vấn hướng sáng và loại cây chính xác hơn.</small>
                    </div>
                  </label>
                  {uploadedUrl && (
                    <div
                      className="upload-preview"
                      style={{ backgroundImage: `url(${uploadedUrl})` }}
                      aria-label="Xem trước ảnh không gian"
                    />
                  )}
                </div>

                <label className="form-group">
                  <span className="form-label">Mô tả thêm mong muốn của bạn</span>
                  <textarea
                    rows={4}
                    value={form.need}
                    onChange={(e) => updateField('need', e.target.value)}
                    placeholder="Ví dụ: Phòng khách ít nắng trực tiếp, muốn tìm cây lọc không khí không độc hại cho mèo nuôi trong nhà..."
                  />
                </label>

                {notice && (
                  <div className={`form-notice ${notice.type}`}>
                    {notice.message}
                  </div>
                )}

                <button
                  className="button button-primary button-submit"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu tư vấn miễn phí →'}
                </button>

                <p className="form-footer-note">
                  🔒 Plant Shop cam kết bảo mật thông tin liên lạc và không gửi tin quảng cáo quấy rầy.
                </p>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* 4-Step Commitment Process */}
      <section className="contact-process">
        <div className="contact-process-heading">
          <span className="eyebrow">Quy trình chuyên nghiệp</span>
          <h2>4 Bước đồng hành cùng bạn</h2>
          <p>Từ ý tưởng ban đầu đến mảng xanh hoàn chỉnh, vững bền theo năm tháng.</p>
        </div>

        <div className="contact-process-grid">
          <article className="process-card">
            <span className="step-num">01</span>
            <h3>Tiếp nhận & Lắng nghe</h3>
            <p>Tìm hiểu diện tích, mức độ ánh sáng, phong cách nội thất và quỹ thời gian chăm sóc của bạn.</p>
          </article>
          <article className="process-card">
            <span className="step-num">02</span>
            <h3>Đề xuất giải pháp</h3>
            <p>Lên danh sách cây, chọn mẫu chậu vừa vặn và gửi bảng báo giá tối ưu không phát sinh.</p>
          </article>
          <article className="process-card">
            <span className="step-num">03</span>
            <h3>Bàn giao & Hướng dẫn</h3>
            <p>Vận chuyển cẩn thận, sắp đặt đúng vị trí và bàn giao cẩm nang chăm sóc chi tiết từng loại cây.</p>
          </article>
          <article className="process-card">
            <span className="step-num">04</span>
            <h3>Bảo hành & Đồng hành</h3>
            <p>Cam kết 1 đổi 1 trong 7 ngày. Hỗ trợ theo dõi, bắt bệnh cây trực tiếp qua Zalo trọn đời.</p>
          </article>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="contact-faq">
        <div className="contact-faq-heading">
          <span className="eyebrow">Giải đáp nhanh</span>
          <h2>Câu hỏi thường gặp</h2>
          <p>Một số thắc mắc phổ biến của khách hàng khi liên hệ với Plant Shop.</p>
        </div>

        <div className="contact-faq-list">
          {faqItems.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                key={item.q}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <strong>{item.q}</strong>
                  <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="contact-bottom-cta">
        <div className="bottom-cta-inner">
          <div>
            <span className="eyebrow">Cần cây ngay hôm nay?</span>
            <h2>Ghé thăm trực tiếp vườn ươm & showroom</h2>
            <p>Địa chỉ: {store.address} · Hotline: {store.hotline}</p>
          </div>
          <div className="bottom-cta-actions">
            <a className="button button-primary" href={`tel:${hotlineClean}`}>
              Gọi Hotline {store.hotline}
            </a>
            <Link className="button button-outline" href="/cua-hang">
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
