'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const services = [
  { group: 'Tư vấn & thiết kế', id: 'thiet-ke-canh-quan', title: 'Thi công · thiết kế cây', text: 'Tư vấn cảnh quan và triển khai mảng xanh cho sân vườn, biệt thự, đường phố, trường học và văn phòng.', image: '/assets/images/cat-outdoor.jpg' },
  { group: 'Chăm sóc cây', id: 'cham-soc-canh-quan', title: 'Chăm sóc cảnh quan', text: 'Lập lịch bảo dưỡng, cắt tỉa, thay đất, xử lý sâu bệnh và duy trì vẻ khỏe đẹp của khu vườn.', image: '/assets/images/cat-services.jpg' },
  { group: 'Thi công & cho thuê', id: 'thue-doi-cay', title: 'Thuê cây · đổi cây mới', text: 'Giải pháp linh hoạt cho văn phòng, cửa hàng và sự kiện: thuê cây cũ, đổi cây mới theo mùa.', image: '/assets/images/cat-indoor.jpg' },
];
const groups = ['Tất cả dịch vụ', ...Array.from(new Set(services.map((service) => service.group)))];
const serviceCounts = groups.reduce<Record<string, number>>((counts, group) => {
  counts[group] = group === groups[0] ? services.length : services.filter((service) => service.group === group).length;
  return counts;
}, {});
const timeline = [
  { title: 'Khảo sát', text: 'Tìm hiểu không gian, ánh sáng và nhu cầu thực tế.' },
  { title: 'Đề xuất', text: 'Gửi phương án cây, chậu, ngân sách và tiến độ.' },
  { title: 'Thi công', text: 'Triển khai, bố trí và bàn giao theo kế hoạch.' },
  { title: 'Chăm sóc', text: 'Theo dõi định kỳ để mảng xanh luôn khỏe đẹp.' },
];

type QuoteForm = { name: string; contact: string; budget: string; note: string; service: string };

