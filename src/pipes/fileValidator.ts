import {
  Injectable,
  PipeTransform,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  constructor(
    @Inject('UploadDirectory') private readonly uploadDirectory: string,
  ) {}

  async transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const hash = crypto.createHash('sha256');
    hash.update(file.buffer);
    const fileHash = hash.digest('hex');

    const filesInDirectory = fs.readdirSync(this.uploadDirectory);
    if (filesInDirectory.length > 0) {
      for (const existingFile of filesInDirectory) {
        const existingFileContent = fs.readFileSync(
          `${this.uploadDirectory}/${existingFile}`,
        );
        const existingFileHash = crypto
          .createHash('sha256')
          .update(existingFileContent)
          .digest('hex');
        console.log(existingFileHash);

        if (existingFileHash === fileHash) {
          throw new BadRequestException(
            'Esta imagen ya esta siendo ocupada por un producto, por favor intente con otra imagen',
          );
        }
      }
    }

    const destinationDirectory = this.uploadDirectory;

    const fileName = `${fileHash}${path.extname(file.originalname)}`;
    const destinationFilePath = path.join(destinationDirectory, fileName);

    fs.writeFileSync(destinationFilePath, file.buffer);

    const allowedFileTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
    if (!allowedFileTypes.includes(file.mimetype.split('/')[1])) {
      throw new BadRequestException('Tipo de archivo no válido');
    }

    const maxSize = 200000;
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Tamaño de archivo excede el límite permitido de 200kb',
      );
    }

    const minSize = 10000;
    if (file.size < minSize) {
      throw new BadRequestException(
        'Tamaño de archivo insuficiente, seleccione un archivo mayor a 10 kb',
      );
    }

    return file;
  }
}
