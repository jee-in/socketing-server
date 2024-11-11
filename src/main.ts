import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

  await app.listen(process.env.PORT);

  if (process.send) {
    process.send('ready');
  }
}
bootstrap();
