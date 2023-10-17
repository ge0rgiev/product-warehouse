import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JwtOptionsService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('jwt.secret'),
      signOptions: {
        expiresIn: this.configService.get('jwt.expiration'),
      },
    };
  }
}