export default function ServicesPage() {
  const [activeGroup, setActiveGroup] = useState(groups[0]);
  const [form, setForm] = useState<QuoteForm>({ name: '', contact: '', budget: '', note: '', service: services[0].title });
  const [imageName, setImageName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [notice, setNotice] = useState('');
  const visible = activeGroup === groups[0] ? services : services.filter((service) => service.group === activeGroup);

  function update(field: keyof QuoteForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function uploadImage(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setNotice('Ảnh vượt quá giới hạn 10MB.');
      return;
    }
    setImageName(file.name);
    setUploadProgress(8);
    setUploadedUrl('');
    const data = new FormData();
    data.append('file', file);
    const request = new XMLHttpRequest();
    request.open('POST', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/media/public-upload`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) setUploadProgress(Math.max(8, Math.round((event.loaded / event.total) * 100)));
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        const payload = JSON.parse(request.responseText) as { url?: string };
        setUploadedUrl(payload.url || URL.createObjectURL(file));
        setUploadProgress(100);
        setNotice('');
      } else {
        setUploadedUrl(URL.createObjectURL(file));
        setUploadProgress(100);
        setNotice('Ảnh đã lưu tạm trên trình duyệt. Có thể gửi yêu cầu và đính kèm lại khi shop liên hệ.');
      }
    };
    request.onerror = () => {
      setUploadedUrl(URL.createObjectURL(file));
      setUploadProgress(100);
      setNotice('Không kết nối được máy chủ upload. Ảnh xem trước vẫn được đính kèm vào yêu cầu.');
    };
    request.send(data);
  }

  function requestQuote(serviceTitle: string) {
    setForm((current) => ({ ...current, service: serviceTitle }));
    document.getElementById('bao-gia')?.scrollIntoView({ behavior: 'smooth' });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const existing = JSON.parse(window.localStorage.getItem('plant_shop_consultations') || '[]') as Array<Record<string, unknown>>;
    existing.unshift({
      id: `quote-${Date.now()}`,
      name: form.name,
      contact: form.contact,
      need: form.note || 'Yêu cầu báo giá dịch vụ',
      related: form.service,
      service: form.service,
      budget: form.budget,
      imageName,
      imageUrl: uploadedUrl,
      sourceUrl: window.location.href,
      createdAt: new Date().toISOString(),
      status: 'new',
      assignee: '',
    });
    window.localStorage.setItem('plant_shop_consultations', JSON.stringify(existing));
    setNotice('Đã nhận yêu cầu báo giá. Plant Shop sẽ liên hệ lại để khảo sát.');
    setForm({ name: '', contact: '', budget: '', note: '', service: services[0].title });
    setImageName('');
    setUploadedUrl('');
    setUploadProgress(0);
  }

  return (
    <main className="service-page container">
      <nav className="page-breadcrumb" aria-label="Breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><strong>Dịch vụ</strong></nav>
      <section className="service-hero">
        <div>
          <span className="eyebrow">Dịch vụ & hệ sinh thái Plant Shop</span>
          <h1>Từ một góc nhỏ<br /><em>đến cả cảnh quan.</em></h1>
          <p>Plant Shop tư vấn, thiết kế, thi công và chăm sóc cây theo không gian thật của bạn.</p>
          <a className="button button-primary" href="#bao-gia">Nhận báo giá dự án →</a>
        </div>
        <div className="service-hero-image" style={{ backgroundImage: "url('/assets/images/cat-outdoor.jpg')" }} />
      </section>
      <div className="service-directory">
        <aside className="mega-sidebar service-sidebar">
          <span className="filter-label">Dịch vụ</span>
          <strong>Chọn nhóm nội dung</strong>
          {groups.map((group) => (
            <button className={activeGroup === group ? 'active' : ''} type="button" key={group} onClick={() => setActiveGroup(group)}>
              <span>{group} · {serviceCounts[group]}</span><b>›</b>
            </button>
          ))}
          <small>Chọn một nhóm để lọc nội dung bên phải.</small>
        </aside>
        <section className="service-results">
          <div className="service-results-heading">
            <span className="eyebrow">{activeGroup}</span>
            <h2>{activeGroup === groups[0] ? 'Tất cả dịch vụ xanh.' : activeGroup}</h2>
          </div>
          <div className="service-grid">
            {visible.map((service) => (
              <article className="service-card" id={service.id} key={service.title}>
                <div className="service-card-image" style={{ backgroundImage: `url(${service.image})` }} />
                <div>
                  <span className="eyebrow">Plant Shop service</span>
                  <h2>{service.title}</h2>
                  <p>{service.text}</p>
                  <button className="service-quote-link" type="button" onClick={() => requestQuote(service.title)}>Nhận báo giá →</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <section className="service-timeline">
        <div>
          <span className="eyebrow">Cách Plant Shop đồng hành</span>
          <h2>Một quy trình rõ ràng<br /><em>từ khảo sát đến chăm sóc.</em></h2>
        </div>
        <div className="service-timeline-grid">
          {timeline.map((step, index) => (
            <article key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>
          ))}
        </div>
      </section>
      <section className="service-quote" id="bao-gia">
        <div>
          <span className="eyebrow">Báo giá theo không gian</span>
          <h2>Gửi chúng mình vài thông tin.</h2>
          <p>Ảnh không gian giúp đội ngũ tư vấn sát hơn. File JPG, PNG hoặc WEBP, tối đa 10MB.</p>
        </div>
        <form className="service-quote-form" onSubmit={submit}>
          <label>Họ và tên<input value={form.name} onChange={(event) => update('name', event.target.value)} required placeholder="Nguyễn Minh Anh" /></label>
          <label>Số điện thoại hoặc email<input value={form.contact} onChange={(event) => update('contact', event.target.value)} required placeholder="0909 123 456 hoặc email" /></label>
          <label>Dịch vụ quan tâm
            <select value={form.service} onChange={(event) => update('service', event.target.value)} required>
              {services.map((service) => <option key={service.title}>{service.title}</option>)}
            </select>
          </label>
          <label>Ngân sách dự kiến
            <select value={form.budget} onChange={(event) => update('budget', event.target.value)} required>
              <option value="">Chọn khoảng ngân sách</option>
              <option>Dưới 5 triệu</option>
              <option>5 - 20 triệu</option>
              <option>20 - 50 triệu</option>
              <option>Trên 50 triệu</option>
            </select>
          </label>
          <label>Ảnh không gian
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadImage(file); }} />
            <small>{imageName ? `${imageName}${uploadProgress && uploadProgress < 100 ? ` · đang tải ${uploadProgress}%` : ' · đã sẵn sàng'}` : 'JPG, PNG hoặc WEBP · tối đa 10MB'}</small>
          </label>
          {uploadedUrl && <div className="quote-preview" style={{ backgroundImage: `url(${uploadedUrl})` }} aria-label="Xem trước ảnh không gian" />}
          <label>Nhu cầu<textarea value={form.note} onChange={(event) => update('note', event.target.value)} rows={4} placeholder="Diện tích, phong cách, thời gian dự kiến..." /></label>
          <button className="button button-primary" type="submit">Gửi yêu cầu báo giá →</button>
          {notice && <p className="form-success" role="status">{notice}</p>}
        </form>
      </section>
      <section className="service-audience">
        <span className="eyebrow">Không gian phục vụ</span>
        <h2>Sân vườn · Biệt thự · Đường phố · Trường học · Văn phòng</h2>
        <p>Từ một chậu cây đặt sảnh đến hệ sinh thái cảnh quan hoàn chỉnh, đội ngũ sẽ đề xuất phương án theo ngân sách, ánh sáng và lịch vận hành.</p>
      </section>
    </main>
  );
}
