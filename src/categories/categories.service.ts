import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories() {
    return this.categoriesRepository.getCategories();
  }

  async addCategories() {
    return this.categoriesRepository.addCategories();
  }
}
