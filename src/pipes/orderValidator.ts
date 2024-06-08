import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from 'src/orders/order.dto';

@Injectable()
export class OrderValidatorPipe implements PipeTransform {
  transform(value: CreateOrderDto) {
    const ids: string[] = [];

    for (const producto of value.products) {
      if (ids.includes(producto.id)) {
        throw new BadRequestException(
          'Solo es valida una unidad de cada producto por persona',
        );
      }
      ids.push(producto.id);
    }

    return value;
  }
}
