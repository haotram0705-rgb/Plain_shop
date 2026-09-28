import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom';
import StorefrontLayout from '@/app/(storefront)/layout';
import HomePage from '@/app/(storefront)/page';
import PlantsPage from '@/app/(storefront)/cay-canh/page';
import PotsPage from '@/app/(storefront)/chau-vat-tu/page';
import GiftsPage from '@/app/(storefront)/hoa-qua-tang/page';
import ShopPage from '@/app/(storefront)/cua-hang/page';
import ProductDetailPage from '@/app/(storefront)/san-pham/[slug]/page';
import CartPage from '@/app/(storefront)/gio-hang/page';
import CheckoutPage from '@/app/(storefront)/dat-hang/page';
import OrderConfirmationPage from '@/app/(storefront)/xac-nhan-don/page';
import ServicesPage from '@/app/(storefront)/dich-vu/page';
import ContactPage from '@/app/(storefront)/lien-he/page';
import AboutPage from '@/app/(storefront)/gioi-thieu/page';
import PartnersPage from '@/app/(storefront)/doi-tac/page';
import ProjectsPage from '@/app/(storefront)/du-an/page';
import ArticlesPage from '@/app/(storefront)/bai-viet/page';
import StoryDetailPage from '@/app/(storefront)/bai-viet/[slug]/page';
import LibraryPage from '@/app/(storefront)/thu-vien/page';
import MediaPage from '@/app/(storefront)/truyen-thong/page';
import LoginPage from '@/app/(storefront)/dang-nhap/page';
import RegisterPage from '@/app/(storefront)/dang-ky/page';
import AccountPage from '@/app/(storefront)/tai-khoan/page';
import AdminPosPage from '@/app/admin/(dashboard)/pos/page';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function PolicyPage() {
  const { slug } = useParams();
  const title = {
    'giao-nhan': 'Giao nhận',
    'thanh-toan': 'Thanh toán',
    'doi-tra': 'Đổi trả',
    'bao-mat': 'Bảo mật',
    'dieu-khoan-mua-hang': 'Điều khoản mua hàng',
  }[slug] || 'Chính sách Plant Shop';

  return (
    <section className="policy-page container">
      <span className="eyebrow">Plant Shop · Chính sách</span>
      <h1>{title}</h1>
      <p>Thông tin chính sách sẽ được Plant Shop xác nhận khi tư vấn đơn hàng.</p>
      <Link className="button button-primary" to="/lien-he">Liên hệ tư vấn</Link>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="policy-page container">
      <span className="eyebrow">Plant Shop</span>
      <h1>Không tìm thấy trang.</h1>
      <p>Đường dẫn có thể đã thay đổi. Bạn có thể quay lại cửa hàng để tiếp tục.</p>
      <Link className="button button-primary" to="/">Về trang chủ</Link>
    </section>
  );
}

export default function StaticApp() {
  return (
    <BrowserRouter basename={basename}>
      <StorefrontLayout staticSite>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cua-hang" element={<ShopPage />} />
          <Route path="/cay-canh" element={<PlantsPage />} />
          <Route path="/chau-vat-tu" element={<PotsPage />} />
          <Route path="/hoa-qua-tang" element={<GiftsPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/dat-hang" element={<CheckoutPage />} />
          <Route path="/xac-nhan-don" element={<OrderConfirmationPage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/doi-tac" element={<PartnersPage />} />
          <Route path="/du-an" element={<ProjectsPage />} />
          <Route path="/bai-viet" element={<ArticlesPage />} />
          <Route path="/bai-viet/:slug" element={<StoryDetailPage />} />
          <Route path="/thu-vien" element={<LibraryPage />} />
          <Route path="/truyen-thong" element={<MediaPage />} />
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />
          <Route path="/tai-khoan" element={<AccountPage />} />
          <Route path="/admin/pos" element={<AdminPosPage />} />
          <Route path="/chinh-sach/:slug" element={<PolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </StorefrontLayout>
    </BrowserRouter>
  );
}
