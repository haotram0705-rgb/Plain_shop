'use client';

import { useEffect, useState } from 'react';
type Consultation = { id: string; name: string; contact: string; need: string; related: string; sourceUrl: string; createdAt: string; status: 'new' | 'processing' | 'completed'; assignee: string };
const staff = ['Chưa phân công', 'Nhân viên bán hàng', 'Lan Nguyễn'];

export default function AdminConsultationsPage() {
  const [requests, setRequests] = useState<Consultation[]>([]);
  useEffect(() => { setRequests(JSON.parse(window.localStorage.getItem('plant_shop_consultations') || '[]') as Consultation[]); }, []);
  function save(next: Consultation[]) { setRequests(next); window.localStorage.setItem('plant_shop_consultations', JSON.stringify(next)); }
  function update(id: string, field: 'status' | 'assignee', value: string) { save(requests.map((request) => request.id === id ? { ...request, [field]: value } as Consultation : request)); }
  return <div className="admin-consultations"><div className="admin-page-title"><div><span className="eyebrow">CRM · Yêu cầu khách hàng</span><h2>Quản lý tư vấn</h2><p>Tiếp nhận, phân công và theo dõi các yêu cầu từ storefront.</p></div><strong>{requests.filter((request) => request.status === 'new').length} yêu cầu mới</strong></div><section className="admin-table-panel">{requests.length === 0 ? <div className="admin-empty-state"><span>✦</span><h3>Chưa có yêu cầu tư vấn</h3><p>Các biểu mẫu gửi từ trang liên hệ sẽ xuất hiện tại đây.</p></div> : <div className="consultation-list">{requests.map((request) => <article className="consultation-row" key={request.id}><div><span className={`status-pill status-${request.status}`}>{request.status === 'new' ? 'Mới' : request.status === 'processing' ? 'Đang xử lý' : 'Hoàn tất'}</span><h3>{request.name}</h3><p>{request.contact} · {request.related || 'Chưa chọn sản phẩm/dịch vụ'}</p><p>{request.need}</p><a href={request.sourceUrl} target="_blank" rel="noreferrer">Mở nguồn yêu cầu ↗</a></div><div className="consultation-controls"><label>Trạng thái<select value={request.status} onChange={(event) => update(request.id, 'status', event.target.value)}><option value="new">Mới</option><option value="processing">Đang xử lý</option><option value="completed">Hoàn tất</option></select></label><label>Phân công<select value={request.assignee || staff[0]} onChange={(event) => update(request.id, 'assignee', event.target.value)}>{staff.map((person) => <option key={person}>{person}</option>)}</select></label><small>{new Date(request.createdAt).toLocaleString('vi-VN')}</small></div></article>)}</div>}</section></div>;
}
