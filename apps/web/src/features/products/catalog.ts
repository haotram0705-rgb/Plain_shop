export type StoreProduct = {
  sku?: string;
  name: string;
  type: string;
  category: string;
  price: number;
  tag: string;
  image: string;
  stock?: number;
  sold?: number;
  sizes?: string[];
  addOns?: { name: string; price: number }[];
  careGuide?: string;
  discount?: number;
  height?: string;
  potSize?: string;
  unit?: string;
};

export const catalogProducts: StoreProduct[] = [
  { sku: 'PS-CAY-001', name: 'Monstera Deliciosa', type: 'Cây nội thất', category: 'Cây cảnh', price: 450000, tag: 'Dễ chăm', image: '/assets/images/prod-monstera.jpg', stock: 18, sold: 42, sizes: ['Nhỏ · 40cm', 'Vừa · 70cm', 'Lớn · 100cm'], addOns: [{ name: 'Chậu gốm kem', price: 120000 }, { name: 'Phân lá hữu cơ', price: 65000 }], careGuide: 'Ánh sáng tán xạ, tưới khi mặt đất khô 2-3cm.', discount: 10, height: '40-70cm', potSize: 'Chậu 18-24cm', unit: 'Chậu' },
  { sku: 'PS-CAY-002', name: 'Cây Kim Tiền', type: 'Cây phong thủy', category: 'Cây cảnh', price: 320000, tag: 'Bán chạy', image: '/assets/images/prod-snake-plant.jpg', stock: 12, sold: 31, careGuide: 'Ưa sáng gián tiếp, tưới vừa phải và để đất khô giữa hai lần tưới.', height: '45-70cm', potSize: 'Chậu 18cm', unit: 'Chậu' },
  { sku: 'PS-CAY-003', name: 'Bàng Singapore', type: 'Cây văn phòng', category: 'Cây cảnh', price: 680000, tag: 'Mới về', image: '/assets/images/prod-fiddle-leaf.jpg', stock: 5, sold: 18, careGuide: 'Đặt gần cửa sổ có ánh sáng tán xạ, lau lá định kỳ.', height: '80-120cm', potSize: 'Chậu 24cm', unit: 'Chậu' },
  { sku: 'PS-HOA-001', name: 'Lan Hồ Điệp trắng', type: 'Hoa quà tặng', category: 'Hoa & quà tặng', price: 890000, tag: 'Quà tặng', image: '/assets/images/prod-peace-lily.jpg', stock: 0, sold: 27, careGuide: 'Tưới khi rễ chuyển màu bạc, tránh để nước đọng trong chậu.', height: '45-60cm', potSize: 'Chậu sứ', unit: 'Chậu' },
  { sku: 'PS-CAY-004', name: 'Cau Tiểu Trâm', type: 'Cây để bàn', category: 'Cây cảnh', price: 180000, tag: 'Nhỏ xinh', image: '/assets/images/prod-pothos.jpg', stock: 24, sold: 36, careGuide: 'Ánh sáng vừa, giữ đất hơi ẩm và tránh nắng gắt.', height: '25-35cm', potSize: 'Chậu 14cm', unit: 'Chậu' },
  { sku: 'PS-VTU-001', name: 'Chậu gốm men rạn', type: 'Chậu & vật tư', category: 'Chậu & vật tư', price: 260000, tag: 'Thủ công', image: '/assets/images/cat-pots.jpg', stock: 14, sold: 22, careGuide: 'Dùng kèm lớp thoát nước và chọn kích thước lớn hơn bầu cây 2-4cm.', height: '20cm', potSize: 'Đường kính 24cm', unit: 'Cái' },
  { sku: 'PS-CAY-005', name: 'Philodendron Birkin', type: 'Cây nội thất', category: 'Cây cảnh', price: 390000, tag: 'Được yêu thích', image: '/assets/images/prod-monstera.jpg', stock: 9, sold: 28, careGuide: 'Ưa sáng tán xạ, không để đất quá ướt.', height: '35-55cm', potSize: 'Chậu 16cm', unit: 'Chậu' },
  { sku: 'PS-CAY-006', name: 'Sen Đá Mix', type: 'Cây để bàn', category: 'Cây cảnh', price: 150000, tag: 'Nhỏ xinh', image: '/assets/images/cat-succulents.jpg', stock: 30, sold: 54, careGuide: 'Nhiều sáng, tưới ít và đảm bảo chậu thoát nước tốt.', height: '10-18cm', potSize: 'Chậu 10cm', unit: 'Chậu' },
  { sku: 'PS-VTU-002', name: 'Chậu đất nung tròn', type: 'Chậu & vật tư', category: 'Chậu & vật tư', price: 120000, tag: 'Phổ biến', image: '/assets/images/cat-pots.jpg', stock: 32, sold: 41, careGuide: 'Chất liệu thoáng khí, phù hợp với sen đá và cây cần khô thoáng.', height: '12cm', potSize: 'Đường kính 16cm', unit: 'Cái' },
  { sku: 'PS-VTU-003', name: 'Đất trồng hữu cơ', type: 'Vật tư chăm cây', category: 'Chậu & vật tư', price: 95000, tag: 'Thiết yếu', image: '/assets/images/cat-tools.jpg', stock: 46, sold: 63, careGuide: 'Trộn theo nhu cầu từng loại cây và bảo quản nơi khô ráo.', height: '5L', potSize: 'Túi 5L', unit: 'Túi' },
  { sku: 'PS-CAY-007', name: 'Cây Hạnh Phúc', type: 'Cây văn phòng', category: 'Cây cảnh', price: 540000, tag: 'Mới về', image: '/assets/images/prod-fiddle-leaf.jpg', stock: 7, sold: 16, careGuide: 'Đặt nơi thoáng sáng, tưới khi bề mặt đất se khô.', height: '70-100cm', potSize: 'Chậu 22cm', unit: 'Chậu' },
  { sku: 'PS-HOA-002', name: 'Bình hoa An Nhiên', type: 'Hoa & quà tặng', category: 'Hoa & quà tặng', price: 620000, tag: 'Quà tặng', image: '/assets/images/cat-services.jpg', stock: 6, sold: 19, careGuide: 'Thay nước mỗi ngày và cắt gốc hoa chéo trước khi cắm.', height: '35-45cm', potSize: 'Bình gốm', unit: 'Bình' },
];

export function productSlug(name: string) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function findCatalogProduct(slug: string, products = catalogProducts) {
  return products.find((product) => productSlug(product.name) === slug);
}

export const shopCategories = ['Tất cả', 'Cây cảnh', 'Chậu & vật tư', 'Hoa & quà tặng'] as const;

export function isInStock(product: { stock?: number }) {
  return product.stock !== 0;
}

export const formatProductPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)}đ`;
