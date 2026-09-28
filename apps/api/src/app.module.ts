import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { MediaModule } from './modules/media/media.module';

@Module({ imports: [DatabaseModule, AuthModule, ProductsModule, OrdersModule, ConsultationsModule, MediaModule] })
export class AppModule {}
