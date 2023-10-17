import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmOptionsService } from './config/services/typeorm-options.service';
import { GraphqlOptions } from './config/services/graphql-options.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { StockTransferModule } from './stock-transfer/stock-transfer.module';
import { CalculationModule } from './calculation/calculation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptionsService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlOptions,
    }),
    // TODO: ScheduleModule.forRoot()
    UserModule,
    AuthModule,
    ProductModule,
    WarehouseModule,
    StockTransferModule,
    CalculationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
