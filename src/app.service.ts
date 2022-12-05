import { Injectable } from '@nestjs/common';
import { ScocketGateway } from './socket.gateway';

@Injectable()
export class AppService {
  constructor(private socketGateway: ScocketGateway) {}
}
