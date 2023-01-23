import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [AppController, BrkController, BrpController],
  providers: [BrpService, BrkService],
})
export class AppModule {}
