import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  list(query?: string) { return this.prisma.product.findMany({ where: query ? { OR: [{ name: { contains: query, mode: 'insensitive' } }, { sku: { contains: query, mode: 'insensitive' } }] } : undefined, orderBy: { createdAt: 'desc' } }); }
  findBySlug(slug: string) { return this.prisma.product.findUnique({ where: { slug } }); }
}
