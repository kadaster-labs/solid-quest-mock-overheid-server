import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );

  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
