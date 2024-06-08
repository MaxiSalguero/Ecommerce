import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateProductDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/products.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../users/role.enum';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontraron productos' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de productos a devolver por página',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  getProducts(
    @Query('limit') limit: number = 5,
    @Query('page') page: number = 1,
  ) {
    return this.productsService.getProducts(page, limit);
  }

  @Get('seeder')
  @ApiResponse({ status: 200, description: 'La precarga de los productos se realizo con exito' })
  @ApiResponse({ status: 404, description: 'No existen categorias, se rechaza la precarga' })
  @ApiResponse({ status: 400, description:'Ya existen productos creados o se hizo la precarga anteriormente' })
  preloadProduct() {
    return this.productsService.preloadProduct();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Producto obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontro el producto' })
  getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'El producto se creo correctamente' })
  @ApiResponse({ status: 400, description: 'Ausencia de datos requeridos' })
  @ApiResponse({ status: 404, description: 'No existe la categoria asociada al producto' })
  @ApiResponse({ status: 409, description: 'Ya existe un producto con ese nombre' })
  createProduct(@Body() product: CreateProductDto) {
    const { categoryId, ...producto } = product;
    return this.productsService.createProduct(producto, categoryId);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({ status: 200, description: 'Producto modificado exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontro el producto' })
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, product);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontro el producto' })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
