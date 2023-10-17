import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtOptionsService } from '../config/services/jwt-options.service';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    JwtModule.registerAsync({
      useClass: JwtOptionsService,
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
