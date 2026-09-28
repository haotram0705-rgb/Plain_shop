import { CollectionPage } from '@/components/storefront/CollectionPage';

export default function ProjectsPage() {
  return <CollectionPage eyebrow="Những không gian đã thực hiện" title="Dự án xanh của Plant Shop." description="Đi qua những căn nhà, văn phòng và góc phố đã được làm dịu bằng cây xanh." items={['Nhà ở', 'Văn phòng', 'Café và cửa hàng', 'Khu nghỉ dưỡng']} images={['/assets/images/hero.jpg', '/assets/images/cat-indoor.jpg', '/assets/images/cat-desk.jpg', '/assets/images/cat-outdoor.jpg']} ctaHref="/lien-he" />;
}
