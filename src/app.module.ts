import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';

import { BrkController } from './brk/brk.controller';
import { BrpController } from './brp/brp.controller';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController, BrkController, BrpController],
  providers: [],
})
export class AppModule {}
