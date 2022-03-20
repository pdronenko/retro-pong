import { Injectable } from '@nestjs/common';
import { Message } from '@retro-pong/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
