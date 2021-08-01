import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ApplicationMain', { timestamp: true });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new TransformInterceptor());
  const document = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription(
      'Task Management API is an open source API for third party applications to connect with and take advantage of the services provided by the API '
    )
    .setVersion('0.0.1')
    .build();

  const config = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, config);

  await app.listen(3001);
  logger.log('App listening to 3001');
}
bootstrap();
