import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动将请求参数转换为 DTO 类的实例
      // whitelist: true, // 只允许 DTO 类中定义的属性
      // forbidNonWhitelisted: true, // 禁止非 DTO 类中定义的属性
    }),
  ); //全局启用 ValidationPipe
  await app.listen(3000);
}
bootstrap();
