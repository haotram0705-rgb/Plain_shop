import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Role } from '@prisma/client';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PrismaService } from '../../database/prisma.service';

const uploadDirectory = join(process.cwd(), 'uploads');
mkdirSync(uploadDirectory, { recursive: true });

@Controller('media')
export class MediaController {
  constructor(private readonly prisma: PrismaService) {}
  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.EDITOR)
  @UseInterceptors(FileInterceptor('file', { dest: uploadDirectory, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_request: unknown, file: { mimetype: string }, callback: (error: Error | null, acceptFile: boolean) => void) => callback(null, /^(image\/(jpeg|png|webp)|video\/(mp4|webm))$/.test(file.mimetype)) }))
  async upload(@UploadedFile() file?: { filename: string; originalname: string; mimetype: string; size: number }) {
    if (!file) throw new BadRequestException('File không hợp lệ. Chỉ nhận JPG, PNG, WEBP, MP4, WEBM tối đa 10MB.');
    return this.prisma.media.create({ data: { filename: file.originalname, url: `/uploads/${file.filename}`, mimeType: file.mimetype, size: file.size, kind: file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE' } });
  }

  @Post('public-upload')
  @UseInterceptors(FileInterceptor('file', { dest: uploadDirectory, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_request: unknown, file: { mimetype: string }, callback: (error: Error | null, acceptFile: boolean) => void) => callback(null, /^(image\/(jpeg|png|webp))$/.test(file.mimetype)) }))
  async publicUpload(@UploadedFile() file?: { filename: string; originalname: string; mimetype: string; size: number }) {
    if (!file) throw new BadRequestException('File không hợp lệ. Chỉ nhận JPG, PNG, WEBP tối đa 10MB.');
    return this.prisma.media.create({ data: { filename: file.originalname, url: `/uploads/${file.filename}`, mimeType: file.mimetype, size: file.size, kind: 'IMAGE' } });
  }
}
