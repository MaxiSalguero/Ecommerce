import { Module } from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { FileUploadController } from './file_upload.controller';
import { CloudinaryConfig } from '../config/cloudinary';
import { FileUploadRepository } from './file_upload.repository';
import { Product } from '../products/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    CloudinaryConfig,
    FileUploadRepository,
    {
      provide: 'UploadDirectory',
      useValue: './src/assets/uploadedImages',
    },
  ],
})
export class FileUploadModule {}
