import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ConsultationsService } from './consultations.service';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultations: ConsultationsService) {}
  @Post() create(@Body() body: { name: string; contact: string; need: string; related?: string; sourceUrl?: string; attachmentUrl?: string }) { return this.consultations.create(body); }
  @Get() @UseGuards(AuthGuard, RolesGuard) @Roles(Role.OWNER, Role.SALES, Role.EDITOR) list() { return this.consultations.list(); }
  @Patch(':id') @UseGuards(AuthGuard, RolesGuard) @Roles(Role.OWNER, Role.SALES) update(@Param('id') id: string, @Body() body: { status?: 'NEW' | 'PROCESSING' | 'COMPLETED'; assigneeId?: string | null }) { return this.consultations.update(id, body); }
}
