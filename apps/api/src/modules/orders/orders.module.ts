import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({ controllers: [OrdersController], providers: [OrdersService, NotificationsService] })
export class OrdersModule {}
