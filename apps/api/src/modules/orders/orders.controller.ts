import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderInput, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}
  @Post() create(@Body() body: CreateOrderInput) { return this.orders.create(body); }
}
