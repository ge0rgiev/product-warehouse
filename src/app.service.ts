import { Injectable } from '@nestjs/common';
// import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppService {
  constructor() {}

  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
