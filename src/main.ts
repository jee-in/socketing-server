import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 5000;
  console.log(port);
  await app.listen(port);

  if (process.send) {
    process.send('ready');
  }
}
bootstrap();
