'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';
const demoCustomer = { email: 'customer@plantshop.vn', password: 'customer123', name: 'Khách hàng Plant Shop', phone: '0909 000 111' };

export function CustomerAuthForm({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [logo, setLogo] = useState('');
  const router = useRouter();

  useEffect(() => {
    setLogo(window.localStorage.getItem('plant_shop_logo') || '');
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isRegister && password !== confirmPassword) {
      setForgotMessage('Mật khẩu xác nhận chưa khớp.');
      return;
    }
    let role = 'customer';
    if (!isRegister) {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (response.ok) role = 'admin';
    }
    const isDemoCustomer = !isRegister && email.toLowerCase() === demoCustomer.email && password === demoCustomer.password;
    window.localStorage.setItem('plant_shop_customer', JSON.stringify({
      name: role === 'admin' ? 'Quản trị viên' : (isDemoCustomer ? demoCustomer.name : (isRegister ? name : email.split('@')[0])),
      email,
      phone: isDemoCustomer ? demoCustomer.phone : phone,
      address: '',
    }));
    window.localStorage.setItem('plant_shop_authenticated', 'true');
    window.localStorage.setItem('plant_shop_role', role);
    window.dispatchEvent(new Event('plant-shop-auth-updated'));
    const nextPath = new URLSearchParams(window.location.search).get('next');
    router.push(nextPath?.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/');
  }

  return (
    <main className={`auth-page${isRegister ? ' is-register' : ' is-login'}`}>
      <section className="auth-card">
        <div className="auth-heading"><span className="eyebrow">{isRegister ? 'Bắt đầu hành trình xanh' : 'Chào mừng trở lại'}</span><h1>{isRegister ? <>Tạo tài khoản<br /><em>của bạn.</em></> : <>Đăng nhập<br /><em>vào khu vườn.</em></>}</h1><p>{isRegister ? 'Lưu lại những lựa chọn yêu thích và nhận thêm cảm hứng chăm cây mỗi tuần.' : 'Theo dõi đơn hàng, lưu cây yêu thích và nhận ưu đãi dành riêng cho bạn.'}</p></div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && <label>Họ và tên<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nguyễn Minh Anh" required /></label>}
          <label>{isRegister ? 'Email' : 'Email hoặc số điện thoại'}<input type={isRegister ? 'email' : 'text'} value={email} onChange={(event) => setEmail(event.target.value)} placeholder={isRegister ? 'you@example.com' : 'you@example.com hoặc 0909 123 456'} required /></label>
          {isRegister && <label>Số điện thoại<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0909 123 456" required /></label>}
          <label>Mật khẩu<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tối thiểu 8 ký tự" minLength={8} required /></label>
          {isRegister && <label>Xác nhận mật khẩu<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Nhập lại mật khẩu" minLength={8} required /></label>}
          {isRegister && <label className="auth-check"><input type="checkbox" required /> <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.</span></label>}
          {!isRegister && <button className="auth-forgot" type="button" onClick={() => setForgotMessage('Liên kết khôi phục sẽ được gửi đến thông tin tài khoản của bạn.')}>Quên mật khẩu?</button>}
          {forgotMessage && <p className="auth-form-message" role="status">{forgotMessage}</p>}
          <button className="button button-primary auth-submit" type="submit">{isRegister ? 'Tạo tài khoản →' : 'Đăng nhập →'}</button>
        </form>
        <div className="auth-switch">{isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} <Link href={isRegister ? '/dang-nhap' : '/dang-ky'}>{isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}</Link></div>
      </section>
      <aside className={`auth-visual ${isRegister ? 'register-visual' : ''}`}><div className="auth-logo-orbit">{logo ? <img src={logo} alt="Logo Plant Shop" /> : <span>PS</span>}</div><div className="auth-visual-copy"><span>PLANT SHOP · GREEN LIVING</span><strong>{isRegister ? 'Gieo một thói quen xanh.' : 'Một góc xanh\ncho mỗi ngày.'}</strong><small>Chọn cây. Chăm nhà. Chăm mình.</small></div></aside>
    </main>
  );
}
