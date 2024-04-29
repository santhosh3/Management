import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { All, Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AllExceptionFilter } from './all-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = app.get(ConfigService);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.useStaticAssets(path.join(__dirname, '../src/uploads'));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Managment App like Trello')
    .setDescription('Where performance of organization show case')
    .setVersion('1.0')
    .addTag('TRELLO')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(config.get('port'));
  Logger.log(`Running API in MODE: on Port: ${config.get('port')}`);
}
bootstrap();

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
//     bufferLogs : true
//   });
//   app.useLogger(app.get(MyLoggerService))
//   const {httpAdapter} = app.get(HttpAdapterHost);
//   app.enableCors();
//   app.useStaticAssets(path.join(__dirname, "../src/uploads"))
//   let PORT : string = '3002'
//   await app.listen(PORT);
//   Logger.log(`Running API in MODE: on Port: ${PORT}`)
// }
// bootstrap();
