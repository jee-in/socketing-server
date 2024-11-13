import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ERROR_CODES } from './contants/error-codes';
import { CommonResponse } from './common/dto/common-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const details = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {}).join(', '),
        }));

        const errorCode = ERROR_CODES.VALIDATION_FAILED;

        return new BadRequestException(
          new CommonResponse(
            undefined,
            errorCode.message,
            errorCode.code,
            details,
          ),
        );
      },
    }),
  );

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
