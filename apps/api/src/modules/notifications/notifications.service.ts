import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  async sendOrderCreated(orderCode: string, recipient?: string) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) { this.logger.warn(`SMTP chưa cấu hình; bỏ qua email đơn ${orderCode}.`); return false; }
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined });
    await transporter.sendMail({ from: process.env.SMTP_FROM, to: recipient || process.env.INTERNAL_NOTIFICATION_EMAIL || process.env.SMTP_FROM, subject: `Plant Shop · Đơn hàng ${orderCode}`, text: `Đơn hàng ${orderCode} đã được tạo và đang chờ xác nhận.` });
    return true;
  }
}
