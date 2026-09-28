import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const products = [
  { sku: 'PS-CAY-001', slug: 'monstera-deliciosa', name: 'Monstera Deliciosa', type: 'Cây nội thất', category: 'Cây cảnh', price: 450000, stock: 18, image: '/assets/images/prod-monstera.jpg' },
  { sku: 'PS-CAY-002', slug: 'cay-kim-tien', name: 'Cây Kim Tiền', type: 'Cây phong thủy', category: 'Cây cảnh', price: 320000, stock: 12, image: '/assets/images/prod-snake-plant.jpg' },
  { sku: 'PS-CAY-003', slug: 'bang-singapore', name: 'Bàng Singapore', type: 'Cây văn phòng', category: 'Cây cảnh', price: 680000, stock: 5, image: '/assets/images/prod-fiddle-leaf.jpg' },
  { sku: 'PS-HOA-001', slug: 'lan-ho-diep-trang', name: 'Lan Hồ Điệp trắng', type: 'Hoa quà tặng', category: 'Hoa & quà tặng', price: 890000, stock: 0, image: '/assets/images/prod-peace-lily.jpg' },
];

async function main() {
  for (const product of products) await prisma.product.upsert({ where: { sku: product.sku }, update: product, create: product });
  await prisma.coupon.upsert({ where: { code: 'GREEN10' }, update: {}, create: { code: 'GREEN10', type: 'PERCENT', value: 10, maxDiscount: 300000, active: true } });
  await prisma.user.upsert({ where: { email: process.env.ADMIN_EMAIL || 'admin@plantshop.vn' }, update: {}, create: { email: process.env.ADMIN_EMAIL || 'admin@plantshop.vn', name: 'Plant Shop Owner', passwordHash: process.env.ADMIN_PASSWORD || 'admin123', role: 'OWNER' } });
}

main().finally(() => prisma.$disconnect());
