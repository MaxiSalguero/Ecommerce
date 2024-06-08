import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { ProductPartialDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  addOrder(userId: string, products: ProductPartialDto[], formatDate:string) {
    return this.orderRepository.addOrder(userId, products, formatDate);
  }

  getOrder(id: string) {
    return this.orderRepository.getOrder(id);
  }
}
