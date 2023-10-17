import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Inventory } from './entities/inventory.entity';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { CreateWarehouseInput } from './dto/create-warehouse.input';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, Inventory]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Warehouse])],
      resolvers: [
        {
          DTOClass: Warehouse,
          EntityClass: Warehouse,
          guards: [JwtAuthGuard],
          read: {
            one: { disabled: true },
            many: { name: 'WarehouseList' },
          },
          create: {
            CreateDTOClass: CreateWarehouseInput,
            one: { name: 'CreateWarehouse' },
            many: { disabled: true },
          },
          update: {
            one: { disabled: true },
            many: { disabled: true },
          },
          delete: {
            one: { disabled: true },
            many: { disabled: true },
          },
        },
      ],
    }),
  ],
})
export class WarehouseModule {}
