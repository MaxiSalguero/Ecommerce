import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Categories } from './categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as data from '../utils/data.json';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories() {
    const categoriesList = await this.categoriesRepository.find();
    if (categoriesList.length < 1)
      throw new NotFoundException('No se encontraron categorias precargadas');
    return categoriesList;
  }

  async addCategories() {
    const categoriesList = await this.categoriesRepository.find();
    if (categoriesList.length > 0)
      throw new ConflictException(
        'Las categorías ya fueron precargadas anteriormente',
      );

    data?.map(async (element) => {
      await this.categoriesRepository
        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .orIgnore()
        .execute();
    });
    return {
      message: 'Categorias cargadas correctamente',
    };
  }
}
