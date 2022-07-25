import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Pay Unit REST API')
    .setDescription('A REST API that makes requests to Pay Unit endpoints')
    .setVersion('1.0')
    .addTag('Pay-Unit API V1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  //* Set up cors
  app.enableCors();

  //* Set up swagger
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
