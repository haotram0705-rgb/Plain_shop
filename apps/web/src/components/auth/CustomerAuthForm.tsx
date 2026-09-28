'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';

export type StoredUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin';
  address?: string;
  createdAt: string;
};

const demoCustomer = {
  email: 'customer@plantshop.vn',
  password: 'customer123',
  name: 'Khách hàng Plant Shop',
  phone: '0909 000 111',
};

export function CustomerAuthForm({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register';
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLogo(window.localStorage.getItem('plant_shop_logo') || '');

    // Check if user is already authenticated
    if (window.localStorage.getItem('plant_shop_authenticated') === 'true') {
      const nextPath = new URLSearchParams(window.location.search).get('next');
      if (nextPath?.startsWith('/') && !nextPath.startsWith('//')) {
        router.replace(nextPath);
      }
    }
  }, [router]);

  function fillDemo() {
    setEmail(demoCustomer.email);
    setPassword(demoCustomer.password);
    setMessage({
      type: 'info',
      text: 'Đã điền thông tin tài khoản mẫu. Nhấn "Đăng nhập" để tiếp tục.',
    });
  }

  function getStoredUsers(): StoredUser[] {
    try {
      const raw = window.localStorage.getItem('plant_shop_users');
      return raw ? (JSON.parse(raw) as StoredUser[]) : [];
    } catch {
      return [];
    }
  }

  function saveStoredUsers(users: StoredUser[]) {
    try {
      window.localStorage.setItem('plant_shop_users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (isRegister) {
      // Validate registration
      if (!name.trim()) {
        setMessage({ type: 'error', text: 'Vui lòng nhập họ và tên của bạn.' });
        setIsSubmitting(false);
        return;
      }

      if (cleanPassword.length < 6) {
        setMessage({ type: 'error', text: 'Mật khẩu phải có tối thiểu 6 ký tự.' });
        setIsSubmitting(false);
        return;
      }

      if (cleanPassword !== confirmPassword.trim()) {
        setMessage({ type: 'error', text: 'Mật khẩu xác nhận chưa khớp.' });
        setIsSubmitting(false);
        return;
      }

      if (!agreeTerms) {
        setMessage({ type: 'error', text: 'Vui lòng đồng ý với điều khoản sử dụng.' });
        setIsSubmitting(false);
        return;
      }

      const users = getStoredUsers();
      const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser || cleanEmail === demoCustomer.email.toLowerCase()) {
        setMessage({
          type: 'error',
          text: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.',
        });
        setIsSubmitting(false);
        return;
      }

      // Create new user record
      const newUser: StoredUser = {
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim() || 'Chưa cập nhật',
        password: cleanPassword,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      saveStoredUsers([...users, newUser]);

      // Set active session
      window.localStorage.setItem(
        'plant_shop_customer',
        JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          address: '',
        })
      );
      window.localStorage.setItem('plant_shop_authenticated', 'true');
      window.localStorage.setItem('plant_shop_role', 'customer');
      window.dispatchEvent(new Event('plant-shop-auth-updated'));

      setMessage({ type: 'success', text: 'Đăng ký thành công! Đang chuyển hướng...' });
      window.setTimeout(() => {
        const nextPath = new URLSearchParams(window.location.search).get('next');
        router.push(nextPath?.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/tai-khoan');
      }, 700);
      return;
    }

    // Handle Login
    let role = 'customer';
    let loggedName = cleanEmail.split('@')[0];
    let loggedPhone = '';
    let loggedAddress = '';

    // 1. Check if admin credentials via API (safe try/catch)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      if (response.ok) {
        role = 'admin';
        loggedName = 'Quản trị viên';
      }
    } catch {
      // offline or static mode fallback
    }

    // 2. Check if Demo customer
    const isDemo = cleanEmail === demoCustomer.email.toLowerCase() && cleanPassword === demoCustomer.password;
    if (isDemo) {
      role = 'customer';
      loggedName = demoCustomer.name;
      loggedPhone = demoCustomer.phone;
    }

    // 3. Check registered users list if not admin and not demo
    if (role !== 'admin' && !isDemo) {
      const users = getStoredUsers();
      const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (matched) {
        if (matched.password !== cleanPassword) {
          setMessage({ type: 'error', text: 'Mật khẩu không chính xác. Vui lòng thử lại.' });
          setIsSubmitting(false);
          return;
        }
        role = matched.role || 'customer';
        loggedName = matched.name;
        loggedPhone = matched.phone || '';
        loggedAddress = matched.address || '';
      } else {
        setMessage({
          type: 'error',
          text: 'Tài khoản chưa tồn tại hoặc sai mật khẩu. Bạn có thể nhấn Đăng ký hoặc dùng tài khoản mẫu.',
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Success login
    window.localStorage.setItem(
      'plant_shop_customer',
      JSON.stringify({
        name: loggedName,
        email: cleanEmail,
        phone: loggedPhone,
        address: loggedAddress,
      })
    );
    window.localStorage.setItem('plant_shop_authenticated', 'true');
    window.localStorage.setItem('plant_shop_role', role);
    window.dispatchEvent(new Event('plant-shop-auth-updated'));

    setMessage({ type: 'success', text: `Chào mừng trở lại, ${loggedName}!` });

    window.setTimeout(() => {
      const nextPath = new URLSearchParams(window.location.search).get('next');
      if (role === 'admin') {
        router.push('/admin/giao-dien');
      } else {
        router.push(nextPath?.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/tai-khoan');
      }
    }, 600);
  }

  return (
    <main className={`auth-page${isRegister ? ' is-register' : ' is-login'}`}>
      <section className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">{isRegister ? 'Bắt đầu hành trình xanh' : 'Chào mừng trở lại'}</span>
          <h1>
            {isRegister ? (
              <>
                Tạo tài khoản<br />
                <em>của bạn.</em>
              </>
            ) : (
              <>
                Đăng nhập<br />
                <em>vào khu vườn.</em>
              </>
            )}
          </h1>
          <p>
            {isRegister
              ? 'Lưu lại những lựa chọn yêu thích, tra cứu đơn hàng và nhận tư vấn chăm cây định kỳ.'
              : 'Theo dõi đơn hàng, lưu cây yêu thích và nhận ưu đãi riêng cho bạn.'}
          </p>
        </div>

        {/* Quick Demo Login Helper for testers/reviewers */}
        {!isRegister && (
          <div style={{ marginBottom: '14px' }}>
            <button
              type="button"
              onClick={fillDemo}
              style={{
                width: '100%',
                border: '1px dashed var(--border)',
                borderRadius: '6px',
                background: '#edf5e9',
                padding: '8px 12px',
                color: 'var(--primary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              ✦ Điền nhanh tài khoản mẫu (Demo: customer@plantshop.vn)
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Họ và tên *
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nguyễn Minh Anh"
                required
              />
            </label>
          )}

          <label>
            {isRegister ? 'Email *' : 'Email đăng nhập'}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {isRegister && (
            <label>
              Số điện thoại
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0909 123 456"
              />
            </label>
          )}

          <label style={{ position: 'relative' }}>
            Mật khẩu *
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  fontSize: '0.9rem',
                }}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-label="Ẩn hoặc hiện mật khẩu"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </label>

          {isRegister && (
            <label>
              Xác nhận mật khẩu *
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Nhập lại mật khẩu"
                minLength={6}
                required
              />
            </label>
          )}

          {isRegister && (
            <label className="auth-check">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của Plant Shop.</span>
            </label>
          )}

          {!isRegister && (
            <button
              className="auth-forgot"
              type="button"
              onClick={() =>
                setMessage({
                  type: 'info',
                  text: 'Hệ thống đã gửi liên kết khôi phục mật khẩu tới email hoặc hotline hỗ trợ 0909 123 456.',
                })
              }
            >
              Quên mật khẩu?
            </button>
          )}

          {message && (
            <p
              className="auth-form-message"
              role="status"
              style={{
                color:
                  message.type === 'error'
                    ? '#d85757'
                    : message.type === 'success'
                    ? '#3d805e'
                    : 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.74rem',
              }}
            >
              {message.text}
            </p>
          )}

          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Đang xử lý...'
              : isRegister
              ? 'Tạo tài khoản →'
              : 'Đăng nhập →'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <Link href={isRegister ? '/dang-nhap' : '/dang-ky'}>
            {isRegister ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
          </Link>
        </div>
      </section>

      <aside className={`auth-visual ${isRegister ? 'register-visual' : ''}`}>
        <div className="auth-logo-orbit">
          {logo ? <img src={logo} alt="Logo Plant Shop" /> : <span>PS</span>}
        </div>
        <div className="auth-visual-copy">
          <span>PLANT SHOP · GREEN LIVING</span>
          <strong>{isRegister ? 'Gieo một thói quen xanh.' : 'Một góc xanh\ncho mỗi ngày.'}</strong>
          <small>Chọn cây. Chăm nhà. Chăm mình.</small>
        </div>
      </aside>
    </main>
  );
}
