import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    // @InjectPinoLogger(AppController.name)
    // private logger: PinoLogger,
    private readonly appService: AppService, // private readonly configService: ConfigSerivce,
    private readonly configServce: ConfigService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
