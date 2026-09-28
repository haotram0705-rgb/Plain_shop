import { CollectionPage } from '@/components/storefront/CollectionPage';

export default function PotsPage() {
  return (
    <CollectionPage
      eyebrow="Chạm vào chất liệu"
      title="Chậu và vật tư."
      description="Đủ vật tư để trồng, chăm và hoàn thiện một góc xanh khỏe mạnh."
      items={['Thuốc bảo vệ thực vật', 'Vật tư ngành hoa & phụ kiện', 'Chậu sứ · chậu nhựa', 'Lưới đen & dụng cụ làm vườn', 'Phân lá · phân chuồng', 'Tre · cây chống', 'Đất trồng & dinh dưỡng', 'Chậu mix & combo']}
      images={['/assets/images/cat-tools.jpg', '/assets/images/cat-services.jpg', '/assets/images/cat-pots.jpg', '/assets/images/cat-outdoor.jpg', '/assets/images/cat-succulents.jpg', '/assets/images/cat-desk.jpg', '/assets/images/cat-indoor.jpg', '/assets/images/cat-pots.jpg']}
      ctaHref="/cua-hang?category=Chậu%20%26%20vật%20tư"
      itemHrefs={[
        '/cua-hang?category=Chậu%20%26%20vật%20tư',
        '/cua-hang?q=phụ%20kiện',
        '/cua-hang?q=Chậu',
        '/cua-hang?category=Chậu%20%26%20vật%20tư',
        '/cua-hang?q=Đất',
        '/cua-hang?category=Chậu%20%26%20vật%20tư',
        '/cua-hang?q=Đất%20trồng',
        '/cua-hang?q=Chậu',
      ]}
    />
  );
}
