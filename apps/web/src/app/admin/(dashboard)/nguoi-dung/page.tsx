'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type UserRole = 'admin' | 'customer';
type UserStatus = 'Hoạt động' | 'Tạm khóa';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

const defaultUsers: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Lan Nguyễn (Quản trị viên)',
    email: 'admin@plantshop.vn',
    phone: '0909 123 456',
    role: 'admin',
    status: 'Hoạt động',
    createdAt: '01/01/2026',
  },
  {
    id: 'usr-2',
    name: 'Khách hàng Plant Shop',
    email: 'customer@plantshop.vn',
    phone: '0909 000 111',
    role: 'customer',
    status: 'Hoạt động',
    createdAt: '15/05/2026',
  },
  {
    id: 'usr-3',
    name: 'Nguyễn Minh Anh',
    email: 'minhanh.nguyen@gmail.com',
    phone: '0909 123 456',
    role: 'customer',
    status: 'Hoạt động',
    createdAt: '21/09/2026',
  },
  {
    id: 'usr-4',
    name: 'Trần Hoàng Nam',
    email: 'nam.tran@company.com',
    phone: '0908 222 333',
    role: 'customer',
    status: 'Hoạt động',
    createdAt: '20/09/2026',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(defaultUsers);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tất cả');
  const [notice, setNotice] = useState('');

  // Form state for creating a new user / staff member
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('plant_shop_users');
    if (raw) {
      try {
        const stored = JSON.parse(raw) as Array<{
          name: string;
          email: string;
          phone: string;
          role?: UserRole;
          createdAt?: string;
        }>;
        const mapped: AdminUser[] = stored.map((u, i) => ({
          id: `usr-reg-${i + 1}`,
          name: u.name,
          email: u.email,
          phone: u.phone || 'Chưa cập nhật',
          role: u.role || 'customer',
          status: 'Hoạt động',
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Gần đây',
        }));

        // Merge with root admin
        const merged = [
          defaultUsers[0],
          ...mapped.filter((m) => m.email !== defaultUsers[0].email),
        ];
        setUsers(merged);
      } catch {
        // ignore
      }
    }
  }, []);

  function notify(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2200);
  }

  function persist(next: AdminUser[], action: string) {
    setUsers(next);
    const syncUsers = next.map((u) => ({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
    }));
    window.localStorage.setItem('plant_shop_users', JSON.stringify(syncUsers));

    try {
      const log = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]');
      log.unshift({ time: new Date().toISOString(), section: 'Người dùng', action });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(log.slice(0, 100)));
    } catch {
      // ignore
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      alert('Email này đã tồn tại trong danh sách tài khoản.');
      return;
    }

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || 'Chưa cập nhật',
      role,
      status: 'Hoạt động',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };

    const next = [newUser, ...users];
    persist(next, `Thêm tài khoản ${newUser.name} (${newUser.role})`);
    setName('');
    setEmail('');
    setPhone('');
    notify(`Đã thêm tài khoản ${newUser.name}.`);
  }

  function toggleStatus(id: string) {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    if (target.email === 'admin@plantshop.vn') {
      alert('Không thể khóa tài khoản quản trị viên chính.');
      return;
    }
    const nextStatus: UserStatus = target.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động';
    const next = users.map((u) => (u.id === id ? { ...u, status: nextStatus } : u));
    persist(next, `Đổi trạng thái tài khoản ${target.name} sang ${nextStatus}`);
    notify(`Đã ${nextStatus.toLowerCase()} tài khoản.`);
  }

  function removeUser(id: string) {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    if (target.email === 'admin@plantshop.vn') {
      alert('Không thể xóa tài khoản quản trị viên chính.');
      return;
    }
    if (!window.confirm(`Xác nhận xóa tài khoản "${target.name}"?`)) return;
    const next = users.filter((u) => u.id !== id);
    persist(next, `Xóa tài khoản ${target.name}`);
    notify('Đã xóa tài khoản.');
  }

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === 'Tất cả' || u.role === roleFilter;
      const matchText = `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(query.toLowerCase());
      return matchRole && matchText;
    });
  }, [users, roleFilter, query]);

  return (
    <div className="admin-crud-page">
      <div className="admin-page-title">
        <div>
          <span className="eyebrow">Tài khoản & Phân quyền</span>
          <h2>Quản lý người dùng</h2>
          <p>Quản lý tài khoản nhân viên thu ngân POS và khách hàng thân thiết đã đăng ký.</p>
        </div>
        <span className="admin-record-count">{users.length} tài khoản</span>
      </div>

      <div className="admin-crud-layout">
        {/* Left Form: Add User */}
        <form className="admin-crud-form" onSubmit={handleSubmit}>
          <span className="filter-label">Thêm mới</span>
          <h3>Tạo tài khoản</h3>

          <label>
            Họ và tên
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
            />
          </label>

          <label>
            Địa chỉ Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhanvien@plantshop.vn"
              required
            />
          </label>

          <label>
            Số điện thoại
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0909 000 888"
            />
          </label>

          <label>
            Vai trò hệ thống
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="customer">Khách hàng thành viên</option>
              <option value="admin">Quản trị viên / Thu ngân</option>
            </select>
          </label>

          <button className="button button-primary" type="submit" style={{ marginTop: 12 }}>
            + Thêm người dùng
          </button>
        </form>

        {/* Right List */}
        <section className="admin-crud-list">
          <div className="admin-list-toolbar">
            <label className="admin-inline-search">
              ⌕
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm tên, email, SĐT..."
              />
            </label>

            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="Tất cả">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="customer">Khách hàng</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((user) => (
              <article
                key={user.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 1.4fr) 100px 90px 140px',
                  gap: 12,
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: '#fff',
                  border: '1px solid #edf0eb',
                  borderRadius: 8,
                }}
              >
                <div>
                  <strong style={{ color: '#123f32', fontSize: '0.85rem' }}>{user.name}</strong>
                  <div style={{ fontSize: '0.68rem', color: '#789083' }}>
                    {user.email} · {user.phone}
                  </div>
                  <small style={{ fontSize: '0.62rem', color: '#9cb5a6' }}>
                    Tạo ngày: {user.createdAt}
                  </small>
                </div>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      background: user.role === 'admin' ? '#e7f3e9' : '#f0f5ee',
                      color: user.role === 'admin' ? '#123f32' : '#556c60',
                    }}
                  >
                    {user.role === 'admin' ? 'Quản trị' : 'Khách hàng'}
                  </span>
                </div>

                <button
                  type="button"
                  className={`admin-status ${user.status === 'Hoạt động' ? 'is-visible' : ''}`}
                  onClick={() => toggleStatus(user.id)}
                  title="Nhấn để đổi trạng thái"
                >
                  {user.status}
                </button>

                <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                  {user.email !== 'admin@plantshop.vn' && (
                    <button type="button" onClick={() => removeUser(user.id)}>
                      Xóa
                    </button>
                  )}
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="admin-empty-state">Không tìm thấy người dùng phù hợp.</div>
            )}
          </div>
        </section>
      </div>

      {notice && <div className="admin-save-notice">✦ {notice}</div>}
    </div>
  );
}
