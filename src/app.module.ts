import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScocketGateway } from './socket.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ScocketGateway],
})
export class AppModule {}
