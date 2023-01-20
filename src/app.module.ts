import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from './config/configuration';

import { BrkController } from './brk/brk.controller';
import { BrkService } from './brk/brk.service';
import { BrpController } from './brp/brp.controller';
import { BrpService } from './brp/brp.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
  ],
  controllers: [AppController, BrkController, BrpController],
  providers: [BrpService, BrkService],
})
export class AppModule {}
