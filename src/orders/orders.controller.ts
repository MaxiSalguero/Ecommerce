import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  Req,
  UsePipes,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './order.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DateAdderInterceptor } from '../interceptors/date-adder.interceptor';
import { OrderValidatorPipe } from 'src/pipes/orderValidator';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'La orden se creo correctamente' })
  @ApiResponse({ status: 400, description: 'Ausencia de datos requeridos' })
  @ApiResponse({ status: 404, description: 'No se encontro el usuario o los productos asociados a la orden' })
  @UsePipes(OrderValidatorPipe)
  @UseInterceptors(DateAdderInterceptor)
  addOrder(@Body() order: CreateOrderDto, @Req() request: Request & { date: string }) {
    const { userId, products } = order;
    const formatDate = request.date
    return this.ordersService.addOrder(userId, products, formatDate);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Orden obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontro la orden' })
  getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrder(id);
  }
}
