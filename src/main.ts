import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

  const port = configService.get<number>('PORT');
  await app.listen(port);

  if (process.send) {
    process.send('ready');
    console.log('Worker process is ready.');
  }

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
