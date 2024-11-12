import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

  const config = new DocumentBuilder()
    .setTitle('Socketing API Documentation')
    .setDescription(
      'This documentation provides details about the Socketing service.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = configService.get<number>('PORT');
  await app.listen(port);

  if (process.send) {
    process.send('ready');
    console.log('Worker process is ready.');
  }

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
