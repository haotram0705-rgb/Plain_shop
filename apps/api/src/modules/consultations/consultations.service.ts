import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ConsultationsService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: { name: string; contact: string; need: string; related?: string; sourceUrl?: string; attachmentUrl?: string }) { return this.prisma.consultation.create({ data }); }
  list() { return this.prisma.consultation.findMany({ include: { assignee: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } }); }
  update(id: string, data: { status?: 'NEW' | 'PROCESSING' | 'COMPLETED'; assigneeId?: string | null }) { return this.prisma.consultation.update({ where: { id }, data }); }
}
