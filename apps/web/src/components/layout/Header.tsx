'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { navigation } from '@/config/navigation';
import { SearchButton } from './SearchButton';

type CartEntry = { quantity: number };
const megaPreviewImages: Record<string, string> = { 'Cây cảnh': '/assets/images/cat-indoor.jpg', 'Chậu & vật tư': '/assets/images/cat-pots.jpg', 'Hoa & quà tặng': '/assets/images/cat-services.jpg', 'Tư vấn & thiết kế': '/assets/images/cat-outdoor.jpg', 'Chăm sóc cây': '/assets/images/cat-services.jpg', 'Thi công & cho thuê': '/assets/images/cat-indoor.jpg', 'Đọc & học': '/assets/images/cat-desk.jpg', 'Dự án & truyền thông': '/assets/images/cat-outdoor.jpg', 'Cộng đồng': '/assets/images/cat-services.jpg' };

export function Header({ staticSite = false }: { staticSite?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [language, setLanguage] = useState('vi');
  const [openMegaSection, setOpenMegaSection] = useState<string | null>(null);

  useEffect(() => {
    function syncCart() {
      const saved = window.localStorage.getItem('plant_shop_cart');
      if (!saved) return setCartCount(0);
      try {
        const items = JSON.parse(saved) as CartEntry[];
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      } catch {
        setCartCount(0);
      }
    }
    function syncAuth() {
      const authenticated = window.localStorage.getItem('plant_shop_authenticated') === 'true';
      const customer = window.localStorage.getItem('plant_shop_customer');
      const role = window.localStorage.getItem('plant_shop_role');
      if (!authenticated || !customer) {
        setCustomerName('');
        setIsAdmin(false);
        return;
      }
      try {
        const profile = JSON.parse(customer) as { name?: string };
        setCustomerName(profile.name || 'Khách hàng');
        setIsAdmin(role === 'admin');
      } catch { setCustomerName('Khách hàng'); setIsAdmin(false); }
    }
    syncCart();
    syncAuth();
    setLanguage(window.localStorage.getItem('plant_shop_language') || 'vi');
    window.addEventListener('plant-shop-cart-updated', syncCart);
    window.addEventListener('plant-shop-auth-updated', syncAuth);
    return () => { window.removeEventListener('plant-shop-cart-updated', syncCart); window.removeEventListener('plant-shop-auth-updated', syncAuth); };
  }, []);

  function logout() {
    window.localStorage.removeItem('plant_shop_authenticated');
    window.localStorage.removeItem('plant_shop_role');
    window.dispatchEvent(new Event('plant-shop-auth-updated'));
    setAccountMenuOpen(false);
  }

  function changeLanguage(nextLanguage: string) {
    setLanguage(nextLanguage);
    window.localStorage.setItem('plant_shop_language', nextLanguage);
    document.documentElement.lang = nextLanguage;
  }

  const isHomePage = pathname === '/';

  return (
    <header className="store-header">
      <div className="container store-header-inner">
        <div className="store-header-top">
          <Link className="brand" href="/">
            <span className="brand-mark">PS</span>
            <span><strong>Plant</strong> Shop<small>cây xanh cho đời sống</small></span>
          </Link>
          <div className="header-actions">
            <SearchButton />
            <span className="hotline">HOTLINE: 0909 123 456</span>
            <Link className="cart-button" href="/gio-hang"><span className="cart-label">Giỏ hàng</span><span>{cartCount}</span></Link>
            {!staticSite && isAdmin && <Link className="pos-link" href="/admin/pos">POS</Link>}
            {customerName ? (
              <div className="account-menu-wrap">
                <button
                  className="customer-avatar"
                  type="button"
                  title={customerName}
                  aria-label={`Tài khoản ${customerName}`}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                >
                  {customerName.slice(0, 1).toUpperCase()}
                </button>
                {accountMenuOpen && (
                  <div className="account-menu">
                    {!isAdmin && (
                      <Link href="/tai-khoan" onClick={() => setAccountMenuOpen(false)}>
                        Tài khoản của tôi
                      </Link>
                    )}
                    <label>
                      Ngôn ngữ
                      <select value={language} onChange={(event) => changeLanguage(event.target.value)}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </label>
                    <button type="button" onClick={logout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="admin-entry" href="/dang-nhap">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
        <nav className="desktop-nav" aria-label="Menu chính">
          {navigation.map((item) => item.children ? (
            <div className={`nav-dropdown${item.label === 'Dịch vụ' ? ' nav-dropdown-service' : ''}${item.megaSections ? ' nav-dropdown-mega' : ''}`} key={`${item.label}-${item.href}`}>
              <button className={`nav-dropdown-trigger${pathname === item.href || pathname.startsWith(`${item.href}/`) ? ' active' : ''}`} type="button" onClick={() => router.push(item.href)}>{isHomePage && item.label === 'Thư viện & câu chuyện' ? 'Tin tức và sự kiện' : item.label}</button>
              {item.megaSections ? (
                <div className="nav-dropdown-menu nav-mega-menu">
                  <div className="mega-heading"><strong>{item.label === 'Dịch vụ' ? 'Chăm chút một không gian xanh' : item.label === 'Thư viện & câu chuyện' ? 'Đọc, xem và hiểu thêm về cây' : 'Chọn một góc xanh'}</strong><span>{item.label === 'Dịch vụ' ? 'Từ tư vấn, chăm cây đến thi công.' : item.label === 'Thư viện & câu chuyện' ? 'Câu chuyện, video và những dự án xanh của Plant Shop.' : 'Cây, chậu và quà tặng được chọn kỹ.'}</span></div>
                  <div className="mega-columns">
                    {item.megaSections.map((section) => <div className="mega-column" key={`${section.title}-${section.href}`}><div className="mega-title-row"><Link className="mega-title" href={section.href}>{section.title}<span>›</span></Link><button className="mega-accordion-toggle" type="button" aria-label={`Mở ${section.title}`} aria-expanded={openMegaSection === section.title} onClick={() => setOpenMegaSection((current) => current === section.title ? null : section.title)}>⌄</button><span className="mega-preview" style={{ backgroundImage: `url(${megaPreviewImages[section.title] || '/assets/images/hero.jpg'})` }} /></div><div className={`mega-submenu${openMegaSection === section.title ? ' is-open' : ''}`}><div className="mega-submenu-heading">{section.items.length} mục</div>{section.items.map((child) => <Link key={`${child.label}-${child.href}`} href={child.href}>{child.label}</Link>)}{section.note && <small>{section.note}</small>}</div></div>)}
                  </div>
                  <Link className="mega-all" href={item.href}>Xem toàn bộ</Link>
                </div>
              ) : <div className="nav-dropdown-menu">{((item as { children?: { label: string; href: string }[] }).children ?? []).map((child) => <Link key={child.href} href={child.href}>{child.label}</Link>)}</div>}
            </div>
          ) : <Link key={item.href} href={item.href}>{isHomePage && item.label === 'Thư viện & câu chuyện' ? 'Tin tức và sự kiện' : item.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
