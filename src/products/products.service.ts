import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(page: number, limit: number) {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductById(id: string) {
    return this.productsRepository.getProductById(id);
  }

  createProduct(producto: Partial<Product>, categoryId:string) {
    return this.productsRepository.createProduct(producto, categoryId);
  }

  updateProduct(id: string, product: Partial<Product>) {
    return this.productsRepository.updateProduct(id, product);
  }

  deleteProduct(id: string) {
    return this.productsRepository.deleteProduct(id);
  }

  preloadProduct() {
    return this.productsRepository.preloadProduct();
  }
}
