import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de categorias obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontraron categorias' })
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get('seeder')
  @ApiResponse({ status: 200, description: 'La precarga de las categorias se realizo con exito' })
  @ApiResponse({ status: 400, description: 'La precarga ya fue realizada anteriormente' })
  addCategories() {
    return this.categoriesService.addCategories();
  }
}
