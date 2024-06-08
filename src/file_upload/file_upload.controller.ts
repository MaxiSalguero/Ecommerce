import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file_upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileValidatorPipe } from 'src/pipes/fileValidator';

@ApiTags('fileUpload')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiBearerAuth()
  @Post('uploadImage/:id')
  @ApiResponse({ status: 201, description: 'Imagen del producto modificada exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontro el producto' })
  @ApiResponse({ status: 400, description: 'El archivo a subir no cumple con lo requerido' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a cargar',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(FileValidatorPipe) file:Express.Multer.File,
  ) {
    return this.fileUploadService.uploadImage(id, file);
  }
}
