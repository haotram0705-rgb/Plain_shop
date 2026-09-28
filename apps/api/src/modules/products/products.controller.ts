import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}
  @Get() list(@Query('q') query?: string) { return this.products.list(query); }
  @Get(':slug') detail(@Param('slug') slug: string) { return this.products.findBySlug(slug); }
}
