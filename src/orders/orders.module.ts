import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/products.entity';
import { User } from '../users/users.entity';
import { OrderRepository } from './order.repository';
import { OrderDetails } from '../entities/OrderDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User, OrderDetails])],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
