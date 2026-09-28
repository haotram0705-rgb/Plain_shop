import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export type CreateOrderInput = { buyerName: string; buyerEmail?: string; buyerPhone: string; recipientName?: string; recipientPhone?: string; address: string; note?: string; paymentMethod: string; shippingMethod?: string; couponCode?: string; shippingFee?: number; items: Array<{ productId?: string; sku?: string; name?: string; quantity: number }> };

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService, private readonly notifications: NotificationsService) {}

  async create(input: CreateOrderInput) {
    if (!input.items.length || !input.buyerName || !input.buyerPhone || !input.address) throw new BadRequestException('Thiếu thông tin người mua hoặc sản phẩm.');
    const order = await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      await tx.stockReservation.updateMany({ where: { expiresAt: { lt: now }, releasedAt: null }, data: { releasedAt: now } });
      const products = await tx.product.findMany({ where: { status: 'ACTIVE', OR: input.items.flatMap((item) => [item.productId ? { id: item.productId } : undefined, item.sku ? { sku: item.sku } : undefined, item.name ? { name: item.name } : undefined].filter(Boolean) as Array<{ id: string } | { sku: string } | { name: string }>) } });
      if (products.length !== input.items.length) throw new BadRequestException('Một sản phẩm không còn khả dụng.');
      const lines = input.items.map((item) => { const product = products.find((candidate) => candidate.id === item.productId || candidate.sku === item.sku || candidate.name === item.name); if (!product || item.quantity < 1) throw new BadRequestException('Số lượng sản phẩm không hợp lệ.'); return { product, quantity: item.quantity, lineTotal: product.price * item.quantity }; });
      const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
      let discount = 0;
      if (input.couponCode) {
        const coupon = await tx.coupon.findFirst({ where: { code: input.couponCode.toUpperCase(), active: true, OR: [{ startsAt: null }, { startsAt: { lte: now } }], AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }] } });
        if (!coupon || subtotal < coupon.minSubtotal || (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)) throw new BadRequestException('Mã giảm giá không hợp lệ hoặc chưa đủ điều kiện.');
        discount = coupon.type === 'PERCENT' ? Math.floor(subtotal * coupon.value / 100) : coupon.value;
        if (coupon.maxDiscount !== null && coupon.maxDiscount !== undefined) discount = Math.min(discount, coupon.maxDiscount);
        discount = Math.min(discount, subtotal);
      }
      for (const line of lines) {
        const updated = await tx.product.updateMany({ where: { id: line.product.id, stock: { gte: line.quantity }, reservedStock: { lte: line.product.stock - line.quantity } }, data: { reservedStock: { increment: line.quantity } } });
        if (updated.count !== 1) throw new BadRequestException(`Sản phẩm ${line.product.name} không đủ tồn kho.`);
      }
      const shippingFee = input.shippingFee ?? null;
      const order = await tx.order.create({ data: { code: `PS-${Date.now().toString().slice(-8)}`, buyerName: input.buyerName, buyerEmail: input.buyerEmail, buyerPhone: input.buyerPhone, recipientName: input.recipientName || input.buyerName, recipientPhone: input.recipientPhone || input.buyerPhone, address: input.address, note: input.note, subtotal, discount, shippingFee, total: subtotal - discount + (shippingFee || 0), couponCode: input.couponCode?.toUpperCase(), shippingMethod: input.shippingMethod, paymentMethod: input.paymentMethod, items: { create: lines.map((line) => ({ productId: line.product.id, name: line.product.name, sku: line.product.sku, unitPrice: line.product.price, quantity: line.quantity, lineTotal: line.lineTotal })) }, reservations: { create: lines.map((line) => ({ productId: line.product.id, quantity: line.quantity, expiresAt: new Date(now.getTime() + 30 * 60 * 1000) })) } }, include: { items: true } });
      if (input.couponCode) await tx.coupon.update({ where: { code: input.couponCode.toUpperCase() }, data: { usedCount: { increment: 1 } } });
      return order;
    });
    await this.notifications.sendOrderCreated(order.code, input.buyerEmail);
    return order;
  }
}
