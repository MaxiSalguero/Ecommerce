import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file_upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async uploadImage(id: string, file: Express.Multer.File) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);

    const response = await this.fileUploadRepository.uploadImage(file);
    
    await this.productsRepository.update(id, {
      imgUrl: response.secure_url,
    });

    const updatedProduct = await this.productsRepository.findOneBy({ id });
    return updatedProduct;
  }
}
