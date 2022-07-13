import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Simple API')
    .setDescription('The simple API description')
    .setVersion('0.1')
    .addTag('Study Refresh Token')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(4000);
}
bootstrap();
