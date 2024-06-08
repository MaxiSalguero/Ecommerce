import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function emptyFolder(folderPath: string) {
  const files = await fs.promises.readdir(folderPath);
  for (const file of files) {
    await fs.promises.unlink(`${folderPath}/${file}`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const folderPath = './src/assets/uploadedImages';
  await emptyFolder(folderPath);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Proyecto Final - By: MSS')
    .setDescription('Proyecto creado en Nest JS para el Módulo 4 de FS-BACK')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
