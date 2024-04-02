import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { All, Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AllExceptionFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.useStaticAssets(path.join(__dirname, '../src/uploads'));
  let PORT: string = '3002';
  await app.listen(PORT);
  Logger.log(`Running API in MODE: on Port: ${PORT}`);
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
