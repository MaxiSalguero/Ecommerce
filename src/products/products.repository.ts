import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from 'src/categories/categories.entity';
import * as data from '../utils/data.json';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Product[]> {
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });

    if (products.length < 1)
      throw new NotFoundException(`No se encontraron productos`);

    const start = (page - 1) * limit;
    const end = start + limit;
    products = products.slice(start, end);

    return products;
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product)
      throw new NotFoundException(`Producto con ID: ${id}, no encontrado`);
    return product;
  }

  async createProduct(producto: Partial<Product>, categoryId: string) {
    const existingProduct = await this.productsRepository.findOne({
      where: { name: producto.name },
    });

    if (existingProduct) {
      throw new ConflictException('El producto ya existe');
    }

    const findCategory = await this.categoriesRepository.findOneBy({
      id: categoryId,
    });

    if (!findCategory) {
      throw new NotFoundException(
        `No se encontro una categoria con ID: ${categoryId}`,
      );
    }

    const newProduct = await this.productsRepository.create({
      ...producto,
      category: findCategory,
    });

    await this.productsRepository.save(newProduct);

    return {
      message: `Has creado un nuevo producto correctamente. Su ID: ${newProduct.id}`,
    };
  }

  async preloadProduct() {
    const categories = await this.categoriesRepository.find();
    const productsExists = await this.productsRepository.find();

    if (categories.length < 1)
      throw new NotFoundException(
        `Aun no existen categorias, se rechazo la precarga`,
      );
    if (productsExists.length > 0)
      throw new BadRequestException(`Ya existen productos creados o la precarga ya fue realizada previamente`);

    data?.map(async (element) => {
      const category = categories.find(
        (category) => category.name === element.category,
      );

      const product = new Product();
      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.stock = element.stock;
      product.imgUrl = element.imgUrl;
      product.category = category;

      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(product)
        .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
        .execute();
    });
    return { message: `Precarga de productos realizada con exito.` };
  }

  async updateProduct(id: string, product: Partial<Product>) {
    const productExists = await this.productsRepository.findOneBy({ id });
    if (!productExists)
      throw new NotFoundException(`No se encontro el producto con id: ${id}`);

    await this.productsRepository.update(id, product);

    const updatedProduct = await this.productsRepository.findOneBy({ id });

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Producto con id: ${id} no encontrado`);

    await this.productsRepository.remove(product);

    return {
      message: `El Producto con ID: ${id}, fue eliminado correctamente.`,
    };
  }
}
