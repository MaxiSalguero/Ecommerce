import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetails } from '../entities/OrderDetails.entity';
import { Order } from './order.entity';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';
import { ProductPartialDto } from './order.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(OrderDetails) private orderDetailRepository: Repository<OrderDetails>,
  ) {}

  async addOrder(userId: string, products: ProductPartialDto[], formatDate:string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) 
      throw new NotFoundException(`No se encontro el usuario con id: ${userId}`);

    const newOrder = await this.ordersRepository.save({
          date: formatDate,
          user: user,
    });

    let totalPrice: number = 0;
    const orderProducts: Product[] = [];

    for await (const product of products) {
      const foundProduct = await this.productsRepository.findOneBy({ id: product.id });
      if (!foundProduct)
        throw new NotFoundException(`No se encontro el producto con ID: ${product.id}`);

      foundProduct.stock--;
      totalPrice += +foundProduct.price;
      orderProducts.push(foundProduct);
      await this.productsRepository.update(
        { id: product.id },
        { stock: foundProduct.stock },
      );
    }

    await this.orderDetailRepository.save({
      total_price: totalPrice,
      products: orderProducts,
      order: newOrder,
    });

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: { orderDetail: true },
    });
  }

  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetail: {
          products: true,
        },
      },
    });
    if (!order)
      throw new NotFoundException(`Orden con id: ${id} no encontrada`);
    return order;
  }
}
