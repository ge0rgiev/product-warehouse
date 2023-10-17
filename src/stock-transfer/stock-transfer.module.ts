import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferResolver } from './stock-transfer.resolver';
import { StockTransferService } from './stock-transfer.service';
import { StockRequest } from './entities/stock-request.entity';
import { CalculationModule } from '../calculation/calculation.module';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { JwtAuthGuard } from '../shared/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransfer, StockRequest]),
    CalculationModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([StockTransfer])],
      resolvers: [
        {
          DTOClass: StockTransfer,
          EntityClass: StockTransfer,
          guards: [JwtAuthGuard],
          read: {
            one: { disabled: true },
            many: { name: 'TransferList' },
          },
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
        },
      ],
    }),
  ],
  providers: [StockTransferResolver, StockTransferService],
  exports: [],
})
export class StockTransferModule {}
