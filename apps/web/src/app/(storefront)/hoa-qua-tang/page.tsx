import { CollectionPage } from '@/components/storefront/CollectionPage';

export default function GiftsPage() {
  return (
    <CollectionPage
      eyebrow="Gửi điều tử tế"
      title="Hoa và quà tặng xanh."
      description="Lan Hồ Điệp, chậu quà biếu đặc biệt, điện hoa tươi và những mẫu hoa được chuẩn bị chỉn chu từ Plant Shop."
      items={['Lan Hồ Điệp', 'Chậu quà biếu đặc biệt', 'Điện hoa tươi', 'Hình ảnh shop hoa tươi']}
      images={['/assets/images/prod-peace-lily.jpg', '/assets/images/cat-services.jpg', '/assets/images/prod-pothos.jpg', '/assets/images/cat-succulents.jpg']}
      ctaHref="/cua-hang?category=Hoa%20%26%20quà%20tặng"
      itemHrefs={[
        '/cua-hang?q=Lan%20H%E1%BB%93%20%C4%90i%E1%BB%87p',
        '/cua-hang?category=Hoa%20%26%20quà%20tặng',
        '/cua-hang?usage=Quà%20tặng',
        '/thu-vien',
      ]}
    />
  );
}
