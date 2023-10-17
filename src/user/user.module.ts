import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { CalculationModule } from '../calculation/calculation.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CalculationModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
